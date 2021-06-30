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
var api_1 = require("./../services/api");
var perf_hooks_1 = __importDefault(require("perf_hooks"));
var server_core_1 = __importDefault(require("./core/server-core"));
var makeRequest = require('../services/utitlies').makeRequest;
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
        this.app.post('/list-countries', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var t0, data, api, body, result, error_1;
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
                        return [4, makeRequest('GET', '/v1/data/countries')];
                    case 2:
                        result = _a.sent();
                        send(res, data, t0);
                        return [3, 4];
                    case 3:
                        error_1 = _a.sent();
                        err(res, error_1, t0);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); });
    };
    return ViafusionServerRoutes;
}(server_core_1.default));
exports.default = ViafusionServerRoutes;
//# sourceMappingURL=server-routes.js.map