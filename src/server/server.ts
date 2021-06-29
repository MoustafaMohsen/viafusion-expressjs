import { ViafusionDB } from '../db/viafusiondb';
import performance from "perf_hooks";
import fs from 'fs';
import path from "path";
import express from "express";
import { Client, Pool } from "pg";
import PareseData from '../data-proccessing/parsedata';
import ParseToFile from '../data-proccessing/parsedatatofile';
import { ViafusionDBFromFile } from '../db/viafusiondbfromfile';


export default class ViafusionServer {
    client = new Client({
        user: 'postgres',
        host: 'localhost',
        password: '123',
        port: 5432,
    });
    app = express();
    port = process.env.NODEJS_PORT || 3005;
    db: ViafusionDB;
    constructor(_db) {
        this.db = _db;
    }
    init() {
        this.app.set('trust proxy', true);

        this.setupMiddleware();
        this.setupRoute();
        this.listen();
    }
    setupMiddleware() {
        // json request and response
        this.app.use(express.json());

        // setup cors
        this.app.use(function (req, res, next) {
            let host = req.hostname;
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            next();
        });

        // preflight handler
        this.app.options('*');
    }
    setupRoute() {
        function json_type(res) {
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8')
        }
        function send(res: express.Response, response, t0) {
            let pre = performance.performance.now() - t0;
            console.log(`-->Request for:'${res.req.path}', from client:'${res.req.ip}' took:${pre}ms`);
            if (!res.headersSent) {
                res.send(JSON.stringify({ data: { ...response }, performance: pre, success: true }))
            } else {
                res.write(JSON.stringify({ data: { ...response }, performance: pre, success: true }));
                res.end();
            }
        }
        function err(res: express.Response, error, t0, statuscode = 400) {
            res.status(statuscode);
            let pre = performance.performance.now() - t0;
            console.log(`-->Request errored for:'${res.req.path}', from client:'${res.req.ip}' took:${pre}ms`);
            console.error(error);
            res.send(JSON.stringify({ data: {}, error, performance: pre, success: false }))
        }
        function write_and_log(res: express.Response, msg) {
            console.log(msg);
            res.write(msg)
        }

        this.app.post('/', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            let response = {} as any;
            try {
                send(res, response, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/get-rows', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            let response = {} as any;
            const body = {
                database: "filedb",
                tablename: "users",
                values: { "noquery": "no" },
                cols: "*",
                abort_on_cancel: true,
                ...req.body
            }
            try {
                var token: any = {};
                req.on("close", () => {
                    write_and_log(res, "connection closed with client:" + req.ip);
                    if (body.abort_on_cancel == false) {
                        token.cancel?.();
                        token.cancel2?.();
                    }
                });
                const viafusiondb = new ViafusionDB();
                const client = await viafusiondb.connect(body.database);
                const results = await viafusiondb.get_rows(client, body.tablename, body.cols, body.values, body.relation, token);
                response = {
                    rows: results.rows,
                    rowCount: results.rowCount,
                }

                send(res, response, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/do-everything', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            write_and_log(res, "request started")
            let response = {} as any;
            try {
                var token: any = {};
                req.on("close", () => {
                    write_and_log(res, "connection closed with client:" + req.ip);
                    if (req.body.abort_on_cancel) {
                        token.cancel?.();
                        token.cancel2?.();
                    }
                });
                // // ===== Preparing Database
                const viafusiondbfromfile = new ViafusionDBFromFile();
                response.prepare_init_file_db = await viafusiondbfromfile.prepare_init_file_db(req.body.database);
                const parsertofile = new ParseToFile();
                for (let i = 0; i < req.body.files_paths.length; i++) {
                    let read_path = req.body.files_paths[i].read_path;
                    let write_path = req.body.files_paths[i].write_path;
                    let t0 = performance.performance.now();

                    // ===== Splitting files
                    write_and_log(res, `==========>... Doing file:'${read_path.join("/")}'`);
                    write_and_log(res, "---Splitting files");
                    let splitted_files_paths = await parsertofile.splite_file(path.resolve(__dirname, ...read_path), path.resolve(__dirname, ...write_path), req.body.max_rows_per_file, req.body.end_read_at_line, req.body.offset, token)
                    let t1 = performance.performance.now();
                    write_and_log(res, `Done 'splite_file' in:'${t1 - t0}ms`);

                    // ===== Quering copy on files
                    for (let i = 0; i < splitted_files_paths.length; i++) {
                        const file_path = splitted_files_paths[i];
                        write_and_log(res, `---> Quering copy on file'${file_path}'`);
                        let _tq0 = performance.performance.now();
                        response.start_copy_from_file = await viafusiondbfromfile.start_copy_from_file(file_path, req.body.database);
                        let _tq1 = performance.performance.now();
                        fs.writeFileSync(file_path, "");
                        write_and_log(res, `---> Done quering copy on file'${file_path}' in:'${_tq1 - _tq0}ms <---`);
                    }

                    // ==== Creating indexes
                    const viafusiondb = new ViafusionDB();
                    response.index_results = []
                    for (let i = 0; i < req.body.indexes.length; i++) {
                        let tablename = req.body.indexes[i].tablename;
                        let columname = req.body.indexes[i].columnname;
                        let _t0 = performance.performance.now();
                        write_and_log(res,`==========>... Doing index for table:'${tablename}' for column:'${columname}'`);
                        write_and_log(res,`-->for table:'${tablename}'`);
                        write_and_log(res,`-->`);
                        const client = await viafusiondb.connect(req.body.database);
                        let create_index = await viafusiondb.create_index(client,tablename,columname);
                        response.index_results.push(create_index);
                        let _t1 = performance.performance.now();
                        write_and_log(res,`Done 'create_index' in:'${_t1-_t0}ms`);
                    }
    


                    let tfinal = performance.performance.now();
                    write_and_log(res, `==========> Done file:'${read_path.join("/")}' in:'${tfinal - t0}ms'<==========`);

                }
                send(res, response, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/create-indexes', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            write_and_log(res,"request started")
            let response = {} as any;
            try {
                var token: any = {};
                req.on("close", () => {
                    write_and_log(res,"connection closed with client:" + req.ip);
                    if (req.body.abort_on_cancel) {
                        token.cancel?.();
                        token.cancel2?.();
                    }
                });
                const viafusiondb = new ViafusionDB();
                response.results = []
                for (let i = 0; i < req.body.indexes.length; i++) {
                    let tablename = req.body.indexes[i].tablename;
                    let columname = req.body.indexes[i].columnname;
                    let _t0 = performance.performance.now();
                    write_and_log(res,`==========>... Doing index for table:'${tablename}' for column:'${columname}'`);
                    write_and_log(res,`-->for table:'${tablename}'`);
                    write_and_log(res,`-->`);
                    const client = await viafusiondb.connect(req.body.database);
                    let create_index = await viafusiondb.create_index(client,tablename,columname);
                    response.results.push(create_index);
                    let _t1 = performance.performance.now();
                    write_and_log(res,`Done 'create_index' in:'${_t1-_t0}ms`);
                }
                let tfinal = performance.performance.now();
                write_and_log(res,`==========> Done indexing:'' in:'${tfinal-t0}ms'<==========`);

                send(res, response, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/init-from-file-db', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            let response = {} as any;
            try {
                var token: any = {};
                req.on("close", () => {
                    console.log("connection closed with client:" + req.ip);
                    if (req.body.abort_on_cancel) {
                        token.cancel?.();
                    }
                });
                const viafusiondbfromfile = new ViafusionDBFromFile();
                let rows = await viafusiondbfromfile.prepare_init_file_db(req.body.database);
                response.rows = rows;
                send(res, response, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })
        this.app.post('/insert-from-file', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            let response = {} as any;
            try {
                var token: any = {};
                req.on("close", () => {
                    console.log("connection closed with client:" + req.ip);
                    if (req.body.abort_on_cancel) {
                        token.cancel?.();
                    }
                });
                const viafusiondbfromfile = new ViafusionDBFromFile();
                let rows = await viafusiondbfromfile.start_copy_from_file(path.resolve(__dirname, ...req.body.filename), req.body.database);
                response.rows = rows;
                send(res, response, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })
        this.app.post('/split-file', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            let response = {} as any;
            try {
                var token: any = {};
                req.on("close", () => {
                    if (req.body.abort_on_cancel) {
                        token.cancel?.();
                        token.cancel2?.();
                    }
                });
                const parsertofile = new ParseToFile();
                await parsertofile.splite_file(path.resolve(__dirname, ...req.body.read_file_path), path.resolve(__dirname, ...req.body.write_file_path),
                    req.body.max_rows_per_file, req.body.end_read_at_line, req.body.offset, token)
                send(res, response, t0)
            } catch (er) {
                err(res, er, t0)
            }
        })

        this.app.post('/insert-data', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            let response = {} as any;
            let filename = path.resolve(__dirname, "data", "egypt_all", req.body.filename);
            try {
                var token: any = {};
                req.on("close", () => {
                    if (req.body.abort_on_cancel) {
                        token.cancel?.();
                        token.cancel2?.();
                    }
                });
                const parser = new PareseData();
                const viafusiondb = new ViafusionDB();
                let rows = await parser.read_and_insert_rows(viafusiondb, filename,
                    req.body.max_rows_count, req.body.offset, req.body.take_a_rest_every, token, (inset, queried) => { res.write(JSON.stringify({ inset, queried })) });
                response.rows = rows;
                send(res, response, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/read-file', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            let response = {} as any;
            var token: any = {};
            req.on("close", () => {
                if (req.body.abort_on_cancel) {
                    token.cancel?.();
                    token.cancel2?.();
                }
            });
            let filename = path.resolve(__dirname, "data", "egypt_all", "1.csv");
            const parser = new PareseData();
            try {
                let rows = [];
                await parser.get_rows(filename, req.body.count || 500, req.body.offset || 500, token, (row) => rows.push);
                response.rows = rows;
                send(res, response, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/get-where-col', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            let response = {} as any;
            const parser = new PareseData();
            let filename = path.resolve(__dirname, "data", "egypt_all", "1.csv");
            try {
                var token: any = {};
                req.on("close", () => {
                    token.cancel()
                })
                let rows = await parser.get_where_col(filename, req.body.col_number || 2, req.body.count || 50, req.body.offset || 0, token);
                response.rows = rows;
                send(res, response, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/init-db', async (req, res) => {
            let t0 = performance.performance.now();
            json_type(res);
            let response = {} as any;
            try {
                response.result = { ...(await this.db.PrepareDB(req.body.database)) };
                send(res, response, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("==== This is Viafusion app ====");
            
            console.log(`App listening at http://localhost:${this.port}`)
        })
    }

}