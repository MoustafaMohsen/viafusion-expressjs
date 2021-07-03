import { ApiService } from '../api/api';
import { IPayment } from "../../interfaces/rapyd/ipayment";
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';

export class PaymentService {
    constructor() {}

    create_payment_and_contact(payment:IPayment){
        var apiSrv = new ApiService();
        return apiSrv.post<IPayment>("payments", payment)
    }

    async create_db_payment(payment:IPayment){
        const db = new ViafusionDB();
        let results = await db.insert_object(payment, 'dbpayment');
        return results;
    }

    async get_payment_method_required_fields(type:string){
        var apiSrv = new ApiService();
        return apiSrv.post<IPayment>("payment_methods/required_fields", type)
    }

}