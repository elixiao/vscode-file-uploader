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
import logger from "../utils/logger";
import { getCurrentTime } from "../utils/getCurrentTime";

export async function upload(context: ExtensionContext, items: Uri[]) {
  let axiosRes;
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
    axiosRes = await sendFormData(filePath, resources, wsConfig);
    const successMsg = t("message.info.uploadSuccess");
    logger.info(`[${getCurrentTime()}] ` + successMsg);
    window.showInformationMessage(successMsg);
  } catch (e) {
    const { message = "", response } = e;
    axiosRes = response;
    const errorMsg =
      t("message.error.uploadFailed") + (message ? ": " + message : "");
    logger.info(`[${getCurrentTime()}] ` + errorMsg);
    window.showErrorMessage(errorMsg);
  } finally {
    if (axiosRes) {
      const { status, statusText, data } = axiosRes;
      logger.info(JSON.stringify({ status, statusText, data }, null, 2));
      logger.show();
    }
  }
}
