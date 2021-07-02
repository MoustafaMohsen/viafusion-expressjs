import { IDBSecurity } from './../../interfaces/db/isecurity';
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
        let results = await db.insert_object(user, 'dbcontact');
        let dbresults = await db.get_object<IDBContact>(user, "OR", 'dbcontact');
        return dbresults.rows[0];
    }

    async get_db_user(user:IDBSelect<IDBContact>){
        const db = new ViafusionDB();
        let results = await db.get_object<IDBContact>(user, "OR", 'dbcontact');
        return results.rows[0];
    }

    async update_db_user(user:IDBContact, newuser:IDBContact){
        const db = new ViafusionDB();
        let results = await db.update_object<IDBContact>(user,newuser, 'dbcontact');
        return results.rows[0];
    }
    
    
    async login_or_register_to_otp(login:any){
        // user exists or not
        let _user:IDBSelect<IDBContact> = {
            "*":{
                phone_number: login.phone_number
            }
        }
        var user = await this.get_db_user(_user);
        
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
        user = await this.create_db_user(login);
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

    // update user security object to set otp
    async set_otp(contact_reference_id:number, otp:number){
        let _user:IDBSelect<IDBContact> = {
            "*":{
                contact_reference_id
            }
        }
        const db = new ViafusionDB();
        var user = await this.get_db_user(_user);
        user.securiy.login._otp_value = otp;
        let newuser:IDBContact = {
            securiy:user.securiy,
        }
        let updatedUser = await this.update_db_user(newuser,{contact_reference_id:user.contact_reference_id});
        return updatedUser;
    }

    async confirm_top(login:any){
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
            let security = this.update_security_otp(user.securiy,otp);

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
        var user = await this.create_db_user(login);
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



    
    // ==== security handling
    update_security_otp(security:IDBSecurity,otp){
        try {
            security = typeof security === "string"?JSON.parse(security):security;
        } catch (error) {
            throw new Error("Security string could not be parsed");
        }
        security.login._otp_value = otp;
        return security;
    }

    // security handling ====
}