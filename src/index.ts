#!/usr/bin/env node

import { createInit } from "./controller/init";
import { upload_init } from "./controller/upload/upload";
import { download_init } from "./controller/download/download";

const { program } = require("commander");
const clc = require("cli-color");

program
  .description("Welcome to lazytempjs")
  .option("-u,--upload <char>", "Upload a template")
  .option("-n , --name <char>", "Set the template name")
  .option("-d, --download <char>", "Download Template")
  .option("-i, --init", "Init The template s")
  .action(async (option: any) => {
    try {
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
        await upload_init(option.upload, option.name);
      }

      //Download
      if (option.download !== undefined) {
        console.log(option.download);
        await download_init(option.download, option.name);
      }

      //Init
      if (option.init) {
        createInit();
      }
      console.log(process.exit());
    } catch (error) {
      return console.error(clc.red(error));
    }
  });

program.parse(process.argv);
