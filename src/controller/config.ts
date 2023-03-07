import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

const configs = {
  Endpoint: "nyc3.digitaloceanspaces.com",
  Bucket: "lazytemps",
};

const REGION = "us-east-1";
const s3Client = new S3Client({
  forcePathStyle: false,
  // Configures to use subdomain/virtual calling format.
  endpoint: `https://${configs.Endpoint}`,
  region: REGION,

  credentials: {
    accessKeyId: "DO00AXFJN4PZYYCUPYD7",
    secretAccessKey: "FcSHtjHjjkOQyqwDO3LVaMJKuZgP5xX4pXtzWSys3Ys",
  },
});

export default {
  Endpoint: "nyc3.digitaloceanspaces.com",
  Bucket: "lazytemps",
  s3Client,
};
