# Reproducible Benchmarking

Run the local benchmark with:

```bash
npm run benchmark
```

The script creates 200 independent synthetic lifecycles through the application service and prints elapsed local process time and calculated operations per second. It measures only deterministic in-memory lifecycle creation on the machine that runs it.

> The output is **not** a production benchmark. Do not use it to claim API latency, external integration performance, production throughput, uptime, cost, customer savings, AI accuracy, or service-level objectives.

For a production benchmark, define representative hardware, concurrency, data volume, persistence, third-party integration behavior, authentication, rate limits, observability overhead, pass/fail thresholds, and reproducible load generation before collecting results.
