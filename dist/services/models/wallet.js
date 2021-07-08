"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
var metacontact_1 = require("./metacontact");
var user_1 = require("./user");
var api_1 = require("../api/api");
var WalletService = (function () {
    function WalletService() {
    }
    WalletService.prototype.create_wallet_and_contact = function (wallet) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("user", wallet);
    };
    WalletService.prototype.get_wallet_transactions = function (wallet_id) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.get("user/" + wallet_id + "/transactions");
    };
    WalletService.prototype.generate_idv_page = function (request) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("hosted/idv", request);
    };
    WalletService.prototype.create_wallet_step = function (form, contact_reference_id) {
        return __awaiter(this, void 0, void 0, function () {
            var userSrv, user, wallet;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userSrv = new user_1.UserService();
                        return [4, userSrv.get_db_user({ contact_reference_id: contact_reference_id })];
                    case 1:
                        user = _a.sent();
                        wallet = {
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
                        };
                        return [2, new Promise(function (resolve, reject) {
                                _this.create_wallet_and_contact(wallet).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                    var newwallet, rapyd_contact, customer;
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                newwallet = res.body.data;
                                                user.ewallet = newwallet.id;
                                                user.rapyd_wallet_data = newwallet;
                                                rapyd_contact = newwallet.contacts.data[0];
                                                user.rapyd_contact_data = rapyd_contact;
                                                return [4, userSrv.update_db_user({ contact_reference_id: user.contact_reference_id }, user)];
                                            case 1:
                                                user = _a.sent();
                                                customer = {
                                                    name: rapyd_contact.first_name + " " + rapyd_contact.last_name,
                                                    phone_number: rapyd_contact.phone_number,
                                                    metadata: {
                                                        contact_reference_id: user.contact_reference_id
                                                    },
                                                    business_vat_id: "123456789",
                                                    ewallet: newwallet.id,
                                                    email: form.email,
                                                    invoice_prefix: this.makeid(4) + "-"
                                                };
                                                this.create_customer(customer).then(function (customer) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                user.customer = customer.body.data.id;
                                                                return [4, userSrv.update_db_user({ contact_reference_id: user.contact_reference_id }, user)];
                                                            case 1:
                                                                user = _a.sent();
                                                                return [4, this.add_funds(newwallet.id, 100000, "USD").catch(function (error) {
                                                                        console.error(error);
                                                                        reject(error);
                                                                    })];
                                                            case 2:
                                                                _a.sent();
                                                                return [4, this.update_wallet_accounts(user.contact_reference_id)];
                                                            case 3:
                                                                user = _a.sent();
                                                                resolve(user);
                                                                return [2];
                                                        }
                                                    });
                                                }); }).catch(function (error) {
                                                    console.error(error);
                                                    reject(error);
                                                });
                                                return [2];
                                        }
                                    });
                                }); }).catch(function (error) {
                                    console.error(error);
                                    reject(error);
                                });
                            })];
                }
            });
        });
    };
    WalletService.prototype.update_contact = function (ewallet, contact, body) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("ewallets/" + ewallet + "/contacts/" + contact, body);
    };
    WalletService.prototype.get_rates = function (query) {
        var apiSrv = new api_1.ApiService();
        var url = "rates/daily?action_type=" + query.action_type + "&buy_currency=" + query.buy_currency + "&sell_currency=" + query.sell_currency;
        return apiSrv.get(url);
    };
    WalletService.prototype.transfer_money_to_phone_number = function (contact_reference_id, amount, phone_number, message, currency) {
        if (currency === void 0) { currency = "USD"; }
        return __awaiter(this, void 0, void 0, function () {
            var userSrv, user, balance, dest_user, source_ewallet, destination_ewallet, transfer_object;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userSrv = new user_1.UserService();
                        return [4, this.update_wallet_accounts(contact_reference_id)];
                    case 1:
                        _a.sent();
                        return [4, userSrv.get_db_user({ contact_reference_id: contact_reference_id })];
                    case 2:
                        user = _a.sent();
                        balance = this.reduce_accounts_to_amount(user.rapyd_wallet_data.accounts, currency);
                        if (!(balance >= amount)) return [3, 4];
                        return [4, userSrv.get_db_user({ phone_number: phone_number })];
                    case 3:
                        dest_user = _a.sent();
                        if (user) {
                            source_ewallet = user.ewallet;
                            destination_ewallet = dest_user.ewallet;
                            transfer_object = {
                                source_ewallet: source_ewallet,
                                destination_ewallet: destination_ewallet,
                                phone_number: phone_number,
                                amount: amount,
                                currency: currency,
                                metadata: {
                                    tran: "w2w"
                                }
                            };
                            return [2, new Promise(function (resolve, reject) {
                                    _this.transfer_to_wallet(transfer_object).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            this.set_transfer_response({ id: res.body.data.id, status: "accept", metadata: { type: "w2w" } }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                                var transfer_resoponse, metacontactSrv, metacontact, dest_metacontact;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            transfer_resoponse = res.body.data;
                                                            metacontactSrv = new metacontact_1.MetaContactService();
                                                            return [4, metacontactSrv.get_db_metacontact({ contact_reference_id: contact_reference_id })];
                                                        case 1:
                                                            metacontact = _a.sent();
                                                            metacontact.transactions.push({
                                                                type: "w2w",
                                                                transfer_resoponse: transfer_resoponse,
                                                                payments: [],
                                                                id: "tranid_" + this.makeid(5),
                                                                source_amount: parseInt(amount),
                                                                destination_amount: parseInt(amount),
                                                                payouts: [],
                                                                execute_payments: true,
                                                                execute_payouts: false,
                                                                closed_payments_amount: amount,
                                                                closed_payouts_amount: amount,
                                                                description: message,
                                                                executed: true,
                                                                execution_date: new Date().getTime() / 1000,
                                                                status: "closed",
                                                                payments_executed: true,
                                                                payouts_executed: true
                                                            });
                                                            return [4, metacontactSrv.update_db_metacontact({ contact_reference_id: contact_reference_id }, { transactions: metacontact.transactions })];
                                                        case 2:
                                                            metacontact = _a.sent();
                                                            resolve(metacontact);
                                                            return [4, metacontactSrv.get_db_metacontact({ contact_reference_id: dest_user.contact_reference_id })];
                                                        case 3:
                                                            dest_metacontact = _a.sent();
                                                            dest_metacontact.transactions.push({
                                                                type: "w2recived",
                                                                payments: [],
                                                                id: "tranid_" + this.makeid(5),
                                                                source_amount: parseInt(amount),
                                                                destination_amount: parseInt(amount),
                                                                payouts: [],
                                                                closed_payments_amount: amount,
                                                                closed_payouts_amount: amount,
                                                                description: message,
                                                                execute_payments: true,
                                                                execute_payouts: false,
                                                                executed: true,
                                                                execution_date: new Date().getTime() / 1000,
                                                                status: "closed",
                                                                payments_executed: true,
                                                                payouts_executed: true,
                                                                transfer_resoponse: null
                                                            });
                                                            return [4, metacontactSrv.update_db_metacontact({ contact_reference_id: dest_user.contact_reference_id }, { transactions: dest_metacontact.transactions })];
                                                        case 4:
                                                            dest_metacontact = _a.sent();
                                                            return [2];
                                                    }
                                                });
                                            }); }).catch(function (error) {
                                                console.error(error);
                                                reject(reject);
                                            });
                                            return [2];
                                        });
                                    }); }).catch(function (error) {
                                        console.error(error);
                                        reject(reject);
                                    });
                                })];
                        }
                        else {
                        }
                        return [3, 5];
                    case 4: throw new Error("Not Enought Ballance");
                    case 5: return [2];
                }
            });
        });
    };
    WalletService.prototype.reduce_accounts_to_amount = function (accounts, currency) {
        var filterd = accounts.filter(function (a) { return a.currency == currency; });
        if (filterd) {
            var balance = filterd.reduce(function (a, b) {
                return (a.balance + b.balance);
            }).balance;
            return balance;
        }
        else {
            return 0;
        }
    };
    WalletService.prototype.transfer_to_wallet = function (transfer_object) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("account/transfer", transfer_object);
    };
    WalletService.prototype.set_transfer_response = function (set_object) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("account/transfer/response", set_object);
    };
    WalletService.prototype.create_customer = function (customer) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("customers", customer);
    };
    WalletService.prototype.add_funds = function (ewallet, amount, currency) {
        if (currency === void 0) { currency = "USD"; }
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("account/deposit", {
            ewallet: ewallet,
            amount: amount,
            currency: currency
        });
    };
    WalletService.prototype.update_wallet_accounts = function (contact_reference_id) {
        return __awaiter(this, void 0, void 0, function () {
            var userSrv, user, wallet_id, apiSrv;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userSrv = new user_1.UserService();
                        return [4, userSrv.get_db_user({ contact_reference_id: contact_reference_id })];
                    case 1:
                        user = _a.sent();
                        wallet_id = user.rapyd_contact_data.ewallet;
                        user.meta = user.meta || {};
                        apiSrv = new api_1.ApiService();
                        return [2, new Promise(function (resolve, reject) {
                                apiSrv.get("user/" + wallet_id + "/accounts").then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                    var wallet_accounts;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                wallet_accounts = res.body.data;
                                                user.rapyd_wallet_data.accounts = wallet_accounts;
                                                return [4, userSrv.update_db_user({ contact_reference_id: contact_reference_id }, { rapyd_wallet_data: user.rapyd_wallet_data })];
                                            case 1:
                                                user = _a.sent();
                                                resolve(user);
                                                return [2];
                                        }
                                    });
                                }); }).catch(function (error) {
                                    console.error(error);
                                    reject(error);
                                });
                            })];
                }
            });
        });
    };
    WalletService.prototype.makeid = function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    };
    return WalletService;
}());
exports.WalletService = WalletService;
//# sourceMappingURL=wallet.js.map