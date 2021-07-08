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
exports.TransactionService = void 0;
var payout_1 = require("./payout");
var payment_1 = require("./payment");
var metacontact_1 = require("./metacontact");
var TransactionService = (function () {
    function TransactionService() {
    }
    TransactionService.prototype.execute_transaction = function (_transaction) {
    };
    TransactionService.prototype.do_payments = function (contact_reference_id, tran_id) {
        var metacontactSrv = new metacontact_1.MetaContactService();
        return new Promise(function (resolve, reject) {
            metacontactSrv.get_db_metacontact({ contact_reference_id: contact_reference_id }).then(function (d) {
                var metacontact = d;
                var transaction = metacontact.transactions.find(function (t) { return t.id == tran_id; });
                if (transaction) {
                    var transactionSrv = new TransactionService();
                    transactionSrv._execute_create_payments(transaction).then(function (transaction_response) {
                        var contact_id = metacontact.contact_reference_id;
                        metacontactSrv.get_db_metacontact({ contact_reference_id: contact_id }).then(function (d) {
                            var metacontact = d;
                            var contact_id = metacontact.contact_reference_id;
                            for (var i = 0; i < metacontact.transactions.length; i++) {
                                var t = metacontact.transactions[i];
                                if (t.id == tran_id) {
                                    transaction_response.payments_executed = true;
                                    transaction_response.execution_date = transaction_response.execution_date ? transaction_response.execution_date : new Date().getTime() / 1000;
                                    metacontact.transactions[i] = transaction_response;
                                }
                            }
                            metacontactSrv.update_db_metacontact({ contact_reference_id: contact_id }, { transactions: metacontact.transactions }).then(function (meta) {
                                resolve(meta);
                            }).catch(function (e) {
                                reject(e);
                            });
                        }).catch(function (e) {
                            reject(e);
                        });
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    throw Error("Transaction not Found");
                }
            }).catch(function (e) {
                reject(e);
            });
        });
    };
    TransactionService.prototype.do_payouts = function (contact_reference_id, tran_id) {
        var metacontactSrv = new metacontact_1.MetaContactService();
        return new Promise(function (resolve, reject) {
            metacontactSrv.get_db_metacontact({ contact_reference_id: contact_reference_id }).then(function (d) {
                var metacontact = d;
                var transaction = metacontact.transactions.find(function (t) { return t.id == tran_id; });
                if (transaction) {
                    var transactionSrv = new TransactionService();
                    transactionSrv._execute_create_payouts(transaction).then(function (transaction_response) {
                        var contact_id = metacontact.contact_reference_id;
                        metacontactSrv.get_db_metacontact({ contact_reference_id: contact_id }).then(function (d) {
                            var metacontact = d;
                            var contact_id = metacontact.contact_reference_id;
                            for (var i = 0; i < metacontact.transactions.length; i++) {
                                var t = metacontact.transactions[i];
                                if (t.id == tran_id) {
                                    transaction_response.payments_executed = true;
                                    metacontact.transactions[i] = transaction_response;
                                }
                            }
                            metacontactSrv.update_db_metacontact({ contact_reference_id: contact_id }, { transactions: metacontact.transactions }).then(function (meta) {
                                resolve(meta);
                            }).catch(function (e) {
                                reject(e);
                            });
                        }).catch(function (e) {
                            reject(e);
                        });
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    throw Error("Transaction not Found");
                }
            }).catch(function (e) {
                reject(e);
            });
        });
    };
    TransactionService.prototype.update_payments_responses = function (contact_reference_id, tran_id) {
        var _this = this;
        var metacontactSrv = new metacontact_1.MetaContactService();
        return new Promise(function (resolve, reject) {
            metacontactSrv.get_db_metacontact({ contact_reference_id: contact_reference_id }).then(function (d) { return __awaiter(_this, void 0, void 0, function () {
                var metacontact, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            metacontact = d;
                            transaction = metacontact.transactions.find(function (t) { return t.id == tran_id; });
                            if (!transaction) return [3, 2];
                            return [4, this._execute_update_payments(transaction).then(function (transaction_response) {
                                    var contact_id = metacontact.contact_reference_id;
                                    metacontactSrv.get_db_metacontact({ contact_reference_id: contact_id }).then(function (d) {
                                        var metacontact = d;
                                        var contact_id = metacontact.contact_reference_id;
                                        for (var i = 0; i < metacontact.transactions.length; i++) {
                                            var t = metacontact.transactions[i];
                                            if (t.id == tran_id) {
                                                metacontact.transactions[i] = transaction_response;
                                            }
                                        }
                                        metacontactSrv.update_db_metacontact({ contact_reference_id: contact_id }, { transactions: metacontact.transactions }).then(function (meta) {
                                            resolve(meta);
                                        }).catch(function (e) {
                                            reject(e);
                                        });
                                    }).catch(function (e) {
                                        reject(e);
                                    });
                                }).catch(function (e) {
                                    reject(e);
                                })];
                        case 1:
                            _a.sent();
                            return [3, 3];
                        case 2:
                            resolve(metacontact);
                            _a.label = 3;
                        case 3: return [2];
                    }
                });
            }); }).catch(function (e) {
                reject(e);
            });
        });
    };
    TransactionService.prototype.update_payouts_responses = function (contact_reference_id, tran_id) {
        var _this = this;
        var metacontactSrv = new metacontact_1.MetaContactService();
        return new Promise(function (resolve, reject) {
            metacontactSrv.get_db_metacontact({ contact_reference_id: contact_reference_id }).then(function (d) { return __awaiter(_this, void 0, void 0, function () {
                var metacontact, transaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            metacontact = d;
                            transaction = metacontact.transactions.find(function (t) { return t.id == tran_id; });
                            if (!transaction) return [3, 2];
                            return [4, this._execute_update_payouts(transaction).then(function (transaction_response) {
                                    var contact_id = metacontact.contact_reference_id;
                                    metacontactSrv.get_db_metacontact({ contact_reference_id: contact_id }).then(function (d) {
                                        var metacontact = d;
                                        var contact_id = metacontact.contact_reference_id;
                                        for (var i = 0; i < metacontact.transactions.length; i++) {
                                            var t = metacontact.transactions[i];
                                            if (t.id == tran_id) {
                                                metacontact.transactions[i] = transaction_response;
                                            }
                                        }
                                        metacontactSrv.update_db_metacontact({ contact_reference_id: contact_id }, { transactions: metacontact.transactions }).then(function (meta) {
                                            resolve(meta);
                                        }).catch(function (e) {
                                            reject(e);
                                        });
                                    }).catch(function (e) {
                                        reject(e);
                                    });
                                }).catch(function (e) {
                                    reject(e);
                                })];
                        case 1:
                            _a.sent();
                            return [3, 3];
                        case 2: throw Error("Transaction not Found");
                        case 3: return [2];
                    }
                });
            }); }).catch(function (e) {
                reject(e);
            });
        });
    };
    TransactionService.prototype._execute_create_payments = function (_transaction) {
        var _this = this;
        var transaction = __assign({}, _transaction);
        var payments = transaction.payments;
        return new Promise(function (resolve, reject) {
            var _loop_1 = function (i) {
                var payment = payments[i].request;
                if (payment.metadata.executed == false)
                    _this.create_payment(payment).then(function (res) {
                        payments[i].response = res;
                        if (_this.are_payments_done(transaction.payments)) {
                            transaction.payments_executed = true;
                            resolve(transaction);
                        }
                    }).catch(function (error) {
                        console.error(error);
                        payments[i].response = error;
                        if (_this.are_payments_done(transaction.payments)) {
                            transaction.payouts_executed = true;
                            resolve(transaction);
                        }
                    });
                payment.metadata.executed = true;
            };
            for (var i = 0; i < payments.length; i++) {
                _loop_1(i);
            }
        });
    };
    TransactionService.prototype._execute_create_payouts = function (_transaction) {
        var _this = this;
        var transaction = __assign({}, _transaction);
        var payouts = transaction.payouts;
        return new Promise(function (resolve, reject) {
            var _loop_2 = function (i) {
                var payout = payouts[i].request;
                if (payout.metadata.executed == false)
                    _this.create_payout(payout).then(function (res) {
                        payouts[i].response = res;
                        if (_this.are_payouts_done(transaction.payouts)) {
                            transaction.payouts_executed = true;
                            resolve(transaction);
                        }
                    }).catch(function (error) {
                        console.error(error);
                        payouts[i].response = error;
                        if (_this.are_payouts_done(transaction.payouts)) {
                            transaction.payouts_executed = true;
                            resolve(transaction);
                        }
                    });
                payout.metadata.executed = true;
            };
            for (var i = 0; i < payouts.length; i++) {
                _loop_2(i);
            }
        });
    };
    TransactionService.prototype._execute_update_payments = function (_transaction) {
        var _this = this;
        var transaction = __assign({}, _transaction);
        var payments = transaction.payments;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var paymentSrv, _loop_3, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paymentSrv = new payment_1.PaymentService();
                        if (transaction.execute_payments == false) {
                            resolve(transaction);
                            return [2];
                        }
                        _loop_3 = function (i) {
                            var payment;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        payment = payments[i].response;
                                        if (!(payment && payment.body && payment.body.status.status == "SUCCESS")) return [3, 2];
                                        return [4, paymentSrv.get_payment(payment.body.data.id).then(function (res) {
                                                payments[i].response = res;
                                            }).catch(function (error) {
                                                console.error(error);
                                                payments[i].response = error;
                                            })];
                                    case 1:
                                        _b.sent();
                                        _b.label = 2;
                                    case 2: return [2];
                                }
                            });
                        };
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < payments.length)) return [3, 4];
                        return [5, _loop_3(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4:
                        if (this.are_payments_done(transaction.payments)) {
                            transaction.payments_executed = true;
                        }
                        resolve(transaction);
                        return [2];
                }
            });
        }); });
    };
    TransactionService.prototype._execute_update_payouts = function (_transaction) {
        var _this = this;
        var transaction = __assign({}, _transaction);
        var payouts = transaction.payouts;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var payoutSrv, _loop_4, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payoutSrv = new payout_1.PayoutService();
                        if (transaction.execute_payouts == false) {
                            resolve(transaction);
                            return [2];
                        }
                        _loop_4 = function (i) {
                            var payout;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        payout = payouts[i].response;
                                        if (!(payout && payout.body && payout.body.status.status == "SUCCESS")) return [3, 2];
                                        return [4, payoutSrv.get_payout(payout.body.data.id).then(function (res) {
                                                payouts[i].response = res;
                                            }).catch(function (error) {
                                                console.error(error);
                                                payouts[i].response = error;
                                            })];
                                    case 1:
                                        _b.sent();
                                        _b.label = 2;
                                    case 2: return [2];
                                }
                            });
                        };
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < payouts.length)) return [3, 4];
                        return [5, _loop_4(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4:
                        if (this.are_payouts_done(transaction.payouts)) {
                            transaction.payouts_executed = true;
                        }
                        resolve(transaction);
                        return [2];
                }
            });
        }); });
    };
    TransactionService.prototype.are_payments_done = function (payments) {
        var requests = payments.filter(function (p) { return (p.request && p.request != {}); });
        var responses = payments.filter(function (p) { return (p.response && p.response != {}); });
        return responses.length == requests.length;
    };
    TransactionService.prototype.are_payouts_done = function (payoutss) {
        var requests = payoutss.filter(function (p) { return (p.request && p.request != {}); });
        var responses = payoutss.filter(function (p) { return (p.response && p.response != {}); });
        return responses.length == requests.length;
    };
    TransactionService.prototype.create_payment = function (payment) {
        var paymentSrv = new payment_1.PaymentService();
        return new Promise(function (resolve, reject) {
            paymentSrv.create_payment(payment).then(function (res) {
                resolve(res);
            }).catch(function (error) {
                console.error(error);
                reject(error);
            });
        });
    };
    TransactionService.prototype.create_payout = function (payout) {
        var payoutSrv = new payout_1.PayoutService();
        return new Promise(function (resolve, reject) {
            payoutSrv.create_payout(payout).then(function (res) {
                resolve(res);
            }).catch(function (error) {
                console.error(error);
                reject(error);
            });
        });
    };
    return TransactionService;
}());
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.js.map