"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_init_1 = __importDefault(require("./server/core/server-init"));
try {
    var server = new server_init_1.default();
    server.init();
}
catch (error) {
    console.log(error);
}
//# sourceMappingURL=index.js.map