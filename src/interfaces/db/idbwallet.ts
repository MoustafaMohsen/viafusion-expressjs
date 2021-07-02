import { contact_id } from './../rapyd/types.d';
import { IWallet } from './../rapyd/iwallet';
import { ewallet_id } from "../rapyd/types";
import { IDBSecurity } from './isecurity';
/**
 * 
ewallet_reference_id VARCHAR ( 255 ) PRIMARY KEY,
id VARCHAR ( 255 ),
phone_number VARCHAR ( 255 ),
email VARCHAR ( 255 ),
contact_id VARCHAR ( 255 ),
contact_reference_id VARCHAR ( 255 ),
data TEXT

 */

export interface IDBWallet {
    ewallet_reference_id?: number;
    id?: contact_id;
    email?: string;
    ewallet: ewallet_id;
    contact_id: string;
    contact_reference_id: string;
    phone_number?: string;
    security:IDBSecurity;
    meta:object;
    data:IWallet;
}
