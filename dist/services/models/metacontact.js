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
exports.MetaContactService = void 0;
var viafusiondb_1 = require("../db/viafusiondb");
var metacontact_class_1 = require("./metacontact-class");
var MetaContactService = (function () {
    function MetaContactService() {
    }
    MetaContactService.prototype.get_db_metacontact = function (minimum_metacontact_object) {
        return __awaiter(this, void 0, void 0, function () {
            var db, _metacontact, results, meta, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        _metacontact = {
                            "*": minimum_metacontact_object
                        };
                        return [4, db.get_object(_metacontact, "AND", 'dbmetacontact')];
                    case 1:
                        results = _a.sent();
                        meta = results.rows[0];
                        parser = this.parse_metacontact(meta);
                        return [2, parser];
                }
            });
        });
    };
    MetaContactService.prototype.update_db_metacontact = function (metacontact, newmetacontact) {
        return __awaiter(this, void 0, void 0, function () {
            var db, results, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        newmetacontact = this.prepare_metacontact_for_db(newmetacontact);
                        return [4, db.update_object(newmetacontact, { contact_reference_id: metacontact.contact_reference_id }, 'dbmetacontact')];
                    case 1:
                        results = _a.sent();
                        return [4, this.get_db_metacontact({ contact_reference_id: metacontact.contact_reference_id })];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    MetaContactService.prototype.create_db_metacontact = function (metacontact) {
        return __awaiter(this, void 0, void 0, function () {
            var db, contactmeta, metaresult, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        return [4, new metacontact_class_1.DBMetaContact().get_default(metacontact.contact_reference_id)];
                    case 1:
                        contactmeta = _a.sent();
                        return [4, db.insert_object(contactmeta, 'dbmetacontact')];
                    case 2:
                        metaresult = _a.sent();
                        return [4, this.get_db_metacontact({ contact_reference_id: metaresult.rows[0].contact_reference_id })];
                    case 3:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    MetaContactService.prototype.prepare_metacontact_for_db = function (metacontact) {
        try {
            if (metacontact.senders)
                metacontact.senders = { data: metacontact.senders };
            if (metacontact.benes)
                metacontact.benes = { data: metacontact.benes };
            if (metacontact.transactions)
                metacontact.transactions = { data: metacontact.transactions };
            if (metacontact.actions)
                metacontact.actions = { data: metacontact.actions };
            if (metacontact.vcc)
                metacontact.vcc = { data: metacontact.vcc };
            if (metacontact.pcc)
                metacontact.pcc = { data: metacontact.pcc };
            if (metacontact.meta)
                metacontact.meta = { data: metacontact.meta };
            return metacontact;
        }
        catch (error) {
            console.error(error);
            return metacontact;
        }
    };
    MetaContactService.prototype.parse_metacontact = function (metacontact) {
        try {
            metacontact.transactions = this.parse_meta(metacontact.transactions) || [];
            metacontact.senders = this.parse_meta(metacontact.senders) || [];
            metacontact.benes = this.parse_meta(metacontact.benes) || [];
            metacontact.actions = this.parse_meta(metacontact.actions) || [];
            metacontact.vcc = this.parse_meta(metacontact.vcc) || [];
            metacontact.pcc = this.parse_meta(metacontact.pcc) || [];
            metacontact.meta = this.parse_meta(metacontact.meta) || [];
            return metacontact;
        }
        catch (error) {
            console.error(error);
            return metacontact;
        }
    };
    MetaContactService.prototype.parse_meta = function (str) {
        var temp = str;
        try {
            temp = JSON.parse(str);
        }
        catch (error) {
            console.error(error);
            temp = str;
        }
        return temp.data;
    };
    return MetaContactService;
}());
exports.MetaContactService = MetaContactService;
//# sourceMappingURL=metacontact.js.map