import { createApp } from "../src/app";
import { ensureDefaultUsers } from "../src/db/seedHelper";

const app = createApp();

// Ensure default admin/users exist on startup
ensureDefaultUsers().catch((err) => {
  console.error("❌ Failed to ensure default users on Vercel startup:", err);
});

export default app;
