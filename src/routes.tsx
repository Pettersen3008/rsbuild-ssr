import type { RouteObject } from 'react-router-dom';
import Home, { loader as homeLoader } from './features/Home';
import { NotFound } from './components/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    loader: homeLoader,
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
