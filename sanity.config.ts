import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemas';

// Defensive: attempt to load .env here in case the CLI was launched without our npm script
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
} catch (_) {
    // ignore if dotenv not installed (should be dev dep)
}

// Accept multiple possible env var names to reduce friction across tutorials / user expectations
const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    undefined;

const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_STUDIO_DATASET ||
    process.env.SANITY_DATASET ||
    'production';

if (!projectId || projectId === 'yourProjectId') {
    const visibleKeys = Object.keys(process.env)
        .filter(k => k.toLowerCase().includes('sanity') || k.includes('NEXT_PUBLIC'))
        .sort();
    throw new Error(
        'Missing Sanity projectId. Tried env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_STUDIO_PROJECT_ID, SANITY_PROJECT_ID.\n' +
            'Detected (filtered) env keys in process: ' + visibleKeys.join(', ') + '\n\n' +
            'Fix steps:\n' +
            '  1) Copy .env.example to .env if not done\n' +
            '  2) Add NEXT_PUBLIC_SANITY_PROJECT_ID=<your real id> (or SANITY_PROJECT_ID)\n' +
            '  3) (Optional) SANITY_API_TOKEN=<write token> for seeding / mutations\n' +
            '  4) Re-run: npm run dev:studio\n' +
            'If this still fails, ensure the npm script includes dotenv preload OR run: node -r dotenv/config node_modules/@sanity/cli/bin/sanity dev' 
    );
}

// Optional one-line debug (comment out to silence)
// console.log('[sanity.config] Using projectId=%s dataset=%s', projectId, dataset);

export default defineConfig({
    name: 'default',
    title: 'Ecommerce Starter',
    projectId,
    dataset,
    plugins: [deskTool()],
    schema: { types: schemaTypes }
});
