import { ApiService } from './../services/api';
import performance from "perf_hooks";
import express from "express";
import ViafusionServerCore from './core/server-core';
const makeRequest = require('../services/utitlies').makeRequest;

export default class ViafusionServerRoutes extends ViafusionServerCore {

    setupRoute() {

        function send(res: express.Response, response, t0) {
            let pre = performance.performance.now() - t0;
            console.log(`-->Request for:'${res.req.path}', from client:'${res.req.ip}' took:${pre}ms`);
            if (!res.headersSent) {
                res.send(JSON.stringify({ data: { ...response }, performance: pre, success: true }))
            } else {
                res.write(JSON.stringify({ data: { ...response }, performance: pre, success: true }));
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

        // === Register Wallet
        this.app.post('/list-countries', async (req, res) => {
            let t0 = performance.performance.now();
            let data = {} as any;
            let api = new ApiService();
            try {
                let body = req.body;
                // data = await api.post("/data/countries",body);
                const result = await makeRequest('GET', '/v1/data/countries');
                send(res, data, t0)
            } catch (error) {
                err(res, error, t0)
            }
        })

    }

}