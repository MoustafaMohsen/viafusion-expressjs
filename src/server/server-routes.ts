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

export default class ViafusionServerRoutes extends ViafusionServerCore {

    setupRoute() {

        function send(res: express.Response, response, t0) {
            let pre = performance.performance.now() - t0;
            console.log(`-->Request for:'${res.req.path}', from client:'${res.req.ip}' took:${pre}ms`);
            if (!res.headersSent) {
                res.send(JSON.stringify({ performance: pre, success: true ,data: { ...response } }))
            } else {
                res.write(JSON.stringify({ performance: pre, success: true ,data: { ...response }}));
                res.end();
            }
        }

        function err(res: express.Response, error, t0, statuscode = 400) {
            res.status(statuscode);
            let pre = performance.performance.now() - t0;
            console.log(`-->Request errored for:'${res.req.path}', from client:'${res.req.ip}' took:${pre}ms`);
            console.error(error);
            res.send(JSON.stringify({ data: {}, error, performance: pre, success: false }))
        }

        function write_and_log(res: express.Response, msg) {
            console.log(msg);
            res.write(msg)
        }


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
                let body:IDBSelect<IDBContact> = req.body;
                userSrv.get_db_user(body).then((d)=>{
                    send(res, d, t0)
                }).catch(e=>{
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
                let body:IDBSelect<IDBWallet> = req.body;
                userSrv.get_db_wallet(body).then((d)=>{
                    send(res, d, t0)
                }).catch(e=>{
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
                let body:IDBContact = req.body;
                userSrv.create_db_user(body).then((d)=>{
                    send(res, d, t0)
                }).catch(e=>{
                    err(res, e, t0)
                })
            } catch (error) {
                err(res, error, t0)
            }
        })

        this.app.post('/create-wallet', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            
            try {
                const walletSrv = new WalletService();
                let body:IWallet = req.body;
                walletSrv.create_wallet_and_contact(body).then((d)=>{
                    send(res, d, t0)
                }).catch(e=>{
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