import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

router.post('/api/user', (ctx, next) => {
  ctx.redirect('/');
});

app.use(serve('./victim/client'));
app.use(router.routes()).use(router.allowedMethods());
 
app.listen(3000);
