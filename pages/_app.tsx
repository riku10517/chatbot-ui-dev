import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';

// ↓ 追加コード------------------------------------------------------------
import { v4 as uuidv4 } from 'uuid'; 
import React from 'react';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
//------------------------------------------------------------------------

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps<{}>) {
  const queryClient = new QueryClient();

  // ↓ 追加コード------------------------------------------------------------------------------------------------
  const [cookies, setCookie] = useCookies(['ai_user']); //const[現在値,更新用関数] = useCookies(['name'])

   // 初回ログイン（Cookie取得）
  useEffect(() => {
    if (!cookies['ai_user']) {
      const cookieId = uuidv4();
      const cookieExpiration = 31536000;   //Cookie有効期限：1年 (60*60*24*365)
      setCookie('ai_user', cookieId, { maxAge : cookieExpiration }); //setCookie('name','value',{option})
      console.log('Cookie発行') ;
      console.log('初回',cookieId);
    }
  }, [cookies]); //依存配列=[cookies]：Cookie削除によるCookie再発行

    // 2回目以降ログイン（Cookie有効期限の更新）
  useEffect(() => {
    if (cookies['ai_user']) {
      const cookieId = cookies['ai_user'];
      const cookieExpirationUpdate = 31536000;  //Cookie更新年数：1年
      setCookie('ai_user', cookieId, { maxAge : cookieExpirationUpdate }); //Cookie有効期限を再セット
      console.log('Cookie更新'); 
      console.log('更新',cookieId);
    }
  }, []); //依存配列=[]：初回レンダリングでのみ実行
  //---------------------------------------------------------------------------------------------------------------

  return (
    <div className={inter.className}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
         <Component {...pageProps} />
      </QueryClientProvider>
    </div>
  );
}

export default appWithTranslation(App);
