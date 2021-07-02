export interface ILogin<T=any>{
    loggedin:boolean;
    otp_passed?:boolean;
    pin_passed?:boolean;
    pf_passed?:boolean;
    user_created:boolean;
    data?:T
    resend_otp_after:number;
    _otp_value?:number;
}