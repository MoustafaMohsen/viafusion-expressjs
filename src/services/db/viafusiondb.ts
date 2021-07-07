import { Client, ClientConfig, QueryConfig, QueryResult } from "pg";

export class ViafusionDB {
    dbsettings: ClientConfig = {
        user: 'postgres',
        host: 'localhost',
        password: '123',
        port: 5433,
    }
    amIChecked = false;
    constructor(opts?: { host?: string; user?: string; password?: string; port?: number; database?}) {
        this.dbsettings = { ...this.dbsettings, ...(opts as any) };
    }

    async PrepareDB(dbname = "viafusiondb") {
        let result: any = {}
        const client1 = await this.connect();
        result.createDB = await this.createDB(client1, dbname);
        await client1.end();

        this.dbsettings.database = dbname;
        const client2 = await this.connect();
        result.create_contact_tabel = await this.create_contact_tabel(client2);
        result.create_contactmeta_tabel = await this.create_contactmeta_tabel(client2);
        result.create_action_tabel = await this.create_action_tabel(client2);
        await client2.end();
        delete this.dbsettings.database;
        console.log("DB is ready");
        return result;
    }

    async create_index(client: Client, tablename, columnname) {
        const query = `CREATE INDEX idx_${tablename}_${columnname} 
        ON ${tablename}(${columnname});`
        return await client.query(query);
    }

 

