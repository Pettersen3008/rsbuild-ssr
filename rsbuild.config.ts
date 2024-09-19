import { type RequestHandler, SetupMiddlewaresServer, defineConfig, logger } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export const serverRender = (api: SetupMiddlewaresServer): RequestHandler =>
  async (_req, res, _next) => {
    const indexModule = await api.environments.ssr.loadBundle<{render: () => string;}>('index');
    const template = await api.environments.web.getTransformedHtml('index');
    const markup = indexModule.render();
    const html = template.replace('<!--app-content-->', markup);

    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(html);
  };

export default defineConfig({
  plugins: [pluginReact()],
  dev: {
    setupMiddlewares: [
      ({ unshift }, serverAPI) => {
        const serverRenderMiddleware = serverRender(serverAPI);

        unshift(async (req, res, next) => {
          if (req.method === 'GET' && req.url === '/') {
            try {
              await serverRenderMiddleware(req, res, next);
            } catch (err) {
              logger.error('SSR render error, downgrade to CSR...\n', err);
              next();
            }
          } else {
            next();
          }
        });
      },
    ],
  },
  environments: {
    web: {
      output: {
        target: 'web',
      },
      source: {
        entry: {
          index: './src/index.client',
        },
      },
    },
    ssr: {
      output: {
        target: 'node',
        distPath: {
          root: 'dist/server',
        },
      },
      source: {
        entry: {
          index: './src/index.server',
        },
      },
    },
  },
  html: {
    template: './index.html',
  },
});