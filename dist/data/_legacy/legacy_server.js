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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var viafusiondb_1 = require("./db/viafusiondb");
var perf_hooks_1 = __importDefault(require("perf_hooks"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var pg_1 = require("pg");
var parsedata_1 = __importDefault(require("./data-proccessing/parsedata"));
var parsedatatofile_1 = __importDefault(require("./data-proccessing/parsedatatofile"));
var viafusiondbfromfile_1 = require("./db/viafusiondbfromfile");
var _legacy_server = (function () {
    function _legacy_server(_db) {
        this.client = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            password: '123',
            port: 5432,
        });
        this.app = express_1.default();
        this.port = process.env.NODEJS_PORT || 3005;
        this.db = _db;
    }
    _legacy_server.prototype.init = function () {
        this.app.set('trust proxy', true);
        this.setupMiddleware();
        this.setupRoute();
        this.listen();
    };
    _legacy_server.prototype.setupMiddleware = function () {
        this.app.use(express_1.default.json());
        this.app.use(function (req, res, next) {
            var host = req.hostname;
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            next();
        });
        this.app.options('*');
    };
    _legacy_server.prototype.setupRoute = function () {
        var _this = this;
        function json_type(res) {
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8');
        }
        function send(res, response, t0) {
            var pre = perf_hooks_1.default.performance.now() - t0;
            console.log("-->Request for:'" + res.req.path + "', from client:'" + res.req.ip + "' took:" + pre + "ms");
            if (!res.headersSent) {
                res.send(JSON.stringify({ data: __assign({}, response), performance: pre, success: true }));
            }
            else {
                res.write(JSON.stringify({ data: __assign({}, response), performance: pre, success: true }));
                res.end();
            }
        }
        function err(res, error, t0, statuscode) {
            if (statuscode === void 0) { statuscode = 400; }
            res.status(statuscode);
            var pre = perf_hooks_1.default.performance.now() - t0;
            console.log("-->Request errored for:'" + res.req.path + "', from client:'" + res.req.ip + "' took:" + pre + "ms");
            console.error(error);
            res.send(JSON.stringify({ data: {}, error: error, performance: pre, success: false }));
        }
        function write_and_log(res, msg) {
            console.log(msg);
            res.write(msg);
        }
        this.app.post('/', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response;
            return __generator(this, function (_a) {
                t0 = perf_hooks_1.default.performance.now();
                json_type(res);
                response = {};
                try {
                    send(res, response, t0);
                }
                catch (error) {
                    err(res, error, t0);
                }
                return [2];
            });
        }); });
        this.app.post('/get-rows', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response, body, token, viafusiondb, client, results, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        json_type(res);
                        response = {};
                        body = __assign({ database: "filedb", tablename: "users", values: { "noquery": "no" }, cols: "*", abort_on_cancel: true }, req.body);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        token = {};
                        req.on("close", function () {
                            var _a, _b;
                            write_and_log(res, "connection closed with client:" + req.ip);
                            if (body.abort_on_cancel == false) {
                                (_a = token.cancel) === null || _a === void 0 ? void 0 : _a.call(token);
                                (_b = token.cancel2) === null || _b === void 0 ? void 0 : _b.call(token);
                            }
                        });
                        viafusiondb = new viafusiondb_1._ViafusionDB();
                        return [4, viafusiondb.connect(body.database)];
                    case 2:
                        client = _a.sent();
                        return [4, viafusiondb.get_rows(client, body.tablename, body.cols, body.values, body.relation, token)];
                    case 3:
                        results = _a.sent();
                        response = {
                            rows: results.rows,
                            rowCount: results.rowCount,
                        };
                        send(res, response, t0);
                        return [3, 5];
                    case 4:
                        error_1 = _a.sent();
                        err(res, error_1, t0);
                        return [3, 5];
                    case 5: return [2];
                }
            });
        }); });
        this.app.post('/do-everything', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response, token, viafusiondbfromfile, _a, parsertofile, i, read_path, write_path, t0_1, splitted_files_paths, t1, i_1, file_path, _tq0, _b, _tq1, viafusiondb, i_2, tablename, columname, _t0, client, create_index, _t1, tfinal, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        json_type(res);
                        write_and_log(res, "request started");
                        response = {};
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 16, , 17]);
                        token = {};
                        req.on("close", function () {
                            var _a, _b;
                            write_and_log(res, "connection closed with client:" + req.ip);
                            if (req.body.abort_on_cancel) {
                                (_a = token.cancel) === null || _a === void 0 ? void 0 : _a.call(token);
                                (_b = token.cancel2) === null || _b === void 0 ? void 0 : _b.call(token);
                            }
                        });
                        viafusiondbfromfile = new viafusiondbfromfile_1._ViafusionDBFromFile();
                        _a = response;
                        return [4, viafusiondbfromfile.prepare_init_file_db(req.body.database)];
                    case 2:
                        _a.prepare_init_file_db = _c.sent();
                        parsertofile = new parsedatatofile_1.default();
                        i = 0;
                        _c.label = 3;
                    case 3:
                        if (!(i < req.body.files_paths.length)) return [3, 15];
                        read_path = req.body.files_paths[i].read_path;
                        write_path = req.body.files_paths[i].write_path;
                        t0_1 = perf_hooks_1.default.performance.now();
                        write_and_log(res, "==========>... Doing file:'" + read_path.join("/") + "'");
                        write_and_log(res, "---Splitting files");
                        return [4, parsertofile.splite_file(path_1.default.resolve.apply(path_1.default, __spreadArray([__dirname], read_path)), path_1.default.resolve.apply(path_1.default, __spreadArray([__dirname], write_path)), req.body.max_rows_per_file, req.body.end_read_at_line, req.body.offset, token)];
                    case 4:
                        splitted_files_paths = _c.sent();
                        t1 = perf_hooks_1.default.performance.now();
                        write_and_log(res, "Done 'splite_file' in:'" + (t1 - t0_1) + "ms");
                        i_1 = 0;
                        _c.label = 5;
                    case 5:
                        if (!(i_1 < splitted_files_paths.length)) return [3, 8];
                        file_path = splitted_files_paths[i_1];
                        write_and_log(res, "---> Quering copy on file'" + file_path + "'");
                        _tq0 = perf_hooks_1.default.performance.now();
                        _b = response;
                        return [4, viafusiondbfromfile.start_copy_from_file(file_path, req.body.database)];
                    case 6:
                        _b.start_copy_from_file = _c.sent();
                        _tq1 = perf_hooks_1.default.performance.now();
                        fs_1.default.writeFileSync(file_path, "");
                        write_and_log(res, "---> Done quering copy on file'" + file_path + "' in:'" + (_tq1 - _tq0) + "ms <---");
                        _c.label = 7;
                    case 7:
                        i_1++;
                        return [3, 5];
                    case 8:
                        viafusiondb = new viafusiondb_1._ViafusionDB();
                        response.index_results = [];
                        i_2 = 0;
                        _c.label = 9;
                    case 9:
                        if (!(i_2 < req.body.indexes.length)) return [3, 13];
                        tablename = req.body.indexes[i_2].tablename;
                        columname = req.body.indexes[i_2].columnname;
                        _t0 = perf_hooks_1.default.performance.now();
                        write_and_log(res, "==========>... Doing index for table:'" + tablename + "' for column:'" + columname + "'");
                        write_and_log(res, "-->for table:'" + tablename + "'");
                        write_and_log(res, "-->");
                        return [4, viafusiondb.connect(req.body.database)];
                    case 10:
                        client = _c.sent();
                        return [4, viafusiondb.create_index(client, tablename, columname)];
                    case 11:
                        create_index = _c.sent();
                        response.index_results.push(create_index);
                        _t1 = perf_hooks_1.default.performance.now();
                        write_and_log(res, "Done 'create_index' in:'" + (_t1 - _t0) + "ms");
                        _c.label = 12;
                    case 12:
                        i_2++;
                        return [3, 9];
                    case 13:
                        tfinal = perf_hooks_1.default.performance.now();
                        write_and_log(res, "==========> Done file:'" + read_path.join("/") + "' in:'" + (tfinal - t0_1) + "ms'<==========");
                        _c.label = 14;
                    case 14:
                        i++;
                        return [3, 3];
                    case 15:
                        send(res, response, t0);
                        return [3, 17];
                    case 16:
                        error_2 = _c.sent();
                        err(res, error_2, t0);
                        return [3, 17];
                    case 17: return [2];
                }
            });
        }); });
        this.app.post('/create-indexes', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response, token, viafusiondb, i, tablename, columname, _t0, client, create_index, _t1, tfinal, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        json_type(res);
                        write_and_log(res, "request started");
                        response = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        token = {};
                        req.on("close", function () {
                            var _a, _b;
                            write_and_log(res, "connection closed with client:" + req.ip);
                            if (req.body.abort_on_cancel) {
                                (_a = token.cancel) === null || _a === void 0 ? void 0 : _a.call(token);
                                (_b = token.cancel2) === null || _b === void 0 ? void 0 : _b.call(token);
                            }
                        });
                        viafusiondb = new viafusiondb_1._ViafusionDB();
                        response.results = [];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < req.body.indexes.length)) return [3, 6];
                        tablename = req.body.indexes[i].tablename;
                        columname = req.body.indexes[i].columnname;
                        _t0 = perf_hooks_1.default.performance.now();
                        write_and_log(res, "==========>... Doing index for table:'" + tablename + "' for column:'" + columname + "'");
                        write_and_log(res, "-->for table:'" + tablename + "'");
                        write_and_log(res, "-->");
                        return [4, viafusiondb.connect(req.body.database)];
                    case 3:
                        client = _a.sent();
                        return [4, viafusiondb.create_index(client, tablename, columname)];
                    case 4:
                        create_index = _a.sent();
                        response.results.push(create_index);
                        _t1 = perf_hooks_1.default.performance.now();
                        write_and_log(res, "Done 'create_index' in:'" + (_t1 - _t0) + "ms");
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3, 2];
                    case 6:
                        tfinal = perf_hooks_1.default.performance.now();
                        write_and_log(res, "==========> Done indexing:'' in:'" + (tfinal - t0) + "ms'<==========");
                        send(res, response, t0);
                        return [3, 8];
                    case 7:
                        error_3 = _a.sent();
                        err(res, error_3, t0);
                        return [3, 8];
                    case 8: return [2];
                }
            });
        }); });
        this.app.post('/init-from-file-db', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response, token, viafusiondbfromfile, rows, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        json_type(res);
                        response = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        token = {};
                        req.on("close", function () {
                            var _a;
                            console.log("connection closed with client:" + req.ip);
                            if (req.body.abort_on_cancel) {
                                (_a = token.cancel) === null || _a === void 0 ? void 0 : _a.call(token);
                            }
                        });
                        viafusiondbfromfile = new viafusiondbfromfile_1._ViafusionDBFromFile();
                        return [4, viafusiondbfromfile.prepare_init_file_db(req.body.database)];
                    case 2:
                        rows = _a.sent();
                        response.rows = rows;
                        send(res, response, t0);
                        return [3, 4];
                    case 3:
                        error_4 = _a.sent();
                        err(res, error_4, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/insert-from-file', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response, token, viafusiondbfromfile, rows, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        json_type(res);
                        response = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        token = {};
                        req.on("close", function () {
                            var _a;
                            console.log("connection closed with client:" + req.ip);
                            if (req.body.abort_on_cancel) {
                                (_a = token.cancel) === null || _a === void 0 ? void 0 : _a.call(token);
                            }
                        });
                        viafusiondbfromfile = new viafusiondbfromfile_1._ViafusionDBFromFile();
                        return [4, viafusiondbfromfile.start_copy_from_file(path_1.default.resolve.apply(path_1.default, __spreadArray([__dirname], req.body.filename)), req.body.database)];
                    case 2:
                        rows = _a.sent();
                        response.rows = rows;
                        send(res, response, t0);
                        return [3, 4];
                    case 3:
                        error_5 = _a.sent();
                        err(res, error_5, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/split-file', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response, token, parsertofile, er_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        json_type(res);
                        response = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        token = {};
                        req.on("close", function () {
                            var _a, _b;
                            if (req.body.abort_on_cancel) {
                                (_a = token.cancel) === null || _a === void 0 ? void 0 : _a.call(token);
                                (_b = token.cancel2) === null || _b === void 0 ? void 0 : _b.call(token);
                            }
                        });
                        parsertofile = new parsedatatofile_1.default();
                        return [4, parsertofile.splite_file(path_1.default.resolve.apply(path_1.default, __spreadArray([__dirname], req.body.read_file_path)), path_1.default.resolve.apply(path_1.default, __spreadArray([__dirname], req.body.write_file_path)), req.body.max_rows_per_file, req.body.end_read_at_line, req.body.offset, token)];
                    case 2:
                        _a.sent();
                        send(res, response, t0);
                        return [3, 4];
                    case 3:
                        er_1 = _a.sent();
                        err(res, er_1, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/insert-data', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response, filename, token, parser, viafusiondb, rows, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        json_type(res);
                        response = {};
                        filename = path_1.default.resolve(__dirname, "data", "egypt_all", req.body.filename);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        token = {};
                        req.on("close", function () {
                            var _a, _b;
                            if (req.body.abort_on_cancel) {
                                (_a = token.cancel) === null || _a === void 0 ? void 0 : _a.call(token);
                                (_b = token.cancel2) === null || _b === void 0 ? void 0 : _b.call(token);
                            }
                        });
                        parser = new parsedata_1.default();
                        viafusiondb = new viafusiondb_1._ViafusionDB();
                        return [4, parser.read_and_insert_rows(viafusiondb, filename, req.body.max_rows_count, req.body.offset, req.body.take_a_rest_every, token, function (inset, queried) { res.write(JSON.stringify({ inset: inset, queried: queried })); })];
                    case 2:
                        rows = _a.sent();
                        response.rows = rows;
                        send(res, response, t0);
                        return [3, 4];
                    case 3:
                        error_6 = _a.sent();
                        err(res, error_6, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/read-file', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response, token, filename, parser, rows_1, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        json_type(res);
                        response = {};
                        token = {};
                        req.on("close", function () {
                            var _a, _b;
                            if (req.body.abort_on_cancel) {
                                (_a = token.cancel) === null || _a === void 0 ? void 0 : _a.call(token);
                                (_b = token.cancel2) === null || _b === void 0 ? void 0 : _b.call(token);
                            }
                        });
                        filename = path_1.default.resolve(__dirname, "data", "egypt_all", "1.csv");
                        parser = new parsedata_1.default();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        rows_1 = [];
                        return [4, parser.get_rows(filename, req.body.count || 500, req.body.offset || 500, token, function (row) { return rows_1.push; })];
                    case 2:
                        _a.sent();
                        response.rows = rows_1;
                        send(res, response, t0);
                        return [3, 4];
                    case 3:
                        error_7 = _a.sent();
                        err(res, error_7, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/get-where-col', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response, parser, filename, token, rows, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        json_type(res);
                        response = {};
                        parser = new parsedata_1.default();
                        filename = path_1.default.resolve(__dirname, "data", "egypt_all", "1.csv");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        token = {};
                        req.on("close", function () {
                            token.cancel();
                        });
                        return [4, parser.get_where_col(filename, req.body.col_number || 2, req.body.count || 50, req.body.offset || 0, token)];
                    case 2:
                        rows = _a.sent();
                        response.rows = rows;
                        send(res, response, t0);
                        return [3, 4];
                    case 3:
                        error_8 = _a.sent();
                        err(res, error_8, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
        this.app.post('/init-db', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, response, _a, _b, error_9;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        t0 = perf_hooks_1.default.performance.now();
                        json_type(res);
                        response = {};
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _a = response;
                        _b = [{}];
                        return [4, this.db.PrepareDB(req.body.database)];
                    case 2:
                        _a.result = __assign.apply(void 0, _b.concat([(_c.sent())]));
                        send(res, response, t0);
                        return [3, 4];
                    case 3:
                        error_9 = _c.sent();
                        err(res, error_9, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
    };
    _legacy_server.prototype.listen = function () {
        var _this = this;
        this.app.listen(this.port, function () {
            console.log("==== This is Viafusion app ====");
            console.log("App listening at http://localhost:" + _this.port);
        });
    };
    return _legacy_server;
}());
exports.default = _legacy_server;
//# sourceMappingURL=legacy_server.js.map