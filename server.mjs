import express from 'express';
import { createRsbuild, loadConfig, logger } from '@rsbuild/core';
import { installGlobals } from '@remix-run/node';

installGlobals();

const serverRender = (serverAPI) => async (req, res) => {
  const indexModule = await serverAPI.environments.ssr.loadBundle('index');
  const markup = await indexModule.render(req, res);
  const template = await serverAPI.environments.web.getTransformedHtml('index');
  const html = template.replace('<!--app-content-->', markup);

  res.writeHead(200, {
    'Content-Type': 'text/html',
  });
  res.end(html);
};

export async function startDevServer() {
  const { content } = await loadConfig({});

  const rsbuild = await createRsbuild({
    rsbuildConfig: content,
  });

  const app = express();
  const rsbuildServer = await rsbuild.createDevServer();
  const serverRenderMiddleware = serverRender(rsbuildServer);

  app.get('/', async (req, res, next) => {
    try {
      await serverRenderMiddleware(req, res);
    } catch (err) {
      logger.error('SSR render error, downgrade to CSR...\n', err);
      next();
    }
  });

  app.use(rsbuildServer.middlewares);
  const httpServer = app.listen(rsbuildServer.port, () => {
    rsbuildServer.afterListen();
  });

  rsbuildServer.connectWebSocket({ server: httpServer });

  return {
    close: async () => {
      await rsbuildServer.close();
      httpServer.close();
    },
  };
}

startDevServer();
