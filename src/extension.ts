import { commands, ExtensionContext, Uri } from "vscode";
import { upload, selectAndUpload } from "./commands/upload";
import { CodeLensController } from "./codelens/codelenController";

export function activate(context: ExtensionContext) {
  const uploadByMenu = commands.registerCommand("file-uploader.upload", (uri: Uri, items: Uri[]) => upload(context, items || [uri]));
  const uploadByCodelen = commands.registerCommand("file-uploader.uploadByCodeLens", (lines) => selectAndUpload(context, lines));
  context.subscriptions.push(uploadByMenu, uploadByCodelen, new CodeLensController());
}

export function deactivate() { }
