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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
var axios_1 = __importDefault(require("axios"));
var crypto_js_1 = __importDefault(require("crypto-js"));
var ApiService = (function () {
    function ApiService() {
        this.base_uri = "https://sandboxapi.rapyd.net/v1";
    }
    ApiService.prototype.get_auth = function (path, method, body) {
        var rapyd_secret_key = "3b0dafc63e76c830bf37a1d9e2ad87f7812f669f26aa0fb06647235d3905d70ddf4174ebfb141e9d";
        var rapyd_access_key = "2BD4532374A630BAACA9";
        var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
        var signature_salt = crypto_js_1.default.lib.WordArray.random(12);
        if (body !== '{}' && body !== '' && typeof body !== 'object') {
            body = JSON.stringify(JSON.parse(body));
        }
        var to_sign = method.toLocaleLowerCase() +
            path.toLocaleLowerCase() +
            signature_salt +
            timestamp +
            rapyd_access_key +
            rapyd_secret_key +
            body;
        console.log("to_sign " + to_sign);
        var rapyd_signature = crypto_js_1.default.enc.Hex.stringify(crypto_js_1.default.HmacSHA256(to_sign, rapyd_secret_key));
        rapyd_signature = crypto_js_1.default.enc.Base64.stringify(crypto_js_1.default.enc.Utf8.parse(rapyd_signature));
        console.log("rapyd_signature " + rapyd_signature);
        return {
            rapyd_secret_key: rapyd_secret_key, rapyd_access_key: rapyd_access_key, signature_salt: signature_salt, rapyd_signature: rapyd_signature
        };
    };
    ApiService.prototype.post = function (path, body) {
        var myheaders = this.get_auth("v1" + path, "post", body);
        var param = {
            headers: __assign({}, myheaders)
        };
        var url = this.base_uri + path;
        return new Promise(function (resolve, reject) {
            axios_1.default({
                method: 'post',
                url: url,
                headers: __assign({}, myheaders)
            })
                .then(function (res) {
                console.log(res);
                resolve(res);
            })
                .catch(function (err) {
                console.error(err);
                reject(err);
            });
        });
    };
    return ApiService;
}());
exports.ApiService = ApiService;
//# sourceMappingURL=api.js.map