import fs from 'fs';
import puppeteer, { ElementHandle } from 'puppeteer';

//输入框文字
const musicName = 'countingstars';
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1800,
        height: 2200,
        deviceScaleFactor: 1
    });
    await page.goto('https://music.163.com/#');

    //为 txt.j-flag这个元素选择器输入内容
    await page.type('.txt.j-flag', musicName, { delay: 0 });
    // 回车
    await page.keyboard.press('Enter');

    // 等待2s
    await page.waitForTimeout(2000);
    // 找到iframe名称为conentFrame的 frame标签
    let iframe = (await page
        .frames()
        .find(f => f.name() === 'contentFrame')) as puppeteer.Frame;

    // 找到歌曲列表标签
    const SONG_LS_SELECTOR = (await iframe.$(
        '.srchsongst'
    )) as ElementHandle<HTMLDivElement>;

    // 获取歌曲的地址
    const selectedSongHref = await iframe.evaluate(
        (songs: HTMLDivElement, musicName: string) => {
            const nodes = songs.childNodes;
            // 歌曲列表的子节点数组
            const songList = Array.from(nodes) as HTMLDivElement[];
            const idx = songList.findIndex((v: HTMLDivElement) => {
                const child = v.childNodes[1] as HTMLDivElement;
                return (
                    child.innerText.replace(/\s/g, '').toLowerCase() ===
                    musicName
                );
            });
            const linkElement = songList[idx].childNodes[1].firstChild
                ?.firstChild?.firstChild as HTMLLinkElement;
            return linkElement.href;
        },
        SONG_LS_SELECTOR,
        musicName
    );

    // 进入歌曲页面
    await page.goto(selectedSongHref);

    // 获取歌曲页面嵌套的 iframe
    await page.waitForTimeout(2000);
    iframe = (await page
        .frames()
        .find(f => f.name() === 'contentFrame')) as puppeteer.Frame;

    // 点击 展开按钮
    const unfoldButton = await iframe.$('#flag_ctrl');
    await unfoldButton!.click();

    // 获取歌词
    const LYRIC_SELECTOR = await iframe.$('#lyric-content');
    const lyricCtn = await iframe.evaluate(e => {
        return e.innerText;
    }, LYRIC_SELECTOR);

    // 截图
    await page.screenshot({
        path: `./static/${musicName}.png`,
        fullPage: true
    });

    // 写入文件
    const writerStream = fs.createWriteStream(`./static/${musicName}.txt`);
    writerStream.setDefaultEncoding('utf8');
    writerStream.write(lyricCtn);
    writerStream.end();

    await browser.close();

    // // 获取评论数量
    // const commentCount = await iframe.$eval(
    //     '.sub.s-fc3',
    //     (e: any) => e.innerText
    // );
    // console.log(commentCount);

    // // 获取评论
    // const commentList = await iframe.$$eval('.itm', elements => {
    //     const ctn = elements.map((v: any) => {
    //         // \s表示匹配任何空白字符
    //         return v.innerText.replace(/\s/g, '');
    //     });
    //     return ctn;
    // });
    // console.log(commentList);
})();

// async function autoScroll(page: puppeteer.Page) {
//     console.log('[AutoScroll begin]');
//     await page.evaluate(async () => {
//         await new Promise<void>((resolve, reject) => {
//             // 页面的当前高度
//             let totalHeight = 0;
//             // 每次向下滚动的距离
//             let distance = 100;
//             // 通过setInterval循环执行
//             let timer = setInterval(() => {
//                 let scrollHeight = document.body.scrollHeight;
//                 // 执行滚动操作
//                 window.scrollBy(0, distance);

//                 // 如果滚动的距离大于当前元素高度则停止执行
//                 totalHeight += distance;
//                 if (totalHeight >= scrollHeight) {
//                     clearInterval(timer);
//                     resolve();
//                 }
//             }, 100);
//         });
//     });
//     console.log('[AutoScroll done]');
//     // 完成懒加载后可以完整截图或者爬取数据等操作
//     // do what you like ...
// }
