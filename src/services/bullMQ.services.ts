import IORedis from 'ioredis'

export const connection = new IORedis({
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD!,
  maxRetriesPerRequest: null
})

export const QueueName = {
  EMAIL_QUEUE: 'EMAIL_QUEUE'
} as const

export const JobSchedulerName = {
  COOK_JOB_SCHEDULER: 'COOK_JOB_SCHEDULER'
} as const
