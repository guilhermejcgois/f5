const PercyScript = require('@percy/script');

PercyScript.run(async (page, percySnapshot) => {
    await page.goto('http://localhost:5000/');

    await page.waitFor('.lop__register-link .link--primary');
    await page.click('.lop__register-link .link--primary');
    await percySnapshot('Register page 1');
    
    await page.type('#name', 'Organization name');
    await page.type('#address', 'Organization address');
    await page.type('#cnpj', '66.081.509/0001-14');
    await page.click('#next-step');
    await page.waitFor('#submit');
    await percySnapshot('Register page 2');
    
    await page.click('#prev-step');
    await page.waitFor('#next-step');
    await percySnapshot('Register page 1 filled');
    
    await page.click('#next-step');
    await page.waitFor('#submit');
    await page.type('#email', 'guijocargo@gmail.com');
    await page.type('#password', '123456');
    await page.type('#confirm_password', '1234567890');
    await percySnapshot('Register page 2 with password mismatch');
    
    await page.type('#confirm_password', '123456');
    await page.click('#prev-step');
    await page.waitFor('#next-step');
    await page.waitFor('#submit');
    await percySnapshot('Register page 2 filled');
    
    await page.click('.lop__login-link .link--primary');
    await page.waitFor('#login');
    await percySnapshot('Login page');
    
    await page.type('#email', 'guijocargo@gmail.com');
    await page.type('#password', '123456');
    await page.click('#login');
    await page.waitFor('#logout');
    await percySnapshot('Dashboard page');
    
    await page.click('#logout')
    await percySnapshot('Login page after logout');
    
    await page.waitFor('#login');
    await page.type('#email', 'empresa@teste.com');
    await page.type('#password', '123456');
    await page.click('#login');
    await page.waitFor('#logout');
    await percySnapshot('Dashboard page for not paying user');
});