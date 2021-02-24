import { workspace, WorkspaceConfiguration } from "vscode";
import * as fs from "fs-extra";
import axios from "axios";
import * as FormData from "form-data";

export async function sendFormData(filePath: string, resources: string[], wsConfig: WorkspaceConfiguration) {
  const { apiEndpoint, httpHeaders, fileField, userDefinedData = {} } = wsConfig;
  const form = new FormData();
  form.append(fileField, fs.createReadStream(filePath));
  userDefinedData.__manifest = resources;
  const wsFolders = workspace.workspaceFolders;
  if (wsFolders && wsFolders.length) {
    const { uri, name } = wsFolders[0];
    userDefinedData.__workspace = { path: uri.path, name };
  }
  const keys = Object.keys(userDefinedData)
  keys.forEach(key => {
    const value = userDefinedData[key]
    if (value === undefined) return
    form.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
  })
  const axiosRequestConfig = {
    headers: { ...httpHeaders, ...form.getHeaders() },
    timeout: 5000,
  };
  return axios.post(apiEndpoint, form, axiosRequestConfig);
}
