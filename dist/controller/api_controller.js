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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_template = exports.update_downloads = exports.upload_template = exports.find_template = exports.find_user = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + "/.env" });
const API_URL = process.env.API_URL || "https://lazytemp.com/api/";
const responseError = (error) => {
    var _a;
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 400)
        return {
            error: error.response.data,
        };
    return {
        error: error.message,
    };
};
const find_user = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const find = yield axios_1.default.get(`${API_URL}/get-code-auth`, {
            headers: {
                code: id,
            },
        });
        return {
            data: find.data.data[0],
        };
    }
    catch (error) {
        if (error instanceof axios_1.default.AxiosError) {
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 400)
                return responseError(error);
        }
        return {
            error: error,
        };
    }
});
exports.find_user = find_user;
const find_template = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = yield axios_1.default.get(`${API_URL}/${id}`, {
            headers: {
                code: id,
            },
        });
        return {
            data: find.data.data[0],
        };
    }
    catch (error) {
        if (error instanceof axios_1.default.AxiosError) {
            return yield responseError(error);
        }
        return {
            error: error,
        };
    }
});
exports.find_template = find_template;
const upload_template = (code_auth, name, description) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const find = yield axios_1.default.post(`${API_URL}/templates`, {
            code_auth: code_auth,
            name: name,
            description: description,
        });
        return {
            data: find.data.data,
        };
    }
    catch (error) {
        if (error instanceof axios_1.default.AxiosError) {
            if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 400)
                return responseError(error);
        }
        return {
            error: error,
        };
    }
});
exports.upload_template = upload_template;
const update_downloads = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = yield axios_1.default.put(`${API_URL}/templates`, {
            id: id,
        });
        return {
            data: find.data.data,
        };
    }
    catch (error) {
        if (error instanceof axios_1.default.AxiosError) {
            return responseError(error);
        }
        return {
            error: error,
        };
    }
});
exports.update_downloads = update_downloads;
const delete_template = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = yield axios_1.default.delete(`${API_URL}/templates`, {
            data: {
                id: id,
            },
        });
        return {
            data: find.data.data,
        };
    }
    catch (error) {
        if (error instanceof axios_1.default.AxiosError) {
            return responseError(error);
        }
        return {
            error: error,
        };
    }
});
exports.delete_template = delete_template;
//# sourceMappingURL=api_controller.js.map