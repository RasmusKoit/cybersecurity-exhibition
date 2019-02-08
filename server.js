import Koa from 'koa';
import serve from 'koa-static';
import publicWifi from './public-wifi/victim';
const app = new Koa();

const pageName = 'PUBLIC_WIFI';

switch (pageName) {
  case 'PUBLIC_WIFI':
    app.use(serve('./public-wifi/victim/client'));
    app.use(publicWifi.routes()).use(publicWifi.allowedMethods());
    break;
  default:
    break;
}


app.listen(3000);
