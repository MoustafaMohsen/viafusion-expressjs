import { UserService } from './user';
import { IDBMetaContact, ITransaction } from "../../interfaces/db/idbmetacontact";
import { ISender } from "../../interfaces/rapyd/isender";
import { contact_id, customer_id, ewallet_id } from "../../interfaces/rapyd/types";

export class DBMetaContact implements IDBMetaContact {
    constructor() {
    }

    async get_default?(contact_reference_id:contact_id){
        this.contact_reference_id = contact_reference_id;
        let userSrv = new  UserService();
        let contact = await userSrv.get_db_user({contact_reference_id:contact_reference_id as any})
        let updated = new DBMetaContact();
        updated={
            contact_reference_id:contact.contact_reference_id,
            wallet_refrence_id:contact.wallet_refrence_id,
            ewallet:contact.ewallet,
            customer:contact.customer
        }
        let def = new DBMetaContact();
        let result = Object.assign()
    }

    /** Internal id for calling actions */
    id?: string;
    contact_reference_id?: contact_id;
    wallet_refrence_id?: ewallet_id;
    customer?: customer_id;
    meta?: object;
    transactions?: ITransaction[];
    senders?: ISender[];
    bene?: any[];

}