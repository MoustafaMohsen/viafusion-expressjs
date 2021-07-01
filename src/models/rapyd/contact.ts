import { IAddress } from "./address";

export interface IContact {
    phone_number?: string
    first_name?: string
    last_name?: string
    email?: string
    mothers_name?: string
    contact_type?: string
    address?: IAddress
    identification_type?: string
    identification_number?: string
    /**
     * 11/22/2000
     * @type {string}
     * @memberof IContact
     */
    date_of_birth?: string
    country?: string
    nationality?: string
    metadata?: any
}