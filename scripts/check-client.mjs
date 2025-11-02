#!/usr/bin/env node

/**
 * Client-side error checker
 * Fetches the dev server page and checks for common issues
 * No external dependencies required - uses built-in Node.js modules
 */

import { get } from 'http';

const PORT = process.env.PORT || 5176;
const HOST = process.env.HOST || 'localhost';
const URL = `http://${HOST}:${PORT}`;

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function checkClient() {
  console.log(`🔍 Checking client at ${URL}...\n`);

  const errors = [];
  const warnings = [];

  try {
    // Fetch the main page
    const { status, body } = await fetchPage(URL);

    if (status !== 200) {
      errors.push(`Server returned status ${status}`);
      console.log(`❌ Server error: Status ${status}`);
      process.exit(1);
    }

    console.log('✅ Server is running');

    // Check for essential elements
    if (!body.includes('id="root"')) {
      errors.push('Root element not found - React may not be mounting');
    } else {
      console.log('✅ Root element found');
    }

    // Check if Vite scripts are loading
    if (!body.includes('type="module"')) {
      errors.push('No module scripts found - Vite may not be serving correctly');
    } else {
      console.log('✅ Module scripts detected');
    }

    // Check for error messages in the initial HTML
    const errorPatterns = [
      /error/i,
      /failed to/i,
      /cannot find module/i,
      /unexpected token/i,
      /syntaxerror/i
    ];

    errorPatterns.forEach(pattern => {
      if (pattern.test(body)) {
        // Filter out false positives (like 'onerror' attributes)
        const match = body.match(pattern);
        if (match && !match[0].includes('onerror') && !match[0].includes('Error')) {
          warnings.push(`Potential error pattern found: "${match[0]}"`);
        }
      }
    });

    // Fetch the main JavaScript file to check for syntax errors
    const scriptMatch = body.match(/src="(\/src\/main\.tsx[^"]*)"/);
    if (scriptMatch) {
      const scriptUrl = `${URL}${scriptMatch[1]}`;
      console.log(`📦 Checking main script: ${scriptMatch[1]}`);

      try {
        const { status: scriptStatus } = await fetchPage(scriptUrl);
        if (scriptStatus === 200) {
          console.log('✅ Main script loads successfully');
        } else {
          errors.push(`Main script returned status ${scriptStatus}`);
        }
      } catch (err) {
        errors.push(`Failed to load main script: ${err.message}`);
      }
    }

    // Report results
    console.log('\n' + '='.repeat(50));

    if (errors.length === 0) {
      console.log('✅ No critical errors detected!');

      if (warnings.length > 0) {
        console.log(`\n⚠️  ${warnings.length} warning(s):`);
        warnings.forEach(w => console.log(`   - ${w}`));
      }

      console.log('\n💡 Next steps:');
      console.log('   1. Open browser at ' + URL);
      console.log('   2. Open DevTools Console (F12)');
      console.log('   3. Check for runtime errors');
      console.log('   4. Try clicking piano keys');

      process.exit(0);
    } else {
      console.log(`❌ Found ${errors.length} error(s):\n`);
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Failed to check client:', error.message);
    console.log('\n💡 Make sure the dev server is running:');
    console.log('   npm run dev');
    process.exit(1);
  }
}

// Run the check
checkClient();