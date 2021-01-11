// 插件入口文件

import { commands, ExtensionContext, Uri } from "vscode";
import { upload } from "./commands/upload";

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand(
    "file-uploader.upload",
    (uri: Uri, items: Uri[]) => {
      upload(context, items || [uri]);
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
