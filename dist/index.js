"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var action_1 = require("./services/models/action");
var server_init_1 = __importDefault(require("./server/core/server-init"));
try {
    var server = new server_init_1.default();
    server.init();
    var actionSrv = new action_1.ActionService();
    actionSrv.listen_to_acitons(parseInt(process.env.EXECUTE_ACTIONS_EVERY_MINUTES || '5'));
}
catch (error) {
    console.log(error);
}
//# sourceMappingURL=index.js.map