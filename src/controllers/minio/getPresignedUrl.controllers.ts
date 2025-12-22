import express from 'express'
import { getPresignedPutUrlService } from '~/services/minio.services'
import { PutPresignedUrlDTO } from './dto'

export const getPresignedPutUrl = async (req: express.Request, res: express.Response) => {
  try {
    const dto = PutPresignedUrlDTO.safeParse(req.query)

    if (!dto.success) {
      return res.status(400).json({ message: 'Invalid request data' })
    }

    const { bucketName, objectName, expiry } = dto.data

    const presignedUrl = await getPresignedPutUrlService(bucketName, objectName, expiry)

    res.status(200).json({ presignedUrl })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
