import { ILogin } from './../../interfaces/db/ilogin';
import { HelperService } from './../util/helper';
import { IDBContact } from '../../interfaces/db/idbcontact';
import { ViafusionDB } from '../db/viafusiondb';
import { ApiService } from '../api/api';
import { IWallet } from "../../interfaces/rapyd/iwallet";
import { IContact } from '../../interfaces/rapyd/icontact';
import { IDBSelect } from '../../interfaces/db/select_rows';

export class UserService {
    constructor() {}

    async create_db_user(user:IDBContact){
        const db = new ViafusionDB();
        let results = await db.insert_object<IDBContact>(user, 'dbcontact');
        return results;
    }

    async get_db_user(user:IDBSelect<IDBContact>){
        const db = new ViafusionDB();
        let results = await db.get_object<IDBContact>(user, "OR", 'dbcontact');
        return results;
    }
    
    
    async login_or_register_to_otp(_user:IDBSelect<IDBContact>){
        // user exists or not
        const db = new ViafusionDB();
        let results = await db.get_object<IDBContact>(_user, "OR", 'dbcontact');
        var user = results.rows[0];
        
        let otp = HelperService.generate_otp();
        // if user make otp request then return loggedin
        if (user) {
            let login :ILogin = {
                loggedin:false,
                otp_passed:false,
                pf_passed:false,
                pin_passed:false,
                _otp_value:otp,
                resend_otp_after:0,
                user_created:false,
                data:null
            }
            return login;
        }

        // if not register login
        results = await this.create_db_user(HelperService.select_to_object(_user));
        var user = results.rows[0];
        let register :ILogin = {
            loggedin:false,
            otp_passed:false,
            pf_passed:false,
            pin_passed:false,
            _otp_value:otp,
            resend_otp_after:0,
            user_created:true,
            data:null
        }
        return register;
    }

    
}