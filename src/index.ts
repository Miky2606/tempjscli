#!/usr/bin/env node

import { createInit, findFile } from "./controller/upload_controller";
import {
  delete_template,
  find_template,
  update_downloads,
  upload_template,
} from "./controller/api_controller";

const { program } = require("commander");
const clc = require("cli-color");

program
  .description("Welcome to lazytempjs")
  .option("-u,--upload <char>", "Upload a template")
  .option("-n , --name <char>", "Set the template name")
  .option("-d, --download <char>", "Download Template")
  .option("-i, --init", "Init The template")
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
        const resp = await upload_template(option.upload, option.name);

        const route = `${resp.data?.user.name}/${option.name}`;
        if (resp.error === undefined) {
          const find = await findFile(
            "Miky2606/hola3/",
            process.cwd(),
            "",
            "upload",
            ""
          );

          if (typeof find === "string") {
            setTimeout(async () => {
              const delete_temp = await delete_template(
                resp.data?.id as string
              );
              console.log(delete_temp);
            }, 2000);
          }
        }
        return console.log(resp);
      }

      //Download
      if (option.download !== undefined) {
        const resp_template = await find_template(option.download);
        const route = `C:/Users/Jonathan/Desktop/tempjs/user/${resp_template.data?.user[0].name}/${resp_template.data?.name}`;
        const update = await update_downloads(
          resp_template.data?._id as string
        );
        const route_download = `${process.cwd()}/${
          option.name === undefined ? resp_template.data?.name : option.name
        }`;

        if (resp_template.error !== undefined)
          return console.table(resp_template.error);
        return findFile(
          route_download,
          route,
          "Successfylly download",
          "download",
          option.name
        );
      }

      //Init
      if (option.init) {
        createInit();
      }
    } catch (error) {
      return console.error(clc.red(error));
    }
  });

program.parse(process.argv);
