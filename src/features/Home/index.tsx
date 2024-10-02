import { json, useLoaderData } from 'react-router-dom';

export const loader = async () => {
  return json({ hello: 'world' });
};

export default function Home() {
  const data = useLoaderData();

  return (
    <div>
      <h1>Home</h1>
      <p>Home page content</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
