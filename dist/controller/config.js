"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const configs = {
    Endpoint: "nyc3.digitaloceanspaces.com",
    Bucket: "lazytemps",
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
    Endpoint: "nyc3.digitaloceanspaces.com",
    Bucket: "lazytemps",
    s3Client,
};
//# sourceMappingURL=config.js.map