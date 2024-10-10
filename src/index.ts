import { CreateBucketCommand } from "@aws-sdk/client-s3";
import autoLoad from "@fastify/autoload";
import fastifyMultipart from "@fastify/multipart";
import { randomUUID } from "crypto";
import "elastic-apm-node/start";
import fastify from "fastify";
import metricsPlugin from "fastify-metrics";
import { join } from "path";
import pinoElasticsearch from "pino-elasticsearch";
import { S3Singleton } from "./s3";

const streamToElastic = pinoElasticsearch({
  index: "vai-tomano",
  node: "http://elastic_search:9200",
});

const server = fastify({
  logger: {
    level: "trace",
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
    server.register(metricsPlugin, {
      endpoint: "/metrics",
    });
    server.register(fastifyMultipart);
    server.register(autoLoad, {
      dir: join(__dirname, "routes"),
    });

    const command = new CreateBucketCommand({
      Bucket: process.env.S3_BUCKET_NAME,
    });

    await S3Singleton.getClient().send(command);

    await server.listen({ port: 3002, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(3);
      }
      console.info(`Server listening at ${address}`);
    });
  } catch (err) {
    console.error("BOOTSTRAP", err);
    process.exit(4);
  }
};

start();
