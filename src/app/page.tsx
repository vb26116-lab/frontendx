'use client';

import InputField from '@/components/InputField';
import { FaXTwitter } from "react-icons/fa6";
import React from 'react';
import { Toaster, toast } from 'sonner'; // ✅ replaced Toastify with Sonner
import { useRouter } from 'next/navigation';
import { Outfit } from 'next/font/google';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { staffLogin } from '@/api/api';  // ✅ Fixed import

interface LoginFormValues {
  username: string;
  password: string;
}

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '600'] });

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string()
        .required('Password is required')
        .min(7, 'Password must be at least 7 characters long'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);

      try {
        const res = await staffLogin(values);
        console.log('Login response:', res);
        toast.success('✅ Login Successful');
        resetForm();
        setTimeout(() => router.push('/dashboard'), 2000);
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const error = err as { response: { status: number; data?: { detail?: unknown } } };
          const { status, data } = error.response;
          let message = 'Login failed';

          if (status === 400 || status === 422) {
            if (Array.isArray(data?.detail)) {
              message = data.detail[0]?.msg || message;
            } else if (typeof data?.detail === 'string') {
              message = data.detail;
            }
          }

          toast.error(`❌ ${message}`);
        } else {
          toast.error('❌ Cannot reach the server. Is it running?');
        }
      }
      finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full min-h-screen flex items-center">
      <Toaster position="top-center" richColors /> {/* ✅ Sonner toaster */}
      <div className="w-[80%] md:w-[70%] h-[70vh] mx-auto flex flex-col justify-center rounded border border-blue-400">
        <FaXTwitter className="text-6xl mx-auto " />
        <h1 className={`${outfit.className} m-2 text-4xl font-semibold text-center`}>
          Login
        </h1>
        <form
          className="space-y-4 flex flex-col justify-center items-center sm:w-full max-w-md mx-auto"
          onSubmit={formik.handleSubmit}
        >
          <InputField
            placeholder="Username or Email"
            minLength={4}
            {...formik.getFieldProps('username')}
            required
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-white-500 text-1xl">{formik.errors.username}</p>
          )}

          <InputField
            placeholder="Password"
            type="password"
            minLength={5}
            {...formik.getFieldProps('password')}
            required
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-white-500 text-1xl">{formik.errors.password}</p>
          )}

          <button
            type="submit"
            className="font-semibold py-2 px-4 rounded-full bg-white hover:bg-blue-500/80 w-full mt-2 text-black"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
