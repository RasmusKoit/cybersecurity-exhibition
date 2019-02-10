import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import serve from 'koa-static';
import { exec } from 'child_process';
import shellescape from 'shell-escape';

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

const app = new Koa(); 
const router = new Router();

router.get('/api/container', async (ctx) => {
  const { stdout } = await sh('docker container list');

  const containers = (stdout.split('\n').slice(1));
  containers.pop();
  console.log(containers)

  ctx.body = containers;
})

router.post('/api/container/:name', async  (ctx) => {
  const { name } = ctx.params;
  const { options: { port } } = ctx.request.body;

  const result = await sh(shellescape(['docker', 'run' , '-d', '-p', `${port}:8080`, name]));
  ctx.body = result.stdout;
});

router.delete('/api/container/:name', async (ctx) => {
  const { name } = ctx.params;

  const result = await sh(`docker rm $(docker stop $(docker ps -a -q --filter ancestor=${shellescape([name])} --format="{{.ID}}"))`)
  ctx.status = 200;
});

app.use(bodyParser())
app.use(serve('./client'));
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000);