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
    constructor() { }

    async create_db_user(user: IDBContact) {
        const db = new ViafusionDB();
        let results = await db.insert_object(user, 'dbcontact');
        let dbresults = await db.get_object<IDBContact>(user, "OR", 'dbcontact');
        return this.parse_user(dbresults.rows[0]);
    }

    async get_db_user(user: IDBSelect<IDBContact>) {
        const db = new ViafusionDB();
        let results = await db.get_object<IDBContact>(user, "OR", 'dbcontact');
        return this.parse_user(results.rows[0]);

    }

    async update_db_user(user: IDBContact, newuser: IDBContact) {
        const db = new ViafusionDB();
        let results = await db.update_object<IDBContact>(user, newuser, 'dbcontact');
        return this.parse_user(results.rows[0]);
    }


    async login_or_register_to_otp(login: any) {
        // user exists or not
        let _user: IDBSelect<IDBContact> = {
            "*": {
                phone_number: login.phone_number
            }
        };
        var user = await this.get_db_user(_user);

        let otp = HelperService.generate_otp();
        // if user make otp request then return loggedin
        if (user) {
            this.set_user_otp({ contact_reference_id: user.contact_reference_id }, otp);
            let login: ILogin = {
                authenticated: false,
                otp_passed: false,
                pf_passed: false,
                pin_passed: false,
                _otp_value: otp,
                resend_otp_after: 0,
                user_exsits: true,
                _sandbox: true,
                data: null
            };
            return login;
        }

        // if not register login
        user = await this.create_db_user(login);
        this.set_user_otp({ contact_reference_id: user.contact_reference_id }, otp);
        let register: ILogin = {
            authenticated: false,
            otp_passed: false,
            pf_passed: false,
            pin_passed: false,
            _otp_value: otp,
            resend_otp_after: 0,
            user_exsits: false,
            _sandbox: true,
            data: null
        };
        return register;
    }

    // update user security object to set otp
    async set_user_otp(minimum_user_object: IDBContact, otp: number) {
        // user exists or not
        let _user: IDBSelect<IDBContact> = {
            "*": minimum_user_object
        };
        const db = new ViafusionDB();
        let user = await this.get_db_user(_user);
        let security = this.update_security_otp(user, otp);
        let newuser = user;
        newuser.securiy = security;
        let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, newuser);
        return updatedUser;
    }


    // update user security object to set otp
    async confirm_user_otp(minimum_user_object: IDBContact, otp: number) {
        // user exists or not
        let _user: IDBSelect<IDBContact> = {
            "*": minimum_user_object
        };
        const db = new ViafusionDB();
        let user = await this.get_db_user(_user);
        if (user && user.securiy.login._otp_value == otp) {
            user.securiy.login.otp_passed = true;
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            return updatedUser;
            
        }else{
            return user;
        }
    }


    // ==== security handling
    update_security_otp(user: IDBContact, otp) {
        let security = this.get_user_security(user);
        security.login._otp_value = otp;
        return security;
    }

    get_user_security(user: IDBContact){
        let security = user.securiy;
        try {
            security = typeof security === "string" ? JSON.parse(security) : security;
        } catch (error) {
            throw new Error("Security string could not be parsed");
        }
        return security;
    }

    // security handling ====


    // ==== User parser
    parse_user(user:IDBContact) {
        user.securiy = this.parse_if_string(user.securiy);
        user.meta = this.parse_if_string(user.securiy);
        user.data = this.parse_if_string(user.securiy);
        return user;
    }
    parse_if_string(str:string |object ){
        if (typeof str == "string") {
            return JSON.parse(str);
        }
        return str;
    }
    // User parser ====
    // 
}