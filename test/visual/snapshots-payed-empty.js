const PercyScript = require('@percy/script');

PercyScript.run(async (page, percySnapshot) => {
    await page.goto('http://localhost:5000/app/login');
    
    await page.waitFor('#login');
    await page.type('#email', 'percy+payed-empty@f5.com.br');
    await page.type('#password', 'percy123');
    await page.click('#login');
    await page.waitFor('.dashboard-grid');
    await percySnapshot('Dashboard page (payed empty user)');

    await page.click('#bins-link a');
    await page.waitFor('.empty-page--bins');
    await percySnapshot('Dashboard page for bins (payed empty user)');

    await page.click('#requests-link a');
    await page.waitFor('.empty-page--requests');
    await percySnapshot('Dashboard page for orders (payed empty user)');

    await page.click('#profile-link a');
    await page.waitFor('.profile-page');
    await percySnapshot('Dashboard page for profile (payed empty user)');

    await page.click('#gathering-link a');
    await page.waitFor('.empty-page--gathering');
    await percySnapshot('Dashboard page for gathering (payed empty user)');

    await page.click('#new-bin-link');
    await page.waitFor('#address');
    await percySnapshot('Register page for new bin request (payed empty user)');
});