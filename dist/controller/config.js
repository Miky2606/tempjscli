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
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + "/.env" });
const configs = {
    Endpoint: process.env.ENDPOINT,
    Bucket: process.env.BUCKET,
};
const REGION = "us-east-1";
const s3Client = new client_s3_1.S3Client({
    forcePathStyle: false,
    // Configures to use subdomain/virtual calling format.
    endpoint: `https://${configs.Endpoint}`,
    region: REGION,
    credentials: {
        accessKeyId: "DO00AXFJN4PZYYCUPYD7",
        secretAccessKey: "FcSHtjHjjkOQyqwDO3LVaMJKuZgP5xX4pXtzWSys3Ys",
    },
});
exports.default = {
    Endpoint: configs.Endpoint,
    Bucket: configs.Bucket,
    s3Client,
};
//# sourceMappingURL=config.js.map