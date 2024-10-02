import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  matchRoutes,
  RouterProvider,
} from 'react-router-dom';

import { routes } from './routes';

hydrate();

async function hydrate() {
  const lazyMatches = matchRoutes(routes, window.location)?.filter(
    (m) => m.route.lazy,
  );

  if (lazyMatches && lazyMatches.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        // biome-ignore lint/style/noNonNullAssertion: React.StrictMode requires a non-null root element
        const routeModule = await m.route.lazy!();
        Object.assign(m.route, { ...routeModule, lazy: undefined });
      }),
    );
  }

  const rootEl = document.getElementById('root');
  const router = createBrowserRouter(routes);

  ReactDOM.hydrateRoot(
    // biome-ignore lint/style/noNonNullAssertion: React.StrictMode requires a non-null root element
    rootEl!,
    <React.StrictMode>
      <RouterProvider router={router} fallbackElement={<div>loading...</div>} />
    </React.StrictMode>,
  );
}
