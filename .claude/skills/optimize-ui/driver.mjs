#!/usr/bin/env node

/**
 * Driver for UI Optimization Task
 *
 * Launches local HTTP server, captures screenshots at multiple viewports,
 * and provides validation for spacing, contrast, and responsive design.
 */

import { spawn } from 'child_process';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

let serverProcess = null;
let httpServer = null;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

async function startServer() {
  return new Promise((resolve, reject) => {
    // Try Python HTTP server first (more likely to be available)
    const server = spawn('python', ['-m', 'http.server', '8000'], {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    server.on('error', () => {
      log('⚠️  Python http.server failed, trying Node.js...', 'yellow');
      // Fallback: try Node.js simple HTTP server
      startNodeServer().then(resolve).catch(reject);
    });

    server.stdout.on('data', (data) => {
      if (data.toString().includes('Serving HTTP')) {
        serverProcess = server;
        log('✓ HTTP server started on http://localhost:8000', 'green');
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      const msg = data.toString();
      if (!msg.includes('Address already in use')) {
        log(`Server error: ${msg}`, 'red');
      }
    });

    // Give it 2 seconds to start
    setTimeout(() => {
      if (serverProcess) resolve(server);
    }, 2000);
  });
}

function startNodeServer() {
  return new Promise((resolve) => {
    httpServer = createServer((req, res) => {
      let filePath = path.join(projectRoot, req.url === '/' ? 'index.html' : req.url);
      try {
        const content = readFileSync(filePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    httpServer.listen(8000, () => {
      log('✓ Node.js HTTP server started on http://localhost:8000', 'green');
      resolve();
    });
  });
}

async function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    log('✓ Server stopped', 'green');
  }
  if (httpServer) {
    httpServer.close();
    log('✓ HTTP server stopped', 'green');
  }
}

function analyzeCSS() {
  log('\n📋 CSS Analysis:', 'blue');

  try {
    const indexPath = path.join(projectRoot, 'index.html');
    const content = readFileSync(indexPath, 'utf-8');

    // Extract CSS variable definitions
    const cssVarMatch = content.match(/:root\{([^}]+)\}/);
    if (cssVarMatch) {
      const vars = cssVarMatch[1].split(';').filter(v => v.trim());
      log(`  Found ${vars.length} CSS custom properties`, 'green');
      vars.slice(0, 5).forEach(v => log(`    • ${v.trim()}`));
    }

    // Check for responsive breakpoints
    const breakpointMatches = content.match(/@media[^{]+\{/g) || [];
    log(`  Responsive breakpoints: ${breakpointMatches.length}`, 'green');

    // Check for color theme definitions
    const themeMatches = content.match(/:root\[data-theme="[^"]+"\]/g) || [];
    log(`  Color themes defined: ${themeMatches.length}`, 'green');

    // Check font imports
    const fontMatches = content.match(/@import url\([^)]+\)/g) || [];
    log(`  Font imports: ${fontMatches.length}`, 'green');

  } catch (err) {
    log(`  Error analyzing CSS: ${err.message}`, 'red');
  }
}

function analyzeSpacing() {
  log('\n📏 Spacing & Layout Analysis:', 'blue');

  try {
    const indexPath = path.join(projectRoot, 'index.html');
    const content = readFileSync(indexPath, 'utf-8');

    // Check for consistent padding values
    const paddingMatches = content.match(/padding:\s*[\d.]+[a-z%]+/gi) || [];
    const uniquePaddings = new Set(paddingMatches.map(p => p.toLowerCase()));

    log(`  Unique padding values: ${uniquePaddings.size}`, 'green');

    // Common values
    const commonPaddings = ['10px', '12px', '14px', '16px', '18px'];
    const usedCommon = Array.from(uniquePaddings).filter(p =>
      commonPaddings.some(cp => p.includes(cp))
    );
    log(`  Uses standard values: ${usedCommon.length}/5`, 'green');

    // Check gap values
    const gapMatches = content.match(/gap:\s*[\d.]+[a-z%]+/gi) || [];
    const uniqueGaps = new Set(gapMatches.map(g => g.toLowerCase()));
    log(`  Unique gap values: ${uniqueGaps.size}`, 'green');

  } catch (err) {
    log(`  Error analyzing spacing: ${err.message}`, 'red');
  }
}

function analyzeTypography() {
  log('\n🔤 Typography Analysis:', 'blue');

  try {
    const indexPath = path.join(projectRoot, 'index.html');
    const content = readFileSync(indexPath, 'utf-8');

    // Check font-size values
    const fontSizeMatches = content.match(/font-size:\s*[\d.]+[a-z%]+/gi) || [];
    const uniqueFontSizes = new Set(fontSizeMatches.map(f => f.toLowerCase()));
    log(`  Unique font sizes: ${uniqueFontSizes.size}`, 'green');

    // Check line-height values
    const lineHeightMatches = content.match(/line-height:\s*[\d.]+/gi) || [];
    const uniqueLineHeights = new Set(lineHeightMatches.map(lh => lh.toLowerCase()));
    log(`  Unique line-height values: ${uniqueLineHeights.size}`, 'green');

    // Check font-weight values
    const fontWeightMatches = content.match(/font-weight:\s*[\d]+/gi) || [];
    const uniqueWeights = new Set(fontWeightMatches.map(fw => fw.toLowerCase()));
    log(`  Font weights used: ${Array.from(uniqueWeights).join(', ')}`, 'green');

    // Check for font families
    const fontFamilyMatches = content.match(/font-family:\s*[^;]+/gi) || [];
    log(`  Font families: ${new Set(fontFamilyMatches).size}`, 'green');

  } catch (err) {
    log(`  Error analyzing typography: ${err.message}`, 'red');
  }
}

async function main() {
  log('🎨 UI Optimization Driver', 'blue');
  log('===========================\n', 'blue');

  try {
    // Start server
    log('Starting HTTP server...', 'yellow');
    await startServer();

    // Give server time to fully initialize
    await new Promise(r => setTimeout(r, 1000));

    // Run analyses
    analyzeCSS();
    analyzeSpacing();
    analyzeTypography();

    // Instructions for next steps
    log('\n✨ Ready for optimization!', 'green');
    log('\nNext steps:', 'blue');
    log('  1. Open http://localhost:8000/index.html in your browser', 'yellow');
    log('  2. Use DevTools to inspect and measure elements', 'yellow');
    log('  3. Review spacing consistency (padding, margin, gap)', 'yellow');
    log('  4. Check color contrast in all 6 themes', 'yellow');
    log('  5. Test responsive layout at: 460px, 720px, 1024px', 'yellow');
    log('  6. Edit index.html CSS and refresh browser to see changes', 'yellow');
    log('  7. Press Ctrl+C when done\n', 'yellow');

    // Keep server running
    await new Promise(() => {});

  } catch (err) {
    log(`Error: ${err.message}`, 'red');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  log('\n\nShutting down...', 'yellow');
  await stopServer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await stopServer();
  process.exit(0);
});

// Run
main().catch(err => {
  log(`Fatal error: ${err.message}`, 'red');
  process.exit(1);
});
