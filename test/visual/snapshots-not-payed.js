const PercyScript = require('@percy/script');

PercyScript.run(async (page, percySnapshot) => {
    await page.goto('http://localhost:5000/app/login');
    
    await page.waitFor('#login');
    await page.type('#email', 'percy+non-payed@f5.com.br');
    await page.type('#password', 'percy123');
    await page.click('#login');
    await page.waitFor('.empty-page--dashboard');
    await percySnapshot('Dashboard page (not paying user)');

    await page.click('#profile-link a');
    await page.waitFor('.profile-page');
    await percySnapshot('Dashboard page for profile (not paying user)');
});