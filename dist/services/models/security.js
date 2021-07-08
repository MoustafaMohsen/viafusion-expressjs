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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBSecurity = void 0;
var DBSecurity = (function () {
    function DBSecurity(security) {
        this.login = {
            authenticated: false,
            otp_passed: false,
            pin_passed: false,
            fp_passed: false,
            device_passed: false,
            has_otp: false,
            has_pin: false,
            has_fp: false,
            has_device: false,
            _otp_value: null,
            _pin_value: null,
            _fp_value: null,
            _device_value: null,
            user_registred: false,
            user_verified: false,
            resend_otp_after: 60,
            data: null,
            _sandbox: true,
        };
        if (security) {
            if (security.login) {
                this.login = __assign(__assign({}, this.login), security.login);
            }
        }
    }
    return DBSecurity;
}());
exports.DBSecurity = DBSecurity;
//# sourceMappingURL=security.js.map