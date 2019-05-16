const { merge } = require("lodash")
const env = process.env.NODE_ENV || "development"

const baseConfig = {
  env,
  isDev: env === "development",
  isTest: env === "testing",
  port: process.env.PORT || 4000,
  serverUrl: process.env.SERVER_URL || "http://localhost:4000",
  clientUrl: process.env.CLIENT_URL || "https://1q33jn2pl3.codesandbox.io",
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: "100d"
  }
}

let envConfig = {}

switch (env) {
  case "dev":
  case "development":
    envConfig = require("./dev")
    break
  case "test":
  case "testing":
    envConfig = require("./testing")
    break
  default:
    envConfig = require("./dev")
}

module.exports = merge(baseConfig, envConfig)
