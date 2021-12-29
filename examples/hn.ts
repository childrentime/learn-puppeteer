import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://childrentime.xyz/', {
        // 当至少 500 毫秒没有超过 2 个网络连接时，认为导航已完成。
        waitUntil: 'networkidle2'
    });
    await page.pdf({
        path: './static/hn.pdf',
        pageRanges: '1-1',
        scale: 0.8,
        format: 'a4'
    });

    await browser.close();
})();
