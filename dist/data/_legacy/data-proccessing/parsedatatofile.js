"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var event_stream_1 = __importDefault(require("event-stream"));
var fs_1 = __importDefault(require("fs"));
var parsedata_1 = __importDefault(require("./parsedata"));
var _ParseToFile = (function (_super) {
    __extends(_ParseToFile, _super);
    function _ParseToFile() {
        return _super.call(this) || this;
    }
    _ParseToFile.prototype.splite_file = function (read_file_path, write_file_path, max_rows_per_file, end_read_at_line, offset, token, line_condition, cb) {
        var lineNr = 0;
        var current_line_per_file = 0;
        var current_file_count = 0;
        var splitted_files_paths = [];
        var read_stream = fs_1.default.createReadStream(read_file_path);
        var current_write_stream;
        line_condition = line_condition ? line_condition : function (line) {
            var _a;
            return line && ((_a = line.match(/,"/g)) === null || _a === void 0 ? void 0 : _a.length) >= 34;
        };
        var prom = new Promise(function (resolve, reject) {
            var parestream = read_stream.pipe(event_stream_1.default.split())
                .pipe(event_stream_1.default.mapSync(function (line) {
                lineNr++;
                current_line_per_file++;
                if (lineNr >= end_read_at_line) {
                    read_stream.emit("end");
                    current_write_stream === null || current_write_stream === void 0 ? void 0 : current_write_stream.emit("end");
                    console.log("stream ended");
                    return;
                }
                if (current_line_per_file >= max_rows_per_file || (offset + 1) == lineNr) {
                    current_line_per_file = 0;
                    if (current_file_count > 0) {
                        current_write_stream === null || current_write_stream === void 0 ? void 0 : current_write_stream.emit("end");
                        current_write_stream === null || current_write_stream === void 0 ? void 0 : current_write_stream.destroy();
                    }
                    var filename = write_file_path + current_file_count;
                    console.log("Creating file: " + filename);
                    splitted_files_paths.push(filename);
                    current_write_stream = fs_1.default.createWriteStream(filename);
                    current_file_count++;
                }
                if (offset < lineNr && lineNr < end_read_at_line + offset) {
                    if (line_condition(line)) {
                        current_write_stream.write(line + "\n");
                    }
                    else {
                        console.error("line number '" + lineNr + "' is invalid");
                        console.error(line);
                    }
                }
            })
                .on('error', function (err) {
                console.log('Error while reading file.', err);
                reject({ error: err, lineNr: lineNr });
            })
                .on('end', function () {
                console.log('Read file, lines count:' + lineNr);
                resolve(splitted_files_paths);
            }));
            token.cancel = function () {
                read_stream.emit("end");
                current_write_stream === null || current_write_stream === void 0 ? void 0 : current_write_stream.emit("end");
                console.log("lineNr", lineNr);
                reject("Cancelled on line:" + lineNr);
            };
        });
        return prom;
    };
    return _ParseToFile;
}(parsedata_1.default));
exports.default = _ParseToFile;
//# sourceMappingURL=parsedatatofile.js.map