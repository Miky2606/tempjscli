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
const init_1 = require("./controller/init");
const upload_1 = require("./controller/upload/upload");
const download_1 = require("./controller/download/download");
const { program } = require("commander");
const clc = require("cli-color");
program
    .description("Welcome to lazytempjs")
    .option("-u,--upload <char>", "Upload a template")
    .option("-n , --name <char>", "Set the template name")
    .option("-d, --download <char>", "Download Template")
    .option("-i, --init", "Init The template s")
    .action((option) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (option.upload !== undefined && option.download === undefined) {
            if (option.upload === undefined)
                return console.error(clc.red("For the upload template you must provide your code auth with after  the command -u or --upload"));
            if (option.name === undefined)
                return console.log(clc.red("For the upload template you must provide a name with the command -n or --name"));
            yield (0, upload_1.upload_init)(option.upload, option.name);
        }
        //Download
        if (option.download !== undefined) {
            console.log(option.download);
            yield (0, download_1.download_init)(option.download, option.name);
        }
        //Init
        if (option.init) {
            (0, init_1.createInit)();
        }
        console.log(process.exit());
    }
    catch (error) {
        return console.error(clc.red(error));
    }
}));
program.parse(process.argv);
//# sourceMappingURL=index.js.map