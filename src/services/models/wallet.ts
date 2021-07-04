import { ICreateCustomer, IDBContact, ICreateCustomerResponse } from './../../interfaces/db/idbcontact';
import { UserService } from './user';
import { ICreateWallet, IDBWallet, IResponseCreateWallet } from '../../interfaces/db/idbwallet';
import { ApiService } from '../api/api';
import { IWallet } from "../../interfaces/rapyd/iwallet";
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';
import { IContact } from '../../interfaces/rapyd/icontact';

export class WalletService {
    constructor() { }

    create_wallet_and_contact(wallet: ICreateWallet.Root) {
        var apiSrv = new ApiService();
        return apiSrv.post<IResponseCreateWallet.Root>("user", wallet)
    }

    async create_wallet_step(form: ICreateWallet.Form, contact_reference_id: number):Promise<IDBContact> {
        let userSrv = new UserService();
        let user = await userSrv.get_db_user({ contact_reference_id });

        let wallet: ICreateWallet.Root = {
            phone_number: user.phone_number,
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            type: "person",
            ewallet_reference_id: contact_reference_id + "",
            contact: {
                address: null,
                contact_type: "personal",
                country: form.country,
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
                phone_number: user.phone_number
            }
        }
        return new Promise((resolve, reject) => {
            this.create_wallet_and_contact(wallet).then(async (res) => {
                let newwallet = res.body.data;

                // update db refrences
                user.ewallet = newwallet.id as any;
                user.rapyd_wallet_data = newwallet;
                let rapyd_contact = newwallet.contacts.data[0]
                user.rapyd_contact_data = rapyd_contact as any;
                user = await userSrv.update_db_user({ contact_reference_id: user.contact_reference_id }, user);

                // create customer from contact
                let customer: ICreateCustomer = {
                    name: rapyd_contact.first_name + " " + rapyd_contact.last_name,
                    phone_number: rapyd_contact.phone_number,
                    metadata: {
                        contact_reference_id: user.contact_reference_id
                    },
                    business_vat_id: "123456789",
                    ewallet: newwallet.id,
                    email: form.email,
                    invoice_prefix: this.makeid(4) + "-"
                }
                this.create_customer(customer).then(async (customer) => {
                    // update db references
                    user.customer = customer.body.data.id as any;
                    user = await userSrv.update_db_user({ contact_reference_id: user.contact_reference_id }, user);

                    // add funds
                    await this.add_funds(newwallet.id, 100000, "USD").catch(error => {
                        console.error(error);
                        reject(error.status.message);
                    });
                    resolve(user)

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