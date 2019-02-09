import Koa from 'koa';
import serve from 'koa-static';
import websockify from 'koa-websocket';
import publicWifiVictim from './public-wifi/victim';
import attackerRouter, { websocketRouter as publicWifiAttackerWebsocket } from './public-wifi/attacker';


const app = websockify(new Koa());
const appName = 'PUBLIC_WIFI';
const subApp = 'victim'

switch (appName) {
  case 'PUBLIC_WIFI':
    switch (subApp) {
      case 'victim':
        app.use(serve('./public-wifi/victim/client'));
        app.use(publicWifiVictim.routes()).use(publicWifiVictim.allowedMethods());   
        break;
      case 'attacker':
        app.use(serve('./public-wifi/attacker/client'));
        app.use(attackerRouter.routes()).use(attackerRouter.allowedMethods());
        app.ws.use(publicWifiAttackerWebsocket.routes()).use(publicWifiAttackerWebsocket.allowedMethods());
      default:
        break;
    }
    break;
  case 'CHATBOT':
    app.use(serve('./chatbot/victim/client'));
    app.use(chatbot.routes()).use(chatbot.allowedMethods())
  default:
    break;
}


app.listen(3000);
