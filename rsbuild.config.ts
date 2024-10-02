import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginImageCompress } from '@rsbuild/plugin-image-compress';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig({
  plugins: [pluginReact(), pluginImageCompress(), pluginTypeCheck()],
  dev: {
    hmr: true,
    liveReload: true,
  },
  performance: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  environments: {
    web: {
      output: {
        target: 'web',
        sourceMap: {
          js: false,
        },
        minify: {
          js: false,
        },
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
        externals: ['fs', 'path'],
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
