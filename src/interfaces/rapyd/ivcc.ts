import { IContact } from './icontact';
import { IAddress } from "./iaddress";

export interface IssueVccRequest {
    ewallet_contact: string
    country: string
}

export interface IssueVccRequestForm {
    address: IAddress,
    date_of_birth: string,
    country: string
}
export interface IssueVccResponse {
    id: string
    ewallet_contact: IContact
    status: string
    card_id: string
    assigned_at: number
    activated_at: number
    metadata: any
    country_iso_alpha_2: string
    created_at: number
    blocked_reason: string
    card_tracking_id: any
    card_program: any
    card_number: string
    cvv: string
    expiration_month: string
    expiration_year: string
    bin: string
    sub_bin: string
}