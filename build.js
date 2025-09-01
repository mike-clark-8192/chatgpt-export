#!/usr/bin/env node
import * as esbuild from 'esbuild'
import bookmarkletPlugin from 'esbuild-plugin-bookmarklet'
import fs from 'fs'
import path from 'path'

const isDev = process.argv.includes('--dev');
const devSuffix = isDev ? '.dev' : '';
const outfile = `dist/gpt2md.bookmarklet${devSuffix}.js`;
const mapfile = `dist/gpt2md.bookmarklet${devSuffix}.js.map`;

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

if (fs.existsSync(outfile)) {
  fs.unlinkSync(outfile)
}

if (fs.existsSync(mapfile)) {
  fs.unlinkSync(mapfile)
}



if (isDev) {
  // Dev build: no minify, no bookmarklet, write output, sourcemap enabled
  await esbuild.build({
    bundle: true,
    entryPoints: ['gpt2md.js'],
    format: 'iife',
    minify: false,
    outfile: outfile,
    sourcemap: false,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    write: true,
  });
} else {
  // Prod build: minify, bookmarklet plugin, write: false, sourcemap disabled
  await esbuild.build({
    bundle: true,
    entryPoints: ['gpt2md.js'],
    format: 'iife',
    minify: true,
    outfile: outfile,
    plugins: [bookmarkletPlugin],
    sourcemap: false,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    write: false,
  });
}