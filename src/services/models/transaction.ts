import { PayoutService } from './payout';
import { PaymentService } from './payment';
import { UserService } from './user';
import { IExcuteTransaction, ITransaction } from './../../interfaces/db/idbmetacontact';
import { ApiService } from '../api/api';
import { ListPayments, RequiredFields, PostCreatePayment, IPayment } from '../../interfaces/rapyd/ipayment';
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';
import { ICreatePayout } from '../../interfaces/rapyd/ipayout';
import { IUtilitiesResponse } from '../../interfaces/rapyd/rest-response';
import { MetaContactService } from './metacontact';

export class TransactionService {
    constructor() { }

    execute_transaction(_transaction: ITransaction) {

    }

    //#region Do Payment And Payouts
    do_payments(contact_reference_id,tran_id) {
        const metacontactSrv = new MetaContactService();
        return new Promise((resolve, reject) => {
            metacontactSrv.get_db_metacontact({ contact_reference_id } as any).then((d) => {
                var metacontact = d
                let transaction = metacontact.transactions.find(t => t.id = tran_id)
                if (transaction) {
                    let transactionSrv = new TransactionService();
                    // execute the payments request
                    transactionSrv.execute_create_payment(transaction).then((transaction_response) => {
                        var contact_id = metacontact.contact_reference_id;
                        // get metacontact again
                        metacontactSrv.get_db_metacontact({ contact_reference_id: contact_id } as any).then((d) => {
                            var metacontact = d;
                            var contact_id = metacontact.contact_reference_id;
                            // update transaction information
                            for (let i = 0; i < metacontact.transactions.length; i++) {
                                const t = metacontact.transactions[i];
                                if (t.id == tran_id) {
                                    transaction_response.payments_executed = true;
                                    metacontact.transactions[i] = transaction_response
                                }
                            }
                            metacontactSrv.update_db_metacontact({ contact_reference_id: contact_id } as any, { transactions: metacontact.transactions } as any).then(meta => {
                                resolve(meta)
                            }).catch(e => {
                                reject(e)
                            })
                        }).catch(e => {
                            reject(e)
                        })
                    }).catch(e => {
                        reject(e)
                    })
                } else {
                    throw Error("Transaction not Found")
                }
            }).catch(e => {
                reject(e)
            })
        })
    }
    do_payouts(contact_reference_id,tran_id) {
        const metacontactSrv = new MetaContactService();
        return new Promise((resolve, reject) => {
            metacontactSrv.get_db_metacontact({ contact_reference_id } as any).then((d) => {
                var metacontact = d
                let transaction = metacontact.transactions.find(t => t.id = tran_id)
                if (transaction) {
                    let transactionSrv = new TransactionService();
                    // execute the payouts request
                    transactionSrv.execute_create_payout(transaction).then((transaction_response) => {
                        var contact_id = metacontact.contact_reference_id;
                        // get metacontact again
                        metacontactSrv.get_db_metacontact({ contact_reference_id: contact_id } as any).then((d) => {
                            var metacontact = d;
                            var contact_id = metacontact.contact_reference_id;
                            // update transaction information
                            for (let i = 0; i < metacontact.transactions.length; i++) {
                                const t = metacontact.transactions[i];
                                if (t.id == tran_id) {
                                    transaction_response.payments_executed = true;
                                    metacontact.transactions[i] = transaction_response
                                }
                            }
                            metacontactSrv.update_db_metacontact({ contact_reference_id: contact_id } as any, { transactions: metacontact.transactions } as any).then(meta => {
                                resolve(meta)
                            }).catch(e => {
                                reject(e)
                            })
                        }).catch(e => {
                            reject(e)
                        })
                    }).catch(e => {
                        reject(e)
                    })
                } else {
                    throw Error("Transaction not Found")
                }
            }).catch(e => {
                reject(e)
            })
        })
    }
    //#endregion


    execute_create_payment(_transaction: ITransaction): Promise<ITransaction> {
        var transaction = { ..._transaction };
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

    execute_create_payout(_transaction: ITransaction): Promise<ITransaction> {
        var transaction = { ..._transaction };
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
