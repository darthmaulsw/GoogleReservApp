'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
// import { motion } from 'framer-motion';
import Link from 'next/link';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid verification link');
      router.push('/login');
      return;
    }

    const verifyEmail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setIsVerified(true);
          toast.success('Email verified successfully!');
          // Automatically redirect to login after 2 seconds
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          const data = await response.json();
          toast.error(data.message || 'Verification failed');
          router.push('/login');
        }
      } catch (error) {
        toast.error('Something went wrong');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your email has been successfully verified. You can now log in to your account.
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 