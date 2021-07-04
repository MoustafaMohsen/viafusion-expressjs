import { ILogin } from "../../interfaces/db/ilogin";
import { IDBSecurity } from "../../interfaces/db/isecurity";

export class DBSecurity implements IDBSecurity {
    constructor(security?:IDBSecurity) {
        if (security) {
            if (security.login) {
                this.login = {
                    ...this.login,
                    ...security.login
                }
            }
        }
    }
    login: ILogin<any> = {
        authenticated: false,
        // checkes
        otp_passed: false,
        pin_passed: false,
        fp_passed: false,
        device_passed:false,
    
        // has
        has_otp: false,
        has_pin: false,
        has_fp: false,
        has_device: false,
        
        // values
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
}