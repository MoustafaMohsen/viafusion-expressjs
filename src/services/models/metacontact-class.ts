import { UserService } from './user';
import { IDBMetaContact, ITransaction } from "../../interfaces/db/idbmetacontact";
import { ISender } from "../../interfaces/rapyd/isender";
import { contact_id, customer_id, ewallet_id } from "../../interfaces/rapyd/types";

export class DBMetaContact implements IDBMetaContact {
    constructor() {
    }

    async get_default?(contact_reference_id:number){
        this.contact_reference_id = contact_reference_id;
        let updated:DBMetaContact = {
            contact_reference_id:contact_reference_id,
            transactions: [],
            senders: [],
            benes: [],
            actions: [],
            vcc: [],
            pcc: [],
            meta: {}
        }
        return updated;
    }

    /** Internal id for calling actions */
    id?: string;
    contact_reference_id: number;
    transactions: ITransaction[];
    senders: ISender[];
    benes: any[];
    actions: any[];
    vcc: any[];
    pcc: any[];
    meta: object;

}