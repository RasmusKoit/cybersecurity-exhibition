import Koa from 'koa';
import serve from 'koa-static';


const app = new Koa(); 

app.use(serve('./client'));

app.listen(3000);