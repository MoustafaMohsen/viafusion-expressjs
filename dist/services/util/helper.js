"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperService = void 0;
var HelperService = (function () {
    function HelperService() {
    }
    HelperService.generate_otp = function () {
        return this.getRandomInt(100000, 999999);
    };
    HelperService.getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    HelperService.select_to_object = function (select_obj) {
        return Object.values(select_obj)[0];
    };
    return HelperService;
}());
exports.HelperService = HelperService;
//# sourceMappingURL=helper.js.map