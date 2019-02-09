import Router from 'koa-router';

const router = new Router();

router.post('/api/user', (ctx, next) => {
  // ctx.body='hello'
  ctx.redirect('/');
});
 
export default router;