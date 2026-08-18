import { createApp } from "./api/app.js";
import { environment } from "./config/env.js";

const app = createApp();

app.listen(environment.PORT, () => {
  console.log(
    JSON.stringify({
      event: "server.started",
      port: environment.PORT,
      demoMode: environment.DEMO_MODE,
      logLevel: environment.LOG_LEVEL
    })
  );
});
