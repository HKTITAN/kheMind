/**
 * Shared "Deploy to Vercel" clone URL (env hints + docs link).
 * @see https://vercel.com/docs/deploy-button/environment-variables
 */
const REPO = "https%3A%2F%2Fgithub.com%2FHKTITAN%2FkheMind";
const ENV =
  "NEXT_PUBLIC_CONVEX_URL%2CBRIDGE_SECRET%2CINGEST_SECRET%2CMCP_BEARER_TOKEN%2CQUARTZ_BASE_URL%2CVAULT_VIEW_PASSWORD%2CVAULT_VIEW_COOKIE_TOKEN";
const ENV_LINK = `https%3A%2F%2Fgithub.com%2FHKTITAN%2FkheMind%23environment-variables`;
const ENV_DESCRIPTION = encodeURIComponent(
  "Use the Convex Vercel integration for NEXT_PUBLIC_CONVEX_URL when possible. Generate BRIDGE_SECRET, INGEST_SECRET, and MCP_BEARER_TOKEN on your deployment at /setup (or paste from Advanced). QUARTZ_BASE_URL and VAULT_* are optional.",
);

export const VERCEL_DEPLOY_CLONE_HREF = `https://vercel.com/new/clone?repository-url=${REPO}&env=${ENV}&envLink=${ENV_LINK}&envDescription=${ENV_DESCRIPTION}`;
