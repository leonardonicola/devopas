import { S3Client } from "@aws-sdk/client-s3";

class S3Singleton {
  private static client: S3Client | null = null;

  private constructor() {
    // Externos não pode instanciar
  }

  static getClient(): S3Client {
    if (!S3Singleton.client) {
      this.client = new S3Client({
        endpoint: `http://localstack:4566`,
        forcePathStyle: true,
        credentials: {
          accessKeyId: "test",
          secretAccessKey: "test",
        },
        region: "us-east-1",
      });
    }
    return S3Singleton.client as S3Client;
  }
}

export { S3Singleton };
