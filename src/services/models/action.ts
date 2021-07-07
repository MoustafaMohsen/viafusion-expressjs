import { ApiService } from '../api/api';
import { IPayment } from "../../interfaces/rapyd/ipayment";
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';
import { IAction } from '../../interfaces/db/iaction';

export class ActionService {
    constructor() { }

    async get_db_action(minimum_action_object: IAction) {
        const db = new ViafusionDB();
        let _action: IDBSelect<IAction> = {
            "*": minimum_action_object
        }
        let results = await db.get_object<IAction>(_action, "AND", 'dbaction');
        let meta = results.rows[0]
        let parser = this.parse_action(meta);
        return parser

    }

    async update_db_action(action: IAction, newaction: IAction) {
        const db = new ViafusionDB();
        newaction = this.prepare_action_for_db(newaction);
        let results = await db.update_object<IAction>(newaction, { id: action.id } as any, 'dbaction');
        let result = await this.get_db_action({ id: action.id } as any);
        return result;
    }

    async create_db_action(action: IAction) {
        const db = new ViafusionDB();
        let metaresult = await db.insert_object(action, 'dbaction');
        let result = await this.get_db_action({ id: metaresult.rows[0].id } as any);
        return result;
    }



    //#region User parser
    prepare_action_for_db(action: IAction) {
        try {
            if (action.transaction) action.transaction = { data: action.transaction } as any;
            if (action.meta) action.meta = { data: action.meta } as any;
            return action;
        } catch (error) {
            console.error(error);
            return action
        }
    }
    parse_action(action: IAction) {
        try {
            action.transaction = this.parse_meta(action.transaction) as any || [];
            action.meta = this.parse_meta(action.meta) as any || [];
            return action;
        } catch (error) {
            console.error(error);
            return action
        }
    }

    parse_meta(str: any) {
        let temp = str;
        try {
            temp = JSON.parse(str);
        } catch (error) {
            console.error(error);
            temp = str;
        }
        return temp.data;
    }

}