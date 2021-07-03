import { ISender } from '../rapyd/isender';
import { PostCreatePayment } from '../rapyd/ipayment';
import { contact_id, customer_id } from '../rapyd/types';
import { ewallet_id } from "../rapyd/types";
import { IPayment } from '../rapyd/ipayment';
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

export interface IDBMetaContact {
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

export interface ITransaction {
  id: string
  source_amount?: string
  destination_amount?: string
  sources: PostCreatePayment.ICreate[]
  destinations: any[]
  executed: boolean
}
