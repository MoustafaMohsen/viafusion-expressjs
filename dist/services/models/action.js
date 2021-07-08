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
exports.ActionService = void 0;
var metacontact_1 = require("./metacontact");
var viafusiondb_1 = require("../db/viafusiondb");
var transaction_1 = require("./transaction");
var ActionService = (function () {
    function ActionService() {
    }
    ActionService.prototype.get_db_action = function (minimum_action_object) {
        return __awaiter(this, void 0, void 0, function () {
            var db, _action, results, meta, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        _action = {
                            "*": minimum_action_object
                        };
                        return [4, db.get_object(_action, "AND", 'dbaction')];
                    case 1:
                        results = _a.sent();
                        meta = results.rows[0];
                        parser = this.parse_action(meta);
                        return [2, parser];
                }
            });
        });
    };
    ActionService.prototype.get_db_actions = function (minimum_action_object) {
        return __awaiter(this, void 0, void 0, function () {
            var db, _action, results, metas, parser;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        _action = {
                            "*": minimum_action_object
                        };
                        return [4, db.get_object(_action, "AND", 'dbaction')];
                    case 1:
                        results = _a.sent();
                        metas = results.rows;
                        parser = [];
                        metas.forEach(function (a) { return metas.push(_this.parse_action(a)); });
                        return [2, parser];
                }
            });
        });
    };
    ActionService.prototype.delete_db_action = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            var db, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        return [4, db.delete_object(action, "AND", 'dbaction')];
                    case 1:
                        results = _a.sent();
                        return [2, results];
                }
            });
        });
    };
    ActionService.prototype.update_db_action = function (action, newaction) {
        return __awaiter(this, void 0, void 0, function () {
            var db, results, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        newaction = this.prepare_action_for_db(newaction);
                        return [4, db.update_object(newaction, { id: action.id }, 'dbaction')];
                    case 1:
                        results = _a.sent();
                        return [4, this.get_db_action({ id: action.id })];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    ActionService.prototype.create_db_action = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            var db, metaresult, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        return [4, db.insert_object(action, 'dbaction')];
                    case 1:
                        metaresult = _a.sent();
                        return [4, this.get_db_action({ id: metaresult.rows[0].id })];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    ActionService.prototype.listen_to_acitons = function (minutes) {
        var _this = this;
        if (minutes === void 0) { minutes = 5; }
        setInterval(function () {
            _this.scan_actions().catch(function (error) {
                console.error(error);
            });
        }, minutes * 60 * 1000);
    };
    ActionService.prototype.scan_actions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, client, query, result, actions, _loop_1, this_1, transaction, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        return [4, db.connect()];
                    case 1:
                        client = _a.sent();
                        query = "SELECT * FROM dbaction";
                        return [4, client.query(query)];
                    case 2:
                        result = _a.sent();
                        return [4, client.end()];
                    case 3:
                        _a.sent();
                        actions = result.rows;
                        _loop_1 = function (i) {
                            var a_1, date_passed, metacontactSrv, metacontact, _transaction, tranSrv, error_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 3, , 4]);
                                        a_1 = this_1.parse_action(actions[i]);
                                        date_passed = this_1.date_passed(a_1.date, a_1.every, a_1.value);
                                        if (!(date_passed && a_1.done_count < a_1.count)) return [3, 2];
                                        console.log("Executing action", a_1);
                                        metacontactSrv = new metacontact_1.MetaContactService();
                                        return [4, metacontactSrv.get_db_metacontact({ contact_reference_id: a_1.contact_reference_id })];
                                    case 1:
                                        metacontact = _b.sent();
                                        _transaction = metacontact.transactions.find(function (t) { return t.id == a_1.tran_id; });
                                        metacontact.transactions.push(_transaction);
                                        transaction = metacontact.transactions[metacontact.transactions.length - 1];
                                        transaction.id = "tranid_schedualed_" + this_1.makeid(5);
                                        transaction.execute_payments = true;
                                        transaction.execute_payouts = true;
                                        transaction.description = "SCHADUALED:" + a_1.meta;
                                        tranSrv = new transaction_1.TransactionService();
                                        tranSrv.do_payments(a_1.contact_reference_id, transaction.id).then(function (re) {
                                            console.log("Done: Schadualed do_payments for action", a_1);
                                        }).catch(function (e) {
                                            console.error("Schadualed do_payments error for action", a_1);
                                            console.error(e);
                                        });
                                        tranSrv.do_payouts(a_1.contact_reference_id, transaction.id).then(function (re) {
                                            console.log("Done: Schadualed do_payouts for action", a_1);
                                        }).catch(function (e) {
                                            console.error("Schadualed do_payouts error for action", a_1);
                                            console.error(e);
                                        });
                                        a_1.done_count = parseInt(a_1.done_count) + 1;
                                        a_1.date = new Date().getTime();
                                        this_1.update_db_action({ id: a_1.id }, a_1);
                                        _b.label = 2;
                                    case 2: return [3, 4];
                                    case 3:
                                        error_1 = _b.sent();
                                        console.log("Action errored=>", actions[i]);
                                        console.error(error_1);
                                        return [3, 4];
                                    case 4: return [2];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < actions.length)) return [3, 7];
                        return [5, _loop_1(i)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3, 4];
                    case 7: return [2];
                }
            });
        });
    };
    ActionService.prototype.add_hours_to_date = function (date, hours) {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    };
    ActionService.prototype.add_days_to_date = function (date, days) {
        return this.add_hours_to_date(new Date(), days * 24);
    };
    ActionService.prototype.add_weeks_to_date = function (date, weeks) {
        return this.add_days_to_date(new Date(), weeks * 7);
    };
    ActionService.prototype.add_months_to_date = function (date, months) {
        return this.add_months_to_date(new Date(), months * 30);
    };
    ActionService.prototype.date_passed = function (_date, every, value) {
        var then;
        switch (every) {
            case 'hour':
                then = this.add_hours_to_date(new Date(), value);
                break;
            case 'day':
                then = this.add_days_to_date(new Date(), value);
                break;
            case 'week':
                then = this.add_weeks_to_date(new Date(), value);
                break;
            case 'month':
                then = this.add_months_to_date(new Date(), value);
                break;
            default:
                break;
        }
        var condition = (new Date().getTime() - then.getTime()) > 0;
        if (condition) {
            console.log("Yes do action");
            return true;
        }
        console.log("No don't do it");
        return false;
    };
    ActionService.prototype.prepare_action_for_db = function (action) {
        try {
            if (action.meta)
                action.meta = { data: action.meta };
            return action;
        }
        catch (error) {
            console.error(error);
            return action;
        }
    };
    ActionService.prototype.parse_action = function (action) {
        try {
            action.meta = this.parse_meta(action.meta) || [];
            return action;
        }
        catch (error) {
            console.error(error);
            return action;
        }
    };
    ActionService.prototype.parse_meta = function (str) {
        var temp = str;
        if (typeof str === "string") {
            try {
                temp = JSON.parse(str);
            }
            catch (error) {
                console.error(error);
                temp = str;
            }
        }
        return temp.data;
    };
    ActionService.prototype.makeid = function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    };
    return ActionService;
}());
exports.ActionService = ActionService;
//# sourceMappingURL=action.js.map