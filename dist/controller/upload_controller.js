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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFile = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const clc = require("cli-color");
const findFile = (route, source, message, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (yield fs_1.default.existsSync(route))
            return yield fs_1.default.mkdirSync(route);
        yield fs_1.default.cpSync(source, route, { recursive: true });
        if (type === "download") {
            readCommandFile(`${route}/command.txt`);
        }
        console.log(clc.green(message));
    }
    catch (error) {
        console.log(error);
    }
});
exports.findFile = findFile;
const readCommandFile = (route) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (fs_1.default.existsSync(route)) {
            const read = yield fs_1.default.readFileSync(route);
            const command = read.toString().split("//").join("&&");
            const run = yield runCommand(command);
            if (!run)
                process.exit(-1);
        }
    }
    catch (error) {
        console.log(error);
    }
});
const runCommand = (command) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, child_process_1.execSync)(`${command}`, { stdio: "inherit" });
    }
    catch (error) {
        console.log(clc.red(error));
        return false;
    }
    return true;
});
//# sourceMappingURL=upload_controller.js.map