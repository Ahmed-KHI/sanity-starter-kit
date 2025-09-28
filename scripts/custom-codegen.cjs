#!/usr/bin/env node
/**
 * Custom lightweight codegen: walks ./schemas and builds basic TS interfaces.
 * Not a full substitute for @sanity/codegen, but provides richer typings than fallback.
 */
const fs = require('fs');
const path = require('path');
const SCHEMA_DIR = path.join(__dirname, '..', 'schemas');
const OUT = path.join(__dirname, '..', 'generated', 'sanity.types.d.ts');
if (!fs.existsSync(path.dirname(OUT))) fs.mkdirSync(path.dirname(OUT), { recursive: true });

function extractFields(fileContent){
  // naive parse: look for defineField({ name: 'x', ... type: 'number' }) patterns.
  const fieldRegex = /defineField\(\{[^}]*name:\s*'([^']+)'[^}]*type:\s*'([^']+)'/g;
  const fields = [];
  let m; while((m = fieldRegex.exec(fileContent))){
    fields.push({ name: m[1], type: m[2] });
  }
  return fields;
}

function mapType(t){
  switch(t){
    case 'string': case 'slug': case 'text': case 'datetime': case 'date': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'array': return 'any[]';
    case 'reference': return 'any';
    case 'image': case 'file': return 'any';
    case 'object': return 'Record<string, any>';
    default: return 'any';
  }
}

const docs = [];
for(const file of fs.readdirSync(SCHEMA_DIR)){
  if(!file.endsWith('.ts')) continue;
  const full = path.join(SCHEMA_DIR, file);
  const content = fs.readFileSync(full, 'utf8');
  const matchName = content.match(/name:\s*'([a-zA-Z0-9_-]+)'/);
  if(!matchName) continue;
  const docName = matchName[1];
  // crude heuristic: treat top-level defineType export as document.
  if(!/defineType\(/.test(content)) continue;
  const fields = extractFields(content);
  docs.push({ docName, fields });
}

let out = '// Custom generated types (lightweight)\n';
const unionNames = [];
for(const d of docs){
  const ifaceName = d.docName.charAt(0).toUpperCase() + d.docName.slice(1);
  unionNames.push(ifaceName);
  out += `export interface ${ifaceName} {\n  _id: string;\n  _type: '${d.docName}';\n`;
  const seen = new Set();
  for(const f of d.fields){
    if(seen.has(f.name) || f.name.startsWith('_')) continue; // skip duplicates/system
    seen.add(f.name);
    out += `  ${f.name}?: ${mapType(f.type)};\n`;
  }
  out += '}\n\n';
}
if(unionNames.length){
  out += `export type SanityDocumentUnion = ${unionNames.join(' | ')};\n`;
}
fs.writeFileSync(OUT, out, 'utf8');
console.log('[custom-codegen] Wrote', OUT);
