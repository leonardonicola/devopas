import autoLoad from "@fastify/autoload";
import { randomUUID } from "crypto";
import "elastic-apm-node/start";
import fastify from "fastify";
import metricsPlugin from "fastify-metrics";
import { join } from "path";
import pinoElasticsearch from "pino-elasticsearch";

const streamToElastic = pinoElasticsearch({
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

const start = async () => {
  try {
    await server.register(metricsPlugin, {
      endpoint: "/metrics",
    });
    await server.register(autoLoad, {
      dir: join(__dirname, "routes"),
    });
    await server.listen({ port: 3002, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
