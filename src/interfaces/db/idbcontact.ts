import { IContact } from "../rapyd/icontact";
import { ewallet_id } from "../rapyd/types";
import { IDBSecurity } from "./isecurity";
/**
 * 
contact_reference_id VARCHAR ( 255 ) PRIMARY KEY,
id VARCHAR ( 255 ),
phone_number VARCHAR ( 255 ),
email VARCHAR ( 255 ),
wallet_id VARCHAR ( 255 ),
wallet_refrence_id VARCHAR ( 255 ),
data TEXT

 */

export interface IDBContact {
    contact_reference_id?: number;
    id?: string;
    email?: string;
    ewallet?: ewallet_id;
    wallet_refrence_id?: string;
    phone_number?: string;
    security?:IDBSecurity;
    meta?:object;
    data?:IContact;
}
