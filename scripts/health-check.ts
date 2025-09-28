#!/usr/bin/env node
/**
 * Lightweight environment & data sanity check.
 * - Verifies required env vars
 * - Attempts a simple GROQ query for products count
 * - Reports placeholder / mock mode
 */
const { createClient } = require('@sanity/client');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yourProjectId';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const placeholder = projectId === 'yourProjectId';

async function run(){
  console.log('--- Sanity Starter Kit Health Check ---');
  console.log('Project ID:', projectId);
  console.log('Dataset   :', dataset);
  if (placeholder){
    console.log('Mode      : placeholder (mock data only)');
    return;
  }
  const client = createClient({ projectId, dataset, apiVersion: '2025-09-01', useCdn: true });
  try {
    const count = await client.fetch('count(*[_type=="product"])');
    console.log('Products  :', count);
    console.log('Status    : OK');
  } catch (err) {
    console.error('Status    : FAILED');
    console.error('Reason    :', (err && typeof err === 'object' && 'message' in err) ? err.message : err);
    process.exitCode = 1;
  }
}
run();