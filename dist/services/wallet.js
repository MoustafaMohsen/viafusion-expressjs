"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
var api_1 = require("./api");
var WalletService = (function () {
    function WalletService() {
    }
    WalletService.prototype.create_wallet_and_contact = function (wallet) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("user", wallet);
    };
    return WalletService;
}());
exports.WalletService = WalletService;
//# sourceMappingURL=wallet.js.map