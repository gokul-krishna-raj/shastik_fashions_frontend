
import { NextSeo } from 'next-seo';

const AboutPage = () => {
  return (
    <>
      <NextSeo
        title="About Us | My E-commerce Store"
        description="Learn more about My E-commerce Store."
      />
      <section>
        <h1 className="text-3xl font-bold">About Us</h1>
        {/* TODO: Add about us content here */}
      </section>
    </>
  );
};

export default AboutPage;
