import path from "path";
import fs from "fs";
import modules from "../config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { delete_template } from "../api_controller";

export const uploadFolderToS3 = async (
  route: string,
  source: string,
  id?: string
) => {
  try {
    const files = fs.readdirSync(source);

    for (const file of files) {
      const filePath = path.join(source, file);
      const s3Key = route ? `${route}/${file}` : file;

      if (fs.statSync(filePath).isDirectory()) {
        // Recursively upload subdirectories
        await uploadFolderToS3(s3Key, filePath);
      } else {
        // Upload file to S3
        const fileContent = fs.readFileSync(filePath);

        const params = {
          Bucket: modules.Bucket,
          Key: s3Key,
          Body: fileContent,
          ACL: "public-read",
          ContentType: getContentType(filePath),
        };

        await modules.s3Client.send(new PutObjectCommand(params));
      }
    }
  } catch (error) {
    const delete_temp = await delete_template(id as string);
    console.log(delete_temp);
    throw error;
  }
};

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
    case ".md":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}
