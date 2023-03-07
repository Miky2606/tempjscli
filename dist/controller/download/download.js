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
exports.download_init = void 0;
const download_controller_1 = require("./download_controller");
const config_1 = __importDefault(require("../config"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const api_controller_1 = require("../api_controller");
const clc = require("cli-color");
const download_init = (name, name_relative) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const resp_template = yield (0, api_controller_1.find_template)(name);
    const route = `${(_a = resp_template.data) === null || _a === void 0 ? void 0 : _a.user[0].name}/${(_b = resp_template.data) === null || _b === void 0 ? void 0 : _b.name}`;
    const update = yield (0, api_controller_1.update_downloads)((_c = resp_template.data) === null || _c === void 0 ? void 0 : _c._id);
    const source = `${process.cwd()}/${name_relative === undefined ? (_d = resp_template.data) === null || _d === void 0 ? void 0 : _d.name : name_relative}`;
    if (resp_template.error !== undefined)
        return console.table(resp_template.error);
    const download = yield (0, download_controller_1.downloadFolderFromS3)(config_1.default.Bucket, route, source);
    if (download) {
        (0, download_controller_1.removeFolderAndFilesEmpty)(source);
        readCommandFile(`${source}/command.json`, name_relative);
        changeNameJSON(`${source}/package.json`, name_relative);
    }
    else
        return console.error("Error in the download");
});
exports.download_init = download_init;
const readCommandFile = (route, name_relative) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(fs_1.default.existsSync(route), route);
        if (fs_1.default.existsSync(route)) {
            const readFile = yield fs_1.default.readFileSync(route);
            let change = JSON.parse(readFile.toString());
            if (name_relative !== undefined)
                change.command.cd = name_relative;
            fs_1.default.writeFileSync(route, JSON.stringify(change));
            let x = "";
            for (const key in change.command) {
                if (x === "") {
                    x = ` ${key} ${change.command[key]}`;
                }
                else {
                    x = `${x} && ${key} ${change.command[key]} `;
                }
            }
            const run = runCommand(x);
            if (!run)
                process.exit(-1);
        }
        console.log(``);
    }
    catch (error) {
        console.log(error);
    }
});
const changeNameJSON = (route, name_relative) => __awaiter(void 0, void 0, void 0, function* () {
    if (fs_1.default.existsSync(route)) {
        const readFile = yield fs_1.default.readFileSync(route);
        let change = JSON.parse(readFile.toString());
        if (name_relative !== undefined) {
            change.name = name_relative;
            yield fs_1.default.writeFileSync(route, JSON.stringify(change));
        }
    }
});
const runCommand = (command) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, child_process_1.execSync)(`${command}`, { stdio: "inherit" });
    }
    catch (error) {
        console.log(clc.red(error));
    }
    return true;
});
//# sourceMappingURL=download.js.map