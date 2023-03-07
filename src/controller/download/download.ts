import {
  downloadFolderFromS3,
  removeFolderAndFilesEmpty,
} from "./download_controller";
import modules from "../config";
import { execSync } from "child_process";
import fs from "fs";
import { find_template, update_downloads } from "../api_controller";
const clc = require("cli-color");

export const download_init = async (name: string, name_relative: string) => {
  const resp_template = await find_template(name);

  const route = `${resp_template.data?.user[0].name}/${resp_template.data?.name}`;
  const update = await update_downloads(resp_template.data?._id as string);
  const source = `${process.cwd()}/${
    name_relative === undefined ? resp_template.data?.name : name_relative
  }`;

  if (resp_template.error !== undefined)
    return console.table(resp_template.error);

  const download = await downloadFolderFromS3(modules.Bucket, route, source);

  if (download) {
    removeFolderAndFilesEmpty(source);
    readCommandFile(`${source}/command.json`, name_relative);
    changeNameJSON(`${source}/package.json`, name_relative);
  } else return console.error("Error in the download");
};

const readCommandFile = async (
  route: string,
  name_relative: string | undefined
) => {
  try {
    console.log(fs.existsSync(route), route);
    if (fs.existsSync(route)) {
      const readFile = await fs.readFileSync(route);
      let change = JSON.parse(readFile.toString());
      if (name_relative !== undefined) change.command.cd = name_relative;
      fs.writeFileSync(route, JSON.stringify(change));

      let x = "";
      for (const key in change.command) {
        if (x === "") {
          x = ` ${key} ${change.command[key]}`;
        } else {
          x = `${x} && ${key} ${change.command[key]} `;
        }
      }

      const run = runCommand(x);

      if (!run) process.exit(-1);
    }

    console.log(``);
  } catch (error) {
    console.log(error);
  }
};

const changeNameJSON = async (
  route: string,
  name_relative: string | undefined
) => {
  if (fs.existsSync(route)) {
    const readFile = await fs.readFileSync(route);
    let change = JSON.parse(readFile.toString());
    if (name_relative !== undefined) {
      change.name = name_relative;
      await fs.writeFileSync(route, JSON.stringify(change));
    }
  }
};
const runCommand = async (command: string) => {
  try {
    await execSync(`${command}`, { stdio: "inherit" });
  } catch (error) {
    console.log(clc.red(error));
  }
  return true;
};
