import { IDBWallet } from '../../interfaces/db/idbwallet';
import { ApiService } from '../api/api';
import { IWallet } from "../../interfaces/rapyd/iwallet";
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';

export class WalletService {
    constructor() {}

    create_wallet_and_contact(wallet:IWallet){
        var apiSrv = new ApiService();
        return apiSrv.post<IWallet>("user", wallet)
    }

    // TODO: get wallet / get wallet ballance
}