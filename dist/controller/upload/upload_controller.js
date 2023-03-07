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
exports.uploadFolderToS3 = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
const client_s3_1 = require("@aws-sdk/client-s3");
const api_controller_1 = require("../api_controller");
const uploadFolderToS3 = (route, source, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = fs_1.default.readdirSync(source);
        for (const file of files) {
            const filePath = path_1.default.join(source, file);
            const s3Key = route ? `${route}/${file}` : file;
            if (fs_1.default.statSync(filePath).isDirectory()) {
                // Recursively upload subdirectories
                yield (0, exports.uploadFolderToS3)(s3Key, filePath);
            }
            else {
                // Upload file to S3
                const fileContent = fs_1.default.readFileSync(filePath);
                const params = {
                    Bucket: config_1.default.Bucket,
                    Key: s3Key,
                    Body: fileContent,
                    ACL: "public-read",
                    ContentType: getContentType(filePath),
                };
                yield config_1.default.s3Client.send(new client_s3_1.PutObjectCommand(params));
            }
        }
    }
    catch (error) {
        const delete_temp = yield (0, api_controller_1.delete_template)(id);
        console.log(delete_temp);
        throw error;
    }
});
exports.uploadFolderToS3 = uploadFolderToS3;
function getContentType(filePath) {
    const extname = path_1.default.extname(filePath);
    switch (extname) {
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "text/javascript";
        case ".json":
            return "application/json";
        case ".png":
            return "image/png";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".gif":
            return "image/gif";
        case ".md":
            return "text/plain; charset=utf-8";
        default:
            return "application/octet-stream";
    }
}
//# sourceMappingURL=upload_controller.js.map