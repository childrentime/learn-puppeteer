import puppeteer from 'puppeteer';
const defaultRuntime = async () => {
    // userDataDir指定下载文件夹
    const browser = await puppeteer.launch({ headless: false }); // default is true
    // const browser = await puppeteer.launch({
    //     executablePath: '/path/to/Chrome'
    // });   //指定可执行路径
};

defaultRuntime();
