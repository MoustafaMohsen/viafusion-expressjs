import { UserService } from './../services/models/user';
import { ActionService } from './../services/models/action';
import { TransactionService } from './../services/models/transaction';
import { PayoutService } from './../services/models/payout';
import { DBMetaContact } from './../services/models/metacontact-class';
import { VccService } from './../services/models/vcc';
import { IAPIServerResponse } from './../interfaces/rapyd/types.d';
import { PaymentService } from './../services/models/payment';
import { ICreateWallet, IDBWallet, IWallet2Wallet } from './../interfaces/db/idbwallet';
import { IDBContact } from './../interfaces/db/idbcontact';
import { ViafusionDB } from './../services/db/viafusiondb';
import { ICreateChckoutPage, ICurrency, IdentityVerification, IWallet } from '../interfaces/rapyd/iwallet';
import { WalletService } from '../services/models/wallet';
import { ApiService } from '../services/api/api';
import performance from "perf_hooks";
import express from "express";
import ViafusionServerCore from './core/server-core';
import { RapydUtilties } from '../services/util/utilities';
import { IContact } from '../interfaces/rapyd/icontact';
import { IDBSelect } from '../interfaces/db/select_rows';
import { PostCreatePayment } from '../interfaces/rapyd/ipayment';
import { IContactAndSender } from '../interfaces/rapyd/isender';
import { ILoginTransportObj } from '../interfaces/db/ilogin';
import { ICreateVccToUser, ISetCardStatus, ISimulateCardAuthorization, IssueVccRequestForm } from '../interfaces/rapyd/ivcc';
import { MetaContactService } from '../services/models/metacontact';
import { IDBMetaContact, IExcuteTransaction } from '../interfaces/db/idbmetacontact';
import { ICreatePayout, IGetPayoutRequiredFields } from '../interfaces/rapyd/ipayout';

export default class ViafusionServerRoutes extends ViafusionServerCore {

