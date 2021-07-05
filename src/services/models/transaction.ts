import { PayoutService } from './payout';
import { PaymentService } from './payment';
import { UserService } from './user';
import { ITransaction } from './../../interfaces/db/idbmetacontact';
import { ApiService } from '../api/api';
import { ListPayments, RequiredFields, PostCreatePayment, IPayment } from '../../interfaces/rapyd/ipayment';
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';
import { ICreatePayout } from '../../interfaces/rapyd/ipayout';
import { IUtilitiesResponse } from '../../interfaces/rapyd/rest-response';

export class TransactionService {
    constructor() { }

    execute_transaction(_transaction: ITransaction){
         
    }

    execute_create_payment(_transaction: ITransaction):Promise<ITransaction> {
        var transaction = {..._transaction};
        const payments = transaction.payments;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < payments.length; i++) {
                const payment = payments[i];
                this.create_payment(payment).then(
                    res => {
                        transaction.payments_response.push(res)
                        if (transaction.payments_response.length == payments.length) {
                            resolve(transaction)
                        }
                    }
                ).catch((error) => {
                    console.error(error);
                    transaction.payments_response.push(error)
                    if (transaction.payments_response.length == payments.length) {
                        resolve(transaction)
                    }
                })
            }
        })

    }

    execute_create_payout(_transaction: ITransaction):Promise<ITransaction> {
        var transaction = {..._transaction};
        transaction.payouts_response = transaction.payouts_response || [];
        const payouts = transaction.payouts;

        return new Promise((resolve, reject) => {
            for (let i = 0; i < payouts.length; i++) {
                const payout = payouts[i];
                this.create_payout(payout).then(
                    res => {
                        transaction.payouts_response.push(res)
                        if (transaction.payouts_response.length == payouts.length) {
                            resolve(transaction)
                        }
                    }
                ).catch((error) => {
                    console.error(error);
                    transaction.payouts_response.push(error)
                    if (transaction.payouts_response.length == payouts.length) {
                        resolve(transaction)
                    }
                })
            }
        })
    }

    create_payment(payment: PostCreatePayment.Request): Promise<IUtilitiesResponse<PostCreatePayment.Response>> {
        let paymentSrv = new PaymentService();
        return new Promise((resolve, reject) => {
            paymentSrv.create_payment(payment).then(
                res => {
                    resolve(res);
                }
            ).catch((error) => {
                console.error(error);
                reject(error);
            })
        })
    }

    create_payout(payout: ICreatePayout.Request): Promise<IUtilitiesResponse<ICreatePayout.Response>> {
        let payoutSrv = new PayoutService();
        return new Promise((resolve, reject) => {
            payoutSrv.create_payout(payout).then(
                res => {
                    resolve(res);
                }
            ).catch((error) => {
                console.error(error);
                reject(error);
            })
        })
    }
}
