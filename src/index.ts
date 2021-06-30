import ViafusionServer from "./server/server-init";
try {
    const server = new ViafusionServer();
    server.init();
    
} catch (error) {
    console.log(error);
    
}