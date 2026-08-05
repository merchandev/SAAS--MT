import { z } from "zod";

const emailConfigSchema = z.object({
  mode: z.enum(["hostinger_vps", "unrestricted_self_hosted", "development"]).default("hostinger_vps"),
  sendEnabled: z.boolean().default(false),
  domain: z.string().min(1, "MAIL_DOMAIN is required"),
  hostname: z.string().min(1, "MAIL_HOSTNAME is required"),
  publicIp: z.string().optional(),
  dkimSelector: z.string().default("s1"),
  
  fromName: z.string().default("Transfers in Barcelona"),
  fromTransactional: z.string().email(),
  fromMarketing: z.string().email(),
  replyTo: z.string().email(),
  bounceDomain: z.string().min(1, "MAIL_BOUNCE_DOMAIN is required"),
  reportsDomain: z.string().min(1, "MAIL_REPORTS_DOMAIN is required"),
  
  timezone: z.string().default("Europe/Madrid"),
  appUrl: z.string().url("MAIL_APP_URL must be a valid URL"),
  
  smtp: z.object({
    host: z.string().default("postfix"),
    port: z.number().int().default(25),
    secure: z.boolean().default(false),
    requireTls: z.boolean().default(false),
    authRequired: z.boolean().default(false),
    user: z.string().optional(),
    pass: z.string().optional(),
    caFile: z.string().optional(),
    connectionTimeoutMs: z.number().int().default(10000),
    socketTimeoutMs: z.number().int().default(30000),
  }),
  
  worker: z.object({
    id: z.string().default("worker-1"),
    batchSize: z.number().int().positive().default(10),
    pollMs: z.number().int().positive().default(1000),
    lockSeconds: z.number().int().positive().default(300),
    maxLocalSubmitAttempts: z.number().int().positive().default(6),
    eventSpool: z.string().default("/var/spool/mail-events"),
  }),
  
  limits: z.object({
    globalRatePerMinute: z.number().int().positive().default(4),
    marketingRatePerHour: z.number().int().positive().default(180),
    transactionalRatePerHour: z.number().int().positive().default(240),
    maxCampaignRatePerHour: z.number().int().positive().default(240),
    maxCampaignRecipients: z.number().int().positive().default(100000),
  }),
  
  dsn: z.object({
    notify: z.string().default("failure,delay"),
    successEnabled: z.boolean().default(false),
  }),
  
  secrets: z.object({
    unsubscribeSecret: z.string().min(1, "MAIL_UNSUBSCRIBE_SECRET is required"),
    internalEventSecret: z.string().optional(),
  }),
  
  security: z.object({
    dnsEnforce: z.boolean().default(true),
    requireDkim: z.boolean().default(true),
    requireReverseDns: z.boolean().default(true),
  }),
  
  hostinger: z.object({
    confirmedRatePerMinute: z.number().int().positive().default(5),
    allowConfirmedOverride: z.boolean().default(false),
  })
});

