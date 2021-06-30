import ViafusionServerRoutes from '../server-routes';


export default class ViafusionServer extends ViafusionServerRoutes {

    init() {
        this.setupMiddleware();
        this.setupRoute();
        this.listen();
    }
}