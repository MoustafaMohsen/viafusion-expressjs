import { DBSecurity } from './security';
import { IDBSecurity } from '../../interfaces/db/isecurity';
import { ILogin } from '../../interfaces/db/ilogin';
import { HelperService } from '../util/helper';
import { IDBMetaContact } from '../../interfaces/db/idbmetacontact';
import { ViafusionDB } from '../db/viafusiondb';
import { ApiService } from '../api/api';
import { IWallet } from "../../interfaces/rapyd/iwallet";
import { IContact } from '../../interfaces/rapyd/icontact';
import { IDBSelect } from '../../interfaces/db/select_rows';

export class MetaContactService {
    constructor() { }

    async create_db_metacontact(metacontact: IDBMetaContact) {
        const db = new ViafusionDB();
        let results = await db.insert_object(metacontact, 'dbmetacontact');
        let result = await this.get_db_metacontact(results.rows[0]);
        await this.refresh_metacontact(result);
        return result;
    }

    async get_db_metacontact(minimum_metacontact_object: IDBMetaContact) {
        const db = new ViafusionDB();
        let _metacontact: IDBSelect<IDBMetaContact> = {
            "*": minimum_metacontact_object
        }
        let results = await db.get_object<IDBMetaContact>(_metacontact, "AND", 'dbmetacontact');
        return this.parse_metacontact(results.rows[0]);

    }

    async update_db_metacontact(metacontact: IDBMetaContact, newmetacontact: IDBMetaContact) {
        const db = new ViafusionDB();
        let results = await db.update_object<IDBMetaContact>(newmetacontact, metacontact, 'dbmetacontact');
        let result = await this.get_db_metacontact(metacontact);
        return result;
    }


    async login_or_register_to_otp(_login: any) {
        // metacontact exists or not

        var metacontact = await this.get_db_metacontact({ phone_number: _login.phone_number });

        let otp = HelperService.generate_otp();

        // if metacontact make otp request then return loggedin
        if (metacontact) {
            metacontact = await this.set_metacontact_otp({ contact_reference_id: metacontact.contact_reference_id }, otp);
            return { login: metacontact.security.login, contact_reference_id: metacontact.contact_reference_id };
        }

        // if not register login
        metacontact = await this.create_db_metacontact(_login);
        metacontact = await this.set_metacontact_otp({ contact_reference_id: metacontact.contact_reference_id }, otp);
        return { login: metacontact.security.login, contact_reference_id: metacontact.contact_reference_id };
    }

    //#region security handling

    // ========= OTP
    // update metacontact security object to set otp
    async set_metacontact_otp(minimum_metacontact_object: IDBMetaContact, otp: string) {
        // metacontact exists or not
        const db = new ViafusionDB();
        let metacontact = await this.get_db_metacontact(minimum_metacontact_object);
        let security = this.update_security_otp(metacontact, otp+"");
        let newmetacontact = metacontact;
        newmetacontact.security = security;
        newmetacontact.security.login.otp_passed = true;
        newmetacontact.security.login.has_otp = true;

        let updatedMetaContact = await this.update_db_metacontact({ contact_reference_id: metacontact.contact_reference_id }, newmetacontact);
        return updatedMetaContact;
    }

    // update metacontact security object to set otp
    async confirm_metacontact_otp(minimum_metacontact_object: IDBMetaContact, otp: number) {
        // metacontact exists or not
        const db = new ViafusionDB();
        let metacontact = await this.get_db_metacontact(minimum_metacontact_object);
        if (metacontact && metacontact.security && metacontact.security.login._otp_value == otp+"") {
            metacontact.security.login.otp_passed = true;
            metacontact.security.login.has_otp = true;
            let updatedMetaContact = await this.update_db_metacontact({ contact_reference_id: metacontact.contact_reference_id }, metacontact);
            return updatedMetaContact;

        } else {
            metacontact.security.login.otp_passed = false;
            let updatedMetaContact = await this.update_db_metacontact({ contact_reference_id: metacontact.contact_reference_id }, metacontact);
            return updatedMetaContact;
        }
    }

    update_security_otp(metacontact: IDBMetaContact, otp:string) {
        let security = this.get_metacontact_security(metacontact);
        security.login._otp_value = otp+"";
        return security;
    }

    // ========= PIN
    async set_metacontact_pin(minimum_metacontact_object: IDBMetaContact, pin: string) {
        // metacontact exists or not
        const db = new ViafusionDB();
        let metacontact = await this.get_db_metacontact(minimum_metacontact_object);
        let security = this.update_security_pin(metacontact, pin+"");
        let newmetacontact = metacontact;
        newmetacontact.security = security;
        newmetacontact.security.login.pin_passed = true;
        newmetacontact.security.login.has_pin = true;
        let updatedMetaContact = await this.update_db_metacontact({ contact_reference_id: metacontact.contact_reference_id }, newmetacontact);
        return updatedMetaContact;
    }

    // update metacontact security object to set pin
    async confirm_metacontact_pin(minimum_metacontact_object: IDBMetaContact, pin: number) {
        // metacontact exists or not
        const db = new ViafusionDB();
        let metacontact = await this.get_db_metacontact(minimum_metacontact_object);
        if (metacontact && metacontact.security && metacontact.security.login._pin_value == (pin+"")) {
            metacontact.security.login.pin_passed = true;
            metacontact.security.login.has_pin = true;
            let updatedMetaContact = await this.update_db_metacontact({ contact_reference_id: metacontact.contact_reference_id }, metacontact);
            return updatedMetaContact;

        } else {
            metacontact.security.login.pin_passed = false;
            let updatedMetaContact = await this.update_db_metacontact({ contact_reference_id: metacontact.contact_reference_id }, metacontact);
            return updatedMetaContact;
        }
    }

    async refresh_metacontact(metacontact: IDBMetaContact){
        // 
        metacontact.security = this.get_metacontact_security(metacontact);
        await this.update_db_metacontact({contact_reference_id:metacontact.contact_reference_id},metacontact);
    }
    update_security_pin(metacontact: IDBMetaContact, pin) {
        let security = this.get_metacontact_security(metacontact);
        security.login._pin_value = pin+"";
        return security;
    }


    get_metacontact_security(metacontact: IDBMetaContact) {
        let defaults = 
        let security = new DBSecurity(metacontact.security);
        try {
            security = typeof security === "string" ? JSON.parse(security) : security;
        } catch (error) {
            throw new Error("Security string could not be parsed");
        }
        return security;
    }

    //#endregion

    //#region MetaContact parser
    parse_metacontact(metacontact: IDBMetaContact) {
        try {
            metacontact.security = this.parse_if_string(metacontact.security) as any;
            metacontact.meta = this.parse_if_string(metacontact.meta) as any;
            metacontact.data = this.parse_if_string(metacontact.data) as any;
            return metacontact;
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
    //#endregion
}