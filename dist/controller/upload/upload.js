"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.upload_init = void 0;
const api_controller_1 = require("../api_controller");
const upload_controller_1 = require("./upload_controller");
const fs_1 = __importStar(require("fs"));
const upload_init = (code_auth, name) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    getCommandAndReadme(process.cwd());
    const description = yield getDescription(process.cwd());
    const resp = yield (0, api_controller_1.upload_template)(code_auth, name.replace(" ", "-"), !description ? "New Template" : description);
    const route = `${(_a = resp.data) === null || _a === void 0 ? void 0 : _a.user.name}/${name.replace(" ", "-")}`;
    if (resp.error === undefined) {
        const find = yield (0, upload_controller_1.uploadFolderToS3)(route, process.cwd(), (_b = resp.data) === null || _b === void 0 ? void 0 : _b.id);
        return console.log("Uploaded");
    }
    return console.log(resp.error);
});
exports.upload_init = upload_init;
const getDescription = (route) => __awaiter(void 0, void 0, void 0, function* () {
    if (fs_1.default.existsSync(`${route}/command.json`)) {
        const json = JSON.parse(yield (0, fs_1.readFileSync)(`${route}/command.json`).toString());
        return json.description;
    }
    return "";
});
const getCommandAndReadme = (route) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs_1.default.existsSync(`${route}/command.json`) ||
        !fs_1.default.existsSync(`${route}/README.md`)) {
        throw new Error("The command.json and Readme.md both must exist or you can create with tempjs -i or --init");
    }
});
//# sourceMappingURL=upload.js.map