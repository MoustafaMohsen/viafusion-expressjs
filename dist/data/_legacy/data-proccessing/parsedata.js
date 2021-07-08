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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var event_stream_1 = __importDefault(require("event-stream"));
var perf_hooks_1 = __importDefault(require("perf_hooks"));
var fs_1 = __importDefault(require("fs"));
var fast_csv_1 = require("fast-csv");
var _PareseData = (function () {
    function _PareseData() {
    }
    _PareseData.prototype.start_reading = function (filepath, callback) {
        var _this = this;
        var lineNr = 0;
        this.stream = fs_1.default.createReadStream(filepath);
        return new Promise(function (resolve, reject) {
            fast_csv_1.parseStream(_this.stream)
                .on('data', function (row) {
                lineNr += 1;
                callback(row, lineNr);
            })
                .on('error', function (err) {
                console.log('Error while reading file.', err);
                reject({ error: err, lineNr: lineNr });
            })
                .on('end', function () {
                console.log('Read entire file.');
                resolve(lineNr);
            });
        });
    };
    _PareseData.prototype.get_rows = function (filepath, maxLine, offset, token, cb) {
        if (maxLine === void 0) { maxLine = 100; }
        if (offset === void 0) { offset = 0; }
        if (token === void 0) { token = {}; }
        this.stream = fs_1.default.createReadStream(filepath);
        return this.userParser(this.stream, maxLine, offset, token, cb);
    };
    _PareseData.prototype.userStream = function (stream, maxLine, offset, token) {
        if (maxLine === void 0) { maxLine = 100; }
        if (offset === void 0) { offset = 0; }
        if (token === void 0) { token = {}; }
        var rows = [];
        var lineNr = 0;
        var parser = fast_csv_1.parse({ headers: false });
        parser.on("data", rows.push);
        var prom = new Promise(function (resolve, reject) {
            var parestream = stream.pipe(event_stream_1.default.split())
                .pipe(event_stream_1.default.mapSync(function (line) {
                if (lineNr >= maxLine) {
                    stream.emit("close");
                    stream.emit("end");
                    stream.destroy();
                    console.log("destroyed stream");
                }
                if (offset <= lineNr && lineNr < maxLine) {
                    lineNr += 1;
                    parser.write(line);
                }
            })
                .on('error', function (err) {
                console.log('Error while reading file.', err);
                reject({ error: err, lineNr: lineNr });
                throw err;
            })
                .on('end', function () {
                console.log('Read entire file, lines count:' + lineNr);
                parser.end();
                resolve(rows);
            }));
            token.cancel = function () {
                stream.emit("end");
                console.log("lineNr", lineNr);
                reject("Cancelled on line:" + lineNr);
            };
        });
        return prom;
    };
    _PareseData.prototype.userParser = function (stream, maxLine, offset, token, cb) {
        if (maxLine === void 0) { maxLine = 100; }
        if (offset === void 0) { offset = 0; }
        if (token === void 0) { token = {}; }
        var lineNr = 0;
        var prom = new Promise(function (resolve, reject) {
            var parestream = fast_csv_1.parseStream(stream, { headers: false, skipRows: offset, maxRows: maxLine + 1 })
                .on('data', function (row) {
                lineNr += 1;
                cb(row, parestream);
                if (lineNr >= maxLine) {
                    stream.emit("close");
                    stream.emit("end");
                    parestream.end();
                    parestream.emit("close");
                    parestream.emit("end");
                    stream.destroy();
                    parestream.destroy();
                }
            })
                .on('error', function (err) {
                console.log('Error while reading file.', err);
                reject({ error: err, lineNr: lineNr });
                throw err;
            })
                .on('end', function () {
                resolve(true);
            });
            token.cancel = function () {
                parestream.end();
                parestream.destroy();
                console.log("lineNr", lineNr);
                reject("Cancelled on line:" + lineNr);
            };
        });
        return prom;
    };
    _PareseData.prototype.mapper_as_obj = function (row) {
        var obj = {
            fb_id: row[0],
            email: row[2],
            phone: row[3],
            religion: row[4],
            birthdate: row[5],
            first_name: row[6],
            last_name: row[7],
            gender: row[8],
            fb_link: row[9],
            username: row[11],
            middle: row[12],
            profile_status: row[13],
            job_company: row[14],
            job_title: row[15],
            city: row[16],
            government: row[17],
            collage: row[18],
            fb_email: row[19],
            data: JSON.stringify(row.filter(function (f, i) { return i > 19; })),
        };
        return obj;
    };
    _PareseData.prototype.mapper_as_array = function (row) {
        var arr = [
            row[0],
            row[2],
            row[3],
            row[4],
            row[5],
            row[6],
            row[7],
            row[8],
            row[9],
            row[11],
            row[12],
            row[13],
            row[14],
            row[15],
            row[16],
            row[17],
            row[18],
            row[19],
            JSON.stringify([row[1], row[10], row.filter(function (f, i) { return i > 19; })])
        ];
        return arr;
    };
    Object.defineProperty(_PareseData.prototype, "get_mapper_as_array_cols", {
        get: function () {
            return [
                "fb_id",
                "email",
                "phone",
                "religion",
                "birthdate",
                "first_name",
                "last_name",
                "gender",
                "fb_link",
                "username",
                "middle",
                "profile_status",
                "job_company",
                "job_title",
                "city",
                "government",
                "collage",
                "fb_email",
                "data",
            ];
        },
        enumerable: false,
        configurable: true
    });
    _PareseData.prototype.read_and_insert_rows = function (viafusiondb, filename, max_rows_count, offset, take_a_rest_every, token, progressCallback) {
        if (offset === void 0) { offset = 0; }
        if (take_a_rest_every === void 0) { take_a_rest_every = 5000; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var inserted_rows, queried_rows, last_t0, cols, client, map_and_query, t_get_0, t_get_1;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    inserted_rows = 0;
                                    queried_rows = 0;
                                    last_t0 = perf_hooks_1.default.performance.now();
                                    cols = this.get_mapper_as_array_cols;
                                    return [4, viafusiondb.connect()];
                                case 1:
                                    client = _a.sent();
                                    token.cancel2 = function () {
                                        client ? client.end() : null;
                                        reject("Client Cancled, rows added:" + inserted_rows);
                                    };
                                    map_and_query = function (row, parestream) { return __awaiter(_this, void 0, void 0, function () {
                                        var q, result, last_t1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    row = this.mapper_as_array(row);
                                                    q = viafusiondb.create_insert_query(cols, row);
                                                    client.query(q);
                                                    inserted_rows++;
                                                    if (!(inserted_rows % take_a_rest_every === 0)) return [3, 2];
                                                    parestream.emit("pause");
                                                    parestream.pause();
                                                    console.log("...Inserting:'" + inserted_rows.toLocaleString() + "'");
                                                    return [4, client.query("SELECT COUNT(*) FROM users")];
                                                case 1:
                                                    result = _a.sent();
                                                    queried_rows = parseInt(result.rows[0].count);
                                                    console.log("===> Inserted:" + (queried_rows).toLocaleString() + " ===");
                                                    progressCallback(inserted_rows, queried_rows);
                                                    last_t1 = perf_hooks_1.default.performance.now();
                                                    console.log(((last_t1 - last_t0) / 1000) + " Seconds\n--------");
                                                    last_t0 = perf_hooks_1.default.performance.now();
                                                    parestream.resume();
                                                    parestream.emit("resume");
                                                    _a.label = 2;
                                                case 2: return [2];
                                            }
                                        });
                                    }); };
                                    t_get_0 = perf_hooks_1.default.performance.now();
                                    return [4, this.get_rows(filename, max_rows_count, offset, token, map_and_query)];
                                case 2:
                                    _a.sent();
                                    t_get_1 = perf_hooks_1.default.performance.now();
                                    console.log("getting rows took:" + ((t_get_1 - t_get_0) / 1000) + " Seconds");
                                    resolve(inserted_rows);
                                    return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    _PareseData.prototype.get_where_col = function (filePath, col_number, maxLine, offset, token) {
        var _this = this;
        if (maxLine === void 0) { maxLine = 100; }
        if (offset === void 0) { offset = 0; }
        var rows = [];
        var lineCount = 0;
        var _that = this;
        return new Promise(function (resolve, reject) {
            _this.start_reading(filePath, function (row, lineNr) {
                if (lineCount > maxLine + offset) {
                    _that.stream.close();
                    resolve(rows);
                }
                if (row[col_number]) {
                    if (lineCount >= offset) {
                        rows.push(row);
                        lineCount++;
                    }
                }
                token.cancel = function () {
                    _that.stream.close();
                    console.log("lineNr", lineNr);
                    reject(new Error("Cancelled on line:" + lineNr));
                };
            });
        });
    };
    return _PareseData;
}());
exports.default = _PareseData;
//# sourceMappingURL=parsedata.js.map