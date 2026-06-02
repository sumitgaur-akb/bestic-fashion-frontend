import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const outputPath = resolve('src/assets/runtime-config.js');
const configName = process.argv[2] || process.env.APP_CONFIG || 'local';
const configPath = resolve(`src/assets/config.${configName}.json`);
if (!existsSync(configPath)) {
  throw new Error(`Runtime config not found: ${configPath}`);
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const apiBaseUrl = process.env.API_BASE_URL || config.apiBaseUrl || '/api';
const escapedApiBaseUrl = JSON.stringify(apiBaseUrl);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `globalThis.__flipshopConfig = {\n  apiBaseUrl: ${escapedApiBaseUrl}\n};\n`
);
