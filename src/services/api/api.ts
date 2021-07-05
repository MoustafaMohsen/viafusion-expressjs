import { IWallet } from '../../interfaces/rapyd/iwallet';
import axios, { AxiosRequestConfig } from "axios";
import CryptoJS from "crypto-js";
import { RapydUtilties } from '../util/utilities';
import { IRapydResponse, IUtilitiesResponse } from '../../interfaces/rapyd/rest-response';

export class ApiService {
    constructor() {
    }


    post<T>(path: string, body: any = null):Promise<IUtilitiesResponse<T>> {
        var rapydUti = new RapydUtilties()
        return rapydUti.makeRequest("POST",'/v1/'+path,body);
    }

    get<T>(path: string):Promise<IUtilitiesResponse<T>> {
        var rapydUti = new RapydUtilties()
        return rapydUti.makeRequest("GET",'/v1/'+path);
    }

}