import Koa from 'koa';
import router from './route';

const app = new Koa();
app.use(router.routes());
app.listen(3003, () => {
    console.log('服务器启动成功');
});
