import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

function addJsExtensions(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add .js extension to relative imports
    // Split by lines and process each import statement
    const lines = content.split('\n');
    const processed = lines.map(line => {
      // Match: from './...' or from "./..."
      const importMatch = line.match(/from\s+['"](\.[^'"]+)['"]/);
      if (!importMatch) return line;
      
      const importPath = importMatch[1];
      // Skip if already has .js, .json, or .d.ts extension
      if (importPath.endsWith('.js') || importPath.endsWith('.json') || importPath.endsWith('.d.ts')) {
        return line;
      }
      
      // Add .js extension
      return line.replace(
        /from\s+['"](\.[^'"]+)['"]/,
        (match, path) => match.replace(`'${path}'`, `'${path}.js'`).replace(`"${path}"`, `"${path}.js"`)
      );
    });
    
    fs.writeFileSync(filePath, processed.join('\n'), 'utf-8');
    console.log(`✓ Added .js extensions to: ${file}`);
  }
}

try {
  addJsExtensions(distDir);
  console.log('✓ Build complete: All ES module imports have .js extensions');
} catch (error) {
  console.error('✗ Error adding .js extensions:', error.message);
  process.exit(1);
}
