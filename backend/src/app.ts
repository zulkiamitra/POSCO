import express from "express";
import cors from "cors";
import { env } from "./config/env";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import posyandusRouter from "./routes/posyandus";
import childrenRouter from "./routes/children";
import pregnanciesRouter from "./routes/pregnancies";
import sessionsRouter from "./routes/sessions";
import referralsRouter from "./routes/referrals";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }

        const isAllowedLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        const isVercelDomain = origin.endsWith(".vercel.app");
        
        if (origin === env.corsOrigin || isAllowedLocalhost || isVercelDomain) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
    })
  );
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/posyandus", posyandusRouter);
  app.use("/children", childrenRouter);
  app.use("/pregnancies", pregnanciesRouter);
  app.use("/sessions", sessionsRouter);
  app.use("/referrals", referralsRouter);

  app.get("/", (_req, res) => {
    res.json({ name: "posco-backend", status: "ok" });
  });

  return app;
};
