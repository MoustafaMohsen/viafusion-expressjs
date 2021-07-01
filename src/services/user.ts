import { IDBContact } from './../models/db/idbcontact';
import { ViafusionDB } from './db/viafusiondb';
import { ApiService } from './api';
import { IWallet } from "../models/rapyd/iwallet";
import { IContact } from '../models/rapyd/icontact';

export class UserService {
    constructor() {}

    async create_db_user(user:IDBContact){
        const db = new ViafusionDB();
        let results = await db.insert_object(user, 'dbcontacts');
        return results;
    }

    async get_db_user(user:IDBContact){
        const db = new ViafusionDB();
        let results = await db.get_object(user, "OR", 'dbcontacts');
        return results;
    }
}