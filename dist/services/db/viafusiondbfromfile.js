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
exports.ViafusionDBFromFile = void 0;
var viafusiondb_1 = require("./viafusiondb");
var ViafusionDBFromFile = (function (_super) {
    __extends(ViafusionDBFromFile, _super);
    function ViafusionDBFromFile(opts) {
        return _super.call(this, opts) || this;
    }
    ViafusionDBFromFile.prototype.prepare_init_file_db = function (dbname, tablename) {
        if (dbname === void 0) { dbname = "filedb"; }
        if (tablename === void 0) { tablename = "users"; }
        return __awaiter(this, void 0, void 0, function () {
            var result, client1, _a, client2, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = {};
                        delete this.dbsettings.database;
                        return [4, this.connect()];
                    case 1:
                        client1 = _c.sent();
                        _a = result;
                        return [4, this.createDB(client1, dbname)];
                    case 2:
                        _a.createDB = _c.sent();
                        return [4, client1.end()];
                    case 3:
                        _c.sent();
                        this.dbsettings.database = dbname;
                        return [4, this.connect(dbname)];
                    case 4:
                        client2 = _c.sent();
                        _b = result;
                        return [4, this.create_file_table(client2, tablename)];
                    case 5:
                        _b.createTable = _c.sent();
                        return [4, client2.end()];
                    case 6:
                        _c.sent();
                        delete this.dbsettings.database;
                        console.log("DB is ready");
                        return [2, result];
                }
            });
        });
    };
    ViafusionDBFromFile.prototype.start_copy_from_file = function (filepath, database, tabelname) {
        if (tabelname === void 0) { tabelname = "users"; }
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.connect(database)];
                    case 1:
                        client = _a.sent();
                        return [4, this._copy_from_file(client, filepath, tabelname)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ViafusionDBFromFile.prototype.create_file_table = function (client, tablename) {
        if (tablename === void 0) { tablename = "users"; }
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, client.query("DROP TABLE IF EXISTS " + tablename + ";")];
                    case 1:
                        _a.sent();
                        query = "CREATE TABLE IF NOT EXISTS users (\n            id serial PRIMARY KEY,\n            fb_id TEXT,\n            data_1 TEXT,\n            email TEXT,\n            phone TEXT,\n            religion TEXT,\n            birthdate TEXT,\n            first_name TEXT,\n            last_name TEXT,\n            gender TEXT,\n            fb_link TEXT,\n            data_10 TEXT,\n            username TEXT,\n            middle TEXT,\n            profile_status TEXT,\n            job_company TEXT,\n            job_title TEXT,\n            city TEXT,\n            government TEXT,\n            collage TEXT,\n            fb_email VARCHAR ( 255 ),\n            data_20 TEXT,\n            data_21 TEXT,\n            data_22 TEXT,\n            data_23 TEXT,\n            data_24 TEXT,\n            marital_status TEXT,\n            data_26 TEXT,\n            data_27 TEXT,\n            data_28 TEXT,\n            data_29 TEXT,\n            data_30 TEXT,\n            data_31 TEXT,\n            data_32 TEXT,\n            data_33 TEXT,\n            data_34 TEXT\n           );";
                        return [2, client.query(query)];
                }
            });
        });
    };
    ViafusionDBFromFile.prototype._copy_from_file = function (client, filepath, tabelname) {
        if (tabelname === void 0) { tabelname = "users"; }
        var query = "COPY " + tabelname + " (fb_id,data_1,email,phone,religion,birthdate,first_name,last_name,gender,fb_link,data_10,username,middle,profile_status,job_company,job_title,city,government,collage,fb_email,data_20,data_21,data_22,data_23,data_24,marital_status,data_26,data_27,data_28,data_29,data_30,data_31,data_32,data_33,data_34)\n        FROM '" + filepath + "'\n        DELIMITER ',' CSV;\n        ;";
        return client.query(query);
    };
    return ViafusionDBFromFile;
}(viafusiondb_1.ViafusionDB));
exports.ViafusionDBFromFile = ViafusionDBFromFile;
//# sourceMappingURL=viafusiondbfromfile.js.map