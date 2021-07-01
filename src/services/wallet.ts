import { ApiService } from './api';
import { IWallet } from "../models/rapyd/iwallet";

export class WalletService {
    constructor() {}

    create_wallet_and_contact(wallet:IWallet){
        var apiSrv = new ApiService();
        return apiSrv.post<IWallet>("user", wallet)
    }
}