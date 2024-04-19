import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <div>
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn more about our team and mission." />
      </Head>
      <h1>About Us</h1>
      <p>Welcome to our about page. Here, you can learn more about our mission, our team, and the services we offer.</p>
      <p>We are dedicated to providing the best experience for our users and are constantly striving to improve our services.</p>

      {/* Link back to the homepage */}
      <Link href="/">
        Go back to the homepage
      </Link>
    </div>
  );
}
