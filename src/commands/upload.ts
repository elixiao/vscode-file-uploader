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
import { selectFiles } from "../utils/selectFiles";

export async function upload(context: ExtensionContext, items: Uri[], opts: any = {}) {
  let axiosRes;
  try {
    if (!context.storageUri) return window.showWarningMessage(t("message.warning.openProject"));
    const wsConfig = workspace.getConfiguration("file-uploader");

    const apiEndpoint = opts.apiEndpoint || wsConfig.get("apiEndpoint");
    if (!apiEndpoint) return window.showWarningMessage(t("message.warning.setApiEndpoint"));

    const resources = items.map((uri) => uri.path);
    if (!(resources && resources.length)) return window.showWarningMessage(t("message.warning.selectFiles"));

    const storageFolder = context?.storageUri?.path || "";
    if (storageFolder) fs.ensureDirSync(storageFolder);

    const defaultUploadOptions: IUploadOptions = opts.options || {
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
    axiosRes = await sendFormData(filePath, resources, {
      ...wsConfig,
      ...opts,
    });
    const successMsg = t("message.info.uploadSuccess");
    logger.info(`[${getCurrentTime()}] ` + successMsg);
    window.showInformationMessage(successMsg);
  } catch (e) {
    const { message = "", response, stack } = e;
    axiosRes = response;
    const errorMsg = t("message.error.uploadFailed") + message
    logger.info(`[${getCurrentTime()}] ` + stack || errorMsg);
    window.showErrorMessage(errorMsg);
  } finally {
    if (axiosRes) {
      const { status, statusText, data } = axiosRes;
      logger.info(JSON.stringify({ status, statusText, data }, null, 2));
      logger.show();
    }
  }
}

export async function selectAndUpload(context: ExtensionContext, lines: string[]) {
  const code = [...lines, "return FileUploader"].join("\n");
  try {
    const fn = new Function(code);
    const options = fn();
    const wsFolders = workspace.workspaceFolders;
    if (!wsFolders) return window.showErrorMessage(t("message.warning.openProject"));
    const files: Uri[] | undefined = await selectFiles(wsFolders[0].uri.path);
    if (!files) return window.showErrorMessage(t("message.warning.selectFiles"));
    options.userDefinedData = options.formData;
    await upload(context, files, options);
  } catch (e) {
    logger.info(e.stack);
    window.showErrorMessage(`${t('message.error.codeExecutionFaild')}${e.message}`);
  }
}
