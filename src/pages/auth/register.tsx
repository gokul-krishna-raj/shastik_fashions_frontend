import React from 'react';
import { NextSeo } from 'next-seo';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { register as registerUser } from '@/store/userSlice';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

interface RegisterFormInputs {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error, token } = useSelector((state: RootState) => state.user);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (token) {
      router.push('/'); // Redirect to home or dashboard on successful registration
      toast({
        title: "Registration Successful",
        description: "Welcome to Shastik Fashions!",
      });
      reset();
    }
    if (error) {
      toast({
        title: "Registration Failed",
        description: error,
        variant: "destructive",
      });
    }
  }, [token, error, router, reset]);

  const onSubmit = async (data: RegisterFormInputs) => {
    await dispatch(registerUser(data));
  };

  return (
    <>
      <NextSeo
        title="Register | Shastik Fashions"
        description="Create an account on Shastik Fashions."
      />

      <div className="min-h-screen flex bg-white">
        {/* Left Side - Decorative Gradient */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-600 to-amber-500 opacity-90 transition-all duration-500 hover:scale-105" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50" />

          <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 text-white">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Join Our Community</h1>
              <p className="mt-4 text-lg text-rose-100 max-w-md">
                Experience the finest collection of handcrafted sarees and ethnic wear.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <p className="text-lg font-medium italic">
                &quot;Elegance is the only beauty that never fades.&quot;
              </p>
              <p className="mt-4 text-sm text-rose-200">
                — Audrey Hepburn
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto h-screen">
          <div className="w-full max-w-md space-y-8 my-auto">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Create Account
              </h2>
              <p className="mt-2 text-slate-600">
                Enter your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-900">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-rose-200"
                    placeholder="John Doe"
                    aria-label="Full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 font-medium animate-in slide-in-from-left-1 pointer-events-none">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-900">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-rose-200"
                    placeholder="name@example.com"
                    aria-label="Email address"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 font-medium animate-in slide-in-from-left-1 pointer-events-none">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="mobile" className="text-sm font-medium text-slate-900">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    {...register('mobile')}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-rose-200"
                    placeholder="9876543210"
                    aria-label="Mobile number"
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500 font-medium animate-in slide-in-from-left-1 pointer-events-none">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-900">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-rose-200"
                    placeholder="••••••••"
                    aria-label="Password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 font-medium animate-in slide-in-from-left-1 pointer-events-none">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-semibold text-rose-600 hover:text-rose-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 rounded-md px-1"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;