#!/usr/bin/env node

import { findFile } from "./controller/upload_controller";
import { find_template, upload_template } from "./controller/api_controller";

const { program } = require("commander");
const clc = require("cli-color");

program
  .description("Welcome to lazytempjs")
  .option("-u,--upload <char>", "Upload a template")
  .option("-n , --name <char>", "Set the template name")
  .option("-d, --download <char>", "Download Template")
  .action(async (option: any) => {
    if (option.upload !== undefined && option.download === undefined) {
      if (option.upload === undefined)
        return console.error(
          clc.red(
            "For the upload template you must provide your code auth with after  the command -u or --upload"
          )
        );
      if (option.name === undefined)
        return console.log(
          clc.red(
            "For the upload template you must provide a name with the command -n or --name"
          )
        );

      const resp = await upload_template(option.upload, option.name);

      const route = `C:/Users/Jonathan/Desktop/tempjs/user/${resp.data?.name}/${option.name}`;
      if (resp.error === undefined)
        return findFile(
          route,
          process.cwd(),
          "Successfully uploaded",
          "upload"
        );

      return console.log(resp);
    }
    if (option.download !== undefined) {
      const resp_template = await find_template(option.download);
      const route = `C:/Users/Jonathan/Desktop/tempjs/user/${resp_template.data?.user[0].name}/${resp_template.data?.name}`;

      return findFile(
        `${process.cwd()}/${resp_template.data?.name}`,
        route,
        "Successfylly download",
        "download"
      );
    }
  });

program.parse(process.argv);
