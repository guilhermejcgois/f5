const PercyScript = require('@percy/script');

PercyScript.run(async (page, percySnapshot) => {
    await page.goto('http://localhost:5000/');

    // await page.waitFor('.lop__register-link .link--primary');
    // await page.click('.lop__register-link .link--primary');
    // await page.waitFor('#next-step');
    // await percySnapshot('Register page 1');
    
    // await page.type('#name', 'Organization name');
    // await page.type('#address', 'Organization address');
    // await page.type('#cnpj', '66.081.509/0001-14');
    // await page.click('#next-step');
    // await page.waitFor('#submit');
    // await percySnapshot('Register page 2');
    
    // await page.click('#prev-step');
    // await page.waitFor('#next-step');
    // await percySnapshot('Register page 1 filled');
    
    // await page.click('#next-step');
    // await page.waitFor('#submit');
    // await page.type('#email', 'guijocargo@gmail.com');
    // await page.type('#password', '123456');
    // await page.type('#confirm_password', '1234567890');
    // await percySnapshot('Register page 2 with password mismatch');
    
    // await page.type('#confirm_password', '123456');
    // await page.click('#prev-step');
    // await page.waitFor('#next-step');
    // await page.waitFor('#submit');
    // await percySnapshot('Register page 2 filled');
    
    // await page.click('.lop__login-link .link--primary');
    await page.waitFor('#login');
    await percySnapshot('Login page');
    
    await page.type('#email', 'sucata@digital.com');
    await page.type('#password', 'sucata');
    await page.click('#login');
    await page.waitFor('.dashboard-grid');
    await percySnapshot('Dashboard page');

    await page.click('#bins-link a');
    await page.waitFor('.bins__table');
    await percySnapshot('Dashboard page for bins');

    await page.click('#requests-link a');
    await page.waitFor('.cards');
    await percySnapshot('Dashboard page for orders');

    await page.click('#profile-link a');
    await page.waitFor('.payment__form');
    await percySnapshot('Dashboard page for profile');

    // await page.click('#gathering-link a');
    // await page.waitFor('#logout');
    // await percySnapshot('Dashboard page for gathering');

    await page.click('#new-bin-link');
    await page.waitFor('#address');
    await percySnapshot('Register page for new bin request');
    // await page.type('#address', 'address');
    // await page.waitFor('.no_result');
    // await percySnapshot('Register page for new bin request with not found address');
    // await page.type('#address', 'Kalunga');
    // await page.waitFor('.autoComplete_result', { timeout: 60000 });
    // await percySnapshot('Register page for new bin request with found address');
    // await page.click('.autoComplete_result');
    // await percySnapshot('Register page for new bin request with selected address');
    // await page.click('#size-m');
    // await percySnapshot('Register page for new bin request with selected bin size');
    // await page.click('#save-bin');
    // await page.waitFor('.modal-container');
    // await percySnapshot('Register page for new bin request with success modal');
    
    // await page.click('#order-cancel');
    // await page.waitFor('.modal-container');
    // await percySnapshot('Orders page with cancelation modal');
    // await page.click('#delete-btn');
    // await percySnapshot('Orders page with cancelation confirmed modal');
    
    await page.click('#logout-link a');
    await percySnapshot('Login page after logout');
    
    await page.waitFor('#login');
    await page.type('#email', 'empresa@teste.com');
    await page.type('#password', '123456');
    await page.click('#login');
    await page.waitFor('.empty-page--dashboard');
    await percySnapshot('Dashboard page (not paying user)');

    // await page.click('#bins-link a');
    // await page.waitFor('.empty-page--bins');
    // await percySnapshot('Dashboard page for bins (not paying user)');

    // await page.click('#requests-link a');
    // await page.waitFor('.empty-page--requests');
    // await percySnapshot('Dashboard page for orders (not paying user)');

    // await page.click('#requests-link a');
    // await page.waitFor('.empty-page--gathering');
    // await percySnapshot('Dashboard page for gathering (not paying user)');

    await page.click('#profile-link a');
    await page.waitFor('.payment__form');
    await percySnapshot('Dashboard page for profile (not paying user)');
});