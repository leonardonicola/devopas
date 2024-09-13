import { randomUUID } from "crypto";
import fastify from "fastify";
import pinoElastic from "pino-elasticsearch";
import init from "./app.js";

const streamToElastic = pinoElastic({
  index: "vai-tomano",
  node: "http://elastic_search:9200",
});

const server = fastify({
  logger: {
    level: "info",
    stream: streamToElastic,
    formatters: {
      level(label) {
        return { severity: label.toUpperCase() };
      },
    },
  },
  genReqId: () => randomUUID(),
});

await init(server, {});

server.listen({ port: 3002, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
