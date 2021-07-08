"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenderService = void 0;
var user_1 = require("./user");
var api_1 = require("../api/api");
var SenderService = (function () {
    function SenderService() {
    }
    SenderService.prototype.create_sender = function (sender, contact_reference_id) {
        var apiSrv = new api_1.ApiService();
        return new Promise(function (resolve, reject) {
            apiSrv.post("payouts/sender", sender).then(function (resolve) {
                var userSrv = new user_1.UserService();
                userSrv.update_db_user();
            }).catch(reject);
        });
    };
    SenderService.prototype.create_sender_from_contact = function (contact, meta) {
        var sender = this.map_contact_to_sender(contact, meta);
        return this.create_sender(sender, contact.contact_reference_id);
    };
    SenderService.prototype.map_contact_to_sender = function (contact, meta) {
        var sender = __assign({ country: contact.data.country, first_name: contact.data.first_name, last_name: contact.data.last_name, entity_type: "individual", phone_number: contact.phone_number, date_of_birth: contact.data.date_of_birth, address: contact.data.address, identification_type: contact.data.identification_type, identification_value: contact.data.identification_number }, meta);
        return sender;
    };
    return SenderService;
}());
exports.SenderService = SenderService;
//# sourceMappingURL=sender%20copy.js.map