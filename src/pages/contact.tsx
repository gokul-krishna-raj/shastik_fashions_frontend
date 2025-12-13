import React from 'react';
import { NextSeo } from 'next-seo';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MapPin, Phone, Mail } from 'lucide-react';

interface ContactFormInputs {
  name: string;
  email: string;
  phoneNumber?: string | null;
  message: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').optional().nullable(),
  message: yup.string().required('Message is required'),
});

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: ContactFormInputs) => {
    console.log('Form Data:', data);
    alert('Message sent successfully! (Check console for data)');
    reset();
  };

  return (
    <>
      <NextSeo
        title="Contact Us | Shastik Fashions"
        description="Get in touch with Shastik Fashions for any queries about our premium sarees, orders, or business inquiries."
      />
      <div className="container mx-auto px-4 py-8 bg-[#FFF9F5]">
        <h1 className="text-4xl font-bold text-center text-[#8A1538] mb-10">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-[#8A1538] mb-6">Reach out to us anytime.</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-[#C99A5E] focus:border-transparent"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby="name-error"
                />
                {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-[#C99A5E] focus:border-transparent"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby="email-error"
                />
                {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  {...register('phoneNumber')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-[#C99A5E] focus:border-transparent"
                  aria-invalid={errors.phoneNumber ? "true" : "false"}
                  aria-describedby="phone-error"
                />
                {errors.phoneNumber && <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={5}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-[#C99A5E] focus:border-transparent"
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby="message-error"
                ></textarea>
                {errors.message && <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-[#8A1538] text-white py-3 px-4 rounded-md font-semibold hover:bg-[#C99A5E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C99A5E] focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details & Map */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#8A1538] mb-6">Contact Details</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin size={24} className="text-[#C99A5E] mr-3 flex-shrink-0" />
                  <p className="text-gray-700">Shastik Fashions, Elampillai, Tamil Nadu, India</p>
                </div>
                <div className="flex items-center">
                  <Phone size={24} className="text-[#C99A5E] mr-3 flex-shrink-0" />
                  <p className="text-gray-700">+91 98765 43210</p>
                </div>
                <div className="flex items-center">
                  <Mail size={24} className="text-[#C99A5E] mr-3 flex-shrink-0" />
                  <p className="text-gray-700">support@shastikfashions.com</p>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#8A1538] mb-4">Our Location</h2>
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.3000000000002!2d78.00000000000001!3d11.666666666666666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDQwJzAwLjAiTiA3OMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1678912345678!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map of Elampillai, Tamil Nadu"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;