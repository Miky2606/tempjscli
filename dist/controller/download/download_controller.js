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
exports.removeFolderAndFilesEmpty = exports.downloadFolderFromS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
function downloadFolderFromS3(bucketName, folderPath, route) {
    return __awaiter(this, void 0, void 0, function* () {
        const listObjectsParams = {
            Bucket: bucketName,
            Prefix: folderPath,
        };
        console.log(route);
        const listObjectsCommand = new client_s3_1.ListObjectsV2Command(listObjectsParams);
        try {
            const listObjectsOutput = yield config_1.default.s3Client.send(listObjectsCommand);
            const exist = yield fs_1.default.existsSync(route);
            if (exist) {
                throw new Error("Folder exist");
            }
            for (const object of listObjectsOutput.Contents || []) {
                const s3Key = object.Key || "";
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: s3Key,
                };
                const getObjectCommand = new client_s3_1.GetObjectCommand(getObjectParams);
                const getObjectOutput = yield config_1.default.s3Client.send(getObjectCommand);
                const relativeS3ObjectPath = s3Key.replace(folderPath, "");
                const localDirectory = path_1.default.join(route, relativeS3ObjectPath);
                if (object.Size === 0) {
                    // This is an empty directory, create a local directory with the same name
                    fs_1.default.mkdirSync(localDirectory, { recursive: true });
                    continue;
                }
                // Ensure that the local directory for this object exists
                fs_1.default.mkdirSync(path_1.default.dirname(localDirectory), { recursive: true });
                const buffer = yield streamToString(getObjectOutput.Body);
                yield fs_1.default.writeFileSync(path_1.default.join(route, relativeS3ObjectPath), buffer);
            }
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
exports.downloadFolderFromS3 = downloadFolderFromS3;
function removeFolderAndFilesEmpty(source) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = fs_1.default.readdirSync(source);
            for (const file of files) {
                const filePath = `${source}/${file}`;
                if (fs_1.default.statSync(filePath).isDirectory()) {
                    removeFolderAndFilesEmpty(filePath);
                    if (fs_1.default.readdirSync(filePath).length === 0) {
                        fs_1.default.rmdirSync(filePath);
                    }
                }
                else {
                    if (fs_1.default.statSync(filePath).size === 0) {
                        fs_1.default.unlinkSync(filePath);
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.removeFolderAndFilesEmpty = removeFolderAndFilesEmpty;
const streamToString = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});
//# sourceMappingURL=download_controller.js.map