import { IDBWallet } from './../models/db/idbwallet';
import { ApiService } from './api';
import { IWallet } from "../models/rapyd/iwallet";
import { ViafusionDB } from './db/viafusiondb';
import { IDBSelect } from '../models/db/select_rows';

export class WalletService {
    constructor() {}

    create_wallet_and_contact(wallet:IWallet){
        var apiSrv = new ApiService();
        return apiSrv.post<IWallet>("user", wallet)
    }

    async create_db_wallet(wallet:IDBWallet){
        const db = new ViafusionDB();
        let results = await db.insert_object(wallet, 'dbwallet');
        return results;
    }

    async get_db_wallet(wallet:IDBSelect<IDBWallet>){
        const db = new ViafusionDB();
        let results = await db.get_object(wallet, "OR", 'dbwallet');
        return results;
    }

}