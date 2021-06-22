import { ViafusionDB } from './viafusiondb';
import ViafusionServer from "./server";
try {
    const db = new ViafusionDB();
    const server = new ViafusionServer(db);
    server.init();
    
} catch (error) {
    console.log(error);
    
}