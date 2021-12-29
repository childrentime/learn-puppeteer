import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // 视口
    await page.setViewport({
        width: 1800,
        height: 1400,
        deviceScaleFactor: 1
    });
    await page.goto('https://childrentime.xyz/');
    await page.screenshot({
        path: './static/childrentime.png',
        type: 'png',
        // quality: 100, 只对jpg有效
        // 全屏
        fullPage: true
        // 指定区域截图，clip和fullPage两者只能设置一个
        // clip: {
        //   x: 0,
        //   y: 0,
        //   width: 1000,
        //   height: 40
        // }
    });

    await browser.close();
})();
