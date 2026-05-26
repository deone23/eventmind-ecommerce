import type { Plugin } from 'vite';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';

export function resolveIndexPlugin(): Plugin {
  return {
    name: 'resolve-index',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer) return null;
      
      // Handle relative imports without extensions
      if (source.startsWith('.')) {
        const importerDir = dirname(importer);
        const absolutePath = resolve(importerDir, source);
        
        // Try to resolve as index.ts file
        const indexPath = resolve(absolutePath, 'index.ts');
        if (existsSync(indexPath)) {
          return indexPath;
        }
        
        // Try with .ts extension
        const tsPath = absolutePath + '.ts';
        if (existsSync(tsPath)) {
          return tsPath;
        }
        
        // Try with .tsx extension
        const tsxPath = absolutePath + '.tsx';
        if (existsSync(tsxPath)) {
          return tsxPath;
        }
      }
      
      return null;
    },
  };
}
