import { IWallet } from '../models/rapyd/iwallet';
import axios, { AxiosRequestConfig } from "axios";
import CryptoJS from "crypto-js";
import { RapydUtilties } from './utilities';
import { IRapydResponse, IUtitliesResponse } from '../models/rapyd/rest-response';

export class ApiService {
    constructor() {
    }


    post<T>(path: string, body: any = null):Promise<IUtitliesResponse<T>> {
        var rapydUti = new RapydUtilties()
        return rapydUti.makeRequest("POST",'/v1/'+path,body);
    }

}