import { UserService } from './user';
import { IDBMetaContact, ITransaction } from "../../interfaces/db/idbmetacontact";
import { contact_id, customer_id, ewallet_id } from "../../interfaces/rapyd/types";
import { ICreatePayout } from '../../interfaces/rapyd/ipayout';

export class DBMetaContact implements IDBMetaContact {
    constructor() {
    }

    async get_default?(contact_reference_id:number){
        this.contact_reference_id = contact_reference_id;
        let updated:any = {
            contact_reference_id:contact_reference_id,
            transactions: {data:[]},
            senders: {data:[]},
            benes: {data:[]},
            actions: {data:[]},
            vcc: {data:[]},
            pcc: {data:[]},
            meta: {data:{}}
        }
        return updated as DBMetaContact;
    }

    /** Internal id for calling actions */
    id?: string;
    contact_reference_id: number;
    transactions: ITransaction[];
    senders: ICreatePayout.Sender[];
    benes: any[];
    actions: any[];
    vcc: any[];
    pcc: any[];
    meta: object;

}