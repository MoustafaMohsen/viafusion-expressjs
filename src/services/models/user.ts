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
    
    
    async login_or_register_to_otp(login:any){
        // user exists or not
        let _user:IDBSelect<IDBContact> = {
            "*":{
                phone_number: login.phone_number
            }
        }
        const db = new ViafusionDB();
        let results = await db.get_object<IDBContact>(_user, "OR", 'dbcontact');
        var user = results.rows[0];
        
        let otp = HelperService.generate_otp();
        // if user make otp request then return loggedin
        if (user) {
            let login :ILogin = {
                authenticated:false,
                otp_passed:false,
                pf_passed:false,
                pin_passed:false,
                _otp_value:otp,
                resend_otp_after:0,
                user_exsits:true,
                _sandbox:true,
                data:null
            }
            return login;
        }

        // if not register login
        results = await this.create_db_user(login);
        var user = results.rows[0];
        let register :ILogin = {
            authenticated:false,
            otp_passed:false,
            pf_passed:false,
            pin_passed:false,
            _otp_value:otp,
            resend_otp_after:0,
            user_exsits:false,
            _sandbox:true,
            data:null
        }
        return register;
    }

    
}