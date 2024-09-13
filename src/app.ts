import AutoLoad from "@fastify/autoload";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import metricsPlugin from "fastify-metrics";
import path from "path";

export default async function (
  fastify: FastifyInstance,
  opts?: FastifyPluginOptions
) {
  await fastify.register(AutoLoad, {
    dir: path.join(import.meta.dirname, "routes"),
    options: Object.assign({}, opts),
  });

  await fastify.register(metricsPlugin, { endpoint: "/metrics" });
}
