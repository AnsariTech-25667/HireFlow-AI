const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateScreenshots() {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    // Generate Hero Section Screenshot
    console.log('Generating hero section screenshot...');
    await page.goto(`file://${path.resolve('./screenshots/hero-section.html')}`);
    await page.waitForTimeout(2000); // Wait for animations
    await page.screenshot({ 
        path: './screenshots/hero-section.png', 
        fullPage: false,
        type: 'png'
    });

    // Generate Job Cards Screenshot
    console.log('Generating job cards screenshot...');
    await page.goto(`file://${path.resolve('./screenshots/job-cards.html')}`);
    await page.waitForTimeout(2000);
    await page.screenshot({ 
        path: './screenshots/job-cards.png', 
        fullPage: false,
        type: 'png'
    });

    // Generate Analytics Dashboard Screenshot
    console.log('Generating analytics dashboard screenshot...');
    await page.goto(`file://${path.resolve('./screenshots/analytics-dashboard.html')}`);
    await page.waitForTimeout(2000);
    await page.screenshot({ 
        path: './screenshots/analytics-dashboard.png', 
        fullPage: false,
        type: 'png'
    });

    await browser.close();
    console.log('All screenshots generated successfully!');
}

generateScreenshots().catch(console.error);