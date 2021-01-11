import { workspace, WorkspaceConfiguration } from "vscode";
import * as fs from "fs-extra";
import axios from "axios";
import * as FormData from "form-data";
import logger from "../utils/logger";

export async function sendFormData(
  filePath: string,
  wsConfig: WorkspaceConfiguration
) {
  const { apiEndpoint, httpHeaders, fileField, userDefinedData } = wsConfig;
  const form = new FormData();
  form.append(fileField, fs.createReadStream(filePath));
  form.append("data", JSON.stringify(userDefinedData));
  const wsFolders = workspace.workspaceFolders;
  if (wsFolders && wsFolders.length) {
    form.append("workspace", wsFolders[0].name);
  }
  const axiosRequestConfig = {
    headers: { ...httpHeaders, ...form.getHeaders() },
    timeout: 5000,
  };
  const res = await axios.post(apiEndpoint, form, axiosRequestConfig);
  const { status, statusText, data } = res;
  logger.info(`status: ${status}`);
  logger.info(`statusText: ${statusText}`);
  logger.info(`data: ${JSON.stringify(data)}`);
  logger.show();
}
