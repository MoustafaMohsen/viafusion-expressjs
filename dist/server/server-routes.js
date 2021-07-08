"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./../services/models/user");
var action_1 = require("./../services/models/action");
var transaction_1 = require("./../services/models/transaction");
var payout_1 = require("./../services/models/payout");
var vcc_1 = require("./../services/models/vcc");
var payment_1 = require("./../services/models/payment");
var viafusiondb_1 = require("./../services/db/viafusiondb");
var wallet_1 = require("../services/models/wallet");
var api_1 = require("../services/api/api");
var perf_hooks_1 = __importDefault(require("perf_hooks"));
var server_core_1 = __importDefault(require("./core/server-core"));
var utilities_1 = require("../services/util/utilities");
var metacontact_1 = require("../services/models/metacontact");
var ViafusionServerRoutes = (function (_super) {
    __extends(ViafusionServerRoutes, _super);
    function ViafusionServerRoutes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ViafusionServerRoutes.prototype.setupRoute = function () {
        var _this = this;
        function send(res, response, t0) {
            var pre = perf_hooks_1.default.performance.now() - t0;
            console.log("-->Request for:'" + res.req.path + "', from client:'" + res.req.ip + "' took:" + pre + "ms");
            if (!res.headersSent) {
                res.send(JSON.stringify({ performance: pre, success: true, data: __assign({}, response) }));
            }
            else {
                res.write(JSON.stringify({ performance: pre, success: true, data: __assign({}, response) }));
                res.end();
            }
        }
        function err(res, message, t0, statuscode) {
            if (statuscode === void 0) { statuscode = 400; }
            var pre = perf_hooks_1.default.performance.now() - t0;
            console.log("-->Request errored for:'" + res.req.path + "', from client:'" + res.req.ip + "' took:" + pre + "ms");
            console.error(message);
            res.send(JSON.stringify({ data: {}, response_status: 400, message: message, performance: pre, success: false }));
        }
        function write_and_log(res, msg) {
            console.log(msg);
            res.write(msg);
        }
        this.app.get('/', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                try {
                    send(res, data, t0);
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.get('/test-db', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, db, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        data = {};
                        db = new viafusiondb_1.ViafusionDB();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = data;
                        return [4, db.connect('viafusion')];
                    case 2:
                        _a.result = (_b.sent());
                        send(res, data, t0);
                        return [3, 4];
                    case 3:
                        error_1 = _b.sent();
                        err(res, error_1, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                try {
                    send(res, data, t0);
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/prepare-db/' + process.env.VIAFUSION_KEY, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, db, _a, _b, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        data = {};
                        db = new viafusiondb_1.ViafusionDB();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _a = data;
                        _b = [{}];
                        return [4, db.PrepareDB(req.body.database)];
                    case 2:
                        _a.result = __assign.apply(void 0, _b.concat([(_c.sent())]));
                        send(res, data, t0);
                        return [3, 4];
                    case 3:
                        error_2 = _c.sent();
                        err(res, error_2, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/create-db-user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.create_db_user(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/get-db-user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.get_db_user(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/delete-db-user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.delete_db_user(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/get-like-db-user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.list_users_by_phone(body.phone_number, body.limit || 10).then(function (d) {
                        send(res, { users: d }, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/w2w', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, walletSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    walletSrv = new wallet_1.WalletService();
                    body = req.body;
                    walletSrv.transfer_money_to_phone_number(body.contact_reference_id, body.amount, body.phone_number, body.message).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/update-db-user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.update_db_user({ contact_reference_id: body.contact_reference_id }, body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/get-db-metacontact', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, metacontactSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    metacontactSrv = new metacontact_1.MetaContactService();
                    body = req.body;
                    metacontactSrv.get_db_metacontact(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/update-db-metacontact', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, metacontactSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    metacontactSrv = new metacontact_1.MetaContactService();
                    body = req.body;
                    metacontactSrv.update_db_metacontact({ contact_reference_id: body.contact_reference_id }, body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/create-db-metacontact', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, metacontactSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    metacontactSrv = new metacontact_1.MetaContactService();
                    body = req.body;
                    metacontactSrv.create_db_metacontact({ contact_reference_id: body.contact_reference_id }).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/create-wallet', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, walletSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    walletSrv = new wallet_1.WalletService();
                    body = req.body;
                    walletSrv.create_wallet_step(body.form, body.contact_reference_id).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/create-vcc', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, vccSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    vccSrv = new vcc_1.VccService();
                    body = req.body;
                    vccSrv.create_vcc_step(body.form, body.contact_reference_id).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/list-vccs', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, vccSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    vccSrv = new vcc_1.VccService();
                    body = req.body;
                    vccSrv.get_contact_cards(body.contact_reference_id).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/list-vcc-transactions', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, vccSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    vccSrv = new vcc_1.VccService();
                    body = req.body;
                    vccSrv.list_card_transactions(body.card_id).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/set-card-status', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, vccSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    vccSrv = new vcc_1.VccService();
                    body = req.body;
                    vccSrv.set_card_status(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/create-vcc-to-user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, vccSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    vccSrv = new vcc_1.VccService();
                    body = req.body;
                    vccSrv.create_vcc_to_user(body.contact_reference_id, body.metadata).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/update-accounts', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, walletSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    walletSrv = new wallet_1.WalletService();
                    body = req.body;
                    walletSrv.update_wallet_accounts(body.contact_reference_id).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.login_or_register_to_otp(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/get-rates', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, walletSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    walletSrv = new wallet_1.WalletService();
                    body = req.body;
                    walletSrv.get_rates(body).then(function (d) {
                        var rates = d.body.data;
                        send(res, rates, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/execute-payments', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, metacontactSrv, body, contact_reference_id, tran_id, tranSrv;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    metacontactSrv = new metacontact_1.MetaContactService();
                    body = req.body;
                    contact_reference_id = body.contact_reference_id;
                    tran_id = body.tran_id;
                    tranSrv = new transaction_1.TransactionService();
                    if (!tran_id) {
                        throw "Transaction not found";
                    }
                    tranSrv.do_payments(contact_reference_id, tran_id).then(function (re) {
                        send(res, re, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                    return [2];
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/update-payments', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, metacontactSrv, body, contact_reference_id, tran_id, tranSrv;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    metacontactSrv = new metacontact_1.MetaContactService();
                    body = req.body;
                    contact_reference_id = body.contact_reference_id;
                    tran_id = body.tran_id;
                    tranSrv = new transaction_1.TransactionService();
                    if (!tran_id) {
                        throw "Transaction not found";
                    }
                    tranSrv.update_payments_responses(contact_reference_id, tran_id).then(function (re) {
                        send(res, re, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                    return [2];
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/update-payouts', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, metacontactSrv, body, contact_reference_id, tran_id, tranSrv;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    metacontactSrv = new metacontact_1.MetaContactService();
                    body = req.body;
                    contact_reference_id = body.contact_reference_id;
                    tran_id = body.tran_id;
                    tranSrv = new transaction_1.TransactionService();
                    if (!tran_id) {
                        throw "Transaction not found";
                    }
                    tranSrv.update_payments_responses(contact_reference_id, tran_id).then(function (re) {
                        send(res, re, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                    return [2];
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/update-payments-payouts', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, metacontactSrv, body, contact_reference_id, tran_id, tranSrv, message_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        metacontactSrv = new metacontact_1.MetaContactService();
                        body = req.body;
                        contact_reference_id = body.contact_reference_id;
                        tran_id = body.tran_id;
                        tranSrv = new transaction_1.TransactionService();
                        if (!tran_id) {
                            throw "Transaction not found";
                        }
                        return [4, tranSrv.update_payments_responses(contact_reference_id, tran_id).catch(function (e) {
                                err(res, e, t0);
                            })];
                    case 2:
                        _a.sent();
                        tranSrv.update_payouts_responses(contact_reference_id, tran_id).then(function (re) {
                            send(res, re, t0);
                        }).catch(function (e) {
                            err(res, e, t0);
                        });
                        return [2];
                    case 3:
                        message_1 = _a.sent();
                        err(res, message_1, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/complete-payment', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, payment_id, paymentSrv;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    payment_id = req.body.payment_id;
                    paymentSrv = new payment_1.PaymentService();
                    paymentSrv.complete_payment(payment_id).then(function (re) {
                        send(res, re, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                    return [2];
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/simulate-payout', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, payment, payoutSrv;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    payment = req.body.payment;
                    payoutSrv = new payout_1.PayoutService();
                    payoutSrv.simulate_payout(req.body).then(function (re) {
                        send(res, re, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                    return [2];
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/get-payment', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, payment_id, paymentSrv;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    payment_id = req.body.payment_id;
                    paymentSrv = new payment_1.PaymentService();
                    paymentSrv.get_payment(payment_id).then(function (re) {
                        send(res, re, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                    return [2];
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/execute-payouts', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, metacontactSrv, body, contact_reference_id, tran_id, tranSrv;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    metacontactSrv = new metacontact_1.MetaContactService();
                    body = req.body;
                    contact_reference_id = body.contact_reference_id;
                    tran_id = body.tran_id;
                    tranSrv = new transaction_1.TransactionService();
                    tranSrv.do_payouts(contact_reference_id, tran_id).then(function (re) {
                        send(res, re, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                    return [2];
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/complete-payout', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, payout_id, payoutSrv;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    payout_id = req.body.payout_id;
                    payoutSrv = new payout_1.PayoutService();
                    payoutSrv.complete_payout(payout_id).then(function (re) {
                        send(res, re, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                    return [2];
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/get-payout', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, payout_id, payoutSrv;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    payout_id = req.body.payout_id;
                    payoutSrv = new payout_1.PayoutService();
                    payoutSrv.get_payout(payout_id).then(function (re) {
                        send(res, re, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                    return [2];
                }
                catch (message) {
                    err(res, message, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/confirm-otp', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.confirm_user_otp(body.user, body.otp).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/set-otp', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.set_user_otp(body.user, body.otp).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/confirm-pin', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.confirm_user_pin(body.user, body.pin).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/set-pin', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.set_user_pin(body.user, body.pin).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/confirm-fp', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.confirm_user_fp(body.user, body.fp).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/set-device', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.set_user_device(body.user, body.device).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/confirm-device', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.confirm_user_device(body.user, body.device).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/set-device', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.set_user_device(body.user, body.device).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/confirm_authnticate', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, userSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                try {
                    userSrv = new user_1.UserService();
                    body = req.body;
                    userSrv.confirm_authenticate(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/list-payment-methods', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, paymentSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                try {
                    paymentSrv = new payment_1.PaymentService();
                    body = req.body;
                    paymentSrv.list_payment_methods(body.country).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/list-payment-required-fields', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, paymentSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                try {
                    paymentSrv = new payment_1.PaymentService();
                    body = req.body;
                    paymentSrv.payment_method_required_fields(body.payment_method_type).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/create-payment', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, paymentSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                try {
                    paymentSrv = new payment_1.PaymentService();
                    body = req.body;
                    paymentSrv.create_payment(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/list-payout-methods', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, payoutSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                try {
                    payoutSrv = new payout_1.PayoutService();
                    body = req.body;
                    payoutSrv.list_payout_methods(body.country).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/list-payout-required-fields', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, payoutSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                try {
                    payoutSrv = new payout_1.PayoutService();
                    body = req.body;
                    payoutSrv.payout_method_required_fields(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/create-payout', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, payoutSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                try {
                    payoutSrv = new payout_1.PayoutService();
                    body = req.body;
                    payoutSrv.create_payout(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/create-wallet-directly', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, walletSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                try {
                    walletSrv = new wallet_1.WalletService();
                    body = req.body;
                    walletSrv.create_wallet_and_contact(body).then(function (d) {
                        send(res, d, t0);
                    }).catch(function (e) {
                        err(res, e, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/list-countries', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, api, body, rapydUti, data_1, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        data = {};
                        api = new api_1.ApiService();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        body = req.body;
                        rapydUti = new utilities_1.RapydUtilties();
                        return [4, rapydUti.makeRequest('GET', '/v1/data/countries')];
                    case 2:
                        data_1 = _a.sent();
                        send(res, data_1.body.data, t0);
                        return [3, 4];
                    case 3:
                        error_3 = _a.sent();
                        err(res, error_3, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/wallet-transactions', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, walletSrv, userSrv, body, user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        data = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        walletSrv = new wallet_1.WalletService();
                        userSrv = new user_1.UserService();
                        body = req.body;
                        return [4, userSrv.get_db_user({ contact_reference_id: body.contact_reference_id })];
                    case 2:
                        user = _a.sent();
                        walletSrv.get_wallet_transactions(user.ewallet).then(function (r) {
                            send(res, { data: Object.values(r.body.data) }, t0);
                        });
                        return [3, 4];
                    case 3:
                        error_4 = _a.sent();
                        err(res, error_4, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/simulate-card-authorization', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, act, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                act = new vcc_1.VccService();
                try {
                    body = req.body;
                    act.simulate_card_authorization(body).then(function (r) {
                        send(res, r, t0);
                    }).catch(function (error) {
                        err(res, error, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/generate-checkout', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, paymentSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                paymentSrv = new payment_1.PaymentService();
                try {
                    body = req.body;
                    paymentSrv.generate_chckout_page(body).then(function (r) {
                        send(res, r.body.data, t0);
                    }).catch(function (error) {
                        err(res, error, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/generate-idv', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, walletSrv, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                walletSrv = new wallet_1.WalletService();
                try {
                    body = req.body;
                    walletSrv.generate_idv_page(body).then(function (r) {
                        send(res, r.body.data, t0);
                    }).catch(function (error) {
                        err(res, error, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/get-actions', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, act, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                act = new action_1.ActionService();
                try {
                    body = req.body;
                    act.get_db_actions(body).then(function (r) {
                        send(res, r, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/update-action', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, act, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                act = new action_1.ActionService();
                try {
                    body = req.body;
                    act.update_db_action(body.action, body.newaction).then(function (r) {
                        send(res, r, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/delete-actions', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, act, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                act = new action_1.ActionService();
                try {
                    body = req.body;
                    act.delete_db_action(body).then(function (r) {
                        send(res, r, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/create-actions', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, act, body;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                data = {};
                act = new action_1.ActionService();
                try {
                    body = req.body;
                    act.get_db_actions(body).then(function (r) {
                        send(res, r, t0);
                    });
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
    };
    return ViafusionServerRoutes;
}(server_core_1.default));
exports.default = ViafusionServerRoutes;
//# sourceMappingURL=server-routes.js.map