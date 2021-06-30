import { Client } from "pg";
import { ViafusionDB } from "./viafusiondb";

export class ViafusionDBFromFile extends ViafusionDB {
    constructor(opts?){
        super(opts)
    }

    async prepare_init_file_db(dbname = "filedb", tablename = "users") {
        let result: any = {}
        delete this.dbsettings.database;
        const client1 = await this.connect();
        result.createDB = await this.createDB(client1, dbname);
        await client1.end();

        this.dbsettings.database = dbname;
        const client2 = await this.connect(dbname);
        result.createTable = await this.create_file_table(client2, tablename);
        await client2.end();
        delete this.dbsettings.database;
        console.log("DB is ready");
        return result;
    }

    async start_copy_from_file(filepath:string, database, tabelname="users"){
        const client = await this.connect(database);
        await this._copy_from_file(client,filepath, tabelname);
    }
    
    async create_file_table(client:Client, tablename = "users"){
        await client.query("DROP TABLE IF EXISTS " + tablename + ";")
        const query = `CREATE TABLE IF NOT EXISTS users (
            id serial PRIMARY KEY,
            fb_id TEXT,
            data_1 TEXT,
            email TEXT,
            phone TEXT,
            religion TEXT,
            birthdate TEXT,
            first_name TEXT,
            last_name TEXT,
            gender TEXT,
            fb_link TEXT,
            data_10 TEXT,
            username TEXT,
            middle TEXT,
            profile_status TEXT,
            job_company TEXT,
            job_title TEXT,
            city TEXT,
            government TEXT,
            collage TEXT,
            fb_email VARCHAR ( 255 ),
            data_20 TEXT,
            data_21 TEXT,
            data_22 TEXT,
            data_23 TEXT,
            data_24 TEXT,
            marital_status TEXT,
            data_26 TEXT,
            data_27 TEXT,
            data_28 TEXT,
            data_29 TEXT,
            data_30 TEXT,
            data_31 TEXT,
            data_32 TEXT,
            data_33 TEXT,
            data_34 TEXT
           );`
        return client.query(query);
    }

    _copy_from_file(client:Client, filepath, tabelname="users"){
        const query = `COPY ${tabelname} (fb_id,data_1,email,phone,religion,birthdate,first_name,last_name,gender,fb_link,data_10,username,middle,profile_status,job_company,job_title,city,government,collage,fb_email,data_20,data_21,data_22,data_23,data_24,marital_status,data_26,data_27,data_28,data_29,data_30,data_31,data_32,data_33,data_34)
        FROM '${filepath}'
        DELIMITER ',' CSV;
        ;`
        return client.query(query);
    }
}