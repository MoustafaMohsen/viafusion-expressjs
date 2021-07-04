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
import { DBMetaContact } from './metacontact-class';

export class MetaContactService {

    async get_db_metacontact(minimum_metacontact_object: IDBMetaContact) {
        const db = new ViafusionDB();
        let _metacontact: IDBSelect<IDBMetaContact> = {
            "*": minimum_metacontact_object
        }
        let results = await db.get_object<IDBMetaContact>(_metacontact, "AND", 'dbcontact');
        return this.parse_metacontact(results.rows[0]);

    }

    async update_db_metacontact(metacontact: IDBMetaContact, newmetacontact: IDBMetaContact) {
        const db = new ViafusionDB();
        let results = await db.update_object<IDBMetaContact>(newmetacontact, metacontact, 'dbcontact');
        let result = await this.get_db_metacontact(metacontact);
        return result;
    }

    //#region User parser
    parse_metacontact(metacontact: IDBMetaContact) {
        try {
            metacontact.transactions = this.parse_if_string(metacontact.transactions) as any;
            metacontact.senders = this.parse_if_string(metacontact.senders) as any;
            metacontact.benes = this.parse_if_string(metacontact.benes) as any;
            metacontact.actions = this.parse_if_string(metacontact.actions) as any;
            metacontact.vcc = this.parse_if_string(metacontact.vcc) as any;
            metacontact.pcc = this.parse_if_string(metacontact.pcc) as any;
            metacontact.meta = this.parse_if_string(metacontact.meta) as any;
            return metacontact;
        } catch (error) {
            console.error(error);
            return metacontact
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