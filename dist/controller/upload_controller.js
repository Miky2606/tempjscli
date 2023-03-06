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
exports.createInit = exports.findFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const client_s3_2 = require("@aws-sdk/client-s3");
const clc = require("cli-color");
const config_1 = __importDefault(require("./config"));
const archiver = require("archiver");
const path_1 = __importDefault(require("path"));
const json = require("../../command.json");
const readme_1 = require("../readme");
const REGION = "us-east-1";
const s3Client = new client_s3_2.S3Client({
    forcePathStyle: false,
    endpoint: `https://${config_1.default.Endpoint}`,
    region: REGION,
    credentials: {
        accessKeyId: "DO00AXFJN4PZYYCUPYD7",
        secretAccessKey: "FcSHtjHjjkOQyqwDO3LVaMJKuZgP5xX4pXtzWSys3Ys",
    },
});
const findFile = (route, source, message, type, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // if (await fs.existsSync(route)) return await fs.mkdirSync(route);
        if (type === "upload") {
            console.log(route);
            yield uploadFolderToS3(config_1.default.Bucket, source, route);
        }
        else {
            const download = yield downloadFolderFromS3(config_1.default.Bucket, route, source);
            if (download) {
                removeFolderAndFilesEmpty(source);
                return readCommandFile(route, id);
            }
            else
                return console.error("Error in the download");
        }
        // return console.log(clc.green(message));
    }
    catch (error) {
        if (error instanceof Error)
            return console.log(error);
        if (error instanceof client_s3_1.ErrorDocumentFilterSensitiveLog)
            console.log(error);
        return console.log(error);
    }
});
exports.findFile = findFile;
const readCommandFile = (route, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (fs_1.default.existsSync(route)) {
            const readFile = yield fs_1.default.readFileSync(route);
            let change = JSON.parse(readFile.toString());
            if (id !== undefined) {
                change.command.cd = id;
                yield fs_1.default.writeFileSync(route, JSON.stringify(change));
            }
            let x = "";
            for (const key in change.command) {
                if (x === "") {
                    x = ` ${key} ${change.command[key]}`;
                }
                else {
                    x = `${x} && ${key} ${change.command[key]} `;
                }
            }
            console.log(x);
            const run = runCommand(x);
            if (!run)
                process.exit(-1);
        }
        console.log("download success");
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
const createInit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templates = [
            {
                name: "command.json",
                content: toStringInit(json),
            },
            {
                name: "readme.md",
                content: toStringInit(readme_1.readme),
            },
        ];
        return templates.map((e) => fs_1.default.writeFileSync(e.name, e.content));
    }
    catch (error) {
        console.error(error);
    }
});
exports.createInit = createInit;
const toStringInit = (route) => {
    console.log(typeof route);
    if (typeof route === 'object')
        return JSON.stringify(json);
    if (typeof route === 'string')
        return route;
    return route;
};
const uploadFiles = (route, source) => __awaiter(void 0, void 0, void 0, function* () {
    const routes_split = route.split("/");
    try {
        var output = fs_1.default.createWriteStream("target.zip");
        var archive = archiver("zip");
        output.on("close", function () {
            console.log(archive.pointer() + " total bytes");
            console.log("archiver has been finalized and the output file descriptor has closed.");
        });
        archive.on("error", function (err) {
            throw err;
        });
        archive.pipe(output);
        archive.directory(source, false);
        archive.directory("subdir/", "new-subdir");
        archive.finalize();
        const read = yield fs_1.default.readFileSync(source + "/target.zip");
        const upload = yield uploadFromStream(routes_split, read);
        yield fs_1.default.unlinkSync(source + "/target.zip");
    }
    catch (error) {
        if (error instanceof Error)
            return error.message;
        console.log(error);
    }
});
const uploadFromStream = (routes_split, output) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield s3Client.send(new client_s3_1.PutObjectCommand({
            Key: `${routes_split[0]}/${routes_split[1]}/target.zip`,
            Bucket: config_1.default.Bucket,
            Body: output,
            ContentType: "application/zip",
            ContentEncoding: "gzip",
            ContentLength: output.readableLength,
        }));
    }
    catch (error) {
        console.log(error);
    }
});
const streamToString = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});
function uploadFolderToS3(bucketName, folderPath, s3KeyPrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = fs_1.default.readdirSync(folderPath);
        for (const file of files) {
            const filePath = path_1.default.join(folderPath, file);
            const s3Key = s3KeyPrefix ? `${s3KeyPrefix}/${file}` : file;
            if (fs_1.default.statSync(filePath).isDirectory()) {
                // Recursively upload subdirectories
                yield uploadFolderToS3(bucketName, filePath, s3Key);
            }
            else {
                // Upload file to S3
                const fileContent = fs_1.default.readFileSync(filePath);
                const params = {
                    Bucket: bucketName,
                    Key: s3Key,
                    Body: fileContent,
                    ContentType: getContentType(filePath),
                };
                yield s3Client.send(new client_s3_1.PutObjectCommand(params));
            }
        }
    });
}
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
        default:
            return "application/octet-stream";
    }
}
function downloadFolderFromS3(bucketName, folderPath, route) {
    return __awaiter(this, void 0, void 0, function* () {
        const listObjectsParams = {
            Bucket: bucketName,
            Prefix: folderPath,
        };
        const listObjectsCommand = new client_s3_2.ListObjectsV2Command(listObjectsParams);
        try {
            const listObjectsOutput = yield s3Client.send(listObjectsCommand);
            for (const object of listObjectsOutput.Contents || []) {
                const s3Key = object.Key || "";
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: s3Key,
                };
                const getObjectCommand = new client_s3_1.GetObjectCommand(getObjectParams);
                const getObjectOutput = yield s3Client.send(getObjectCommand);
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
                fs_1.default.writeFileSync(path_1.default.join(route, relativeS3ObjectPath), buffer);
            }
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    });
}
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
//# sourceMappingURL=upload_controller.js.map