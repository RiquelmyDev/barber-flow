export default () => ({
  app: {
    name: 'BarberFlow',
    url: process.env.APP_URL ?? 'http://localhost:3000',
    port: parseInt(process.env.PORT ?? '4000', 10),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  queue: {
    redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY ?? '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL ?? 'no-reply@barberflow.app',
  },
  whatsapp: {
    accessToken: process.env.META_WABA_ACCESS_TOKEN ?? '',
    phoneNumberId: process.env.META_WABA_PHONE_NUMBER_ID ?? '',
    fallbackNumber: process.env.WHATSAPP_FALLBACK_NUMBER ?? '',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    region: process.env.AWS_REGION ?? 'us-east-1',
    bucket: process.env.AWS_S3_BUCKET ?? 'barberflow-dev',
  },
  webhook: {
    secret: process.env.WEBHOOK_SECRET ?? 'super-secret',
  },
});
