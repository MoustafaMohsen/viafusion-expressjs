import { IDBMetaContact } from '../../interfaces/db/idbmetacontact';
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';
import { DBMetaContact } from './metacontact-class';

export class MetaContactService {

    async get_db_metacontact(minimum_metacontact_object: IDBMetaContact) {
        const db = new ViafusionDB();
        let _metacontact: IDBSelect<IDBMetaContact> = {
            "*": minimum_metacontact_object
        }
        let results = await db.get_object<IDBMetaContact>(_metacontact, "AND", 'dbmetacontact');
        let meta = results.rows[0]
        let parser = this.parse_metacontact(meta);
        return parser

    }

    async update_db_metacontact(metacontact: IDBMetaContact, newmetacontact: IDBMetaContact) {
        const db = new ViafusionDB();
        newmetacontact = this.prepare_metacontact_for_db(newmetacontact);
        let results = await db.update_object<IDBMetaContact>(newmetacontact, {contact_reference_id:metacontact.contact_reference_id} as any, 'dbmetacontact');
        let result = await this.get_db_metacontact({contact_reference_id:metacontact.contact_reference_id} as any);
        return result;
    }

    async create_db_metacontact(metacontact: IDBMetaContact) {
        const db = new ViafusionDB();
        let contactmeta = await new DBMetaContact().get_default(metacontact.contact_reference_id)
        let metaresult = await db.insert_object(contactmeta, 'dbmetacontact');
        let result = await this.get_db_metacontact({contact_reference_id:metaresult.rows[0].contact_reference_id} as any);
        return result;
    }

    //#region User parser
    prepare_metacontact_for_db(metacontact: IDBMetaContact) {
        try {
            if (metacontact.senders)metacontact.senders = {data:metacontact.senders} as any;
            if (metacontact.benes)metacontact.benes = {data:metacontact.benes} as any;
            if (metacontact.transactions)metacontact.transactions = {data:metacontact.transactions} as any;
            if (metacontact.actions)metacontact.actions = {data:metacontact.actions} as any;
            if (metacontact.vcc)metacontact.vcc = {data:metacontact.vcc} as any;
            if (metacontact.pcc)metacontact.pcc = {data:metacontact.pcc} as any;
            if (metacontact.meta)metacontact.meta = {data:metacontact.meta} as any;
            return metacontact;
        } catch (error) {
            console.error(error);
            return metacontact
        }
    }
    parse_metacontact(metacontact: IDBMetaContact) {
        try {
            metacontact.transactions = this.parse_meta(metacontact.transactions) as any || [];
            metacontact.senders = this.parse_meta(metacontact.senders) as any || [];
            metacontact.benes = this.parse_meta(metacontact.benes) as any || [];
            metacontact.actions = this.parse_meta(metacontact.actions) as any || [];
            metacontact.vcc = this.parse_meta(metacontact.vcc) as any || [];
            metacontact.pcc = this.parse_meta(metacontact.pcc) as any || [];
            metacontact.meta = this.parse_meta(metacontact.meta) as any || [];
            return metacontact;
        } catch (error) {
            console.error(error);
            return metacontact
        }
    }

    parse_meta(str:any) {
        let temp = str;
        try {
            temp = JSON.parse(str);
        } catch (error) {
            console.error(error);
            temp = str;
        }
        return temp.data;
    }
    //#endregion

}