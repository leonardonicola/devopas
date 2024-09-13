import type { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.route({
    url: "/vai",
    method: "GET",
    handler: async (req, reply) => {
      reply.status(500).send({ erro: "seu palerma" });
      return;
    },
  });
}
