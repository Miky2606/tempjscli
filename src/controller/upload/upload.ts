import { delete_template, upload_template } from "../api_controller";
import { uploadFolderToS3 } from "./upload_controller";
import fs, { readFileSync } from "fs";
export const upload_init = async (code_auth: string, name: string) => {
  getCommandAndReadme(process.cwd());
  const description = await getDescription(process.cwd());

  const resp = await upload_template(
    code_auth,
    name.replace(" ", "-"),
    !description ? "New Template" : description
  );

  const route = `${resp.data?.user.name}/${name.replace(" ", "-")}`;

  if (resp.error === undefined) {
    const find = await uploadFolderToS3(
      route,
      process.cwd(),
      resp.data?.id as string
    );
    return console.log("Uploaded");
  }

  return console.log(resp.error);
};

const getDescription = async (route: string): Promise<string> => {
  if (fs.existsSync(`${route}/command.json`)) {
    const json = JSON.parse(
      await readFileSync(`${route}/command.json`).toString()
    );
    return json.description;
  }
  return "";
};
const getCommandAndReadme = async (route: string) => {
  if (
    !fs.existsSync(`${route}/command.json`) ||
    !fs.existsSync(`${route}/README.md`)
  ) {
    throw new Error(
      "The command.json and Readme.md both must exist or you can create with tempjs -i or --init"
    );
  }
};
