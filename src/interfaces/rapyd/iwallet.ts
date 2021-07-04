import { IAccType } from './general';
import { IContact } from "./icontact";

export interface IWallet {
    first_name?: string
    last_name?: string
    phone_number?: string
    email?: string

    /**
    * Set by the user.
   */
    ewallet_reference_id: string
    metadata: any
    type?: IAccType
    contact?: IContact
    contacts?: {
        data:IContact[];
        has_more: boolean,
        total_count: number,
        /**
         *  Example "/v1/ewallets/ewallet_c633f0da4a5997a71918940c95a3aae0/contacts"
         */
        url: string;

    }
}


export interface WalletBallanceResponse {
    id: string
    currency: string
    alias: string
    balance: number
    received_balance: number
    on_hold_balance: number
    reserve_balance: number
    limits: any
    limit: any
}
