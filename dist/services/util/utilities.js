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
exports.RapydUtilties = void 0;
var crypto = require('crypto');
var https_1 = __importDefault(require("https"));
var access_key = process.env.RAPYD_ACCESS_KEY;
var secretKey = process.env.RAPYD_SECRET_KEY;
var log = true;
var RapydUtilties = (function () {
    function RapydUtilties() {
    }
    RapydUtilties.prototype.makeRequest = function (method, urlPath, body) {
        if (body === void 0) { body = null; }
        return __awaiter(this, void 0, void 0, function () {
            var hostname, path, salt, idempotency, timestamp, signature, options, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        hostname = "sandboxapi.rapyd.net";
                        path = urlPath;
                        salt = this.generateRandomString(8);
                        idempotency = new Date().getTime().toString();
                        timestamp = Math.round(new Date().getTime() / 1000);
                        signature = this.sign(method, path, salt, timestamp, body);
                        options = {
                            hostname: hostname,
                            port: 443,
                            path: path,
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                salt: salt,
                                timestamp: timestamp,
                                signature: signature,
                                access_key: access_key,
                                idempotency: idempotency
                            }
                        };
                        return [4, this.httpRequest(options, body)];
                    case 1: return [2, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error generating request options");
                        throw error_1;
                    case 3: return [2];
                }
            });
        });
    };
    RapydUtilties.prototype.sign = function (method, urlPath, salt, timestamp, body) {
        try {
            var bodyString = "";
            if (body) {
                bodyString = JSON.stringify(body);
                bodyString = bodyString == "{}" ? "" : bodyString;
            }
            var toSign = method.toLowerCase() + urlPath + salt + timestamp + access_key + secretKey + bodyString;
            log && console.log("toSign: " + toSign);
            var hash = crypto.createHmac('sha256', secretKey);
            hash.update(toSign);
            var signature = Buffer.from(hash.digest("hex")).toString("base64");
            log && console.log("signature: " + signature);
            return signature;
        }
        catch (error) {
            console.error("Error generating signature");
            throw error;
        }
    };
    RapydUtilties.prototype.generateRandomString = function (size) {
        try {
            return crypto.randomBytes(size).toString('hex');
        }
        catch (error) {
            console.error("Error generating salt");
            throw error;
        }
    };
    RapydUtilties.prototype.httpRequest = function (options, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        try {
                            var bodyString = "";
                            if (body) {
                                bodyString = JSON.stringify(body);
                                bodyString = bodyString == "{}" ? "" : bodyString;
                            }
                            log && console.log("httpRequest options: " + JSON.stringify(options));
                            var req = https_1.default.request(options, function (res) {
                                var response = {
                                    statusCode: res.statusCode,
                                    headers: res.headers,
                                    body: ''
                                };
                                res.on('data', function (data) {
                                    response.body += data;
                                });
                                res.on('end', function () {
                                    response.body = response.body ? JSON.parse(response.body) : {};
                                    log && console.log("httpRequest response: " + JSON.stringify(response));
                                    if (response.statusCode !== 200) {
                                        return reject(response);
                                    }
                                    return resolve(response);
                                });
                            });
                            req.on('error', function (error) {
                                return reject(error);
                            });
                            req.write(bodyString);
                            req.end();
                        }
                        catch (err) {
                            return reject(err);
                        }
                    })];
            });
        });
    };
    return RapydUtilties;
}());
exports.RapydUtilties = RapydUtilties;
//# sourceMappingURL=utilities.js.map