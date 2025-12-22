import * as minio from 'minio'

const minioClient = new minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT!),
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS,
  secretKey: process.env.MINIO_SECRET
})

export const getPresignedPutUrlService = async (bucketName: string, objectName: string, expiry?: number) => {
  return await minioClient.presignedPutObject(bucketName, objectName, expiry)
}
export default minioClient
