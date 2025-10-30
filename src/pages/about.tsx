
import { NextSeo } from 'next-seo';

const AboutPage = () => {
  return (
    <>
      <NextSeo
        title="About Us | Shastik Fashions"
        description="Learn more about Shastik Fashions."
      />
      <section>
        <h1 className="text-3xl font-bold">About Us</h1>
        {/* TODO: Add about us content here */}
      </section>
    </>
  );
};

export default AboutPage;
