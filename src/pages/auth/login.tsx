import React from 'react';
import { NextSeo } from 'next-seo';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { login } from '@/store/userSlice';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

interface LoginFormInputs {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error, token } = useSelector((state: RootState) => state.user);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (token) {
      router.push('/'); // Redirect to home or dashboard on successful login
      toast({
        title: "Login Successful",
        description: "Welcome back to Shastik Fashions!",
        variant: "success",
      });
      reset();
    }
    if (error) {
      toast({
        title: "Login Failed",
        description: error,
        variant: "destructive",
      });
    }
  }, [token, error, router, reset]);

  const onSubmit = async (data: LoginFormInputs) => {
    await dispatch(login(data));
  };

  return (
    <>
      <NextSeo
        title="Login | Shastik Fashions"
        description="Login to your account on Shastik Fashions."
      />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                aria-label="Email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                aria-label="Password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              disabled={status === 'loading'}
              aria-label="Login to your account"
            >
              {status === 'loading' ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account? <Link href="/auth/register" className="text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;