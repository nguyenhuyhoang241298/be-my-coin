import { Queue, Worker } from 'bullmq'
import { JobSchedulerName, QueueName, connection } from '~/services/bullMQ.services'
import { sendEmail } from '~/services/email.services'

export const upsertCookEmailJob = async () => {
  const emailQueue = new Queue(QueueName.EMAIL_QUEUE, { connection })

  return await emailQueue.upsertJobScheduler(
    JobSchedulerName.COOK_JOB_SCHEDULER,
    {
      pattern: '0 30 17 * * 1-5',
      tz: 'Asia/Ho_Chi_Minh'
    },
    {
      name: 'every-week-email-job'
    }
  )
}

export const getCookEmailWorker = () => {
  return new Worker(
    QueueName.EMAIL_QUEUE,
    async (job) => {
      console.log(`Processing repeat job ${job.id} of type ${job.name} with data:`)
      await sendEmail({
        to: 'nguyenmai198.hust@gmail.com',
        subject: 'Nhắc nhở về sớm nấu cơm tối',
        html: `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nhắc nhở: Về sớm nấu cơm tối</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e9e9ef;">
            <tr>
              <td style="padding:18px 20px;background:#111827;color:#ffffff;">
                <div style="font-size:14px;opacity:.85;">🔔 Nhắc nhở thị mai</div>
                <div style="font-size:20px;font-weight:700;line-height:1.2;margin-top:4px;">
                  Về sớm nấu cơm tối !!!!!
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:20px;color:#111827;">
                <div style="font-size:16px;line-height:1.6;">
                  Thị Mai, nhớ <b>về sớm</b> để còn <b>nấu cơm tối</b> nhé.
                  Đừng để tui đói 😼
                </div>

                <div style="margin:16px 0;padding:14px;border-radius:12px;background:#f3f4f6;border:1px dashed #d1d5db;">
                  <div style="font-size:14px;color:#374151;line-height:1.6;">
                    ✅ Checklist nhanh:
                    <ul style="margin:10px 0 0 18px;padding:0;">
                      <li>Đi chợ hoặc winmart (nếu hết đồ ăn)</li>
                      <li>Dọn dẹp sạch sẽ trước, trong và sau khi nấu</li>
                      <li>Nhớ cắm cơm, hấp trứng + khoai</li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
      })
    },
    { connection }
  )
}
