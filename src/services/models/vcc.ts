import { MetaContactService } from './metacontact';
import { WalletService } from './wallet';
import { ICreateCustomer, IDBContact, ICreateCustomerResponse } from '../../interfaces/db/idbcontact';
import { UserService } from './user';
import { ICreateWallet, IDBWallet, IResponseCreateWallet } from '../../interfaces/db/idbwallet';
import { ApiService } from '../api/api';
import { IWallet } from "../../interfaces/rapyd/iwallet";
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';
import { IContact } from '../../interfaces/rapyd/icontact';
import { IssueVccRequest, IssueVccRequestForm, IssueVccResponse } from '../../interfaces/rapyd/ivcc';

export class VccService {
    constructor() { }

    create_vcc(card_info: IssueVccRequest) {
        var apiSrv = new ApiService();
        return apiSrv.post<IssueVccResponse>("issuing/cards", card_info)
    }

    activate_card(card_number: string) {
        var apiSrv = new ApiService();
        return apiSrv.post<IssueVccResponse>("issuing/cards/activate", {
            card: card_number
        })
    }

    async create_vcc_step(form: IssueVccRequestForm, contact_reference_id: number): Promise<IDBContact> {
        let userSrv = new UserService();
        let user = await userSrv.get_db_user({ contact_reference_id });

        let update_user: IssueVccRequestForm = {
            date_of_birth: form.date_of_birth,
            address: form.address,
            country: form.country
        }

        return new Promise((resolve, reject) => {
            let walletSrv = new WalletService();
            walletSrv.update_contact(user.ewallet, user.contact, update_user as any).then(async (res) => {
                let contactdata = res.body.data;
                user.rapyd_contact_data = contactdata;
                user.contact = contactdata.id;
                user = await userSrv.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
                this.create_vcc({
                    country: form.country,
                    ewallet_contact: user.contact
                }).then(async (card) => {


                    let card_data = card.body.data;
                    this.activate_card(card_data.card_number).then(async (card_data) => {
                        // update cards in metacontact
                        let metacontactSrv = new MetaContactService();
                        let metacontact = await metacontactSrv.get_db_metacontact({ contact_reference_id: user.contact_reference_id } as any);
                        metacontact.vcc.push(card_data);
                        metacontact = await metacontactSrv.update_db_metacontact({ contact_reference_id: user.contact_reference_id } as any, metacontact);
                        // return contact
                        resolve(user);
                    }).catch(error => {
                        console.error(error);
                        reject(error.status.message);
                    })
                }).catch(error => {
                    console.error(error);
                    reject(error.status.message);
                })


            }).catch(error => {
                console.error(error);
                reject(error.status.message);
            })

        })
    }



    // TODO: get wallet / get wallet ballance

    create_customer(customer: ICreateCustomer) {
        var apiSrv = new ApiService();
        return apiSrv.post<ICreateCustomerResponse>("customers", customer)
    }

    add_funds(ewallet: any, amount: number, currency = "USD") {
        var apiSrv = new ApiService();
        return apiSrv.post<IResponseCreateWallet.Root>("account/deposit", {
            ewallet,
            amount,
            currency
        })
    }

    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
}