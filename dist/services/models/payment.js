"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
var api_1 = require("../api/api");
var PaymentService = (function () {
    function PaymentService() {
    }
    PaymentService.prototype.list_payment_methods = function (country) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.get("payment_methods/country?country=" + country);
    };
    PaymentService.prototype.payment_method_required_fields = function (payment_method_type) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.get("payment_methods/required_fields/" + payment_method_type);
    };
    PaymentService.prototype.create_payment = function (create_payment_object) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("payments", create_payment_object);
    };
    PaymentService.prototype.get_payment = function (payment_id) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.get("payments/" + payment_id);
    };
    PaymentService.prototype.generate_chckout_page = function (request) {
        var apiSrv = new api_1.ApiService();
        return apiSrv.post("checkout/", request);
    };
    PaymentService.prototype.complete_payment = function (payment_id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.get_payment(payment_id).then(function (res) {
                var payment = res.body.data;
                if (payment.status == "CLO") {
                    resolve(payment);
                    return;
                }
                var id = payment.id;
                var request = {
                    token: id
                };
                if (payment.payment_method_type_category == "bank_transfer") {
                    request.param1 = payment.amount;
                }
                if (payment.payment_method_type_category == "bank_redirect") {
                    request.param1 = "rapyd";
                    request.param2 = "success";
                }
                var apiSrv = new api_1.ApiService();
                apiSrv.post("payments/completePayment", request).then(function (res) {
                    var payment = res.body.data;
                    resolve(payment);
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
    return PaymentService;
}());
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.js.map