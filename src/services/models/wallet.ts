import { MetaContactService } from './metacontact';
import { ICreateCustomer, IDBContact, ICreateCustomerResponse } from './../../interfaces/db/idbcontact';
import { UserService } from './user';
import { ICreateWallet, IDBWallet, IResponseCreateWallet } from '../../interfaces/db/idbwallet';
import { ApiService } from '../api/api';
import { IContact } from '../../interfaces/rapyd/icontact';
import { TransferToWallet, WalletBalanceResponse } from '../../interfaces/rapyd/iwallet';
import { ITransaction } from '../../interfaces/db/idbmetacontact';
import { IUtilitiesResponse } from '../../interfaces/rapyd/rest-response';

export class WalletService {
    constructor() { }

    create_wallet_and_contact(wallet: ICreateWallet.Root) {
        var apiSrv = new ApiService();
        return apiSrv.post<IResponseCreateWallet.Root>("user", wallet)
    }

    async create_wallet_step(form: ICreateWallet.Form, contact_reference_id: number): Promise<IDBContact> {
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
                        reject(error);
                    });
                    user = await this.update_wallet_accounts(user.contact_reference_id);
                    resolve(user)

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


    update_contact(ewallet: string, contact: string, body: IContact) {
        var apiSrv = new ApiService();
        return apiSrv.post<IContact>("ewallets/" + ewallet + "/contacts/" + contact, body)
    }

    async transfer_money_to_phone_number(contact_reference_id: number, amount: number, phone_number: string, currency = "USD") {
        // check wallet has this balance
        let userSrv = new UserService();
        await this.update_wallet_accounts(contact_reference_id);
        var user = await userSrv.get_db_user({ contact_reference_id });
        let balance = this.reduce_accounts_to_amount(user.rapyd_wallet_data.accounts, currency);
        if (balance >= amount) {
            // check user exsits
            let user = await userSrv.get_db_user({ phone_number });
            if (user) {
                let source_ewallet = user.ewallet;
                let destination_ewallet = user.ewallet;
                let transfer_object: TransferToWallet.Request = {
                    source_ewallet,
                    destination_ewallet,
                    amount,
                    currency,
                    metadata: {
                        tran: "w2w"
                    }
                }
                new Promise((resolve, reject) => {
                    this.transfer_to_wallet(transfer_object).then(
                        async (res) => {
                            // set transfer response
                            this.set_transfer_response({ id: res.body.data.id, status: "accept", metadata: { type: "w2w" } }).then(async (res) => {
                                // save response
                                let transfer_resoponse = res.body.data;
                                let metacontactSrv = new MetaContactService();
                                let metacontact = await metacontactSrv.get_db_metacontact({ contact_reference_id } as any);
                                metacontact.transactions.push({
                                    type: "w2w",
                                    transfer_resoponse
                                } as any);

                                metacontact = await metacontactSrv.update_db_metacontact({ contact_reference_id } as any, {
                                    transactions: JSON.stringify(metacontact.transactions)
                                } as any);
                                resolve(metacontact)
                            }).catch(error => {
                                console.error(error);
                                reject(reject)
                            })
                        }
                    ).catch(error => {
                        console.error(error);
                        reject(reject)
                    })
                })
            } else {
                // handle send anyway

            }
        }
    }

    reduce_accounts_to_amount(accounts: WalletBalanceResponse[], currency: string) {
        let filterd = accounts.filter(a => a.currency == currency);
        if (filterd) {
            let balance: number = filterd.reduce((a, b) => {
                return (a.balance + b.balance) as any
            }).balance as any
            return balance;
        } else {
            return 0
        }
    }

    transfer_to_wallet(transfer_object: TransferToWallet.Request) {
        var apiSrv = new ApiService();
        return apiSrv.post<TransferToWallet.Response>("account/transfer", transfer_object)
    }

    set_transfer_response(set_object: TransferToWallet.Set_Response) {
        var apiSrv = new ApiService();
        return apiSrv.post<TransferToWallet.Response>("account/transfer/response", set_object)
    }


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

    async update_wallet_accounts(contact_reference_id: number):Promise<IDBContact>    {
        var userSrv = new UserService();
        var user = await userSrv.get_db_user({ contact_reference_id })
        let wallet_id = user.rapyd_contact_data.ewallet;
        user.meta = user.meta || {};

        var apiSrv = new ApiService();
        return new Promise((resolve, reject) => {
            apiSrv.get<WalletBalanceResponse[]>("user/" + wallet_id + "/accounts").then(async (res) => {
                let wallet_accounts = res.body.data;
                user.rapyd_wallet_data.accounts = wallet_accounts;
                user = await userSrv.update_db_user({ contact_reference_id }, { rapyd_wallet_data: user.rapyd_wallet_data });
                resolve(user);
            }).catch((error:IUtilitiesResponse)=>{
                console.error(error);
                reject(error)
            })
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