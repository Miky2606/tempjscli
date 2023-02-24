#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
const upload_controller_1 = require("./controller/upload_controller");
const api_controller_1 = require("./controller/api_controller");
const { program } = require("commander");
const clc = require("cli-color");
program
    .description("Welcome to lazytempjs")
    .option("-u,--upload <char>", "Upload a template")
    .option("-n , --name <char>", "Set the template name")
    .option("-d, --download <char>", "Download Template")
    .action((option) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (option.upload !== undefined && option.download === undefined) {
        if (option.upload === undefined)
            return console.error(clc.red("For the upload template you must provide your code auth with after  the command -u or --upload"));
        if (option.name === undefined)
            return console.log(clc.red("For the upload template you must provide a name with the command -n or --name"));
        const resp = yield (0, api_controller_1.upload_template)(option.upload, option.name);
        const route = `C:/Users/Jonathan/Desktop/tempjs/user/${(_a = resp.data) === null || _a === void 0 ? void 0 : _a.name}/${option.name}`;
        if (resp.error === undefined)
            return (0, upload_controller_1.findFile)(route, process.cwd(), "Successfully uploaded", "upload");
        return console.log(resp);
    }
    if (option.download !== undefined) {
        const resp_template = yield (0, api_controller_1.find_template)(option.download);
        const route = `C:/Users/Jonathan/Desktop/tempjs/user/${(_b = resp_template.data) === null || _b === void 0 ? void 0 : _b.user[0].name}/${(_c = resp_template.data) === null || _c === void 0 ? void 0 : _c.name}`;
        return (0, upload_controller_1.findFile)(`${process.cwd()}/${(_d = resp_template.data) === null || _d === void 0 ? void 0 : _d.name}`, route, "Successfylly download", "download");
    }
}));
program.parse(process.argv);
//# sourceMappingURL=index.js.map