"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutService = void 0;
var api_1 = require("../api/api");
var PayoutService = (function () {
    function PayoutService() {
    }
    PayoutService.prototype.list_payout_methods = function (country) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.get("payout_methods/country?country=" + country);
    };
    PayoutService.prototype.payout_method_required_fields = function (payout_method_type) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.get("payout_methods/required_fields/" + payout_method_type);
    };
    PayoutService.prototype.create_payout = function (create_payout_object) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("payouts", create_payout_object);
    };
    PayoutService.prototype.get_payout = function (payout_id) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.get("payouts/" + payout_id);
    };
    PayoutService.prototype.compelete_payout = function (payout_id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.get_payout(payout_id).then(function (res) {
                var payout = res.body.data;
                if (payout.status == "CLO") {
                    resolve(payout);
                    return;
                }
                var id = payout.id;
                var request = {
                    token: id
                };
                if (payout.payout_method_type_category == "bank_transfer") {
                    request.param1 = payout.amount;
                }
                if (payout.payout_method_type_category == "bank_redirect") {
                    request.param1 = "rapyd";
                    request.param2 = "success";
                }
                var apiSrv = new api_1.ApiService();
                apiSrv.post("payouts/completepayout", request).then(function (res) {
                    var payout = res.body.data;
                    resolve(payout);
                }).catch(function (error) {
                    console.error(error);
                    reject(error);
                });
            }).catch(function (error) {
                console.error(error);
                reject(error);
            });
        });
    };
    return PayoutService;
}());
exports.PayoutService = PayoutService;
//# sourceMappingURL=payment%20copy.js.map