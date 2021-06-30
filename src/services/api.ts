import { IWallet } from './../models/rapyd/wallet';
import axios, { AxiosRequestConfig }  from "axios";

export class ApiService {
    constructor() {
    }


    get_auth(){
        
    }

    post(path:string,data:any){
        /**
         * Content-Type:application/json
            access_key:{{rapyd_access_key}}
            salt:{{rapyd_signature_salt}}
            timestamp:{{rapyd_request_timestamp}}
            signature:{{rapyd_signature}}
            idempotency:asdfah898hsdaf0hj
         */
        let param :AxiosRequestConfig = {
            auth:""
        }
        axios.post(url,params)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.error(err); 
        })
    }

}