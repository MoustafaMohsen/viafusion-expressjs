"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var security_1 = require("./security");
var helper_1 = require("./../util/helper");
var viafusiondb_1 = require("../db/viafusiondb");
var UserService = (function () {
    function UserService() {
    }
    UserService.prototype.create_db_user = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var db, results, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        return [4, db.insert_object(user, 'dbcontact')];
                    case 1:
                        results = _a.sent();
                        return [4, this.get_db_user(results.rows[0])];
                    case 2:
                        result = _a.sent();
                        return [4, this.refresh_security(result)];
                    case 3:
                        _a.sent();
                        return [2, result];
                }
            });
        });
    };
    UserService.prototype.get_db_user = function (minimum_user_object) {
        return __awaiter(this, void 0, void 0, function () {
            var db, _user, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        _user = {
                            "*": minimum_user_object
                        };
                        return [4, db.get_object(_user, "AND", 'dbcontact')];
                    case 1:
                        results = _a.sent();
                        return [2, this.parse_user(results.rows[0])];
                }
            });
        });
    };
    UserService.prototype.update_db_user = function (user, newuser) {
        return __awaiter(this, void 0, void 0, function () {
            var db, results, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        return [4, db.update_object(newuser, user, 'dbcontact')];
                    case 1:
                        results = _a.sent();
                        return [4, this.get_db_user(user)];
                    case 2:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    UserService.prototype.login_or_register_to_otp = function (_login) {
        return __awaiter(this, void 0, void 0, function () {
            var user, otp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get_db_user({ phone_number: _login.phone_number })];
                    case 1:
                        user = _a.sent();
                        otp = helper_1.HelperService.generate_otp();
                        if (!user) return [3, 3];
                        return [4, this.set_user_otp({ contact_reference_id: user.contact_reference_id }, otp)];
                    case 2:
                        user = _a.sent();
                        return [2, { login: user.security.login, contact_reference_id: user.contact_reference_id }];
                    case 3: return [4, this.create_db_user(_login)];
                    case 4:
                        user = _a.sent();
                        return [4, this.set_user_otp({ contact_reference_id: user.contact_reference_id }, otp)];
                    case 5:
                        user = _a.sent();
                        return [2, { login: user.security.login, contact_reference_id: user.contact_reference_id }];
                }
            });
        });
    };
    UserService.prototype.set_user_otp = function (minimum_user_object, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var db, user, security, newuser, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        return [4, this.get_db_user(minimum_user_object)];
                    case 1:
                        user = _a.sent();
                        security = this.update_security_otp(user, otp + "");
                        newuser = user;
                        newuser.security = security;
                        newuser.security.login.otp_passed = true;
                        newuser.security.login.has_otp = true;
                        return [4, this.update_db_user({ contact_reference_id: user.contact_reference_id }, newuser)];
                    case 2:
                        updatedUser = _a.sent();
                        return [2, updatedUser];
                }
            });
        });
    };
    UserService.prototype.confirm_user_otp = function (minimum_user_object, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var db, user, updatedUser, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        return [4, this.get_db_user(minimum_user_object)];
                    case 1:
                        user = _a.sent();
                        if (!(user && user.security && user.security.login._otp_value == otp + "")) return [3, 3];
                        user.security.login.otp_passed = true;
                        user.security.login.has_otp = true;
                        return [4, this.update_db_user({ contact_reference_id: user.contact_reference_id }, user)];
                    case 2:
                        updatedUser = _a.sent();
                        return [2, updatedUser];
                    case 3:
                        user.security.login.otp_passed = false;
                        return [4, this.update_db_user({ contact_reference_id: user.contact_reference_id }, user)];
                    case 4:
                        updatedUser = _a.sent();
                        return [2, updatedUser];
                }
            });
        });
    };
    UserService.prototype.update_security_otp = function (user, otp) {
        var security = this.get_user_security(user);
        security.login._otp_value = otp + "";
        return security;
    };
    UserService.prototype.set_user_pin = function (minimum_user_object, pin) {
        return __awaiter(this, void 0, void 0, function () {
            var db, user, security, newuser, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        return [4, this.get_db_user(minimum_user_object)];
                    case 1:
                        user = _a.sent();
                        security = this.update_security_pin(user, pin + "");
                        newuser = user;
                        newuser.security = security;
                        newuser.security.login.pin_passed = true;
                        newuser.security.login.has_pin = true;
                        return [4, this.update_db_user({ contact_reference_id: user.contact_reference_id }, newuser)];
                    case 2:
                        updatedUser = _a.sent();
                        return [2, updatedUser];
                }
            });
        });
    };
    UserService.prototype.confirm_user_pin = function (minimum_user_object, pin) {
        return __awaiter(this, void 0, void 0, function () {
            var db, user, updatedUser, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new viafusiondb_1.ViafusionDB();
                        return [4, this.get_db_user(minimum_user_object)];
                    case 1:
                        user = _a.sent();
                        if (!(user && user.security && user.security.login._pin_value == (pin + ""))) return [3, 3];
                        user.security.login.pin_passed = true;
                        user.security.login.has_pin = true;
                        return [4, this.update_db_user({ contact_reference_id: user.contact_reference_id }, user)];
                    case 2:
                        updatedUser = _a.sent();
                        return [2, updatedUser];
                    case 3:
                        user.security.login.pin_passed = false;
                        return [4, this.update_db_user({ contact_reference_id: user.contact_reference_id }, user)];
                    case 4:
                        updatedUser = _a.sent();
                        return [2, updatedUser];
                }
            });
        });
    };
    UserService.prototype.refresh_security = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user.security = this.get_user_security(user);
                        return [4, this.update_db_user({ contact_reference_id: user.contact_reference_id }, user)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    UserService.prototype.update_security_pin = function (user, pin) {
        var security = this.get_user_security(user);
        security.login._pin_value = pin + "";
        return security;
    };
    UserService.prototype.get_user_security = function (user) {
        var security = new security_1.DBSecurity(user.security);
        try {
            security = typeof security === "string" ? JSON.parse(security) : security;
        }
        catch (error) {
            throw new Error("Security string could not be parsed");
        }
        return security;
    };
    UserService.prototype.parse_user = function (user) {
        try {
            user.security = this.parse_if_string(user.security);
            user.meta = this.parse_if_string(user.meta);
            user.data = this.parse_if_string(user.data);
            return user;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    };
    UserService.prototype.parse_if_string = function (str) {
        var temp = str;
        if (typeof str == "string") {
            temp = JSON.parse(str);
        }
        else {
            temp = str;
        }
        return temp;
    };
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user%20copy.js.map