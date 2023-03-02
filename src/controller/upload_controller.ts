import {
  ErrorDocumentFilterSensitiveLog,
  GetObjectCommand,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { execSync } from "child_process";
import fs from "fs";
import { ITemplateInit } from "interface/interface_api";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
const clc = require("cli-color");
import modules from "./config";
const archiver = require("archiver");
import { Readable } from "stream";
import path, { dirname } from "path";

type TypeForm = "upload" | "download";
const REGION = "us-east-1";
const s3Client = new S3Client({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: `https://${modules.Endpoint}`,
  region: REGION,
  credentials: {
    accessKeyId: "DO00AXFJN4PZYYCUPYD7",
    secretAccessKey: "FcSHtjHjjkOQyqwDO3LVaMJKuZgP5xX4pXtzWSys3Ys",
  },
});

export const findFile = async (
  route: string,
  source: string,
  message: string,
  type: TypeForm,
  id: string | undefined
): Promise<unknown> => {
  try {
    // if (await fs.existsSync(route)) return await fs.mkdirSync(route);
    const routes = "Miky2606/new/";
    if (type === "upload") {
      await uploadFolderToS3(modules.Bucket, source, `Miky2606/new/`);
    } else {
      await downloadFolderFromS3(modules.Bucket, routes, route);
    }
    // return console.log(clc.green(message));
  } catch (error) {
    if (error instanceof Error) return console.log(error);
    if (error instanceof ErrorDocumentFilterSensitiveLog) console.log(error);
    return console.log(error);
  }
};

const readCommandFile = async (route: string, id: string | undefined) => {
  try {
    if (fs.existsSync(route)) {
      const readFile = await fs.readFileSync(route);
      let change = JSON.parse(readFile.toString());
      if (id !== undefined) {
        change.command.cd = id;
        await fs.writeFileSync(route, JSON.stringify(change));
      }
      let x = "";
      for (const key in change.command) {
        if (x === "") {
          x = ` ${key} ${change.command[key]}`;
        } else {
          x = `${x} && ${key} ${change.command[key]} `;
        }
      }

      console.log(x);

      const run = runCommand(x);
      if (!run) process.exit(-1);
    }
  } catch (error) {
    console.log(error);
  }
};

const runCommand = async (command: string) => {
  try {
    await execSync(`${command}`, { stdio: "inherit" });
  } catch (error) {
    console.log(clc.red(error));
    return false;
  }
  return true;
};

export const createInit = async () => {
  try {
    const templates: ITemplateInit[] = [
      {
        name: "command.json",
        content: await getReadme(
          `C:/Users/Jonathan/Desktop/tempjs/command.json`
        ),
      },
      {
        name: "readme.md",
        content: await getReadme(`C:/Users/Jonathan/Desktop/tempjs/readme.md`),
      },
    ];
    return templates.map((e) => fs.writeFileSync(e.name, e.content));
  } catch (error) {
    console.error(error);
  }
};

const getReadme = async (route: string) => {
  const x = await fs.readFileSync(route);
  return x.toString();
};

const uploadFiles = async (route: string, source: string) => {
  const routes_split = route.split("/");

  try {
    var output = fs.createWriteStream("target.zip");
    var archive = archiver("zip");

    output.on("close", function () {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
    });

    archive.on("error", function (err: any) {
      throw err;
    });

    archive.pipe(output);

    archive.directory(source, false);

    archive.directory("subdir/", "new-subdir");

    archive.finalize();

    const read = await fs.readFileSync(source + "/target.zip");

    const upload = await uploadFromStream(routes_split, read);

    await fs.unlinkSync(source + "/target.zip");
  } catch (error) {
    if (error instanceof Error) return error.message;
    console.log(error);
  }
};

const uploadFromStream = async (routes_split: string[], output: any) => {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Key: `${routes_split[0]}/${routes_split[1]}/target.zip`,
        Bucket: modules.Bucket,
        Body: output,
        ContentType: "application/zip",
        ContentEncoding: "gzip",
        ContentLength: output.readableLength,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const streamToString = (stream: any) =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

async function uploadFolderToS3(
  bucketName: string,
  folderPath: string,
  s3KeyPrefix: string = ""
): Promise<void> {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const s3Key = s3KeyPrefix ? `${s3KeyPrefix}/${file}` : file;

    if (fs.statSync(filePath).isDirectory()) {
      // Recursively upload subdirectories
      await uploadFolderToS3(bucketName, filePath, s3Key);
    } else {
      // Upload file to S3
      const fileContent = fs.readFileSync(filePath);

      const params = {
        Bucket: bucketName,
        Key: s3Key,
        Body: fileContent,
        ContentType: getContentType(filePath),
      };

      await s3Client.send(new PutObjectCommand(params));
    }
  }
}

function getContentType(filePath: string): string {
  const extname = path.extname(filePath);
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

async function downloadFolderFromS3(
  bucketName: string,
  folderPath: string,
  route: string
): Promise<void> {
  const listObjectsParams = {
    Bucket: bucketName,
    Prefix: folderPath,
  };
  const listObjectsCommand = new ListObjectsV2Command(listObjectsParams);

  try {
    const listObjectsOutput: ListObjectsV2CommandOutput = await s3Client.send(
      listObjectsCommand
    );

    for (const object of listObjectsOutput.Contents || []) {
      const s3Key = object.Key || "";
      const getObjectParams = {
        Bucket: bucketName,
        Key: s3Key,
      };

      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const getObjectOutput = await s3Client.send(getObjectCommand);
      const relativeS3ObjectPath = s3Key.replace(folderPath, "");
      console.log(relativeS3ObjectPath);
      const localDirectory = path.join(route, relativeS3ObjectPath);
      const split = object.Key?.split("/");
      if (object.Size === 0 || !split![split!.length - 1].includes(".")) {
        // This is an empty directory, create a local directory with the same name
        fs.mkdirSync(localDirectory, { recursive: true });
        continue;
      }

      // Ensure that the local directory for this object exists
      fs.mkdirSync(path.dirname(localDirectory), { recursive: true });

      const buffer = await streamToString(getObjectOutput.Body);
      fs.writeFileSync(
        path.join(route, relativeS3ObjectPath),
        buffer as string
      );
    }
  } catch (error) {
    console.error(error);
  }
}
