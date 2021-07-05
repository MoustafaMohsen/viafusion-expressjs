import { PaymentService } from './payment';
import { UserService } from './user';
import { ITransaction } from './../../interfaces/db/idbmetacontact';
import { ApiService } from '../api/api';
import { ListPayments, RequiredFields, PostCreatePayment, IPayment } from '../../interfaces/rapyd/ipayment';
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';

export class TransactionService {
    constructor() {}

    async execute_create_payment(transaction:ITransaction){
        const payments = transaction.payments;
        for (let i = 0; i < payments.length; i++) {
            const payment = payments[i];
            this.create_payment(payment).then(
                res=>{
                    transaction.payments_response = transaction.payments_response || [] ;
                    transaction.payments_response.push(res)
                }
            )
        }
    }

    create_payment(payment:PostCreatePayment.Request):Promise<PostCreatePayment.Response>{
        let paymentSrv = new PaymentService();

        return new Promise((resolve,reject)=>{
            paymentSrv.create_payment(payment).then(
                res=>{
                    let response = res.body.data;
                    resolve(response);
                }
            ).catch((error)=>{
                console.error(error.body.status.message + "" + error.body.status.error_code);
                reject(error);
            })
        })
    }
}
