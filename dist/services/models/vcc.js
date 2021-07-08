"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.VccService = void 0;
var metacontact_1 = require("./metacontact");
var wallet_1 = require("./wallet");
var user_1 = require("./user");
var api_1 = require("../api/api");
var VccService = (function () {
    function VccService() {
    }
    VccService.prototype.create_vcc = function (card_info) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("issuing/cards", card_info);
    };
    VccService.prototype.activate_card = function (card_number) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("issuing/cards/activate", {
            card: card_number
        });
    };
    VccService.prototype.list_cards = function () {
        var apiSrv = new api_1.ApiService();
        return apiSrv.get("issuing/cards/");
    };
    VccService.prototype.list_card_transactions = function (card_id) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.get("issuing/cards/" + card_id + "/transactions/");
    };
    VccService.prototype.set_card_status = function (obj) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("issuing/cards/status", obj);
    };
    VccService.prototype.simulate_card_authorization = function (obj) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("issuing/cards/authorization", obj);
    };
    VccService.prototype.get_contact_cards = function (contact_reference_id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, userSrv, contact, cards;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.list_cards()];
                    case 1:
                        res = _a.sent();
                        userSrv = new user_1.UserService();
                        return [4, userSrv.get_db_user({ contact_reference_id: contact_reference_id })];
                    case 2:
                        contact = _a.sent();
                        if (contact && res.body.status.status == "SUCCESS") {
                            if (res.body.data) {
                                cards = res.body.data;
                                cards = cards.filter(function (c) { return c.ewallet_contact.id == contact.rapyd_contact_data.id; });
                                return [2, cards];
                            }
                        }
                        return [2, []];
                }
            });
        });
    };
    VccService.prototype.create_vcc_step = function (form, contact_reference_id) {
        return __awaiter(this, void 0, void 0, function () {
            var userSrv, user, update_user;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userSrv = new user_1.UserService();
                        return [4, userSrv.get_db_user({ contact_reference_id: contact_reference_id })];
                    case 1:
                        user = _a.sent();
                        update_user = {
                            date_of_birth: form.date_of_birth,
                            address: form.address,
                            country: form.country
                        };
                        return [2, new Promise(function (resolve, reject) {
                                var walletSrv = new wallet_1.WalletService();
                                walletSrv.update_contact(user.ewallet, user.rapyd_contact_data.id, update_user).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                    var contactdata;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                contactdata = res.body.data;
                                                user.rapyd_contact_data = contactdata;
                                                user.contact = contactdata.id;
                                                return [4, userSrv.update_db_user({ contact_reference_id: user.contact_reference_id }, user)];
                                            case 1:
                                                user = _a.sent();
                                                this.create_vcc_to_user(user.contact_reference_id, { name: "First Card" }).then(resolve).catch(function (error) {
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
    VccService.prototype.create_vcc_to_user = function (contact_reference_id, metadata) {
        var _this = this;
        if (metadata === void 0) { metadata = { name: "My Card" }; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var userSrv, user;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userSrv = new user_1.UserService();
                        return [4, userSrv.get_db_user({ contact_reference_id: contact_reference_id })];
                    case 1:
                        user = _a.sent();
                        this.create_vcc({
                            country: user.rapyd_contact_data.country,
                            ewallet_contact: user.rapyd_contact_data.id,
                            metadata: metadata
                        }).then(function (card) { return __awaiter(_this, void 0, void 0, function () {
                            var card_data_all;
                            var _this = this;
                            return __generator(this, function (_a) {
                                card_data_all = card.body.data;
                                this.activate_card(card_data_all.card_number).then(function (card_data) { return __awaiter(_this, void 0, void 0, function () {
                                    var metacontactSrv, metacontact, updated;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                metacontactSrv = new metacontact_1.MetaContactService();
                                                return [4, metacontactSrv.get_db_metacontact({ contact_reference_id: user.contact_reference_id })];
                                            case 1:
                                                metacontact = _a.sent();
                                                if (card_data.body.status.status !== "SUCCESS") {
                                                    throw card_data;
                                                }
                                                updated = __assign(__assign({}, card_data_all), card_data.body.data);
                                                metacontact.vcc.push(updated);
                                                return [4, metacontactSrv.update_db_metacontact({ contact_reference_id: user.contact_reference_id }, metacontact)];
                                            case 2:
                                                metacontact = _a.sent();
                                                resolve(user);
                                                return [2];
                                        }
                                    });
                                }); }).catch(function (error) {
                                    console.error(error);
                                    reject(error);
                                });
                                return [2];
                            });
                        }); }).catch(function (error) {
                            console.error(error);
                            reject(error);
                        });
                        return [2];
                }
            });
        }); });
    };
    VccService.prototype.create_customer = function (customer) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("customers", customer);
    };
    VccService.prototype.add_funds = function (ewallet, amount, currency) {
        if (currency === void 0) { currency = "USD"; }
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("account/deposit", {
            ewallet: ewallet,
            amount: amount,
            currency: currency
        });
    };
    VccService.prototype.makeid = function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    };
    return VccService;
}());
exports.VccService = VccService;
//# sourceMappingURL=vcc.js.map