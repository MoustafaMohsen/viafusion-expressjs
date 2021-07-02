import { IDBSelect } from "../../interfaces/db/select_rows";

export class HelperService {
    static generate_otp(){
        return this.getRandomInt(100000,999999);
    }
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static select_to_object<T>(select_obj:IDBSelect<T>){
        return Object.values(select_obj)[0]
    }
}