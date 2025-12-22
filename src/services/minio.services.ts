import * as minio from 'minio'
import { replaceMinioUrl } from './helpers'

const minioClient = new minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS,
  secretKey: process.env.MINIO_SECRET
})

export const getPresignedPutUrlService = async (bucketName: string, objectName: string, expiry?: number) => {
  const url = await minioClient.presignedPutObject(bucketName, objectName, expiry)
  return replaceMinioUrl(url)
}
export default minioClient
