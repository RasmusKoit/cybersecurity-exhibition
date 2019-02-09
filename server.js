import Koa from 'koa';
import serve from 'koa-static';
import publicWifi from './public-wifi/victim';
import chatbot from './chatbot/victim';
const app = new Koa();

const pageName = 'CHATBOT';

switch (pageName) {
  case 'PUBLIC_WIFI':
    app.use(serve('./public-wifi/victim/client'));
    app.use(publicWifi.routes()).use(publicWifi.allowedMethods());
    break;
  case 'CHATBOT':
    app.use(serve('./chatbot/victim/client'));
    app.use(chatbot.routes()).use(chatbot.allowedMethods())
  default:
    break;
}


app.listen(3000);
