import agent from "@convex-dev/agent/convex.config";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rag from "@convex-dev/rag/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(agent);
app.use(rag);
app.use(betterAuth);

export default app;
