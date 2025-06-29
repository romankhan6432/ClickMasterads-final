"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
 

 

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "telegram">("email");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    telegramId: "",
    telegramPassword: "",
  });
  const { data: session } = useSession();
  const router = useRouter();
  
 

  // Auto sign in with Telegram WebApp
  useEffect(() => {

    // Check if we're in Telegram WebApp and have user data
    if (window.Telegram.WebApp.initDataUnsafe?.user?.id) {

    

      const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
      const start_param = window.Telegram.WebApp.initDataUnsafe.start_param
      setTimeout(async () => {
        const result = await signIn("credentials", {
          telegramId: telegramUser.id.toString(),
          username: telegramUser.username,
          fullName: telegramUser.first_name + " " + telegramUser.last_name,
          referCode : start_param,
          method : 'tg-only',
          redirect: false,
        });

        if (result?.error) {
          toast.error(result.error);
        }
        if (result?.ok) {
          router.push("/");
        }
      }, 1000);
    }

    if (session?.user) {
      router.push("/");
    }

  }, []);




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { t } = useTranslation();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        return toast.error(result.error)
      }
      toast.success('Sign in successful');
      return  router.push('/');

    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
  await signIn("google", { callbackUrl: "/", redirect :true });
   
    } catch (error) {
      alert("Google sign in failed");
    }
  };

  const handleTelegramSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
 
      const result = await signIn("credentials", {
        telegramId : formData.telegramId,
        password: formData.telegramPassword,
        method : 'tg-pass',
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.ok) {
        window.location.href = '/'
       // router.push('/')
      }
    } catch (error) {
      toast.error(t('auth.errors.telegramSignInFailed', 'Telegram sign in failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0B0E11] via-[#1E2026] to-[#0B0E11] p-4">
      {/* Logo and Title */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">ClickMasterAds</h1>
        <p className="text-gray-400">Welcome back! Please sign in to continue</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Auth Methods Quick Access */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleGoogleSignIn}
            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-700 bg-[#1E2026] hover:bg-[#2B3139] transition-all duration-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-gray-300">Google</span>
          </button>
          <button
            onClick={() => setActiveTab("telegram")}
            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-700 bg-[#1E2026] hover:bg-[#2B3139] transition-all duration-200"
          >
            <svg className="h-5 w-5 text-[#229ED9]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            <span className="text-gray-300">Telegram</span>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#0B0E11] text-gray-500">or continue with</span>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-[#1E2026] rounded-xl p-6 shadow-xl border border-gray-800">
          {activeTab === "email" ? (
            <form onSubmit={handleEmailSignIn} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#2B3139] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#2B3139] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-[#1E2026] bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#1E2026] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTelegramSignIn} className="space-y-5">
              <div>
                <label htmlFor="telegramId" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Telegram ID
                </label>
                <input
                  id="telegramId"
                  name="telegramId"
                  type="text"
                  required
                  value={formData.telegramId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#2B3139] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#229ED9] focus:border-transparent transition-all"
                  placeholder="Enter your Telegram ID"
                />
              </div>
              <div>
                <label htmlFor="telegramPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Password
                </label>
                <input
                  id="telegramPassword"
                  name="telegramPassword"
                  type="password"
                  required
                  value={formData.telegramPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#2B3139] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#229ED9] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-[#229ED9] hover:bg-[#1E8DC1] focus:outline-none focus:ring-2 focus:ring-[#229ED9] focus:ring-offset-2 focus:ring-offset-[#1E2026] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
               {isLoading ? "Signing in..." :  t('signInWithTelegram')} 
              </button>
            </form>
          )}
        </div>
      </div>

     
    </div>
  );
}