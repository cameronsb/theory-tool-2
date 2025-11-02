#!/usr/bin/env node

/**
 * Simple client-side error detector for the piano app
 * Uses Playwright to load the app and check for JavaScript errors
 */

import { chromium } from 'playwright';

const TEST_URL = process.env.TEST_URL || 'http://localhost:5176/';
const TIMEOUT = 10000;

async function testClient() {
  let browser;
  const errors = [];
  const consoleLogs = [];

  try {
    console.log(`🔍 Testing client at ${TEST_URL}...`);

    browser = await chromium.launch({
      headless: true
    });

    const page = await browser.newPage();

    // Capture console errors
    page.on('pageerror', err => {
      errors.push({
        type: 'PAGE_ERROR',
        message: err.message,
        stack: err.stack
      });
    });

    // Capture console messages
    page.on('console', msg => {
      const type = msg.type();
      if (type === 'error') {
        errors.push({
          type: 'CONSOLE_ERROR',
          message: msg.text(),
          location: msg.location()
        });
      }
      consoleLogs.push({
        type: msg.type(),
        text: msg.text()
      });
    });

    // Capture network failures
    page.on('requestfailed', request => {
      errors.push({
        type: 'NETWORK_ERROR',
        url: request.url(),
        failure: request.failure()
      });
    });

    // Navigate to the app
    console.log('📱 Loading application...');
    const response = await page.goto(TEST_URL, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT
    });

    if (!response.ok()) {
      errors.push({
        type: 'LOAD_ERROR',
        status: response.status(),
        statusText: response.statusText()
      });
    }

    // Wait for the app to initialize
    await page.waitForTimeout(2000);

    // Check if the piano component loaded
    console.log('🎹 Checking for piano component...');
    const pianoExists = await page.locator('.piano-container').count() > 0;

    if (!pianoExists) {
      errors.push({
        type: 'COMPONENT_ERROR',
        message: 'Piano component did not render'
      });
    }

    // Try to click a piano key
    console.log('🎵 Testing piano key interaction...');
    const firstKey = await page.locator('.piano-key').first();
    if (await firstKey.count() > 0) {
      await firstKey.click();
      await page.waitForTimeout(500);
    } else {
      errors.push({
        type: 'INTERACTION_ERROR',
        message: 'No piano keys found to interact with'
      });
    }

    // Check for any React errors in the DOM
    const reactErrorBoundary = await page.locator('text=/error|Error|failed|Failed/i').count();
    if (reactErrorBoundary > 0) {
      errors.push({
        type: 'REACT_ERROR',
        message: 'React error boundary triggered or error text found in DOM'
      });
    }

    // Report results
    console.log('\n' + '='.repeat(50));

    if (errors.length === 0) {
      console.log('✅ No client-side errors detected!');
      console.log('🎹 Piano app is running correctly');
    } else {
      console.log(`❌ Found ${errors.length} client-side error(s):\n`);
      errors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type}]`);
        console.log(`   ${error.message || JSON.stringify(error, null, 2)}`);
        if (error.stack) {
          console.log(`   Stack: ${error.stack.split('\n')[0]}`);
        }
        console.log();
      });
      process.exit(1);
    }

    // Show some console logs for debugging
    if (process.env.VERBOSE) {
      console.log('\n📝 Console logs:');
      consoleLogs.slice(-10).forEach(log => {
        console.log(`   [${log.type}] ${log.text}`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testClient().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});