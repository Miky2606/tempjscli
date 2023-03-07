import {
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import path from "path";
import modules from "../config";
import fs from "fs";

export async function downloadFolderFromS3(
  bucketName: string,
  folderPath: string,
  route: string
): Promise<boolean | undefined> {
  const listObjectsParams = {
    Bucket: bucketName,
    Prefix: folderPath,
  };
  console.log(route);

  const listObjectsCommand = new ListObjectsV2Command(listObjectsParams);

  try {
    const listObjectsOutput: ListObjectsV2CommandOutput =
      await modules.s3Client.send(listObjectsCommand);
    const exist = await fs.existsSync(route);

    if (exist) {
      throw new Error("Folder exist");
    }
    for (const object of listObjectsOutput.Contents || []) {
      const s3Key = object.Key || "";
      const getObjectParams = {
        Bucket: bucketName,
        Key: s3Key,
      };

      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const getObjectOutput = await modules.s3Client.send(getObjectCommand);
      const relativeS3ObjectPath = s3Key.replace(folderPath, "");

      const localDirectory = path.join(route, relativeS3ObjectPath);

      if (object.Size === 0) {
        // This is an empty directory, create a local directory with the same name
        fs.mkdirSync(localDirectory, { recursive: true });
        continue;
      }

      // Ensure that the local directory for this object exists
      fs.mkdirSync(path.dirname(localDirectory), { recursive: true });

      const buffer = await streamToString(getObjectOutput.Body);
      await fs.writeFileSync(
        path.join(route, relativeS3ObjectPath),
        buffer as string
      );
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function removeFolderAndFilesEmpty(source: string) {
  try {
    const files = fs.readdirSync(source);

    for (const file of files) {
      const filePath = `${source}/${file}`;

      if (fs.statSync(filePath).isDirectory()) {
        removeFolderAndFilesEmpty(filePath);

        if (fs.readdirSync(filePath).length === 0) {
          fs.rmdirSync(filePath);
        }
      } else {
        if (fs.statSync(filePath).size === 0) {
          fs.unlinkSync(filePath);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

const streamToString = (stream: any) =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
