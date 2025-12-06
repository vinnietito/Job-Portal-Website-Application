// Import with `import * as Sentry from "@sentry/node"` if you are using ESM

import * as Sentry from "@sentry/node"
import { nodeProfilingingIntegration } from "@sentry/node-profiling"

Sentry.init({
  dsn: "https://ea6521c266573af44142d03543d3396a@o4510426348322816.ingest.us.sentry.io/4510486490841088",
  integrations: [
    nodeProfilingingIntegration(),
    Sentry.mongooseIntegration()
    ],
    // Tracing
    tracesSampleRate: 1.0,
});

Sentry.profiler.startProfiler();

Sentry.startSpan({
    name: "My first Transaction",
}),

Sentry.profiler.stopProfiler();
    

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  