    setupRoute() {

        function send(res: express.Response, response, t0) {
            let pre = performance.performance.now() - t0;
            console.log(`-->Request for:'${res.req.path}', from client:'${res.req.ip}' took:${pre}ms`);
            if (!res.headersSent) {
                res.send(JSON.stringify({ performance: pre, success: true, data: { ...response } }))
            } else {
                res.write(JSON.stringify({ performance: pre, success: true, data: { ...response } }));
                res.end();
            }
        }

        function err(res: express.Response, message, t0, statuscode = 400) {
            // res.status(statuscode);
            let pre = performance.performance.now() - t0;
            console.log(`-->Request errored for:'${res.req.path}', from client:'${res.req.ip}' took:${pre}ms`);
            console.error(message);
            res.send(JSON.stringify({ data: {}, response_status: 400, message, performance: pre, success: false }))
        }

        function write_and_log(res: express.Response, msg) {
            console.log(msg);
            res.write(msg)
        }


        // ==== Status Test
        this.app.get('/', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            try {
                send(res, data, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })
        this.app.get('/test-db', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            const db = new ViafusionDB();
            try {
                data.result = (await db.connect());
                send(res, data, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

        // ==== Status Test
        this.app.post('/', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            try {
                send(res, data, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })


        this.app.post('/prepare-db/'+process.env.VIAFUSION_KEY, async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            const db = new ViafusionDB();
            try {
                data.result = { ...(await db.PrepareDB(req.body.database)) };
                send(res, data, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/create-db-user', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: IDBContact = req.body;
                userSrv.create_db_user(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })


        this.app.post('/get-db-user', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: IDBContact = req.body;
                userSrv.get_db_user(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/delete-db-user', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: IDBContact = req.body;
                userSrv.delete_db_user(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/get-like-db-user', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body = req.body;
                userSrv.list_users_by_phone(body.phone_number, body.limit || 10).then((d) => {
                    send(res, { users: d }, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        this.app.post('/w2w', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const walletSrv = new WalletService();
                let body: IWallet2Wallet = req.body;
                walletSrv.transfer_money_to_phone_number(body.contact_reference_id, body.amount, body.phone_number, body.message).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })


        this.app.post('/update-db-user', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: IDBContact = req.body;
                userSrv.update_db_user({ contact_reference_id: body.contact_reference_id }, body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })


        this.app.post('/get-db-metacontact', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const metacontactSrv = new MetaContactService();
                let body: IDBMetaContact = req.body;
                metacontactSrv.get_db_metacontact(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })


        this.app.post('/update-db-metacontact', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const metacontactSrv = new MetaContactService();
                let body: IDBMetaContact = req.body;
                metacontactSrv.update_db_metacontact({ contact_reference_id: body.contact_reference_id } as any, body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/create-db-metacontact', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const metacontactSrv = new MetaContactService();
                let body: IDBMetaContact = req.body;
                metacontactSrv.create_db_metacontact({ contact_reference_id: body.contact_reference_id } as any).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })


        this.app.post('/create-wallet', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const walletSrv = new WalletService();
                let body: {
                    form: ICreateWallet.Form, contact_reference_id: number
                } = req.body;
                walletSrv.create_wallet_step(body.form, body.contact_reference_id).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (message) {
                err(res, message, t0)
            }
        })
        this.app.post('/create-vcc', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const vccSrv = new VccService();
                let body: {
                    form: IssueVccRequestForm, contact_reference_id: number
                } = req.body;
                vccSrv.create_vcc_step(body.form, body.contact_reference_id).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (message) {
                err(res, message, t0)
            }
        })
        this.app.post('/list-vccs', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const vccSrv = new VccService();
                let body: { contact_reference_id: number } = req.body;
                vccSrv.get_contact_cards(body.contact_reference_id).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (message) {
                err(res, message, t0)
            }
        })
        this.app.post('/list-vcc-transactions', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const vccSrv = new VccService();
                let body: { card_id: number } = req.body;
                vccSrv.list_card_transactions(body.card_id).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (message) {
                err(res, message, t0)
            }
        })

        this.app.post('/set-card-status', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const vccSrv = new VccService();
                let body: ISetCardStatus = req.body;
                vccSrv.set_card_status(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (message) {
                err(res, message, t0)
            }
        })

        this.app.post('/create-vcc-to-user', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const vccSrv = new VccService();
                let body: ICreateVccToUser = req.body;
                vccSrv.create_vcc_to_user(body.contact_reference_id, body.metadata).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (message) {
                err(res, message, t0)
            }
        })

        this.app.post('/update-accounts', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const walletSrv = new WalletService();
                let body: { contact_reference_id: number } = req.body;
                walletSrv.update_wallet_accounts(body.contact_reference_id).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (message) {
                err(res, message, t0)
            }
        })


        this.app.post('/login', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: ILoginTransportObj = req.body;
                userSrv.login_or_register_to_otp(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/get-rates', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const walletSrv = new WalletService();
                let body: ICurrency.QueryRequest = req.body;
                walletSrv.get_rates(body).then((d) => {
                    let rates = d.body.data
                    send(res, rates, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })


        //#region Payments
        this.app.post('/execute-payments', async (req, res) => {
            let t0 = performance.performance.now();
            try {

                const metacontactSrv = new MetaContactService();
                let body: IExcuteTransaction = req.body;
                var contact_reference_id = body.contact_reference_id
                var tran_id = body.tran_id
                let tranSrv = new TransactionService()
                if (!tran_id) {
                    throw "Transaction not found"
                }
                tranSrv.do_payments(contact_reference_id, tran_id).then(re => {
                    send(res, re, t0)
                }).catch(e => {
                    err(res, e, t0)
                })

                return;
            } catch (message) {
                err(res, message, t0)
            }
        })
        this.app.post('/update-payments', async (req, res) => {
            let t0 = performance.performance.now();
            try {

                const metacontactSrv = new MetaContactService();
                let body: IExcuteTransaction = req.body;
                var contact_reference_id = body.contact_reference_id
                var tran_id = body.tran_id
                let tranSrv = new TransactionService()
                if (!tran_id) {
                    throw "Transaction not found"
                }
                tranSrv.update_payments_responses(contact_reference_id, tran_id).then(re => {
                    send(res, re, t0)
                }).catch(e => {
                    err(res, e, t0)
                })

                return;
            } catch (message) {
                err(res, message, t0)
            }
        })
        this.app.post('/update-payouts', async (req, res) => {
            let t0 = performance.performance.now();
            try {

                const metacontactSrv = new MetaContactService();
                let body: IExcuteTransaction = req.body;
                var contact_reference_id = body.contact_reference_id
                var tran_id = body.tran_id
                let tranSrv = new TransactionService()
                if (!tran_id) {
                    throw "Transaction not found"
                }
                tranSrv.update_payments_responses(contact_reference_id, tran_id).then(re => {
                    send(res, re, t0)
                }).catch(e => {
                    err(res, e, t0)
                })

                return;
            } catch (message) {
                err(res, message, t0)
            }
        })
        this.app.post('/update-payments-payouts', async (req, res) => {
            let t0 = performance.performance.now();
            try {

                const metacontactSrv = new MetaContactService();
                let body: IExcuteTransaction = req.body;
                var contact_reference_id = body.contact_reference_id
                var tran_id = body.tran_id
                let tranSrv = new TransactionService()
                if (!tran_id) {
                    throw "Transaction not found"
                }
                await tranSrv.update_payments_responses(contact_reference_id, tran_id).catch(e => {
                    err(res, e, t0)
                })
                tranSrv.update_payouts_responses(contact_reference_id, tran_id).then(re => {
                    send(res, re, t0)
                }).catch(e => {
                    err(res, e, t0)
                })

                return;
            } catch (message) {
                err(res, message, t0)
            }
        })

        this.app.post('/complete-payment', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                var payment_id = req.body.payment_id
                let paymentSrv = new PaymentService()
                paymentSrv.complete_payment(payment_id).then(re => {
                    send(res, re, t0)
                }).catch(e => {
                    err(res, e, t0)
                })

                return;
            } catch (message) {
                err(res, message, t0)
            }
        })

        this.app.post('/simulate-payout', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                var payment = req.body.payment
                let payoutSrv = new PayoutService()
                payoutSrv.simulate_payout(req.body).then(re => {
                    send(res, re, t0)
                }).catch(e => {
                    err(res, e, t0)
                })

                return;
            } catch (message) {
                err(res, message, t0)
            }
        })

        this.app.post('/get-payment', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                var payment_id = req.body.payment_id
                let paymentSrv = new PaymentService()
                paymentSrv.get_payment(payment_id).then(re => {
                    send(res, re, t0)
                }).catch(e => {
                    err(res, e, t0)
                })

                return;
            } catch (message) {
                err(res, message, t0)
            }
        })
        //#endregion


        //#region Transaction
        this.app.post('/execute-payouts', async (req, res) => {
            let t0 = performance.performance.now();
            try {

                const metacontactSrv = new MetaContactService();
                let body: IExcuteTransaction = req.body;
                var contact_reference_id = body.contact_reference_id
                var tran_id = body.tran_id
                let tranSrv = new TransactionService()
                tranSrv.do_payouts(contact_reference_id, tran_id).then(re => {
                    send(res, re, t0)
                }).catch(e => {
                    err(res, e, t0)
                })

                return;
            } catch (message) {
                err(res, message, t0)
            }
        })
        this.app.post('/complete-payout', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                var payout_id = req.body.payout_id
                let payoutSrv = new PayoutService()
                payoutSrv.complete_payout(payout_id).then(re => {
                    send(res, re, t0)
                }).catch(e => {
                    err(res, e, t0)
                })

                return;
            } catch (message) {
                err(res, message, t0)
            }
        })
        this.app.post('/get-payout', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                var payout_id = req.body.payout_id
                let payoutSrv = new PayoutService()
                payoutSrv.get_payout(payout_id).then(re => {
                    send(res, re, t0)
                }).catch(e => {
                    err(res, e, t0)
                })

                return;
            } catch (message) {
                err(res, message, t0)
            }
        })
        //#endregion