    async connect(database?) {
        const set = database ? { ...this.dbsettings, database } : this.dbsettings;
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

    // ======= Create Tables

    async create_wallet_tabel(client: Client, tablename = "dbwallet") {
        await client.query("DROP TABLE IF EXISTS " + tablename + ";")
        let result = await client.query(`CREATE TABLE IF NOT EXISTS ${tablename} (
            ewallet_reference_id SERIAL PRIMARY KEY,
            id VARCHAR ( 255 ),
            phone_number VARCHAR ( 255 ) NOT NULL UNIQUE,
            email VARCHAR ( 255 ),
            contact_id VARCHAR ( 255 ),
            contact_reference_id VARCHAR ( 255 ),
            data TEXT,
            meta TEXT,
            security TEXT NOT NULL
);`)
        return result;
    }

    async create_contact_tabel(client: Client, tablename = "dbcontact") {
        await client.query("DROP TABLE IF EXISTS " + tablename + ";")
        let result = await client.query(`CREATE TABLE IF NOT EXISTS ${tablename} (
            contact_reference_id SERIAL PRIMARY KEY,
            contact VARCHAR ( 255 ),
            ewallet VARCHAR ( 255 ),
            customer VARCHAR ( 255 ),
            verification VARCHAR ( 255 ),
            rapyd_contact_data TEXT,
            rapyd_wallet_data TEXT,
            phone_number VARCHAR ( 255 ) NOT NULL UNIQUE,
            security TEXT NOT NULL,
            email VARCHAR ( 255 ),
            meta TEXT
);`)
        return result;
    }

    async create_contactmeta_tabel(client: Client, tablename = "dbmetacontact") {
        await client.query("DROP TABLE IF EXISTS " + tablename + ";")
        let result = await client.query(`CREATE TABLE IF NOT EXISTS ${tablename} (
            meta_id SERIAL PRIMARY KEY,
            contact_reference_id VARCHAR ( 255 ) NOT NULL UNIQUE,
            transactions TEXT NOT NULL,
            senders TEXT,
            benes TEXT,
            actions TEXT,
            vcc TEXT,
            pcc TEXT,
            meta TEXT
);`)
        return result;
    }
    async create_action_tabel(client: Client, tablename = "dbaction") {
        await client.query("DROP TABLE IF EXISTS " + tablename + ";")
        let result = await client.query(`CREATE TABLE IF NOT EXISTS ${tablename} (
            id SERIAL PRIMARY KEY,
            active VARCHAR (6) NOT NULL,
            type VARCHAR (6) NOT NULL,
            contact_reference_id VARCHAR ( 255 ) NOT NULL,
            tran_id VARCHAR (16),
            every  VARCHAR ( 255 ) NOT NULL,
            date VARCHAR (16) NOT NULL,
            value VARCHAR (16) NOT NULL,
            count VARCHAR (16) NOT NULL,
            done_count VARCHAR (16) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            meta TEXT
);`)
        return result;
    }

    // Create Tables =======

    async insertRows(tabelname, client: Client, cols: string[], values: string[][]) {
        const queries = this.create_multiple_insert_queries(tabelname, cols, values);
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

    create_multiple_insert_queries(tabelname, cols: string[], values_array: string[][]) {
        const queries: QueryConfig[] = [];
        for (let i = 0; i < values_array.length; i++) {
            const values = values_array[i]
            const query = this.create_insert_query(tabelname, cols, values);
            queries.push(query);
        }
        return queries;
    }

    // ========== Query helpers

    create_select_query(tablename, cols: string[] | string, values: {}, relation: "OR" | "AND"): QueryConfig {
        let equals_keys = Object.keys(values);
        let equals = Object.values(values);
        let _tmp_keys = equals_keys ? "WHERE " : "";
        for (let i = 0; i < equals_keys.length; i++) {
            const key = equals_keys[i];
            const value = values[key];
            _tmp_keys = _tmp_keys + key + `=$${i + 1} ` + (i != equals_keys.length - 1 ? relation : "");
        }
        let _tmp_cols = cols ? typeof cols == "string" ? cols : cols.join(", ") : "*";
        const query = {
            text: `SELECT  ${_tmp_cols} FROM ${tablename} ${_tmp_keys}`,
            values: equals
        }
        return query;
    }

    create_insert_query(tabelname, cols: string[], values: string[]): QueryConfig {
        let _tmp_cols_arr = [];
        for (let i = 0; i < cols.length; i++) {
            _tmp_cols_arr.push("$" + (i + 1));
        }
        let _tmp_val_replace = _tmp_cols_arr.join(", ");
        let _tmp_cols = cols.map(d => d.replace("'", "''")).join(", ");
        const query = {
            text: `INSERT INTO ${tabelname} (${_tmp_cols}) VALUES(${_tmp_val_replace}) RETURNING contact_reference_id`,
            values
        }
        return query;
    }

    create_update_query(tabelname, object: object, condition, relation: "OR" | "AND" = "AND"): QueryConfig {

        let equals_keys = Object.keys(object);
        let equals = Object.values(object);
        let _set_string = "";
        var last = 0;
        for (let i = 0; i < equals_keys.length; i++) {
            const key = equals_keys[i];
            const value = object[key];
            _set_string = _set_string + key + `=$${i + 1} ` + (i != equals_keys.length - 1 ? ", " : "");
            last = i;
        }
        last++;

        let cond_keys = Object.keys(condition);
        let cond = Object.values(condition);
        let _where_string = cond_keys ? "WHERE " : "";
        for (let i = 0; i < cond_keys.length; i++) {
            const key = cond_keys[i];
            const value = condition[key];
            _where_string = _where_string + key + `=$${i + 1 + last} ` + (i != cond_keys.length - 1 ? relation + " " : "");
        }

        const query = {
            text: `UPDATE ${tabelname} SET ${_set_string} ${_where_string}`,
            values: equals.concat(cond)
        }
        return query;
    }

    // Query helpers ==========

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

    async insert_object(data: object, tabelname, dbname = "viafusiondb") {
        let keys = Object.keys(data);
        let values = Object.values(data);
        const query = this.create_insert_query(tabelname, keys, values);
        const client = await this.connect(dbname);
        let result = await client.query(query);
        await client.end();
        return result;
    }

    async update_object<T = any>(data: object, condition: object, tabelname, dbname = "viafusiondb") {
        const query = this.create_update_query(tabelname, data, condition);
        const client = await this.connect(dbname);
        let result = await client.query<T>(query);
        await client.end();
        return result;
    }

    async get_object<T = any>(data: object, relation: "OR" | "AND", tabelname, dbname = "viafusiondb") {
        let keys = Object.keys(data)[0];
        let values = Object.values(data)[0];
        const query = this.create_select_query(tabelname, keys, values, relation);
        const client = await this.connect(dbname);
        let result = await client.query<T>(query);
        await client.end();
        return result;
    }

}