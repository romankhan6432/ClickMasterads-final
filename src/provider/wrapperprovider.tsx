'use client';
// index.tsx or App.tsx
import React from 'react';
import { SessionProvider } from "next-auth/react";
import { StyleProvider } from '@ant-design/cssinjs';
import { Provider as ReduxProvider } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import store from '@/modules/store';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { ConfigProvider, theme } from 'antd';


export default function WrapperProvider({ children , lang }: { children: React.ReactNode  , lang : string }) {
  
   i18n.changeLanguage(lang);

   return (
      <StyleProvider hashPriority="high">
         <ReduxProvider store={store}>
            <SessionProvider>
            <ConfigProvider  theme={{
                algorithm: theme.darkAlgorithm
            }}>
                <I18nextProvider i18n={i18n}>
                  <ToastContainer />
                  {children}
               </I18nextProvider>
            </ConfigProvider>
              
            </SessionProvider>
         </ReduxProvider>
      </StyleProvider>
   )
}       