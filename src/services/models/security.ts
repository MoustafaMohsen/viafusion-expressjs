import { ILogin } from "../../interfaces/db/ilogin";
import { IDBSecurity } from "../../interfaces/db/isecurity";

export class DBSecurity implements IDBSecurity {
    constructor(security?:IDBSecurity) {
        if (security) {
            if (security.login) {
                this.login = security.login
            }
        }
    }
    login: ILogin<any> = {
        authenticated: false,
        otp_passed: false,
        pf_passed: false,
        pin_passed: false,
        _otp_value: null,
        resend_otp_after: 0,
        user_exsits: false,
        _sandbox: true,
        data: null
    };
}