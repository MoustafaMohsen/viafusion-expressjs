import { PayoutService } from './payout';
import { PaymentService } from './payment';
import { UserService } from './user';
import { ITransaction } from './../../interfaces/db/idbmetacontact';
import { ApiService } from '../api/api';
import { ListPayments, RequiredFields, PostCreatePayment, IPayment } from '../../interfaces/rapyd/ipayment';
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';
import { ICreatePayout } from '../../interfaces/rapyd/ipayout';

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

    async execute_create_payout(transaction:ITransaction){
        const payouts = transaction.payouts;
        for (let i = 0; i < payouts.length; i++) {
            const payout = payouts[i];
            this.create_payout(payout).then(
                res=>{
                    transaction.payouts_response = transaction.payouts_response || [] ;
                    transaction.payouts_response.push(res)
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
                console.error(error);
                reject(error);
            })
        })
    }
    
    create_payout(payment:ICreatePayout.Request):Promise<ICreatePayout.Response>{
        let paymentSrv = new PayoutService();
        return new Promise((resolve,reject)=>{
            paymentSrv.create_payout(payment).then(
                res=>{
                    let response = res.body.data;
                    resolve(response);
                }
            ).catch((error)=>{
                console.error(error);
                reject(error);
            })
        })
    }
}
