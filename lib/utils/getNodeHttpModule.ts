export function getNodeHttpModule(url: string) {
  return url.indexOf("https://") === 0 ? require("https") : require("http");
}
