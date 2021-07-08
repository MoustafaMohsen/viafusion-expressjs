import { MetaContactService } from './metacontact';
import { UserService } from './user';
import { ApiService } from '../api/api';
import { IPayment } from "../../interfaces/rapyd/ipayment";
import { ViafusionDB } from '../db/viafusiondb';
import { IDBSelect } from '../../interfaces/db/select_rows';
import { IAction } from '../../interfaces/db/iaction';
import { TransactionService } from './transaction';

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
    async get_db_actions(minimum_action_object: IAction): Promise<IAction[]> {
        const db = new ViafusionDB();
        let _action: IDBSelect<IAction> = {
            "*": minimum_action_object
        }
        let results = await db.get_object<IAction>(_action, "AND", 'dbaction');
        let metas = results.rows
        let parser = []
        metas.forEach(a => metas.push(this.parse_action(a)))
        return parser

    }

    async delete_db_action(action: IAction) {
        const db = new ViafusionDB();
        let results = await db.delete_object<IAction>(action, "AND", 'dbaction');
        return results;
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

    listen_to_acitons(minutes = 5) {
        setInterval(() => {
            this.scan_actions().catch(
                error=>{
                    console.error(error);
                }
            )
        },
            minutes * 60 * 1000);
    }

    async scan_actions() {
        const db = new ViafusionDB();
        const client = await db.connect('viafusiondb');
        var query = "SELECT * FROM dbaction";
        let result = await client.query<IAction>(query);
        await client.end();

        const actions = result.rows;

        for (let i = 0; i < actions.length; i++) {
            try {
                const a = this.parse_action(actions[i]);
                let date_passed = this.date_passed(a.date, a.every, a.value);

                // if date has passed and done count is less than cound
                if (date_passed && a.done_count < a.count) {
                    console.log("Executing action", a);
                    const metacontactSrv = new MetaContactService();
                    let metacontact = await metacontactSrv.get_db_metacontact({ contact_reference_id: a.contact_reference_id } as any)
                    // find transaction
                    let _transaction = metacontact.transactions.find(t => t.id == a.tran_id);
                    // copy and push transaction to usermeta
                    metacontact.transactions.push(_transaction);
                    // get the new transaction
                    var transaction = metacontact.transactions[metacontact.transactions.length - 1];
                    transaction.id = "tranid_schedualed_" + this.makeid(5);
                    transaction.execute_payments = true;
                    transaction.execute_payouts = true;
                    transaction.description ="SCHADUALED:" +a.meta
                    let tranSrv = new TransactionService();

                    // execute
                    tranSrv.do_payments(a.contact_reference_id, transaction.id).then(re => {
                        console.log("Done: Schadualed do_payments for action", a);

                    }).catch(e => {
                        console.error("Schadualed do_payments error for action", a);
                        console.error(e);
                    })
                    tranSrv.do_payouts(a.contact_reference_id, transaction.id).then(re => {
                        console.log("Done: Schadualed do_payouts for action", a);
                    }).catch(e => {
                        console.error("Schadualed do_payouts error for action", a);
                        console.error(e);
                    })
                    a.done_count = parseInt(a.done_count as any) + 1;
                    a.date = new Date().getTime();
                    this.update_db_action({ id: a.id } as any, a);
                }
            } catch (error) {
                console.log("Action errored=>", actions[i]);
                console.error(error);
            }
        }

    }
    add_hours_to_date(date: Date, hours: number): Date {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }
    add_days_to_date(date: Date, days: number): Date {
        return this.add_hours_to_date(new Date(), days * 24);
    }
    add_weeks_to_date(date: Date, weeks: number): Date {
        return this.add_days_to_date(new Date(), weeks * 7);
    }
    add_months_to_date(date: Date, months: number): Date {
        return this.add_months_to_date(new Date(), months * 30);
    }

    date_passed(_date, every, value) {
        var then: Date;
        // conditions
        switch (every) {
            case 'hour':
                then = this.add_hours_to_date(new Date(), value)
                break;
            case 'day':
                then = this.add_days_to_date(new Date(), value)
                break;
            case 'week':
                then = this.add_weeks_to_date(new Date(), value)
                break;
            case 'month':
                then = this.add_months_to_date(new Date(), value)
                break;
            default:
                break;
        }
        let condition = (new Date().getTime() - then.getTime()) > 0;
        if (condition) {
            console.log("Yes do action");
            return true;
        }
        console.log("No don't do it")
        return false;
    }




    //#region User parser
    prepare_action_for_db(action: IAction) {
        try {
            if (action.meta) action.meta = { data: action.meta } as any;
            return action;
        } catch (error) {
            console.error(error);
            return action
        }
    }
    parse_action(action: IAction) {
        try {
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
    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

}