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
exports.ViafusionDB = void 0;
var pg_1 = require("pg");
var ViafusionDB = (function () {
    function ViafusionDB(opts) {
        this.dbsettings = {
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            host: process.env.DATABASE_HOST,
            database: process.env.DATABASE_NAME
        };
        this.amIChecked = false;
        this.dbsettings = __assign(__assign({}, this.dbsettings), opts);
    }
    ViafusionDB.prototype.PrepareDB = function (dbname) {
        if (dbname === void 0) { dbname = "viafusiondb"; }
        return __awaiter(this, void 0, void 0, function () {
            var result, client1, _a, client2, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        result = {};
                        return [4, this.connect()];
                    case 1:
                        client1 = _e.sent();
                        _a = result;
                        return [4, this.createDB(client1, dbname)];
                    case 2:
                        _a.createDB = _e.sent();
                        return [4, client1.end()];
                    case 3:
                        _e.sent();
                        this.dbsettings.database = dbname;
                        return [4, this.connect()];
                    case 4:
                        client2 = _e.sent();
                        _b = result;
                        return [4, this.create_contact_tabel(client2)];
                    case 5:
                        _b.create_contact_tabel = _e.sent();
                        _c = result;
                        return [4, this.create_contactmeta_tabel(client2)];
                    case 6:
                        _c.create_contactmeta_tabel = _e.sent();
                        _d = result;
                        return [4, this.create_action_tabel(client2)];
                    case 7:
                        _d.create_action_tabel = _e.sent();
                        return [4, client2.end()];
                    case 8:
                        _e.sent();
                        delete this.dbsettings.database;
                        console.log("DB is ready");
                        return [2, result];
                }
            });
        });
    };
    ViafusionDB.prototype.create_index = function (client, tablename, columnname) {
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
    ViafusionDB.prototype.connect = function (database) {
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
    ViafusionDB.prototype.createDB = function (client, dbname) {
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
    ViafusionDB.prototype.create_wallet_tabel = function (client, tablename) {
        if (tablename === void 0) { tablename = "dbwallet"; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, client.query("DROP TABLE IF EXISTS " + tablename + ";")];
                    case 1:
                        _a.sent();
                        return [4, client.query("CREATE TABLE IF NOT EXISTS " + tablename + " (\n            ewallet_reference_id SERIAL PRIMARY KEY,\n            id VARCHAR ( 255 ),\n            phone_number VARCHAR ( 255 ) NOT NULL UNIQUE,\n            email VARCHAR ( 255 ),\n            contact_id VARCHAR ( 255 ),\n            contact_reference_id VARCHAR ( 255 ),\n            data TEXT,\n            meta TEXT,\n            security TEXT NOT NULL\n);")];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    ViafusionDB.prototype.create_contact_tabel = function (client, tablename) {
        if (tablename === void 0) { tablename = "dbcontact"; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, client.query("DROP TABLE IF EXISTS " + tablename + ";")];
                    case 1:
                        _a.sent();
                        return [4, client.query("CREATE TABLE IF NOT EXISTS " + tablename + " (\n            contact_reference_id SERIAL PRIMARY KEY,\n            contact VARCHAR ( 255 ),\n            ewallet VARCHAR ( 255 ),\n            customer VARCHAR ( 255 ),\n            verification VARCHAR ( 255 ),\n            rapyd_contact_data TEXT,\n            rapyd_wallet_data TEXT,\n            phone_number VARCHAR ( 255 ) NOT NULL UNIQUE,\n            security TEXT NOT NULL,\n            email VARCHAR ( 255 ),\n            meta TEXT\n);")];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    ViafusionDB.prototype.create_contactmeta_tabel = function (client, tablename) {
        if (tablename === void 0) { tablename = "dbmetacontact"; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, client.query("DROP TABLE IF EXISTS " + tablename + ";")];
                    case 1:
                        _a.sent();
                        return [4, client.query("CREATE TABLE IF NOT EXISTS " + tablename + " (\n            meta_id SERIAL PRIMARY KEY,\n            contact_reference_id VARCHAR ( 255 ) NOT NULL UNIQUE,\n            transactions TEXT NOT NULL,\n            senders TEXT,\n            benes TEXT,\n            actions TEXT,\n            vcc TEXT,\n            pcc TEXT,\n            meta TEXT\n);")];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    ViafusionDB.prototype.create_action_tabel = function (client, tablename) {
        if (tablename === void 0) { tablename = "dbaction"; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, client.query("DROP TABLE IF EXISTS " + tablename + ";")];
                    case 1:
                        _a.sent();
                        return [4, client.query("CREATE TABLE IF NOT EXISTS " + tablename + " (\n            id SERIAL PRIMARY KEY,\n            active VARCHAR (6) NOT NULL,\n            type VARCHAR (6) NOT NULL,\n            contact_reference_id VARCHAR ( 255 ) NOT NULL,\n            tran_id VARCHAR (16),\n            every  VARCHAR ( 255 ) NOT NULL,\n            date VARCHAR (16) NOT NULL,\n            value VARCHAR (16) NOT NULL,\n            count VARCHAR (16) NOT NULL,\n            done_count VARCHAR (16) NOT NULL,\n            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n            meta TEXT\n);")];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    ViafusionDB.prototype.insertRows = function (tabelname, client, cols, values) {
        return __awaiter(this, void 0, void 0, function () {
            var queries, done;
            return __generator(this, function (_a) {
                queries = this.create_multiple_insert_queries(tabelname, cols, values);
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
    ViafusionDB.prototype.create_multiple_insert_queries = function (tabelname, cols, values_array) {
        var queries = [];
        for (var i = 0; i < values_array.length; i++) {
            var values = values_array[i];
            var query = this.create_insert_query(tabelname, cols, values);
            queries.push(query);
        }
        return queries;
    };
    ViafusionDB.prototype.create_select_query = function (tablename, cols, values, relation) {
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
    ViafusionDB.prototype.create_delete_query = function (tablename, cols, values, relation) {
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
            text: "DELETE  " + _tmp_cols + " FROM " + tablename + " " + _tmp_keys,
            values: equals
        };
        return query;
    };
    ViafusionDB.prototype.create_insert_query = function (tabelname, cols, values) {
        var _tmp_cols_arr = [];
        for (var i = 0; i < cols.length; i++) {
            _tmp_cols_arr.push("$" + (i + 1));
        }
        var _tmp_val_replace = _tmp_cols_arr.join(", ");
        var _tmp_cols = cols.map(function (d) { return d.replace("'", "''"); }).join(", ");
        var query = {
            text: "INSERT INTO " + tabelname + " (" + _tmp_cols + ") VALUES(" + _tmp_val_replace + ") RETURNING contact_reference_id",
            values: values
        };
        return query;
    };
    ViafusionDB.prototype.create_update_query = function (tabelname, object, condition, relation) {
        if (relation === void 0) { relation = "AND"; }
        var equals_keys = Object.keys(object);
        var equals = Object.values(object);
        var _set_string = "";
        var last = 0;
        for (var i = 0; i < equals_keys.length; i++) {
            var key = equals_keys[i];
            var value = object[key];
            _set_string = _set_string + key + ("=$" + (i + 1) + " ") + (i != equals_keys.length - 1 ? ", " : "");
            last = i;
        }
        last++;
        var cond_keys = Object.keys(condition);
        var cond = Object.values(condition);
        var _where_string = cond_keys ? "WHERE " : "";
        for (var i = 0; i < cond_keys.length; i++) {
            var key = cond_keys[i];
            var value = condition[key];
            _where_string = _where_string + key + ("=$" + (i + 1 + last) + " ") + (i != cond_keys.length - 1 ? relation + " " : "");
        }
        var query = {
            text: "UPDATE " + tabelname + " SET " + _set_string + " " + _where_string,
            values: equals.concat(cond)
        };
        return query;
    };
    ViafusionDB.prototype._createOneInsertQuery = function (cols, values) {
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
    ViafusionDB.prototype.insert_object = function (data, tabelname, dbname) {
        if (dbname === void 0) { dbname = "viafusiondb"; }
        return __awaiter(this, void 0, void 0, function () {
            var keys, values, query, client, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = Object.keys(data);
                        values = Object.values(data);
                        query = this.create_insert_query(tabelname, keys, values);
                        return [4, this.connect(dbname)];
                    case 1:
                        client = _a.sent();
                        return [4, client.query(query)];
                    case 2:
                        result = _a.sent();
                        return [4, client.end()];
                    case 3:
                        _a.sent();
                        return [2, result];
                }
            });
        });
    };
    ViafusionDB.prototype.update_object = function (data, condition, tabelname, dbname) {
        if (dbname === void 0) { dbname = "viafusiondb"; }
        return __awaiter(this, void 0, void 0, function () {
            var query, client, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.create_update_query(tabelname, data, condition);
                        return [4, this.connect(dbname)];
                    case 1:
                        client = _a.sent();
                        return [4, client.query(query)];
                    case 2:
                        result = _a.sent();
                        return [4, client.end()];
                    case 3:
                        _a.sent();
                        return [2, result];
                }
            });
        });
    };
    ViafusionDB.prototype.get_object = function (data, relation, tabelname, dbname) {
        if (dbname === void 0) { dbname = "viafusiondb"; }
        return __awaiter(this, void 0, void 0, function () {
            var keys, values, query, client, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = Object.keys(data)[0];
                        values = Object.values(data)[0];
                        query = this.create_select_query(tabelname, keys, values, relation);
                        return [4, this.connect(dbname)];
                    case 1:
                        client = _a.sent();
                        return [4, client.query(query)];
                    case 2:
                        result = _a.sent();
                        return [4, client.end()];
                    case 3:
                        _a.sent();
                        return [2, result];
                }
            });
        });
    };
    ViafusionDB.prototype.delete_object = function (data, relation, tabelname, dbname) {
        if (dbname === void 0) { dbname = "viafusiondb"; }
        return __awaiter(this, void 0, void 0, function () {
            var keys, values, query, client, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = Object.keys(data)[0];
                        values = Object.values(data)[0];
                        query = this.create_delete_query(tabelname, keys, values, relation);
                        return [4, this.connect(dbname)];
                    case 1:
                        client = _a.sent();
                        return [4, client.query(query)];
                    case 2:
                        result = _a.sent();
                        return [4, client.end()];
                    case 3:
                        _a.sent();
                        return [2, result];
                }
            });
        });
    };
    return ViafusionDB;
}());
exports.ViafusionDB = ViafusionDB;
//# sourceMappingURL=viafusiondb.js.map