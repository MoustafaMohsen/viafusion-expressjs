import { IncomingHttpHeaders } from "http";

export interface IUtitliesResponse<T=any>{
    statusCode: number;
    headers: IncomingHttpHeaders;
    body?: IRapydResponse<T>;
}
export interface IRapydResponse<T=any>{    
    status: IRapydStatusResponse,
    data: T
}

export interface IRapydStatusResponse{
    "error_code":string,
    "status": "SUCCESS" | "ERROR",
    "message": string,
    "response_code": string,
    "operation_id": string
}