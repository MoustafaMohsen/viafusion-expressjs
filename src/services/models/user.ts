import { DBSecurity } from './security';
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
        let result = await this.get_db_user(results.rows[0]);
        return result;
    }

    async get_db_user(minimum_user_object: IDBContact) {
        const db = new ViafusionDB();
        let _user: IDBSelect<IDBContact> = {
            "*": minimum_user_object
        }
        let results = await db.get_object<IDBContact>(_user, "AND", 'dbcontact');
        return this.parse_user(results.rows[0]);

    }

    async update_db_user(user: IDBContact, newuser: IDBContact) {
        const db = new ViafusionDB();
        let results = await db.update_object<IDBContact>(newuser, user, 'dbcontact');
        let result = await this.get_db_user(user);
        return result;
    }


    async login_or_register_to_otp(_login: any) {
        // user exists or not

        var user = await this.get_db_user({ phone_number: _login.phone_number });

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
            return { login, contact_reference_id: user.contact_reference_id };
        }

        // if not register login
        user = await this.create_db_user(_login);
        this.set_user_otp({ contact_reference_id: user.contact_reference_id }, otp);
        let login: ILogin = {
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
        return { login, contact_reference_id: user.contact_reference_id };
    }

    // update user security object to set otp
    async set_user_otp(minimum_user_object: IDBContact, otp: number) {
        // user exists or not
        const db = new ViafusionDB();
        let user = await this.get_db_user(minimum_user_object);
        let security = this.update_security_otp(user, otp);
        let newuser = user;
        newuser.security = security;
        let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, newuser);
        return updatedUser;
    }


    // update user security object to set otp
    async confirm_user_otp(minimum_user_object: IDBContact, otp: number) {
        // user exists or not
        const db = new ViafusionDB();
        let user = await this.get_db_user(minimum_user_object);
        if (user && user.security && user.security.login._otp_value == otp) {
            user.security.login.otp_passed = true;
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            return updatedUser;

        } else {
            user.security.login.otp_passed = false;
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            return updatedUser;
        }
    }


    // ==== security handling
    update_security_otp(user: IDBContact, otp) {
        let security = this.get_user_security(user);
        security.login._otp_value = otp;
        return security;
    }

    get_user_security(user: IDBContact) {
        let security = new DBSecurity(user.security);
        try {
            security = typeof security === "string" ? JSON.parse(security) : security;
        } catch (error) {
            throw new Error("Security string could not be parsed");
        }
        return security;
    }

    // security handling ====


    // ==== User parser
    parse_user(user: IDBContact) {
        try {
            user.security = this.parse_if_string(user.security) as any;
            user.meta = this.parse_if_string(user.meta) as any;
            user.data = this.parse_if_string(user.data) as any;
            return user;
        } catch (error) {
            console.error(error);
            return null
        }
    }

    parse_if_string(str: string | object) {
        let temp = str;
        if (typeof str == "string") {
            temp = JSON.parse(str);
        } else {
            temp = str;
        }
        return temp;
    }
    // User parser ====
    // 
}