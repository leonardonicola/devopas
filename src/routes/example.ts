import type { FastifyPluginAsync } from "fastify";

import { randomUUID } from "crypto";
import apm from "elastic-apm-node";
import { Pool } from "pg";
import { setTimeout } from "timers/promises";

const config = {
  host: "postgres",
  port: 5432,
  password: "tomano",
  database: "tomano",
  user: "vai",
};
const pool = new Pool(config);

async function getInfos(): Promise<[number, number]> {
  await setTimeout(200);
  const client = await pool.connect();
  const { rows } = await client.query("SELECT $1::int as max, $2::int as min", [
    Math.floor((Math.random() + 1) * 8),
    Math.floor((Math.random() + 1) * 8),
  ]);
  client.release();
  return [rows[0].max, rows[0].min];
}

async function getPosts(max: number, min: number) {
  await setTimeout(800);
  return [
    {
      id: randomUUID(),
      title: `Rando ${Math.floor(Math.random() * (max - min + 1) + min)}`,
    },
  ];
}

const exampleRouter: FastifyPluginAsync = async (fastify): Promise<void> => {
  const count = new fastify.metrics.client.Counter({
    name: "CONTADOR_VAI_PFV",
    help: "CONTADOR_VAI_PFV",
  });
  fastify.log.debug(fastify.metrics.client);

  fastify.get("/vai", {}, async (req, reply) => {
    try {
      const [max, min] = await withSpan(getInfos);
      const posts = await withSpan(getPosts, max, min);
      reply.status(200).send(posts);
    } catch (error) {
      reply.status(500).send(error);
    }
    count.inc();
  });
};

async function withSpan<T, R>(
  callback: (...args: T[]) => Promise<R>,
  ...args: T[]
): ReturnType<typeof callback> {
  const spanInfo = apm.startSpan(callback.name);
  const result = await callback(...args);
  spanInfo?.end();
  return result;
}

export default exampleRouter;
