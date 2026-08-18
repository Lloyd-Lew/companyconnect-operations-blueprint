# Developer Runbook

## Local workflow

| Step           | Command                                                                          | Expected result                                                                |
| -------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Clone          | `git clone https://github.com/Lloyd-Lew/companyconnect-operations-blueprint.git` | Local source checkout.                                                         |
| Install        | `npm ci`                                                                         | Exact locked dependencies installed.                                           |
| Configure      | `cp .env.example .env`                                                           | Local demonstration configuration.                                             |
| Run            | `npm run dev`                                                                    | Service listens on port 3000 by default.                                       |
| Health check   | `curl http://localhost:3000/health`                                              | `status: ok` response.                                                         |
| Test           | `npm test`                                                                       | Six automated tests pass.                                                      |
| Static quality | `npm run check`                                                                  | TypeScript and ESLint pass.                                                    |
| Build          | `npm run build`                                                                  | Compiled output in `dist/`.                                                    |
| API session    | Follow [demo session](demo-session.md)                                           | Synthetic lifecycle, approval, retry, support, KPI, and audit paths exercised. |
| Stop           | `Ctrl+C`                                                                         | Process ends; all in-memory demonstration records are discarded.               |

## Troubleshooting

| Symptom                         | Likely cause                                                              | Safe response                                                   |
| ------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `npm ci` fails                  | Unsupported Node version or a corrupted local dependency directory        | Use Node 22+, delete `node_modules`, and rerun `npm ci`.        |
| Port 3000 is busy               | Another local process is bound to the default port                        | Set `PORT=3001` in `.env` and retry.                            |
| Lifecycle request returns `400` | Missing idempotency key, invalid input, or no synthetic-data confirmation | Use the README sample and inspect the response `error.code`.    |
| Approval returns `409`          | The lifecycle is not in `awaiting_approval`                               | Create a new synthetic lifecycle or inspect the returned state. |
| State disappears after restart  | Expected reference behavior                                               | The implementation intentionally uses no database.              |
