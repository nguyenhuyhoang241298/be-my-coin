import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  const msg = {
    to,
    from: 'register@huyhoang.me',
    subject,
    html
  }

  try {
    await sgMail.send(msg)
    console.log('Email sent to', to)
  } catch (err: any) {
    console.error('Error sending email:', err.response?.body || err)
    throw err
  }
}

export { sendEmail }
