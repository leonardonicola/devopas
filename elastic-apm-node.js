/** @type { import("elastic-apm-node").AgentConfigOptions} */
const config = {
  serviceName: "apm",
  serverUrl: "http://apm:8200",
  logLevel: "trace",
  usePathAsTransactionName: true,
};

module.exports = config;