        //#region OTP
        this.app.post('/confirm-otp', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: {
                    otp: number,
                    user: IDBContact
                } = req.body;
                userSrv.confirm_user_otp(body.user, body.otp).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/set-otp', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: {
                    otp: string,
                    user: IDBContact
                } = req.body;
                userSrv.set_user_otp(body.user, body.otp).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        //#endregion

        //#region PIN
        this.app.post('/confirm-pin', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: {
                    pin: number,
                    user: IDBContact
                } = req.body;
                userSrv.confirm_user_pin(body.user, body.pin).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/set-pin', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: {
                    pin: string,
                    user: IDBContact
                } = req.body;
                userSrv.set_user_pin(body.user, body.pin).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        //#endregion

        //#region FP
        this.app.post('/confirm-fp', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: {
                    fp: number,
                    user: IDBContact
                } = req.body;
                userSrv.confirm_user_fp(body.user, body.fp).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/set-device', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: {
                    device: string,
                    user: IDBContact
                } = req.body;
                userSrv.set_user_device(body.user, body.device).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        //#endregion

        //#region Device
        this.app.post('/confirm-device', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: {
                    device: number,
                    user: IDBContact
                } = req.body;
                userSrv.confirm_user_device(body.user, body.device).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/set-device', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: {
                    device: string,
                    user: IDBContact
                } = req.body;
                userSrv.set_user_device(body.user, body.device).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        //#endregion


