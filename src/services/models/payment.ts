import { ApiService } from '../api/api';
import { ListPayments, RequiredFields, PostCreatePayment, IPayment } from '../../interfaces/rapyd/ipayment';
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';

export class PaymentService {
    constructor() {}

    list_payment_methods(country:string){
        var apiSrv = new ApiService();
        return apiSrv.get<ListPayments.Response[]>("payment_methods/country?country="+country)
    }

    payment_method_required_fields(payment_method_type:string){
        var apiSrv = new ApiService();
        return apiSrv.get<RequiredFields.Response>("payment_methods/required_fields/"+payment_method_type)
    }

    create_payment(create_payment_object:PostCreatePayment.Request){
        var apiSrv = new ApiService();
        return apiSrv.post<PostCreatePayment.Response>("payments",create_payment_object)
    }
}