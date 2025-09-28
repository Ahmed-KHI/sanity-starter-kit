#!/usr/bin/env node
// Fallback generator that creates a minimal ambient module if official codegen CLI unavailable.
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'generated', 'sanity.types.d.ts');
if (!fs.existsSync(path.dirname(out))) fs.mkdirSync(path.dirname(out), { recursive: true });
const content = `// Fallback generated types (minimal)
export interface Product { _id: string; _type: 'product'; name?: string; price?: number }
export interface Category { _id: string; _type: 'category'; name?: string }
// Run real codegen when available for complete accuracy.
`;
fs.writeFileSync(out, content, 'utf8');
console.log('Fallback sanity types written to', out);
