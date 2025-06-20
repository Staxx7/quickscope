#!/usr/bin/env node

// Test script to verify navigation fixes

const { chromium } = require('playwright');

async function testNavigationFix() {
  console.log('Testing navigation fix for Extract Data button...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to admin dashboard
    console.log('1. Navigating to admin dashboard...');
    await page.goto('https://www.quickscope.info/admin/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for Stax LLC in the table
    console.log('2. Looking for Stax LLC...');
    const staxRow = await page.locator('tr:has-text("Stax LLC")').first();
    
    if (await staxRow.isVisible()) {
      console.log('✓ Found Stax LLC in the table');
      
      // Find the Extract Data button for Stax LLC
      const extractButton = staxRow.locator('button:has-text("Extract Data")');
      
      if (await extractButton.isVisible()) {
        console.log('✓ Found Extract Data button');
        
        // Set up listeners to detect popups/alerts
        let alertShown = false;
        page.on('dialog', async dialog => {
          console.log('❌ ALERT/POPUP DETECTED:', dialog.message());
          alertShown = true;
          await dialog.dismiss();
        });
        
        // Click the button
        console.log('3. Clicking Extract Data button...');
        await extractButton.click();
        
        // Wait a bit to see if alert shows
        await page.waitForTimeout(2000);
        
        if (alertShown) {
          console.log('❌ FAILED: Popup/alert was shown instead of navigation');
        } else {
          // Check if we navigated to data extraction page
          const currentUrl = page.url();
          console.log('Current URL:', currentUrl);
          
          if (currentUrl.includes('/data-extraction')) {
            console.log('✓ SUCCESS: Navigated to data extraction page');
            
            // Check if company context is maintained
            if (currentUrl.includes('Stax') || currentUrl.includes('stax')) {
              console.log('✓ Company context maintained in URL');
            } else {
              console.log('⚠ Warning: Company context may not be in URL');
            }
            
            // Check if page shows Stax LLC
            const pageText = await page.locator('body').textContent();
            if (pageText.includes('Stax LLC')) {
              console.log('✓ Company name displayed on page');
            } else {
              console.log('⚠ Warning: Company name not found on page');
            }
          } else {
            console.log('❌ FAILED: Did not navigate to data extraction page');
          }
        }
      } else {
        console.log('❌ Extract Data button not found');
      }
    } else {
      console.log('❌ Stax LLC not found in the table');
      console.log('Available companies:');
      const rows = await page.locator('tbody tr').all();
      for (const row of rows) {
        const text = await row.textContent();
        console.log(' -', text.slice(0, 50) + '...');
      }
    }

  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    console.log('\nTest complete. Browser will close in 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// Run the test
testNavigationFix().catch(console.error);