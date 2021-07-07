import { ApiService } from '../api/api';
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';
import { ICreatePayout, IGetPayoutRequiredFields, IListPayout, ISimulateTransaction } from '../../interfaces/rapyd/ipayout';

export class PayoutService {
    constructor() { }

    list_payout_methods(country: string) {
        var apiSrv = new ApiService();
        return apiSrv.get<IListPayout.Response[]>("payouts/supported_types?beneficiary_country=" + country)
    }

    /** entity is alway "individual" and sender currency is always "USD" */
    payout_method_required_fields(request: IGetPayoutRequiredFields.QueryRequest) {
        var apiSrv = new ApiService();
        return apiSrv.get<any>(`payouts/${request.payout_method_type}/details?sender_currency=USD&sender_entity_type=individual&beneficiary_entity_type=individual&sender_country=${request.sender_country}&beneficiary_country=${request.beneficiary_country}&payout_currency=${request.payout_currency}&payout_amount=${request.payout_amount}`)
    }

    // TODO: make request
    create_payout(create_payout_object: ICreatePayout.Request) {
        var apiSrv = new ApiService();
        return apiSrv.post<ICreatePayout.Response>("payouts", create_payout_object)
    }

    get_payout(payout_id: string) {
        var apiSrv = new ApiService();
        return apiSrv.get<ICreatePayout.Response>("payouts/" + payout_id);
    }

    complete_payout(payout_id: string) {
        return new Promise((resolve, reject) => {
            this.get_payout(payout_id).then(res => {
                let payout = res.body.data;
                if (payout.status == "CLO") {
                    resolve(payout);
                    return;
                }
                var apiSrv = new ApiService();
                apiSrv.post<ICreatePayout.Response>("payouts/complete/" + payout.id + "/" + payout.amount, {}).then(res => {
                    let payout = res.body.data
                    resolve(payout);
                }).catch(error => {
                    console.error(error);
                    reject(error)
                })

            }).catch(error => {
                console.error(error);
                reject(error)
            })
        })
    }

    async simulate_payout(create_payout_object: ICreatePayout.Request): Promise<ISimulateTransaction> {
        let result: ISimulateTransaction = {} as any
        return new Promise(async (resolve, reject) => {
            create_payout_object.ewallet = process.env.SIMULATE_PAYOUT_EWALLET || "ewallet_b1017c01f3ce0c3ec7aa11b37a30738b"
            await this.create_payout(create_payout_object).then(res => {
                result.success = true;
                result.message = `Payout can be processed`;
                resolve(result);
            }).catch(res => {
                result.error_code = res.body.status.response_code
                result.success = false
                result.message = res.body.status.message
                resolve(result);
            })
        })
    }
}