function loadConfig() {
  const isTrue = (val: string | undefined) => val === "true" || val === "1";

  const rawConfig = {
    mode: process.env.MAIL_INFRA_MODE || "hostinger_vps",
    sendEnabled: isTrue(process.env.MAIL_SEND_ENABLED),
    domain: process.env.MAIL_DOMAIN || "transfersinbarcelona.com",
    hostname: process.env.MAIL_HOSTNAME || "mail.transfersinbarcelona.com",
    publicIp: process.env.MAIL_PUBLIC_IP,
    dkimSelector: process.env.DKIM_SELECTOR || "s1",
    
    fromName: process.env.MAIL_FROM_NAME || "Transfers in Barcelona",
    fromTransactional: process.env.MAIL_FROM_TRANSACTIONAL || "reservas@transfersinbarcelona.com",
    fromMarketing: process.env.MAIL_FROM_MARKETING || "novedades@transfersinbarcelona.com",
    replyTo: process.env.MAIL_REPLY_TO || "info@transfersinbarcelona.com",
    bounceDomain: process.env.MAIL_BOUNCE_DOMAIN || "bounce.transfersinbarcelona.com",
    reportsDomain: process.env.MAIL_REPORTS_DOMAIN || "reports.transfersinbarcelona.com",
    
    timezone: process.env.MAIL_DEFAULT_TIMEZONE || "Europe/Madrid",
    appUrl: process.env.MAIL_APP_URL || "https://transfersinbarcelona.com",
    
    smtp: {
      host: process.env.SMTP_HOST || "postfix",
      port: parseInt(process.env.SMTP_PORT || "25", 10),
      secure: isTrue(process.env.SMTP_SECURE),
      requireTls: isTrue(process.env.SMTP_REQUIRE_TLS),
      authRequired: isTrue(process.env.SMTP_AUTH_REQUIRED),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      caFile: process.env.SMTP_CA_FILE,
      connectionTimeoutMs: parseInt(process.env.SMTP_CONNECTION_TIMEOUT_MS || "10000", 10),
      socketTimeoutMs: parseInt(process.env.SMTP_SOCKET_TIMEOUT_MS || "30000", 10),
    },
    
    worker: {
      id: process.env.EMAIL_WORKER_ID || "worker-1",
      batchSize: parseInt(process.env.EMAIL_WORKER_BATCH_SIZE || "10", 10),
      pollMs: parseInt(process.env.EMAIL_WORKER_POLL_MS || "1000", 10),
      lockSeconds: parseInt(process.env.EMAIL_LOCK_SECONDS || "300", 10),
      maxLocalSubmitAttempts: parseInt(process.env.EMAIL_MAX_LOCAL_SUBMIT_ATTEMPTS || "6", 10),
      eventSpool: process.env.EMAIL_EVENT_SPOOL || "/var/spool/mail-events",
    },
    
    limits: {
      globalRatePerMinute: parseInt(process.env.MAIL_GLOBAL_RATE_PER_MINUTE || "9", 10),
      marketingRatePerHour: parseInt(process.env.MAIL_MARKETING_RATE_PER_HOUR || "490", 10),
      transactionalRatePerHour: parseInt(process.env.MAIL_TRANSACTIONAL_RATE_PER_HOUR || "490", 10),
      maxCampaignRatePerHour: parseInt(process.env.MAIL_MAX_CAMPAIGN_RATE_PER_HOUR || "490", 10),
      maxCampaignRecipients: parseInt(process.env.MAIL_MAX_CAMPAIGN_RECIPIENTS || "100000", 10),
    },
    
    dsn: {
      notify: process.env.MAIL_DSN_NOTIFY || "failure,delay",
      successEnabled: isTrue(process.env.MAIL_DSN_SUCCESS_ENABLED),
    },
    
    secrets: {
      unsubscribeSecret: process.env.MAIL_UNSUBSCRIBE_SECRET || "dummy-secret-if-disabled",
      internalEventSecret: process.env.MAIL_INTERNAL_EVENT_SECRET,
    },
    
    security: {
      dnsEnforce: process.env.MAIL_DNS_ENFORCE !== "false",
      requireDkim: process.env.MAIL_REQUIRE_DKIM !== "false",
      requireReverseDns: process.env.MAIL_REQUIRE_REVERSE_DNS !== "false",
    },
    
    hostinger: {
      confirmedRatePerMinute: parseInt(process.env.HOSTINGER_CONFIRMED_RATE_PER_MINUTE || "9", 10),
      allowConfirmedOverride: process.env.HOSTINGER_ALLOW_CONFIRMED_OVERRIDE !== "false",
    }
  };

  const parsed = emailConfigSchema.safeParse(rawConfig);
  
  if (!parsed.success) {
    console.error("❌ Email configuration validation error:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    // En producción y worker, si está activado el envío, fallamos rápido
    if (rawConfig.sendEnabled) {
      throw new Error("Invalid email configuration. Stopping execution.");
    }
    console.warn("⚠️ Continuing with invalid email config because MAIL_SEND_ENABLED is false.");
    return rawConfig as any;
  }
  
  const conf = parsed.data;
  
  if (conf.mode === "hostinger_vps" && conf.limits.globalRatePerMinute > 4) {
    if (!conf.hostinger.allowConfirmedOverride || conf.limits.globalRatePerMinute > conf.hostinger.confirmedRatePerMinute) {
      throw new Error(`En modo hostinger_vps el límite no puede superar 4/minuto (configurado: ${conf.limits.globalRatePerMinute}).`);
    }
  }
  
  if (conf.mode === "unrestricted_self_hosted" && !conf.smtp.requireTls) {
     console.warn("⚠️ unrestricted_self_hosted should normally use requireTls=true when sending to an external MTA.");
  }
  
  if (conf.sendEnabled && !conf.appUrl.startsWith("https://") && process.env.NODE_ENV === "production") {
    throw new Error("MAIL_APP_URL must use https:// in production");
  }
  
  if (conf.sendEnabled && conf.smtp.requireTls && !conf.smtp.caFile) {
    console.warn("⚠️ SMTP_REQUIRE_TLS is true but SMTP_CA_FILE is not provided. Relying on system certificates.");
  }

  const checkDomain = (email: string) => {
    if (!email.endsWith(`@${conf.domain}`) && !email.endsWith(`@bounce.${conf.domain}`)) {
       console.warn(`⚠️ The email ${email} does not belong to the domain ${conf.domain}`);
    }
  };
  
  checkDomain(conf.fromTransactional);
  checkDomain(conf.fromMarketing);
  checkDomain(conf.replyTo);
  
  return conf;
}

export const emailConfig = loadConfig();
