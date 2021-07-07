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
        data: IContact[];
        has_more: boolean,
        total_count: number,
        /**
         *  Example "/v1/ewallets/ewallet_c633f0da4a5997a71918940c95a3aae0/contacts"
         */
        url: string;

    }
}


export interface WalletBalanceResponse {
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


export namespace TransferToWallet {
    export interface Request {
        source_ewallet: string
        phone_number: string
        amount: number
        currency: string
        destination_ewallet: string
        metadata: any
    }
    export interface Response {

        id: string
        /**
         ** accept - The transferee accepts the transfer.
        * cancel - The sender cancels the transaction.
        * decline - The transferee declines to accept the transfer.

        Response - One of the following:
        * CAN - The sender canceled the transaction.
        * DEC - The transferee declined to accept the transfer.
        * PEN - Pending. Waiting for the transferee to respond.
        * CLO - Closed. The transferee accepted the transfer.

        Other transactions:
        * CANCELED
        * CLOSED
         */
        status: "PEN" | "CLO" | "DEC" | "CAN"
        amount: number
        currency_code: string
        destination_phone_number: string
        destination_ewallet_id: string
        destination_transaction_id: string
        source_ewallet_id: string
        source_transaction_id: string
        transfer_response_at: number
        created_at: number

        /** metadata set by who made the request  (source's metadata)*/
        metadata: any
        /** metadata set by the response (destination's metadata)*/
        response_metadata: any

    }

    export interface Set_Response {
        /** The transfer id */
        id: string;
        /** The desired status */
        status: "accept" | "cancel" | "decline";
        metadata?: any
    }
}

export namespace ICurrency {
    export interface QueryRequest {
        sell_currency: string
        buy_currency: string
        action_type: "payment"|"payout"
    }
    export interface Response {
        sell_currency: string
        buy_currency: string
        action_type: "payment"|"payout"
        fixed_side: any
        rate: number
        date: string
        sell_amount: any
        buy_amount: any
    }

}