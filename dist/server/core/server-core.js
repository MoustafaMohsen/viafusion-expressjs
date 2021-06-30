"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ViafusionServerCore = (function () {
    function ViafusionServerCore() {
        this.app = express_1.default();
        this.port = process.env.NODEJS_PORT || 3005;
    }
    ViafusionServerCore.prototype.setupMiddleware = function () {
        this.app.set('trust proxy', true);
        this.app.use(express_1.default.json());
        this.app.use(function (req, res, next) {
            var host = req.hostname;
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8');
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            next();
        });
        this.app.options('*');
    };
    ViafusionServerCore.prototype.listen = function () {
        var _this = this;
        this.app.listen(this.port, function () {
            console.log("==== This is Viafusion app ====");
            console.log("App listening at http://localhost:" + _this.port);
        });
    };
    return ViafusionServerCore;
}());
exports.default = ViafusionServerCore;
//# sourceMappingURL=server-core.js.map