//Error code 500
//solution: https://stackoverflow.com/questions/72179070/react-native-bundling-failure-error-message-while-trying-to-resolve-module-i
//from official documentation on expo:
//https://docs.expo.dev/guides/customizing-metro/#adding-more-file-extensions-to--assetexts
const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push("cjs");

module.exports = defaultConfig;