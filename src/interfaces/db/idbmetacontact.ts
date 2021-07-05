import { IUtilitiesResponse } from './../rapyd/rest-response';
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
  payments: ITransactionFull_payment[];
  payouts: ITransactionFull_payout[];

  // payments_response: IUtilitiesResponse<PostCreatePayment.Response>[];
  // payouts_response: IUtilitiesResponse<ICreatePayout.Response>[];

  transfer_resoponse:TransferToWallet.Response;
  
  execute: boolean;
  executed: boolean;
  payments_executed?: boolean;
  payouts_executed?: boolean;
  type: "w2w"| `${categories}2${categories}`
}

export interface IExcuteTransaction{
  contact_reference_id:number,
  tran_id:string
}

export interface ITransactionFull_payment {
  request:PostCreatePayment.Request;
  response:IUtilitiesResponse<PostCreatePayment.Response>;
  status:"CLO" | "ACT"
}

export interface ITransactionFull_payout {
  request:ICreatePayout.Request
  response:IUtilitiesResponse<ICreatePayout.Response>
  status:"CLO" | "ACT"
}

