// 类型定义

export interface IUploadConfig {
  apiEndpoint: string;
  httpHeaders: IHttpHeaders;
  fileField: string;
  options: IUploadOptions;
  userDefinedData: IUserDefinedData;
}

interface IHttpHeaders {
  [key: string]: string;
}

interface IUploadOptions {
  shouldCompressSingleFile: boolean;
  compressMode: "zip" | "tar.gz";
}

interface IUserDefinedData {
  [key: string]: any;
}
