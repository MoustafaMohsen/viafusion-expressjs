export interface ILogin<T = any> {
    authenticated: boolean;
    // checkes
    otp_passed?: boolean;
    pin_passed?: boolean;
    pf_passed?: boolean;

    // has
    has_otp: boolean;
    has_pin: boolean;
    has_pf: boolean;
    
    // values
    _otp_value?: string;
    _pin_value?: string;
    _fp_value?: string;
    
    user_registred: boolean;
    user_verified: boolean;

    resend_otp_after?: number;

    data?: T
    _sandbox?: boolean;
}
export interface ILOginTransportObj<T> {
    contact_refrence_id: number;
    login: ILogin<T>
}
