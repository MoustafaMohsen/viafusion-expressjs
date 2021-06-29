import { ViafusionDB } from './db/viafusiondb';
import ViafusionServer from "./server/server";
try {
    const db = new ViafusionDB();
    const server = new ViafusionServer(db);
    server.init();
    
} catch (error) {
    console.log(error);
    
}