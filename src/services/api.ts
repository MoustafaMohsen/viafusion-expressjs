import { IWallet } from './../models/rapyd/wallet';
import axios, { AxiosRequestConfig } from "axios";
import CryptoJS from "crypto-js";

export class ApiService {
    constructor() {
    }


    base_uri = "https://sandboxapi.rapyd.net/v1";
    get_auth(path: string, method: string, body) {
        /**
         * to_sign 
                // method
                get

                // path
                /v1/identities/types?country=US

                // singture salt
                47f5e0eb448429aa4688612f

                // timestamp
                1625016994

                // access key
                2BD4532374A630BAACA9

                // secret
                3b0dafc63e76c830bf37a1d9e2ad87f7812f669f26aa0fb06647235d3905d70ddf4174ebfb141e9d

                //body (as string or empty)
         */
        const rapyd_secret_key = "3b0dafc63e76c830bf37a1d9e2ad87f7812f669f26aa0fb06647235d3905d70ddf4174ebfb141e9d";
        const rapyd_access_key = "2BD4532374A630BAACA9";

        var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();

        var signature_salt = CryptoJS.lib.WordArray.random(12);

        if (body !== '{}' && body !== '' && typeof body !== 'object') {
            body = JSON.stringify(JSON.parse(body));
        }

        var to_sign =
            method.toLocaleLowerCase() +
            path.toLocaleLowerCase() +
            signature_salt +
            timestamp +
            rapyd_access_key +
            rapyd_secret_key +
            body;

        console.log("to_sign " + to_sign);

        var rapyd_signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, rapyd_secret_key));

        rapyd_signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(rapyd_signature));

        console.log("rapyd_signature " + rapyd_signature);

        return {
            rapyd_secret_key, rapyd_access_key, signature_salt, rapyd_signature
        }
    }

    post(path: string, body: any) {
        let headers = this.get_auth("v1" + path, "post", body)
        let param: AxiosRequestConfig = {
            headers
        }

        let url = this.base_uri + path

        return new Promise((resolve, reject) => {
            axios.post(url, param)
                .then(res => {
                    console.log(res);
                    resolve(res)
                })
                .catch(err => {
                    console.error(err);
                    reject(err)
                })
        })
    }

}