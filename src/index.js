import 'dotenv/config';
import { createApp } from './app.js';
import { seed } from './db/seed.js';

// Always seed on first boot (no-op if data already exists), and optionally
// force a full reseed on every start via RESEED_ON_START=true in .env.
seed({ wipe: process.env.RESEED_ON_START === 'true' });

const app = createApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`\n  Patient Case-Taking API listening on http://localhost:${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/api/health\n`);
});
