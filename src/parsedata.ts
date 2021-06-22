import es from 'event-stream';
import { ViafusionDB } from './viafusiondb';
import performance from "perf_hooks";
import fs from 'fs';
import path, { resolve } from "path";
import { CsvParserStream, parse, parseFile, parseStream } from 'fast-csv';
import { Client } from 'pg';


export default class PareseData {
    constructor() { }
    stream: fs.ReadStream
    start_reading(filepath: string, callback: Function) {
        var lineNr = 0;
        this.stream = fs.createReadStream(filepath);
        return new Promise((resolve, reject) => {
            parseStream(this.stream)
                .on('data', row => {
                    lineNr += 1;
                    callback(row, lineNr);
                })
                .on('error', function (err) {
                    console.log('Error while reading file.', err);
                    reject({ error: err, lineNr })
                })
                .on('end', function () {
                    console.log('Read entire file.');
                    resolve(lineNr);
                })
        })

    }

    get_rows(filepath, maxLine = 100, offset = 0, token: any = {}, cb: Function) {
        this.stream = fs.createReadStream(filepath);
        return this.userParser(this.stream, maxLine, offset, token, cb);
    }
    userStream(stream: fs.ReadStream, maxLine = 100, offset = 0, token: any = {}) {
        let rows: string[][] = [];
        var lineNr = 0;
        const parser = parse({ headers: false });
        parser.on("data", rows.push);
        const prom = new Promise<string[][]>((resolve, reject) => {
            var parestream = stream.pipe(es.split())
                .pipe(es.mapSync(function (line) {
                    if (lineNr >= maxLine) {
                        stream.emit("close");
                        stream.emit("end");
                        stream.destroy();
                        console.log("destroyed stream");
                    }
                    if (offset <= lineNr && lineNr < maxLine) {
                        lineNr += 1;
                        parser.write(line);
                    }
                })
                    .on('error', function (err) {
                        console.log('Error while reading file.', err);
                        reject({ error: err, lineNr });
                        throw err;

                    })
                    .on('end', function () {
                        console.log('Read entire file, lines count:' + lineNr);
                        parser.end();
                        resolve(rows);
                    }))
            token.cancel = function () {  // SPECIFY CANCELLATION
                stream.emit("end");
                console.log("lineNr", lineNr);
                reject("Cancelled on line:" + lineNr); // reject the promise
            }

        });
        return prom;

    }

    userParser(stream: fs.ReadStream, maxLine = 100, offset = 0, token: any = {}, cb: Function) {
        var lineNr = 0;
        const prom = new Promise<boolean>((resolve, reject) => {

            var parestream = parseStream(stream, { headers: false, skipRows: offset, maxRows: maxLine + 1 })
                .on('data', (row: string[]) => {
                    lineNr += 1;
                    cb(row,parestream);
                    // termnate
                    if (lineNr >= maxLine) {
                        stream.emit("close");
                        stream.emit("end");
                        parestream.end();
                        parestream.emit("close");
                        parestream.emit("end");
                        stream.destroy();
                        parestream.destroy();
                    }
                })
                .on('error', function (err) {
                    console.log('Error while reading file.', err);
                    reject({ error: err, lineNr });
                    throw err;

                })
                .on('end', function () {
                    resolve(true);
                })
            token.cancel = function () {
                parestream.end();
                parestream.destroy();
                console.log("lineNr", lineNr);
                reject("Cancelled on line:" + lineNr);
            };

        });
        return prom;

    }

    mapper_as_obj(row: string[]) {
        let obj = {
            fb_id: row[0],
            email: row[2],
            phone: row[3],
            religion: row[4],
            birthdate: row[5],
            first_name: row[6],
            last_name: row[7],
            gender: row[8],
            fb_link: row[9],
            username: row[11],
            middle: row[12],
            profile_status: row[13],
            job_company: row[14],
            job_title: row[15],
            city: row[16],
            government: row[17],
            collage: row[18],
            fb_email: row[19],
            data: JSON.stringify(row.filter((f, i) => i > 19)),
        }
        return obj;
    }

