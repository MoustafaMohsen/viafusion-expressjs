import { ActionService } from './services/models/action';
import ViafusionServer from "./server/core/server-init";

try {
    const server = new ViafusionServer();
    server.init();
    const actionSrv = new ActionService();
    actionSrv.listen_to_acitons(parseInt(process.env.EXECUTE_ACTIONS_EVERY || '5'));
     
} catch (error) {
    console.log(error);
    
}