import Router from 'koa-router';

const router = new Router();

router.get('/api/test', (ctx, next) => {
  ctx.body = 'test';
});
 
export default router;