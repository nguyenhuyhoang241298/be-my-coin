import z from 'zod'

export const GetPresignedUrlDTO = z.object({
  bucketName: z.string().min(1),
  objectName: z.string().min(1),
  expiry: z.number().optional()
})

export const PutPresignedUrlDTO = z.object({
  bucketName: z.string().min(1),
  objectName: z.string().min(1),
  expiry: z.number().optional()
})
