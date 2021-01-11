// 创建文件压缩包

import * as path from "path";
import * as archiver from "archiver";
import * as fs from "fs-extra";
import * as stream from "stream";
import * as util from "util";

const pipeline = util.promisify(stream.pipeline);

export async function createArchive(
  storageFolder: string,
  resources: string[],
  compressMode: "zip" | "tar.gz"
) {
  const file = `${storageFolder}/archive.${compressMode}`;
  fs.removeSync(file);
  const archive =
    compressMode === "zip"
      ? archiver("zip", { zlib: { level: 9 } })
      : archiver("tar", { gzip: true });
  const output = fs.createWriteStream(file);
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const stat = fs.statSync(resource);
    const basename = path.basename(resource);
    if (stat.isDirectory()) {
      archive.directory(resource, basename);
    } else {
      archive.file(resource, { name: basename });
    }
  }
  archive.finalize();
  await pipeline(archive, output);
  return file;
}
