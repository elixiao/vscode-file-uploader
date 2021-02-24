import * as path from "path";
import {
  CodeLensProvider,
  EventEmitter,
  Event,
  TextDocument,
  ProviderResult,
  CodeLens,
  Range,
} from "vscode";
import { t } from "../i18n/index";

export class CustomCodeLensProvider implements CodeLensProvider {
  private onDidChangeCodeLensesEmitter: EventEmitter<void> = new EventEmitter<void>();

  get onDidChangeCodeLenses(): Event<void> {
    return this.onDidChangeCodeLensesEmitter.event;
  }

  public refresh(): void {
    this.onDidChangeCodeLensesEmitter.fire();
  }

  public provideCodeLenses(document: TextDocument): ProviderResult<CodeLens[]> {
    const content: string = document.getText();
    if (content.indexOf("var FileUploader") < 0) return [];
    if (![ ".js", ".ts" ].includes(path.extname(document.fileName))) return [];
    const codeLens: CodeLens[] = [];
    const lineCount = document.lineCount;
    let codeLensLineStart: number = 0;
    let codeLensLineEnd: number = 0;
    let range: Range = new Range(0, 0, 0, 0);
    let lines: string[] = [];
    let open = false;
    for (let i: number = 0; i < lineCount; i++) {
      const lineContent: string = document.lineAt(i).text;
      lines.push(lineContent);
      if (!open && /(var|let|const)\s+FileUploader/.test(lineContent)) {
        lines = [ lineContent ];
        codeLensLineStart = i;
        range = new Range(codeLensLineStart, 0, codeLensLineStart, 0);
        open = true;
      } else if (open && lineContent.startsWith("}")) {
        codeLensLineEnd = i;
        codeLens.push(
          new CodeLens(range, {
            title: `▶ ${t("codeLens.upload")}`,
            command: "file-uploader.uploadByCodeLens",
            arguments: [ lines ],
          })
        );
        lines = [];
        open = false;
      }
    }
    return codeLens;
  }
}
