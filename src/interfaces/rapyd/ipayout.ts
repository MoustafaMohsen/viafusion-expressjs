import { RequiredFields } from "./ipayment";

export namespace IListPayout {
    export interface Response {
        payout_method_type: string
        name: string
        is_cancelable: number
        is_expirable: number
        is_location_specific: number
        is_online: number
        status: number
        image: string
        category: string
        beneficiary_country: string
        payout_currencies: string[]
        sender_entity_types: string[]
        beneficiary_entity_types: string[]
        amount_range_per_currency: AmountRangePerCurrency[]
        minimum_expiration_seconds: any
        maximum_expiration_seconds: any
        sender_currencies: string[]
    }

    export interface AmountRangePerCurrency {
        maximum_amount?: number
        minimum_amount?: number
        // filter anything that isn't USD
        payout_currency: string
    }
}

export namespace IGetPayoutRequiredFields {
    export interface Response {
        payout_method_type: string
        sender_currency: string
        sender_country: string
        sender_entity_type: string
        beneficiary_country: string
        payout_currency: string
        beneficiary_entity_type: string
        is_cancelable: number
        is_location_specific: number
        is_expirable: number
        minimum_expiration_seconds: any
        maximum_expiration_seconds: any
        is_online: number
        image: string
        status: number
        beneficiary_required_fields: RequiredFields.Field[]
        sender_required_fields: RequiredFields.Field[]
        payout_options: any[]
        minimum_amount: number
        maximum_amount: number
        batch_file_header: string
    }

    export interface QueryRequest{
        sender_country:string
        beneficiary_country:string
        payout_currency:string
        payout_amount:number
        payout_method_type:string
    }
}