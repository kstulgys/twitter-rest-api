const { merge } = require("lodash")
const env = process.env.NODE_ENV || "development"

const baseConfig = {
  env,
  isDev: env === "development",
  isPro: env === "production",
  isTest: env === "testing",
  port: process.env.PORT || 8000,
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
  case "prod":
  case "production":
    envConfig = require("./prod")
    break
  default:
    envConfig = require("./dev")
}

module.exports = merge(baseConfig, envConfig)
