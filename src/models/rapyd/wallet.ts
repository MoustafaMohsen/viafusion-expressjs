import { IAccType } from './general';
import { IContact } from "./contact";

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
}

