import { Context } from 'koa';
import Router from 'koa-router';
import puppeteer from 'puppeteer';

const router = new Router();
const port = 3000;
router.get('(.*)', async (ctx: Context) => {
    console.log(ctx.request.url);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    // 如果是html 返回html 如果是其他文件 直接返回文件
    page.on('request', request => {
        if (request.resourceType() !== 'document') request.abort();
        else request.continue();
    });
    const url = `http://localhost:${port}${ctx.request.url}`;
    await page.goto(url, {
        waitUntil: 'networkidle0'
    });
    const html = await page.content();
    await browser.close();
    ctx.response.body = html;
});

export default router;
