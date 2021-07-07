import { DBSecurity } from './security';
import { IDBSecurity } from './../../interfaces/db/isecurity';
import { ILogin, ILoginTransportObj } from './../../interfaces/db/ilogin';
import { HelperService } from './../util/helper';
import { IDBContact } from '../../interfaces/db/idbcontact';
import { ViafusionDB } from '../db/viafusiondb';
import { ApiService } from '../api/api';
import { IWallet } from "../../interfaces/rapyd/iwallet";
import { IContact } from '../../interfaces/rapyd/icontact';
import { IDBSelect } from '../../interfaces/db/select_rows';
import { DBMetaContact } from './metacontact-class';
import { MetaContactService } from './metacontact';

export class UserService {
    constructor() { }

    async create_db_user(user: IDBContact) {
        const db = new ViafusionDB();
        let results = await db.insert_object(user, 'dbcontact');
        let result = await this.get_db_user(results.rows[0]);
        await this.refresh_security(result);


        // create contact meta object
        let contactmeta = await new DBMetaContact().get_default(result.contact_reference_id)
        new MetaContactService().create_db_metacontact(contactmeta)
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

    async list_users_by_phone(phone_number, limit = 10) {
        const db = new ViafusionDB();
        const query_str = {
            text: `SELECT phone_number FROM dbcontact WHERE phone_number LIKE $1 AND ewallet LIKE ewallet LIMIT $2`,
            values: ["%"+phone_number+"%", limit]
        };
        const client = await db.connect('viafusiondb')
        let result = await client.query(query_str);
        return result.rows.map(u=>u.phone_number)
    }
    // TODO: delete user




    async login_or_register_to_otp(_login: ILoginTransportObj): Promise<ILoginTransportObj> {

        // user exists or not
        var user = await this.get_db_user({ phone_number: _login.phone_number });

        // login using device value
        if (user && _login.device_value) {
            if (user.security.login._device_value == _login.device_value) {
                user.security.login.device_passed = true;
                user.security.login = this.update_has_values(user.security.login);

                // check if fp value or fp value is sent
                if (_login.login._fp_value && user.security.login._fp_value == _login.fp_value) {
                    user.security.login.fp_passed = true;
                    user.security.login = this.update_has_values(user.security.login);
                    user.security.login = this.should_authenticate(user.security.login);
                    await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
                    return { login: user.security.login, contact_reference_id: user.contact_reference_id };
                }
            }
        }


        // if login using otp and pin/fp
        let otp = HelperService.generate_otp();

        // if user make otp request then return
        if (user) {
            user = await this.set_user_otp({ contact_reference_id: user.contact_reference_id }, otp);
            return { login: user.security.login, contact_reference_id: user.contact_reference_id };
        }

        // if not register login
        user = {};
        let new_user: IDBContact = {
            security: this.get_user_security(user),
            phone_number: _login.phone_number
        };
        user = await this.create_db_user(new_user);
        user = await this.set_user_otp({ contact_reference_id: user.contact_reference_id }, otp);
        return { login: user.security.login, contact_reference_id: user.contact_reference_id };
    }

    async confirm_authenticate(user: IDBContact): Promise<IDBContact> {
        user.security.login = this.should_authenticate(user.security.login);
        let newuser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
        return newuser
    }


    //#region security handling

    // ========= OTP
    // update user security object to set otp
    async set_user_otp(minimum_user_object: IDBContact, otp: string) {
        // user exists or not
        const db = new ViafusionDB();
        let user = await this.get_db_user(minimum_user_object);
        user.security.login._otp_value = otp + "";
        user.security.login.otp_passed = true;
        user.security.login = this.update_has_values(user.security.login);

        let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
        return updatedUser;
    }

    // update user security object to set otp
    async confirm_user_otp(minimum_user_object: IDBContact, otp: number) {
        // user exists or not
        const db = new ViafusionDB();
        let user = await this.get_db_user(minimum_user_object);
        if (user && user.security && user.security.login._otp_value === otp + "") {
            user.security.login.otp_passed = true;
            user.security.login = this.update_has_values(user.security.login);
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            return updatedUser;

        } else {
            user.security.login.otp_passed = false;
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            return updatedUser;
        }
    }


    // ========= PIN
    async set_user_pin(minimum_user_object: IDBContact, pin: string) {
        // user exists or not
        const db = new ViafusionDB();
        let user = await this.get_db_user(minimum_user_object);
        user.security.login._pin_value = pin + "";
        user.security.login.pin_passed = true;
        user.security.login = this.update_has_values(user.security.login);
        let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
        updatedUser = await this.confirm_authenticate(updatedUser);
        return updatedUser;
    }

    // update user security object to set pin
    async confirm_user_pin(minimum_user_object: IDBContact, pin: number) {
        // user exists or not
        const db = new ViafusionDB();
        let user = await this.get_db_user(minimum_user_object);
        if (user && user.security && user.security.login._pin_value === pin + "") {
            user.security.login.pin_passed = true;
            user.security.login = this.update_has_values(user.security.login);
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            updatedUser = await this.confirm_authenticate(updatedUser);
            return updatedUser;

        } else {
            user.security.login.pin_passed = false;
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            return updatedUser;
        }
    }

    // ========= FP
    async set_user_fp(minimum_user_object: IDBContact, fp: string) {
        // user exists or not
        const db = new ViafusionDB();
        let user = await this.get_db_user(minimum_user_object);
        user.security.login._fp_value = fp + "";
        user.security.login.fp_passed = true;
        user.security.login = this.update_has_values(user.security.login);

        let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
        updatedUser = await this.confirm_authenticate(updatedUser);
        return updatedUser;
    }

    // update user security object to set fp
    async confirm_user_fp(minimum_user_object: IDBContact, fp: number) {
        // user exists or not
        const db = new ViafusionDB();
        let user = await this.get_db_user(minimum_user_object);
        if (user && user.security && user.security.login._fp_value === fp + "") {
            user.security.login.fp_passed = true;
            user.security.login = this.update_has_values(user.security.login);
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            updatedUser = await this.confirm_authenticate(updatedUser);
            return updatedUser;

        } else {
            user.security.login.fp_passed = false;
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            return updatedUser;
        }
    }

    // ========= DEVICE
    async set_user_device(minimum_user_object: IDBContact, device: string) {
        // user exists or not
        const db = new ViafusionDB();
        let user = await this.get_db_user(minimum_user_object);
        user.security.login._device_value = device + "";
        user.security.login.device_passed = true;
        user.security.login = this.update_has_values(user.security.login);
        this.confirm_authenticate(user);
        let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
        return updatedUser;
    }

    // update user security object to set device
    async confirm_user_device(minimum_user_object: IDBContact, device: number) {
        // user exists or not
        const db = new ViafusionDB();
        let user = await this.get_db_user(minimum_user_object);
        if (user && user.security && user.security.login._device_value === device + "") {
            user.security.login.device_passed = true;
            user.security.login = this.update_has_values(user.security.login);
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            updatedUser = await this.confirm_authenticate(updatedUser);
            return updatedUser;

        } else {
            user.security.login.device_passed = false;
            let updatedUser = await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
            return updatedUser;
        }
    }
    //#endregion


    //#region secuiry
    async refresh_security(user: IDBContact) {
        user.security = this.get_user_security(user);
        await this.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
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

    update_has_values(login: ILogin) {
        if (login._otp_value) login.has_otp = true;
        if (login._pin_value) login.has_pin = true;
        if (login._fp_value) login.has_fp = true;
        if (login._device_value) login.has_device = true;
        return login;
    }

    should_authenticate(login: ILogin) {
        if (login.fp_passed && login.device_passed) {
            login.authenticated = true;
        }
        if (login.pin_passed && login.otp_passed) {
            login.authenticated = true;
        }
        if (login.fp_passed && login.otp_passed) {
            login.authenticated = true;
        }
        return login;
    }

    //#endregion

    //#region User parser
    parse_user(user: IDBContact) {
        try {
            user.security = this.parse_if_string(user.security) as any;
            user.meta = this.parse_if_string(user.meta) as any;
            user.rapyd_contact_data = this.parse_if_string(user.rapyd_contact_data) as any;
            user.rapyd_wallet_data = this.parse_if_string(user.rapyd_wallet_data) as any;
            return user;
        } catch (error) {
            console.error(error);
            return user
        }
    }

    parse_if_string(str: string | object) {
        let temp = str;
        if (str && typeof str === "string") {
            try {
                temp = JSON.parse(str);
            } catch (error) {
                console.error(error);
                temp = str;
            }
        } else {
            temp = str;
        }
        return temp;
    }
    //#endregion
}