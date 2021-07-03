import { ISender } from '../rapyd/isender';
import { PostCreatePayment } from '../rapyd/ipayment';
import { contact_id, customer_id } from '../rapyd/types';
import { ewallet_id } from "../rapyd/types";
import { IPayment } from '../rapyd/ipayment';
/**
 *
            meta_id SERIAL PRIMARY KEY,
            contact_reference_id UNIQUE,
            transactions TEXT NOT NULL,
            senders TEXT,
            benes TEXT,
            actions TEXT,
            vcc TEXT,
            pcc TEXT,
            meta TEXT

 */

export interface IDBMetaContact {
  /** Internal id for calling actions */
  id?: string;
  contact_reference_id?: contact_id;
  transactions?: ITransaction[];
  senders?: ISender[];
  benes?: any[];
  actions?: any[];
  vcc?: any[];
  pcc?: any[];
  meta?: object;
}

export interface ITransaction {
  id: string
  source_amount?: string
  destination_amount?: string
  sources: PostCreatePayment.ICreate[]
  destinations: any[]
  executed: boolean
}
