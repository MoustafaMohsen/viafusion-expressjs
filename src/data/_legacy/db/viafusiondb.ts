import { Client, ClientConfig, QueryResult } from "pg";

export class _ViafusionDB {
    dbsettings:ClientConfig = {
        user: 'postgres',
        host: 'localhost',
        password: '123',
        port: 5433,
    }
    amIChecked = false;
    constructor(opts?: { host?: string; user?: string; password?: string; port?: number; database?}) {
        this.dbsettings = { ...this.dbsettings, ...(opts as any) };
    }

    async PrepareDB(dbname = "viafusiondb",tablename = "users") {
        let result: any = {}
        const client1 = await this.connect();
        result.createDB = await this.createDB(client1, dbname);
        await client1.end();

        this.dbsettings.database = "dbname";
        const client2 = await this.connect();
        result.createTable = await this.createTable(client2,tablename);
        await client2.end();
        delete this.dbsettings.database;
        console.log("DB is ready");
        return result;
    }

    async create_index(client:Client, tablename, columnname){
        const query = `CREATE INDEX idx_${tablename}_${columnname} 
        ON ${tablename}(${columnname});`
        return await client.query(query);
    }

    async get_rows(client:Client, tablename, cols: string[], values: {}, relation:"OR"|"AND",token){
        const query = this.create_select_query(tablename, cols, values, relation);
        console.log(query);
        token.cancel = ()=>{
            client.end();
        }
        return await client.query(query);
    }

    create_select_query(tablename, cols: string[], values: {}, relation:"OR"|"AND"){
        let equals_keys = Object.keys(values);
        let equals = Object.values(values);
        let _tmp_keys = equals_keys?"WHERE ":"";
        for (let i = 0; i < equals_keys.length; i++) {
            const key = equals_keys[i];
            const value = values[key];
            _tmp_keys = _tmp_keys + key + `=$${i+1} ` + (i!=equals_keys.length-1?relation:"");
        }
        let _tmp_cols = cols?typeof cols == "string"?cols:cols.join(", "):"*";
        const query = {
            text: `SELECT  ${_tmp_cols} FROM ${tablename} ${_tmp_keys}`,
            values:equals
        }
        return query;
    }
    async connect(database?) {
        const set = database?{...this.dbsettings,database }:this.dbsettings;
        const client = new Client(set);
        await client.connect();
        return client;
    }


    async createDB(client: Client, dbname = "viafusiondb") {
        await client.query(`SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${dbname}'
        AND pid <> pg_backend_pid();`)
        await client.query("DROP DATABASE IF EXISTS " + dbname + ";")
        const query = `CREATE DATABASE ${dbname}`
        let result = await client.query(query);
        return result;
    }

    async createTable(client: Client, tablename = "users") {
        await client.query("DROP TABLE IF EXISTS " + tablename + ";")
        let result = await client.query(`CREATE TABLE IF NOT EXISTS ${tablename} (
            id serial PRIMARY KEY,
            fb_id VARCHAR ( 255 ),
            email VARCHAR ( 255 ),
            phone VARCHAR ( 255 ),
            religion TEXT,
            birthdate VARCHAR ( 255 ),
            first_name VARCHAR ( 255 ),
            last_name VARCHAR ( 255 ),
            gender VARCHAR ( 255 ),
            fb_link VARCHAR ( 255 ),
            username TEXT,
            middle TEXT,
            profile_status TEXT,
            job_company TEXT,
            job_title TEXT,
            city TEXT,
            government TEXT,
            collage TEXT, 
            fb_email VARCHAR ( 255 ),
            data TEXT

);`)
        return result;
    }

    async insertRows(client: Client, cols: string[], values: string[][]) {
        const queries = this.create_multiple_insert_queries(cols, values);
        const promsies: Promise<QueryResult<any>>[] = []
        // callback
        let done = 0;
        new Promise((resolve, reject) => {
            for (let i = 0; i < queries.length; i++) {
                const q = queries[i];
                // promsies.push(client.query(q));
                client.query(q).then((results) => {
                    let t = q;
                    // console.log(q); 
                    done++;
                    if (done == queries.length) {
                        resolve(true);
                    }
    
                },
                    (err) => {
                        console.error(err);
                        console.log(q);
                        reject(err)
                    })
            }
        })
        // return Promise.all(promsies)
        // return Promise.resolve

    }

    create_multiple_insert_queries(cols: string[], values_array: string[][]) {
        const queries: {
            text: string,
            values: any[]
        }[] = [];
        for (let i = 0; i < values_array.length; i++) {
            const values = values_array[i]
            const query = this.create_insert_query(cols, values);
            queries.push(query);
        }
        return queries;
    }
    
    create_insert_query(cols: string[], values: string[]){
        let _tmp_cols_arr = [];
        for (let i = 0; i < cols.length; i++) {
            _tmp_cols_arr.push("$" + (i + 1));
        }
        let _tmp_val_replace = _tmp_cols_arr.join(", ");
        let _tmp_cols = cols.map(d => d.replace("'", "''")).join(", ");
        const query = {
            text: `INSERT INTO users(${_tmp_cols}) VALUES(${_tmp_val_replace})`,
            values
        }
        return query;
    }

    /**
     * @deprecated
     * @param cols 
     * @param values 
     * @returns 
     */
    _createOneInsertQuery(cols: string[], values: string[][]) {

        let _tmp_values_arr = [];
        for (let i = 0; i < values.length; i++) {
            _tmp_values_arr.push("$" + (i + 1));
        }
        let _tmp_cols = cols.map(d => "'" + d.replace("'", "\\'") + "'").join(", ");
        let _values = values.map((v) => {
            return "(" + v.map(d => "'" + d.replace("'", "\\'") + "'").join(", ") + ")"
        }).join(", ")
        const query = `INSERT INTO users(${_tmp_cols}) VALUES(${_values})`
        return query;
    }

}