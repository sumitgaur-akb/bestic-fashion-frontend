import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const outputPath = resolve('src/assets/runtime-config.js');
const apiBaseUrl = process.env.API_BASE_URL || '/api';
const escapedApiBaseUrl = JSON.stringify(apiBaseUrl);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `globalThis.__flipshopConfig = {\n  apiBaseUrl: ${escapedApiBaseUrl}\n};\n`
);
