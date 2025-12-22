export const replaceMinioUrl = (url: string): string => {
  if (process.env.NODE_ENV !== 'production') return url

  const urlObj = new URL(url)
  const publicUrl = new URL(process.env.MINIO_PUBLIC_URL!)

  urlObj.protocol = publicUrl.protocol
  urlObj.host = publicUrl.host

  return urlObj.toString()
}