    mapper_as_array(row: string[]) {
        let arr = [
            row[0],
            row[2],
            row[3],
            row[4],
            row[5],
            row[6],
            row[7],
            row[8],
            row[9],
            row[11],
            row[12],
            row[13],
            row[14],
            row[15],
            row[16],
            row[17],
            row[18],
            row[19],
            JSON.stringify([row[1], row[10], row.filter((f, i) => i > 19)])
        ]
        return arr;
    }
    get get_mapper_as_array_cols(): string[] {
        return [
            "fb_id",
            "email",
            "phone",
            "religion",
            "birthdate",
            "first_name",
            "last_name",
            "gender",
            "fb_link",
            "username",
            "middle",
            "profile_status",
            "job_company",
            "job_title",
            "city",
            "government",
            "collage",
            "fb_email",
            "data",
        ]
    }

    async read_and_insert_rows(viafusiondb: ViafusionDB, filename: string, max_rows_count: number, offset = 0, take_a_rest_every=5000, token: any, progressCallback: Function) {
        return new Promise<number>(async (resolve, reject) => {
            let inserted_rows = 0;
            let queried_rows = 0;
            let last_t0 = performance.performance.now();

            const cols = this.get_mapper_as_array_cols;
            const client = await viafusiondb.connect();
            token.cancel2 = () => {
                client ? client.end() : null;
                reject("Client Cancled, rows added:" + inserted_rows);
            }
            var map_and_query = async (row: string[], parestream: CsvParserStream<any,any>
                ) => {
                row = this.mapper_as_array(row);
                let q = viafusiondb.create_insert_query(cols, row);
                client.query(q);
                inserted_rows++;
                
                if (inserted_rows % take_a_rest_every === 0) {
                    parestream.emit("pause");
                    parestream.pause();
                    console.log("...Inserting:'" + inserted_rows.toLocaleString() +"'");
                    let result = await client.query("SELECT COUNT(*) FROM users");
                    queried_rows = parseInt(result.rows[0].count)
                    console.log("===> Inserted:"+(queried_rows).toLocaleString()+" ===");
                    progressCallback(inserted_rows,queried_rows)
                    let last_t1 = performance.performance.now();
                    console.log(((last_t1 - last_t0) / 1000) + " Seconds\n--------");
                    last_t0 = performance.performance.now();
                    parestream.resume();
                    parestream.emit("resume");
                }
            }

            let t_get_0 = performance.performance.now();
            
            // === get row, map row, query row
            await this.get_rows(filename, max_rows_count, offset, token, map_and_query);

            let t_get_1 = performance.performance.now();
            console.log("getting rows took:" + ((t_get_1 - t_get_0) / 1000) + " Seconds");
            resolve(inserted_rows);
        })
    }


    /**
     *get rows where specific column exists
     *
     * @param {*} filePath
     * @param {*} col_number column index, starts with 0
     * @param {number} [maxLine=100] numbur of columns to be returned
     * @param {number} [offset=0] offeset positive rows by
     * @param {*} token to cancel mid execution, use token.cancel()
     * @returns
     * @memberof PareseData
     */
    get_where_col(filePath, col_number, maxLine = 100, offset = 0, token) {
        let rows = [];
        let lineCount = 0;
        var _that = this;
        return new Promise((resolve, reject) => {
            this.start_reading(filePath, (row, lineNr) => {
                if (lineCount > maxLine + offset) {
                    _that.stream.close();
                    resolve(rows);
                }
                if (row[col_number]) {
                    if (lineCount >= offset) {
                        rows.push(row);
                        lineCount++;
                    }
                }
                token.cancel = function () {  // SPECIFY CANCELLATION
                    _that.stream.close();
                    console.log("lineNr", lineNr);

                    reject(new Error("Cancelled on line:" + lineNr)); // reject the promise
                };
            })
        })
    }
}