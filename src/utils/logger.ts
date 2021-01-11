import { window, OutputChannel } from "vscode";

export interface ILogger {
  info(message: string): void;
}

class Logger implements ILogger {
  private channel: OutputChannel;
  constructor(channel: OutputChannel) {
    this.channel = channel;
  }

  public info(message: string) {
    console.log(message);
    this.channel.appendLine(message);
  }
}

export { Logger };
export default new Logger(window.createOutputChannel("File Uploader"));
