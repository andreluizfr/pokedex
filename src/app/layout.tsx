'use client';
import './globals.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import clsx from 'clsx';

import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { useEffect, useState } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from 'react-query';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwl57LjruJjV0FEMB4TiRo7uRj33ppX3w",
  authDomain: "pokedex-511ed.firebaseapp.com",
  projectId: "pokedex-511ed",
  storageBucket: "pokedex-511ed.appspot.com",
  messagingSenderId: "640089955730",
  appId: "1:640089955730:web:5ca87d1944acbafaed354b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const client = new ApolloClient({
  uri: 'https://graphql-pokeapi.vercel.app/api/graphql',
  cache: new InMemoryCache(),
});

const queryClient = new QueryClient({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [theme, setTheme] = useState("light");

  useEffect(()=>{
      if(typeof window === 'undefined')
        console.warn(`Tried setting localStorage key “theme” even though environment is not a client`);
      try{
        const themeStoraged = window.localStorage.getItem("theme");
        if(themeStoraged) setTheme(themeStoraged);
      } 
      catch (error) {
        console.warn(`Error getting localStorage item with key “theme”:`, error);
      }
  }, []);

  useEffect(()=>{
    if(theme){
        if (typeof window === 'undefined')
          console.warn(`Tried setting localStorage key “theme” even though environment is not a client`);
        try{
          window.localStorage.setItem("theme", theme);
        } 
        catch (error) {
          console.warn(`Error setting localStorage key “theme”:`, error)
        }
    }
  }, [theme]);

  return (
    <html lang="en">
      <body className={clsx(
        'flex flex-col min-h-screen m-0 min-w-[320px]',
        'scroll-smooth',
        theme==="dark" && "bg-zinc-950"
        )}
      >
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={theme}>
              <AppHeader setTheme={setTheme}/>
              {children}
              <AppFooter/>
            </ThemeContext.Provider>
          </QueryClientProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}
