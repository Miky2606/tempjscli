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
import path from "path";
const json = require("../../command.json");
import { readme } from "../readme";

export const createInit = async () => {
  try {
    const templates: ITemplateInit[] = [
      {
        name: "command.json",
        content: toStringInit(json),
      },
      {
        name: "README.md",
        content: toStringInit(readme),
      },
    ];

    templates.map((e) => {
      if (fs.existsSync(`${process.cwd()}/${e.name}`))
        console.error(clc.red(`Already exist ${e.name}`));
      fs.writeFileSync(e.name, e.content as string);
    });
    return console.log(clc.green("Init Finished"));
  } catch (error) {
    console.error(error);
  }
};

const toStringInit = (route: unknown): string => {
  if (typeof route === "object") {
    if (json.command.cd !== undefined) {
      json.command.cd = path.basename(process.cwd().replace(" ", "-"));
    }

    return JSON.stringify(json);
  }
  if (typeof route === "string") return route;
  return route as string;
};
