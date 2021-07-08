"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
var utilities_1 = require("../util/utilities");
var ApiService = (function () {
    function ApiService() {
    }
    ApiService.prototype.post = function (path, body) {
        if (body === void 0) { body = null; }
        var rapydUti = new utilities_1.RapydUtilties();
        return rapydUti.makeRequest("POST", '/v1/' + path, body);
    };
    ApiService.prototype.get = function (path) {
        var rapydUti = new utilities_1.RapydUtilties();
        return rapydUti.makeRequest("GET", '/v1/' + path);
    };
    return ApiService;
}());
exports.ApiService = ApiService;
//# sourceMappingURL=api.js.map