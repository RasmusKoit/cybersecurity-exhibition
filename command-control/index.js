import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import serve from 'koa-static';
import { exec } from 'child_process';

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

router.post('/api/container/:name', (ctx) => {
  const { name } = ctx.params;
  const { options: { port } } = ctx.request.body;

  sh(`docker run  -d -p ${port}:3000 ${name}`)
});

router.delete('/api/container/:name', (ctx) => {

});

app.use(bodyParser())
app.use(serve('./client'));

app.listen(3000);