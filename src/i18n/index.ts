import { env } from "vscode";
import * as en from "./locales/en.json";
import * as zhCn from "./locales/zh-cn.json";

const locale: any = {
  en,
  "zh-cn": zhCn,
};

export function t(key: string) {
  const lang = env.language;
  const json = locale[lang] || locale["en"];
  return json ? json[key] : "";
}
