export const SITE_HOST = "mary-jute.ru";
export const SITE_URL = (process.env.SITE_URL || `https://${SITE_HOST}`).replace(/\/$/, "");
export const CONTACT_EMAIL = "hello@mary-jute.ru";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
