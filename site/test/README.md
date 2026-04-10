# Testing

This project uses `vitest` for unit/integration tests.

## Run tests

- Run once: `npm test`
- Watch mode: `npm run test:watch`

## Current scope

Initial tests target pure logic/data modules:
- `src/utility.js`
- `src/data/pubsub.js`
- `src/data/group-data.js`

DOM/custom-element integration tests are intentionally deferred to a later wave.
