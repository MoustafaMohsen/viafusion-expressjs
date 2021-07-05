import { ISender } from '../rapyd/isender';
import { PostCreatePayment } from '../rapyd/ipayment';
import { categories, contact_id, customer_id } from '../rapyd/types';
import { ewallet_id } from "../rapyd/types";
import { IPayment } from '../rapyd/ipayment';
import { TransferToWallet } from '../rapyd/iwallet';
import { ICreatePayout } from '../rapyd/ipayout';
import { IssueVccResponse } from '../rapyd/ivcc';
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
  contact_reference_id: number;
  transactions: ITransaction[];
  senders: ICreatePayout.Sender[];
  benes: ICreatePayout.Beneficiary[];
  vcc: IssueVccResponse[];
  
  actions: any[];
  pcc: any[];
  meta: object;
}

export interface ITransaction {
  id: string;
  source_amount?: string;
  destination_amount?: string;
  payments: PostCreatePayment.Request[];
  payouts: ICreatePayout.Request[];

  payments_response: PostCreatePayment.Response[];
  payouts_response: ICreatePayout.Response[];

  transfer_resoponse:TransferToWallet.Response;
  
  execute: boolean;
  executed: boolean;
  type: "w2w"| `${categories}2${categories}`
}
