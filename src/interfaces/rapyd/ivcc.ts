import { IContact } from './icontact';
import { IAddress } from "./iaddress";

export interface IssueVccRequest {
    ewallet_contact: string
    country: string
    metadata:any
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

export namespace ListIssuedVcc{
    export interface Response {
        id: string
        ewallet_contact: EwalletContact
        status: string
        card_id: string
        assigned_at: number
        activated_at: number
        metadata: any
        country_iso_alpha_2: string
        created_at: number
        blocked_reason: string
        card_program: any
        card_number: string
        cvv: string
        expiration_month: string
        expiration_year: string
        bin: string
        sub_bin: string
      }
      
      export interface EwalletContact {
        id: string
        first_name: string
        last_name: string
        middle_name: string
        second_last_name: string
        gender: string
        marital_status: string
        house_type: string
        contact_type: string
        phone_number: string
        email: string
        identification_type: string
        identification_number: string
        issued_card_data: IssuedCardData
        date_of_birth: string
        country: string
        nationality: any
        address: Address
        ewallet: string
        created_at: number
        metadata: any
        business_details: any
        compliance_profile: number
        verification_status: string
        send_notifications: boolean
        mothers_name: string
      }
      
      export interface IssuedCardData {
        preferred_name: string
        transaction_permissions: string
        role_in_company: string
      }
      
      export interface Address {
        id: string
        name: string
        line_1: string
        line_2: string
        line_3: string
        city: string
        state: string
        country: string
        zip: string
        phone_number: string
        metadata: any
        canton: string
        district: string
        created_at: number
      }
}