import { workspace, WorkspaceFolder, Uri, window, OpenDialogOptions } from "vscode";

export async function selectFiles(fsPath?: string | undefined) {
  const defaultUri: Uri | undefined = getBelongingWorkspaceFolderUri(fsPath);
  const options: OpenDialogOptions = {
    defaultUri,
    canSelectFiles: true,
    canSelectFolders: true,
    canSelectMany: true,
    openLabel: "Select",
  };
  return await window.showOpenDialog(options);
}

function getBelongingWorkspaceFolderUri(fsPath: string | undefined): Uri | undefined {
  let defaultUri: Uri | undefined;
  if (fsPath) {
    const workspaceFolder: | WorkspaceFolder | undefined = workspace.getWorkspaceFolder(Uri.file(fsPath));
    if (workspaceFolder) {
      defaultUri = workspaceFolder.uri;
    }
  }
  return defaultUri;
}
