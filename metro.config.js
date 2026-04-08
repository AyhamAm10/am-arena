const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

const upstreamResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web") {
    const norm = String(moduleName).split("?")[0].replace(/\\/g, "/");
    if (
      norm.includes("node_modules/axios/") &&
      norm.endsWith("/lib/adapters/http.js")
    ) {
      return {
        type: "sourceFile",
        filePath: path.join(projectRoot, "src/shims/axios-http-adapter.js"),
      };
    }
  }

  if (typeof upstreamResolveRequest === "function") {
    return upstreamResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
