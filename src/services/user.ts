import { IDBContact } from './../models/db/idbcontact';
import { ViafusionDB } from './db/viafusiondb';
import { ApiService } from './api';
import { IWallet } from "../models/rapyd/iwallet";
import { IContact } from '../models/rapyd/icontact';
import { IDBSelect } from '../models/db/select_rows';

export class UserService {
    constructor() {}

    async create_db_user(user:IDBContact){
        const db = new ViafusionDB();
        let results = await db.insert_object(user, 'dbcontact');
        return results;
    }

    async get_db_user(user:IDBSelect<IDBContact>){
        const db = new ViafusionDB();
        let results = await db.get_object(user, "OR", 'dbcontact');
        return results;
    }
}