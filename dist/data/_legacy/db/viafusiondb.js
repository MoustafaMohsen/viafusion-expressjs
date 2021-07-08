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
exports._ViafusionDB = void 0;
var pg_1 = require("pg");
var _ViafusionDB = (function () {
    function _ViafusionDB(opts) {
        this.dbsettings = {
            user: 'postgres',
            host: 'localhost',
            password: '123',
            port: 5433,
        };
        this.amIChecked = false;
        this.dbsettings = __assign(__assign({}, this.dbsettings), opts);
    }
    _ViafusionDB.prototype.PrepareDB = function (dbname, tablename) {
        if (dbname === void 0) { dbname = "viafusiondb"; }
        if (tablename === void 0) { tablename = "users"; }
        return __awaiter(this, void 0, void 0, function () {
            var result, client1, _a, client2, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = {};
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
                        this.dbsettings.database = "dbname";
                        return [4, this.connect()];
                    case 4:
                        client2 = _c.sent();
                        _b = result;
                        return [4, this.createTable(client2, tablename)];
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
    _ViafusionDB.prototype.create_index = function (client, tablename, columnname) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "CREATE INDEX idx_" + tablename + "_" + columnname + " \n        ON " + tablename + "(" + columnname + ");";
                        return [4, client.query(query)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    _ViafusionDB.prototype.get_rows = function (client, tablename, cols, values, relation, token) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.create_select_query(tablename, cols, values, relation);
                        console.log(query);
                        token.cancel = function () {
                            client.end();
                        };
                        return [4, client.query(query)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    _ViafusionDB.prototype.create_select_query = function (tablename, cols, values, relation) {
        var equals_keys = Object.keys(values);
        var equals = Object.values(values);
        var _tmp_keys = equals_keys ? "WHERE " : "";
        for (var i = 0; i < equals_keys.length; i++) {
            var key = equals_keys[i];
            var value = values[key];
            _tmp_keys = _tmp_keys + key + ("=$" + (i + 1) + " ") + (i != equals_keys.length - 1 ? relation : "");
        }
        var _tmp_cols = cols ? typeof cols == "string" ? cols : cols.join(", ") : "*";
        var query = {
            text: "SELECT  " + _tmp_cols + " FROM " + tablename + " " + _tmp_keys,
            values: equals
        };
        return query;
    };
    _ViafusionDB.prototype.connect = function (database) {
        return __awaiter(this, void 0, void 0, function () {
            var set, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        set = database ? __assign(__assign({}, this.dbsettings), { database: database }) : this.dbsettings;
                        client = new pg_1.Client(set);
                        return [4, client.connect()];
                    case 1:
                        _a.sent();
                        return [2, client];
                }
            });
        });
    };
    _ViafusionDB.prototype.createDB = function (client, dbname) {
        if (dbname === void 0) { dbname = "viafusiondb"; }
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, client.query("SELECT pg_terminate_backend(pg_stat_activity.pid)\n        FROM pg_stat_activity\n        WHERE pg_stat_activity.datname = '" + dbname + "'\n        AND pid <> pg_backend_pid();")];
                    case 1:
                        _a.sent();
                        return [4, client.query("DROP DATABASE IF EXISTS " + dbname + ";")];
                    case 2:
                        _a.sent();
                        query = "CREATE DATABASE " + dbname;
                        return [4, client.query(query)];
                    case 3:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    _ViafusionDB.prototype.createTable = function (client, tablename) {
        if (tablename === void 0) { tablename = "users"; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, client.query("DROP TABLE IF EXISTS " + tablename + ";")];
                    case 1:
                        _a.sent();
                        return [4, client.query("CREATE TABLE IF NOT EXISTS " + tablename + " (\n            id serial PRIMARY KEY,\n            fb_id VARCHAR ( 255 ),\n            email VARCHAR ( 255 ),\n            phone VARCHAR ( 255 ),\n            religion TEXT,\n            birthdate VARCHAR ( 255 ),\n            first_name VARCHAR ( 255 ),\n            last_name VARCHAR ( 255 ),\n            gender VARCHAR ( 255 ),\n            fb_link VARCHAR ( 255 ),\n            username TEXT,\n            middle TEXT,\n            profile_status TEXT,\n            job_company TEXT,\n            job_title TEXT,\n            city TEXT,\n            government TEXT,\n            collage TEXT, \n            fb_email VARCHAR ( 255 ),\n            data TEXT\n\n);")];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    _ViafusionDB.prototype.insertRows = function (client, cols, values) {
        return __awaiter(this, void 0, void 0, function () {
            var queries, promsies, done;
            return __generator(this, function (_a) {
                queries = this.create_multiple_insert_queries(cols, values);
                promsies = [];
                done = 0;
                new Promise(function (resolve, reject) {
                    var _loop_1 = function (i) {
                        var q = queries[i];
                        client.query(q).then(function (results) {
                            var t = q;
                            done++;
                            if (done == queries.length) {
                                resolve(true);
                            }
                        }, function (err) {
                            console.error(err);
                            console.log(q);
                            reject(err);
                        });
                    };
                    for (var i = 0; i < queries.length; i++) {
                        _loop_1(i);
                    }
                });
                return [2];
            });
        });
    };
    _ViafusionDB.prototype.create_multiple_insert_queries = function (cols, values_array) {
        var queries = [];
        for (var i = 0; i < values_array.length; i++) {
            var values = values_array[i];
            var query = this.create_insert_query(cols, values);
            queries.push(query);
        }
        return queries;
    };
    _ViafusionDB.prototype.create_insert_query = function (cols, values) {
        var _tmp_cols_arr = [];
        for (var i = 0; i < cols.length; i++) {
            _tmp_cols_arr.push("$" + (i + 1));
        }
        var _tmp_val_replace = _tmp_cols_arr.join(", ");
        var _tmp_cols = cols.map(function (d) { return d.replace("'", "''"); }).join(", ");
        var query = {
            text: "INSERT INTO users(" + _tmp_cols + ") VALUES(" + _tmp_val_replace + ")",
            values: values
        };
        return query;
    };
    _ViafusionDB.prototype._createOneInsertQuery = function (cols, values) {
        var _tmp_values_arr = [];
        for (var i = 0; i < values.length; i++) {
            _tmp_values_arr.push("$" + (i + 1));
        }
        var _tmp_cols = cols.map(function (d) { return "'" + d.replace("'", "\\'") + "'"; }).join(", ");
        var _values = values.map(function (v) {
            return "(" + v.map(function (d) { return "'" + d.replace("'", "\\'") + "'"; }).join(", ") + ")";
        }).join(", ");
        var query = "INSERT INTO users(" + _tmp_cols + ") VALUES(" + _values + ")";
        return query;
    };
    return _ViafusionDB;
}());
exports._ViafusionDB = _ViafusionDB;
//# sourceMappingURL=viafusiondb.js.map