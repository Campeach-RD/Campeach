// Remote-only secrets are not visible to `wrangler types`; this augments the generated binding.
interface Env {
  GOOGLE_SERVICE_ACCOUNT_JSON: string;
  ADMIN_API_TOKEN: string;
  OPENAI_API_KEY: string;
  META_APP_SECRET: string;
  META_WEBHOOK_VERIFY_TOKEN: string;
  INSTAGRAM_ACCESS_TOKEN: string;
  INSTAGRAM_ACCOUNT_ID: string;
  META_GRAPH_API_VERSION: string;
}
