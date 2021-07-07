import { ITransaction } from './idbmetacontact';

export interface IAction{
    id:number,

    active:boolean,
    type:"transaction"|"disburse";
    transaction:ITransaction,

    every:"hour"|"day"|"week"|"month"|"year",
    date:number,
    
    contact_reference_id:number,
    meta:any
}