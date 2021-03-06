import { PayoutService } from './payout';
import { PaymentService } from './payment';
import { UserService } from './user';
import { IDBMetaContact, ITransaction, ITransactionFull_payment, ITransactionFull_payout } from './../../interfaces/db/idbmetacontact';
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
    do_payments(contact_reference_id, tran_id) {
        const metacontactSrv = new MetaContactService();
        return new Promise((resolve, reject) => {
            metacontactSrv.get_db_metacontact({ contact_reference_id } as any).then((d) => {
                var metacontact = d
                let transaction = metacontact.transactions.find(t => t.id == tran_id)
                if (transaction) {
                    let transactionSrv = new TransactionService();
                    // execute the payments request
                    transactionSrv._execute_create_payments(transaction).then((transaction_response) => {
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
                                    transaction_response.execution_date = transaction_response.execution_date?transaction_response.execution_date:new Date().getTime()/1000;
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
    do_payouts(contact_reference_id, tran_id) {
        const metacontactSrv = new MetaContactService();
        return new Promise((resolve, reject) => {
            metacontactSrv.get_db_metacontact({ contact_reference_id } as any).then((d) => {
                var metacontact = d
                let transaction = metacontact.transactions.find(t => t.id == tran_id)
                if (transaction) {
                    let transactionSrv = new TransactionService();
                    // execute the payouts request
                    transactionSrv._execute_create_payouts(transaction).then((transaction_response) => {
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

    update_payments_responses(contact_reference_id, tran_id):Promise<IDBMetaContact> {
        const metacontactSrv = new MetaContactService();
        return new Promise((resolve, reject) => {
            metacontactSrv.get_db_metacontact({ contact_reference_id } as any).then(async (d) => {
                var metacontact = d
                let transaction = metacontact.transactions.find(t => t.id == tran_id)
                if (transaction) {

                    // Update all payments
                    await this._execute_update_payments(transaction).then((transaction_response) => {
                        var contact_id = metacontact.contact_reference_id;
                        // get metacontact again
                        metacontactSrv.get_db_metacontact({ contact_reference_id: contact_id } as any).then((d) => {
                            var metacontact = d;
                            var contact_id = metacontact.contact_reference_id;
                            // update transaction information
                            for (let i = 0; i < metacontact.transactions.length; i++) {
                                const t = metacontact.transactions[i];
                                if (t.id == tran_id) {
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
                    resolve(metacontact)
                }
            }).catch(e => {
                reject(e)
            })
        })
    }

    update_payouts_responses(contact_reference_id, tran_id):Promise<IDBMetaContact> {
        const metacontactSrv = new MetaContactService();
        return new Promise((resolve, reject) => {
            metacontactSrv.get_db_metacontact({ contact_reference_id } as any).then(async (d) => {
                var metacontact = d
                let transaction = metacontact.transactions.find(t => t.id == tran_id)
                if (transaction) {

                    // Update all payouts
                    await this._execute_update_payouts(transaction).then((transaction_response) => {
                        var contact_id = metacontact.contact_reference_id;
                        // get metacontact again
                        metacontactSrv.get_db_metacontact({ contact_reference_id: contact_id } as any).then((d) => {
                            var metacontact = d;
                            var contact_id = metacontact.contact_reference_id;
                            // update transaction information
                            for (let i = 0; i < metacontact.transactions.length; i++) {
                                const t = metacontact.transactions[i];
                                if (t.id == tran_id) {
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

    //#region Execute Bluk
    // ======= CREATE
    _execute_create_payments(_transaction: ITransaction): Promise<ITransaction> {
        var transaction = { ..._transaction };
        const payments = transaction.payments;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < payments.length; i++) {
                const payment = payments[i].request;
                if(payment.metadata.executed == false)
                this.create_payment(payment).then(
                    res => {
                        payments[i].response = res
                        if (this.are_payments_done(transaction.payments)) {
                            transaction.payments_executed = true
                            resolve(transaction)
                        }
                    }
                ).catch((error) => {
                    console.error(error);
                    payments[i].response = error
                    if (this.are_payments_done(transaction.payments)) {
                        transaction.payouts_executed = true
                        resolve(transaction)
                    }
                })
                payment.metadata.executed=true
            }
        })
    }
    _execute_create_payouts(_transaction: ITransaction): Promise<ITransaction> {
        var transaction = { ..._transaction };
        const payouts = transaction.payouts;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < payouts.length; i++) {
                const payout = payouts[i].request;
                if(payout.metadata.executed == false)
                this.create_payout(payout).then(
                    res => {
                        payouts[i].response = res
                        if (this.are_payouts_done(transaction.payouts)) {
                            transaction.payouts_executed = true
                            resolve(transaction)
                        }
                    }
                ).catch((error) => {
                    console.error(error);
                    payouts[i].response = error
                    if (this.are_payouts_done(transaction.payouts)) {
                        transaction.payouts_executed = true
                        resolve(transaction)
                    }
                })
                payout.metadata.executed=true
            }
        })
    }

    // ======= GET
    _execute_update_payments(_transaction: ITransaction): Promise<ITransaction> {
        var transaction = { ..._transaction };
        const payments = transaction.payments;
        return new Promise(async (resolve, reject) => {
            let paymentSrv = new PaymentService();
            if (transaction.execute_payments == false) {
                resolve(transaction)
                return;
            }

            for (let i = 0; i < payments.length; i++) {
                const payment = payments[i].response;
                if (payment && payment.body && payment.body.status.status == "SUCCESS") {
                    await paymentSrv.get_payment(payment.body.data.id).then(
                        res => {
                            payments[i].response = res
                        }
                    ).catch((error) => {
                        console.error(error);
                        payments[i].response = error
                    })
                }
            }
            if (this.are_payments_done(transaction.payments)) {
                transaction.payments_executed = true
            }
            resolve(transaction)
        })
    }

    _execute_update_payouts(_transaction: ITransaction): Promise<ITransaction> {
        var transaction = { ..._transaction };
        const payouts = transaction.payouts;
        return new Promise(async (resolve, reject) => {
            let payoutSrv = new PayoutService();
            if (transaction.execute_payouts == false) {
                resolve(transaction)
                return;
            }
            for (let i = 0; i < payouts.length; i++) {
                const payout = payouts[i].response;
                if (payout && payout.body && payout.body.status.status == "SUCCESS") {
                    await payoutSrv.get_payout(payout.body.data.id).then(
                        res => {
                            payouts[i].response = res
                        }
                    ).catch((error) => {
                        console.error(error);
                        payouts[i].response = error
                    })
                }
            }
            if (this.are_payouts_done(transaction.payouts)) {
                transaction.payouts_executed = true
            }
            resolve(transaction)
        })
    }
    //#endregion

    //#region Checks
    are_payments_done(payments: ITransactionFull_payment[]) {
        let requests = payments.filter(p => (p.request && p.request != {} as any))
        let responses = payments.filter(p => (p.response && p.response != {} as any))
        return responses.length == requests.length
    }
    are_payouts_done(payoutss: ITransactionFull_payout[]) {
        let requests = payoutss.filter(p => (p.request && p.request != {} as any))
        let responses = payoutss.filter(p => (p.response && p.response != {} as any))
        return responses.length == requests.length
    }
    //#endregion


    //#region Singles for do Payment and Payout
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
    //#endregion
}
