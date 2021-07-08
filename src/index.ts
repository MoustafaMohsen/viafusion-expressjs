import { ActionService } from './services/models/action';
import ViafusionServer from "./server/core/server-init";

try {
    const server = new ViafusionServer();
    server.init();
    const actionSrv = new ActionService();
    console.log("===Envs===");
    console.log(process.env.DATABASE_URL)
    console.log(process.env.DATABASE_USER)
    console.log(process.env.DATABASE_PASSWORD)
    console.log(process.env.DATABASE_HOST)
    console.log(process.env.DATABASE_NAME)
    console.log(process.env.EXECUTE_ACTIONS_EVERY_MINUTES)
    
    actionSrv.listen_to_acitons(parseInt(process.env.EXECUTE_ACTIONS_EVERY_MINUTES || '5'));
     
} catch (error) {
    console.log(error);
    
}