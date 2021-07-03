import { PaymentService } from './../services/models/payment';
import { IDBWallet } from './../interfaces/db/idbwallet';
import { IDBContact } from './../interfaces/db/idbcontact';
import { UserService } from '../services/models/user';
import { ViafusionDB } from './../services/db/viafusiondb';
import { IWallet } from '../interfaces/rapyd/iwallet';
import { WalletService } from '../services/models/wallet';
import { ApiService } from '../services/api/api';
import performance from "perf_hooks";
import express from "express";
import ViafusionServerCore from './core/server-core';
import { RapydUtilties } from '../services/util/utilities';
import { IContact } from '../interfaces/rapyd/icontact';
import { IDBSelect } from '../interfaces/db/select_rows';
import { PostCreatePayment } from '../interfaces/rapyd/ipayment';

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

        function err(res: express.Response, error, t0, statuscode = 400) {
            // res.status(statuscode);
            let pre = performance.performance.now() - t0;
            console.log(`-->Request errored for:'${res.req.path}', from client:'${res.req.ip}' took:${pre}ms`);
            console.error(error);
            res.send(JSON.stringify({ data: {}, response_status:400, error, performance: pre, success: false }))
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


        this.app.post('/prepare-db', async (req, res) => {
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

        this.app.post('/get-db-wallet', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new WalletService();
                let body: IDBSelect<IDBWallet> = req.body;
                userSrv.get_db_wallet(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
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


        this.app.post('/login', async (req, res) => {
            let t0 = performance.performance.now();
            try {
                const userSrv = new UserService();
                let body: object = req.body;
                userSrv.login_or_register_to_otp(body).then((d) => {
                    send(res, d, t0)
                }).catch(e => {
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })


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


        //#region Collect Payment Group

        this.app.post('/list-payment-methods', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            try {
                const paymentSrv = new PaymentService();
                let body: {country:string} = req.body;
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
                let body: {payment_method_type:string} = req.body;
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
                let body: PostCreatePayment.ICreate = req.body;
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
        this.app.post('/create-wallet', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;

            try {
                const walletSrv = new WalletService();
                let body: IWallet = req.body;
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

    }

}