        //#region Is Authenticated
        this.app.post('/confirm_authnticate', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: IDBContact = req.body;
                userSrv.confirm_authenticate(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        //#endregion



        //#region Collect Payment Group

        this.app.post('/list-payment-methods', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            try {
                const paymentSrv = new PaymentService();
                let body: { country: string } = req.body;
                paymentSrv.list_payment_methods(body.country).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/list-payment-required-fields', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;

            try {
                const paymentSrv = new PaymentService();
                let body: { payment_method_type: string } = req.body;
                paymentSrv.payment_method_required_fields(body.payment_method_type).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })


        this.app.post('/create-payment', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;

            try {
                const paymentSrv = new PaymentService();
                let body: PostCreatePayment.Request = req.body;
                paymentSrv.create_payment(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        //#endregion


        //#region Send Payout Group

        this.app.post('/list-payout-methods', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            try {
                const payoutSrv = new PayoutService();
                let body: { country: string } = req.body;
                payoutSrv.list_payout_methods(body.country).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/list-payout-required-fields', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;

            try {
                const payoutSrv = new PayoutService();
                let body: IGetPayoutRequiredFields.QueryRequest = req.body;
                payoutSrv.payout_method_required_fields(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })


        this.app.post('/create-payout', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;

            try {
                const payoutSrv = new PayoutService();
                let body: ICreatePayout.Request = req.body;
                payoutSrv.create_payout(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        //#endregion


        this.app.post('/create-wallet-directly', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;

            try {
                const walletSrv = new WalletService();
                let body: ICreateWallet.Root = req.body;
                walletSrv.create_wallet_and_contact(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        // === List Countries
        this.app.post('/list-countries', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            let api = new ApiService();
            try {
                let body = req.body;
                var rapydUti = new RapydUtilties();
                const data = await rapydUti.makeRequest('GET', '/v1/data/countries');
                send(res, data.body.data, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })


        this.app.post('/wallet-transactions', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            try {
                let walletSrv = new WalletService();
                let userSrv = new UserService();
                let body = req.body;
                let user = await userSrv.get_db_user({ contact_reference_id: body.contact_reference_id });
                walletSrv.get_wallet_transactions(user.ewallet).then(r => {
                    send(res, { data: Object.values(r.body.data) }, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        // === Actions
        this.app.post('/simulate-card-authorization', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            let act = new VccService();
            try {
                let body: ISimulateCardAuthorization = req.body;
                act.simulate_card_authorization(body).then(r => {
                    send(res, r, t0)
                }).catch(error => {
                    err(res, error, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        this.app.post('/generate-checkout', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            let paymentSrv = new PaymentService();
            try {
                let body: ICreateChckoutPage.Request = req.body;
                paymentSrv.generate_chckout_page(body).then(r => {
                    send(res, r.body.data, t0)
                }).catch(error => {
                    err(res, error, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        this.app.post('/generate-idv', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            let walletSrv = new WalletService();
            try {
                let body: IdentityVerification.Request = req.body;
                walletSrv.generate_idv_page(body).then(r => {
                    send(res, r.body.data, t0)
                }).catch(error => {
                    err(res, error, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        this.app.post('/get-actions', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            let act = new ActionService();
            try {
                let body = req.body;
                act.get_db_actions(body).then(r => {
                    send(res, r, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        this.app.post('/update-action', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            let act = new ActionService();
            try {
                let body = req.body;
                act.update_db_action(body.action, body.newaction).then(r => {
                    send(res, r, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        this.app.post('/delete-actions', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            let act = new ActionService();
            try {
                let body = req.body;
                act.delete_db_action(body).then(r => {
                    send(res, r, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })
        this.app.post('/create-actions', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            let act = new ActionService();
            try {
                let body = req.body;
                act.get_db_actions(body).then(r => {
                    send(res, r, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

    }

}