/*
 上传文件到指定接口
 POST 请求，formData 请求体，文件在 file 字段，用户自定义参数在 data 字段 
 */
import { window, workspace, ExtensionContext, Uri } from "vscode";
import * as fs from "fs-extra";
import { IUploadOptions } from "../types";
import { createArchive } from "../utils/createArchive";
import { sendFormData } from "../utils/sendFormData";
import { t } from "../i18n/index";

export async function upload(context: ExtensionContext, items: Uri[]) {
  try {
    if (!context.storageUri) {
      window.showWarningMessage(t("message.warning.openProject"));
      return;
    }
    const wsConfig = workspace.getConfiguration("file-uploader");

    const apiEndpoint = wsConfig.get("apiEndpoint");

    if (!apiEndpoint) {
      window.showWarningMessage(t("message.warning.setApiEndpoint"));
      return;
    }

    const resources = items.map((uri) => uri.path);
    if (!(resources && resources.length)) {
      window.showWarningMessage(t("message.warning.selectFiles"));
      return;
    }

    const storageFolder = context?.storageUri?.path || "";
    if (storageFolder) fs.ensureDirSync(storageFolder);

    const defaultUploadOptions: IUploadOptions = {
      shouldCompressSingleFile: false,
      compressMode: "zip",
    };
    const uploadOptions = wsConfig.get("options", defaultUploadOptions);

    let filePath;

    if (resources.length === 1 && !uploadOptions.shouldCompressSingleFile) {
      const resource = resources[0];
      const stat = fs.statSync(resource);
      if (stat.isFile()) filePath = resource;
    }

    if (!filePath) {
      filePath = await createArchive(
        storageFolder,
        resources,
        uploadOptions.compressMode
      );
    }

    await sendFormData(filePath, resources, wsConfig);
    window.showInformationMessage(t("message.info.uploadSuccess"));
  } catch (e) {
    console.log(e);
    let hint = "";
    if (e.message) hint = ": " + e.message;
    window.showErrorMessage(t("message.error.uploadFailed") + hint);
  }
}
