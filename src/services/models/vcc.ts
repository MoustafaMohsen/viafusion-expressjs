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
import { ISetCardStatus, IssueVccRequest, IssueVccRequestForm, IssueVccResponse, ListIssuedVcc, ListIssuedVccTransactions } from '../../interfaces/rapyd/ivcc';
import { IDBMetaContact } from '../../interfaces/db/idbmetacontact';

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

    list_cards() {
        var apiSrv = new ApiService();
        return apiSrv.get<ListIssuedVcc.Response[]>("issuing/cards/")
    }

    list_card_transactions(card_id) {
        var apiSrv = new ApiService();
        return apiSrv.get<ListIssuedVccTransactions.Response[]>("issuing/cards/" + card_id + "/transactions/")
    }

    set_card_status(obj: ISetCardStatus) {
        var apiSrv = new ApiService();
        return apiSrv.post<ListIssuedVccTransactions.Response[]>("issuing/cards/status", obj)
    }

    async get_contact_cards(contact_reference_id): Promise<ListIssuedVcc.Response[]> {
        let res = await this.list_cards();

        let userSrv = new UserService()
        let contact = await userSrv.get_db_user({ contact_reference_id })

        if (contact && res.body.status.status == "SUCCESS") {
            if (res.body.data) {
                let cards = res.body.data;
                cards = cards.filter(c => c.ewallet_contact.id == contact.rapyd_contact_data.id);
                return cards;
            }
        }
        return [];
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
            walletSrv.update_contact(user.ewallet, user.rapyd_contact_data.id, update_user as any).then(async (res) => {
                let contactdata = res.body.data;
                user.rapyd_contact_data = contactdata;
                user.contact = contactdata.id;
                user = await userSrv.update_db_user({ contact_reference_id: user.contact_reference_id }, user);
                this.create_vcc_to_user(user.contact_reference_id, { name: "First Card" }).then(resolve).catch(error => {
                    console.error(error);
                    reject(error);
                })
            }).catch(error => {
                console.error(error);
                reject(error);
            })

        })
    }

    create_vcc_to_user(contact_reference_id:number, metadata = { name: "My Card" }):Promise<IDBContact> {
        return new Promise(async (resolve, reject) => {
            let userSrv = new UserService();
            var user = await userSrv.get_db_user({ contact_reference_id })
            this.create_vcc({
                country: user.rapyd_contact_data.country,
                ewallet_contact: user.rapyd_contact_data.id,
                metadata
            }).then(async (card) => {


                var card_data_all = card.body.data;
                this.activate_card(card_data_all.card_number).then(async (card_data) => {
                    // update cards in metacontact
                    let metacontactSrv = new MetaContactService();
                    let metacontact = await metacontactSrv.get_db_metacontact({ contact_reference_id: user.contact_reference_id } as any);
                    if (card_data.body.status.status !== "SUCCESS") {
                        throw card_data;

                    }
                    let updated = {
                        ...card_data_all,
                        ...card_data.body.data
                    }
                    metacontact.vcc.push(updated);
                    metacontact = await metacontactSrv.update_db_metacontact({ contact_reference_id: user.contact_reference_id } as any, metacontact);
                    // return contact
                    resolve(user);
                }).catch(error => {
                    console.error(error);
                    reject(error);
                })
            }).catch(error => {
                console.error(error);
                reject(error);
            })
        })
    }



    // TODO: get wallet / get wallet balance

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