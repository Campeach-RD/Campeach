// Remote-only secrets are not visible to `wrangler types`; this augments the generated binding.
interface Env {
  GOOGLE_SERVICE_ACCOUNT_JSON: string;
  ADMIN_API_TOKEN: string;
}
