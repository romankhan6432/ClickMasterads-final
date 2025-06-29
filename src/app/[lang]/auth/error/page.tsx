"use client"
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(5);

  const error = searchParams.get('error');
  const errorType = error || 'default';
  
  // Get the custom error message if available
  const customError = searchParams.get('message');

  const errorMessages: { [key: string]: string } = {
    CredentialsSignin: t('auth.errors.invalidCredentials', 'Invalid credentials. Please check your Telegram ID and try again.'),
    OAuthSignin: t('auth.errors.oauthSignin', 'Error in OAuth sign in process.'),
    OAuthCallback: t('auth.errors.oauthCallback', 'Error in OAuth callback process.'),
    OAuthCreateAccount: t('auth.errors.oauthCreateAccount', 'Could not create OAuth provider account.'),
    EmailCreateAccount: t('auth.errors.emailCreateAccount', 'Could not create email provider account.'),
    Callback: t('auth.errors.callback', 'Error in the OAuth callback handler route.'),
    OAuthAccountNotLinked: t('auth.errors.oauthAccountNotLinked', 'Email on the account already exists.'),
    EmailSignin: t('auth.errors.emailSignin', 'Check your email address.'),
    SessionRequired: t('auth.errors.sessionRequired', 'Please sign in to access this page.'),
    DeviceIpRestriction: t('auth.errors.deviceIpRestriction', 'Account creation not allowed from this device or IP address.'),
    MissingCredentials: t('auth.errors.missingCredentials', 'Missing required credentials.'),
    MissingTelegramId: t('auth.errors.missingTelegramId', 'Telegram ID is required for authentication.'),
    MissingUsername: t('auth.errors.missingUsername', 'Username is required for authentication.'),
    MissingFullName: t('auth.errors.missingFullName', 'Full name is required for authentication.'),
    default: t('auth.errors.default', 'An error occurred during authentication.')
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleRetry = () => {
    router.push('/auth');
  };

  // Display custom error message if available, otherwise use the predefined error message
  const errorMessage = customError || errorMessages[errorType] || errorMessages.default;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-red-500">
            {t('auth.errors.title', 'Authentication Error')}
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            {errorMessage}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            {t('auth.errors.redirect', 'Redirecting in')} <span className="text-yellow-400 font-bold">{countdown}</span> {t('auth.errors.seconds', 'seconds')}
          </p>
          <div className="mt-6">
            <Button 
              type="primary" 
              onClick={handleRetry}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {t('auth.errors.tryAgain', 'Try Again')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
