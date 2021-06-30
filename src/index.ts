import ViafusionServer from "./server/core/server-init";
try {
    const server = new ViafusionServer();
    server.init();
     
} catch (error) {
    console.log(error);
    
}