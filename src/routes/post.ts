import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { FastifyPluginAsync } from "fastify";
import { S3Singleton } from "../s3";

const exampleRouter: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post("/upload", async (req, reply) => {
    const data = await req.file();
    if (!data) {
      reply.status(400).send({ message: "Imagem não encontrada!" });
      return;
    }
    const s3 = S3Singleton.getClient();
    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: data.filename,
      Body: data.file,
      ContentType: data.mimetype,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(uploadParams);

    try {
      const result = await s3.send(command);
      reply.send({ success: true, data: result });
    } catch (err: any) {
      req.log.error("/upload", err);
      reply.send({ success: false, error: err });
    }
  });
};

export default exampleRouter;
