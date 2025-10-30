
import { NextSeo } from 'next-seo';

const ContactPage = () => {
  return (
    <>
      <NextSeo
        title="Contact Us | My E-commerce Store"
        description="Get in touch with My E-commerce Store."
      />
      <section>
        <h1 className="text-3xl font-bold">Contact Us</h1>
        {/* TODO: Add contact form or information here */}
      </section>
    </>
  );
};

export default ContactPage;
