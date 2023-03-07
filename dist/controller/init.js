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
exports.createInit = void 0;
const fs_1 = __importDefault(require("fs"));
const clc = require("cli-color");
const archiver = require("archiver");
const path_1 = __importDefault(require("path"));
const json = require("../../command.json");
const readme_1 = require("../readme");
const createInit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templates = [
            {
                name: "command.json",
                content: toStringInit(json),
            },
            {
                name: "README.md",
                content: toStringInit(readme_1.readme),
            },
        ];
        templates.map((e) => {
            if (fs_1.default.existsSync(`${process.cwd()}/${e.name}`))
                console.error(clc.red(`Already exist ${e.name}`));
            fs_1.default.writeFileSync(e.name, e.content);
        });
        return console.log(clc.green("Init Finished"));
    }
    catch (error) {
        console.error(error);
    }
});
exports.createInit = createInit;
const toStringInit = (route) => {
    if (typeof route === "object") {
        if (json.command.cd !== undefined) {
            json.command.cd = path_1.default.basename(process.cwd().replace(" ", "-"));
        }
        return JSON.stringify(json);
    }
    if (typeof route === "string")
        return route;
    return route;
};
//# sourceMappingURL=init.js.map