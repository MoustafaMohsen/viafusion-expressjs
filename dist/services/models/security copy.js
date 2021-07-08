"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBSecurity = void 0;
var DBSecurity = (function () {
    function DBSecurity(security) {
        this.login = {
            authenticated: false,
            otp_passed: false,
            pin_passed: false,
            pf_passed: false,
            has_otp: false,
            has_pin: false,
            has_pf: false,
            _otp_value: null,
            _pin_value: null,
            _fp_value: null,
            user_registred: false,
            user_verified: false,
            resend_otp_after: 60,
            data: null,
            _sandbox: true,
        };
        if (security) {
            if (security.login) {
                this.login = security.login;
            }
        }
    }
    return DBSecurity;
}());
exports.DBSecurity = DBSecurity;
//# sourceMappingURL=security%20copy.js.map