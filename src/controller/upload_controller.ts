import { execSync } from "child_process";
import fs from "fs";
const clc = require("cli-color");

type TypeForm = "upload" | "download";

export const findFile = async (
  route: string,
  source: string,
  message: string,
  type: TypeForm
) => {
  try {
    if (await fs.existsSync(route)) return await fs.mkdirSync(route);
    await fs.cpSync(source, route, { recursive: true });
    if (type === "download") {
      readCommandFile(`${route}/command.txt`);
    }

    console.log(clc.green(message));
  } catch (error) {
    console.log(error);
  }
};

const readCommandFile = async (route: string) => {
  try {
    if (fs.existsSync(route)) {
      const read = await fs.readFileSync(route);
      const command = read.toString().split("//").join("&&");
      const run = await runCommand(command);
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
