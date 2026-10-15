// Brand Concierge styling configuration (exported from the Brand Concierge deployment screen)
window.styleConfiguration = {
  "id": "b8ae8fce-5f1e-49e0-92d1-36982946d07e",
  "name": "BNDES_26-10-14_b8ae8fce-5f1e-49e0-92d1-36982946d07e",
  "metadata": {
    "brandName": "BNDES",
    "version": "1.0.0",
    "language": "pt-BR",
    "namespace": "brand-concierge"
  },
  "behavior": {
    "multimodalCarousel": {
      "cardClickAction": "openLink"
    },
    "input": {
      "enableVoiceInput": false,
      "continuousVoiceMode": false,
      "disableMultiline": true,
      "showAiChatIcon": {
        "icon": ""
      }
    },
    "chat": {
      "messageAlignment": "normal",
      "messageWidth": "100%"
    },
    "privacyNotice": {
      "title": "Privacy Notice",
      "text": "Your use of this automated chatbot constitutes your consent that the personal information you provide in the chat session can be collected, used, disclosed, and retained by YourBrand and service providers acting on YourBrand's behalf in accordance with the YourBrand {Privacy Policy}. Please do not provide sensitive personal information (such as financial or health information) in the chatbot.",
      "links": [
        {
          "text": "Privacy Policy",
          "url": "<your-privacy-policy-url>"
        }
      ]
    },
    "meetingForm": {
      "fieldsPerRow": 2,
      "fieldLayoutRules": {
        "textInputs": {
          "allowTwoColumns": true,
          "fieldTypes": [
            "string",
            "email",
            "tel",
            "number"
          ],
          "identifyBy": null
        },
        "dropdowns": {
          "allowTwoColumns": false,
          "fieldTypes": [
            "select"
          ],
          "identifyBy": "hasOptions"
        },
        "checkboxes": {
          "allowTwoColumns": false,
          "fieldTypes": [
            "boolean",
            "checkbox"
          ],
          "identifyBy": null
        }
      },
      "title": {
        "text": "Agende uma reunião",
        "alignment": "left"
      },
      "subtitle": {
        "text": "Escolha um horário para conversar com um especialista do BNDES.",
        "alignment": "left"
      },
      "buttons": {
        "submit": {
          "text": "Enviar",
          "alignment": "left"
        },
        "cancel": {
          "text": "Cancelar",
          "alignment": "left"
        }
      }
    },
    "calendarWidget": {
      "title": {
        "text": "Selecione um horário",
        "alignment": "left"
      },
      "subtitle": {
        "text": "Escolha o melhor momento para sua reunião.",
        "alignment": "left"
      },
      "postTitle": {
        "text": "Após a confirmação, você receberá um convite de calendário com todos os detalhes. O especialista já terá o contexto desta conversa, então não será necessário repetir nada. Estamos ansiosos para conectá-lo ao especialista certo!",
        "alignment": "left"
      },
      "buttons": {
        "confirm": {
          "text": "Confirmar",
          "alignment": "left"
        },
        "cancel": {
          "text": "Cancelar",
          "alignment": "left"
        }
      }
    },
    "productCard": {
      "actionButtonSize": "S"
    },
    "b2bLiveChat": {
      "enabled": true
    }
  },
  "disclaimer": {
    "text": "Aviso: O BNDES utiliza cookies e tecnologias semelhantes de acordo com seus Termos de Uso e Política de Privacidade.",
    "links": [
      {
        "text": "Terms of Use",
        "url": "https://www.bndes.gov.br/wps/portal/site/home/termos-de-uso"
      }
    ]
  },
  "text": {
    "welcome.heading": "Bem-vindo ao BNDES",
    "welcome.subheading": "Aqui você encontra soluções para financiar seus projetos e impulsionar seu desenvolvimento.",
    "input.placeholder": "Como posso ajudar? Ex.: Solicitar financiamento",
    "input.messageInput.aria": "Digite sua mensagem aqui",
    "input.send.aria": "Enviar mensagem",
    "input.aiChatIcon.tooltip": "Assistente virtual do BNDES",
    "input.mic.aria": "Ativar entrada de voz",
    "card.aria.select": "Selecionar esta opção",
    "carousel.prev.aria": "Anterior",
    "carousel.next.aria": "Próximo",
    "scroll.bottom.aria": "Ir para o final da conversa",
    "error.network": "Erro de conexão. Tente novamente.",
    "loading.message": "Carregando resposta...",
    "feedback.dialog.title.positive": "Feedback positivo",
    "feedback.dialog.title.negative": "Feedback negativo",
    "feedback.dialog.question.positive": "O que você gostou?",
    "feedback.dialog.question.negative": "O que podemos melhorar?",
    "feedback.dialog.notes": "Notas adicionais",
    "feedback.dialog.submit": "Enviar",
    "feedback.dialog.cancel": "Cancelar",
    "feedback.dialog.notes.placeholder": "Digite aqui suas observações",
    "feedback.toast.success": "Obrigado pelo seu feedback!",
    "feedback.thumbsUp.aria": "Gostei",
    "feedback.thumbsDown.aria": "Não gostei",
    "feedback.title": "Nos envie seu feedback",
    "feedback.positive.title": "O que você gostou?",
    "feedback.negative.title": "O que podemos melhorar?",
    "feedback.submitButton": "Enviar",
    "feedback.positive.options": "",
    "feedback.negative.options": ""
  },
  "arrays": {
    "welcome.examples": [
      {
        "text": "Como solicitar um financiamento?",
        "systemPrompt": "Explique como solicitar um financiamento no BNDES.",
        "backgroundColor": "#005782",
        "image": "https://www.bndes.gov.br/wps/wcm/connect/site/35a29552-111c-4869-ba5e-e7a8e42378e8/BNDES_FInanciamento_Bannersite-desktop.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_7QGCHA41LORVA0AHO1SIO51085-35a29552-111c-4869-ba5e-e7a8e42378e8-p.TzjJV"
      },
      {
        "text": "Quais são os projetos financiados?",
        "systemPrompt": "Liste os tipos de projetos que o BNDES financia.",
        "backgroundColor": "#267095",
        "image": "https://www.bndes.gov.br/wps/wcm/connect/site/eb2c7ae3-3bd0-4b5c-9b04-db288b64b5af/respsocioambiental-home-destaqueazul.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_7QGCHA41LORVA0AHO1SIO51085-eb2c7ae3-3bd0-4b5c-9b04-db288b64b5af-nRdcaIc"
      },
      {
        "text": "Informações sobre o Fundo do Idoso",
        "systemPrompt": "Forneça informações sobre o Edital Fundo do Idoso.",
        "backgroundColor": "#4d89a8",
        "image": "https://www.bndes.gov.br/wps/wcm/connect/site/42369e75-648e-46ad-a664-9d1850fc2186/edital-fundo-idoso.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_7QGCHA41LORVA0AHO1SIO51085-42369e75-648e-46ad-a664-9d1850fc2186-q18D1t5"
      },
      {
        "text": "Chamada Rio Doce Participativo",
        "systemPrompt": "Explique sobre a Chamada Rio Doce Participativo.",
        "backgroundColor": "#73a3ba",
        "image": "https://www.bndes.gov.br/wps/wcm/connect/site/de555296-a2bf-414c-8be6-6ea1c94186e5/banner-Rio-Doce-Participativo.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_7QGCHA41LORVA0AHO1SIO51085-de555296-a2bf-414c-8be6-6ea1c94186e5-pYFAfKU"
      }
    ],
    "feedback.positive.options": [
      "Interface intuitiva",
      "Respostas rápidas",
      "Informações úteis",
      "Atendimento personalizado",
      "Outro"
    ],
    "feedback.negative.options": [
      "Demora nas respostas",
      "Informações incompletas",
      "Dificuldade de navegação",
      "Problemas técnicos",
      "Outro"
    ]
  },
  "assets": {
    "icons": {
      "company": "https://www.bndes.gov.br/wps/wcm/connect/site/7c0447ac-0252-4e73-bd2f-cda219a5cc93/logo-bndes.png"
    }
  },
  "visualProfile": {
    "sendIconIconColor": "#ffffff",
    "sendIconBackgroundColor": "#522752"
  },
  "theme": {
    "--welcome-input-order": "3",
    "--welcome-cards-order": "2",
    "--welcome-heading-size-desktop": "2rem",
    "--welcome-heading-size-mobile": "1.5rem",
    "--welcome-heading-weight": "700",
    "--welcome-heading-text-align": "center",
    "--welcome-subheading-size-desktop": "1.25rem",
    "--welcome-subheading-size-mobile": "1rem",
    "--welcome-subheading-text-align": "center",
    "--welcome-padding": "20px",
    "--prompt-suggestion-background": "#522752",
    "--prompt-suggestion-background-hover": "#522752",
    "--prompt-suggestion-text-color": "#522752",
    "--prompt-suggestion-border-color": "#522752",
    "--font-family": "Fira Sans, sans-serif",
    "--color-primary": "#005782",
    "--color-text": "#522752",
    "--line-height-body": "1.5",
    "--main-container-background": "#ffffff",
    "--input-height": "48px",
    "--input-height-mobile": "40px",
    "--input-border-radius": "8px",
    "--input-border-radius-mobile": "6px",
    "--input-background": "#ffffff",
    "--input-outline-color": "#d9d9d9",
    "--input-outline-width": "1px",
    "--input-box-shadow": "0 2px 4px rgba(0, 0, 0, 0.1)",
    "--input-focus-outline-width": "2px",
    "--input-focus-outline-color": "#005782",
    "--input-font-size": "1rem",
    "--input-font-weight": "400",
    "--input-text-color": "#005782",
    "--input-button-height": "36px",
    "--input-button-width": "36px",
    "--submit-button-fill-color": "#ffffff",
    "--submit-button-fill-color-disabled": "#CCCCCC",
    "--color-button-submit": "#005782",
    "--color-button-submit-hover": "#522752",
    "--input-button-border-radius": "8px",
    "--button-disabled-background": "#F0F0F0",
    "--disclaimer-color": "#071d41",
    "--disclaimer-font-size": "0.875rem",
    "--disclaimer-font-weight": "400",
    "--message-user-background": "#005782",
    "--message-user-text": "#ffffff",
    "--message-border-radius": "8px",
    "--message-padding": "16px",
    "--message-concierge-background": "#f3f3f3",
    "--message-concierge-text": "#000000",
    "--message-max-width": "100%",
    "--chat-interface-max-width": "768px",
    "--message-blocker-height": "48px",
    "--loading-message-background": "#d9d9d9",
    "--loading-dot-background": "#626262",
    "--color-text-muted": "#626262",
    "--citations-text-font-weight": "500",
    "--citations-desktop-button-font-size": "0.875rem",
    "--feedback-icon-btn-background": "#005782",
    "--feedback-icon-btn-hover-background": "#00856c",
    "--feedback-icon-btn-size-desktop": "40px",
    "--feedback-container-gap": "16px",
    "--multimodal-card-box-shadow": "0 4px 8px rgba(0, 0, 0, 0.1)",
    "--border-radius-card": "12px",
    "--button-height-s": "36px",
    "--button-primary-background": "#005782",
    "--button-primary-text": "#ffffff",
    "--button-primary-hover": "#522752",
    "--button-secondary-border": "1px solid #00856c",
    "--button-secondary-text": "#00856c",
    "--button-secondary-hover": "#006b24",
    "--color-button-secondary-hover-text": "#ffffff",
    "--privacy-notice-background": "#f8f8f8",
    "--privacy-notice-padding": "16px",
    "--privacy-notice-title-color": "#626262",
    "--privacy-notice-text-color": "#626262",
    "--privacy-notice-text-font-size": "0.875rem",
    "--privacy-notice-title-font-size": "1rem",
    "--message-concierge-link-decoration": "underline",
    "--color-secondary": "#00856c",
    "--prompt-suggestion-button-background": "#d9d9d9",
    "--prompt-pill-background": "#00856c",
    "--button-primary-mobile-background": "#522752",
    "--button-primary-mobile-hover": "#522752",
    "--main-container-mobile-background": "#ffffff",
    "--message-concierge-border-width": "1px",
    "--message-concierge-link-color": "#005782",
    "--prompt-suggestion-button-border-radius": "16px",
    "--prompt-suggestion-button-padding": "8px 16px",
    "--prompt-suggestions-container-gap": "12px",
    "--card-background": "#00856c",
    "--card-text-font-size": "1rem",
    "--card-text-padding": "16px",
    "--chat-container-background": "#ffffff",
    "--message-blocker-background": "#ffffff",
    "--card-text-color": "#ffffff",
    "--prompt-pill-border-color": "#00856c",
    "--prompt-pill-text-color": "#000000",
    "--prompt-suggestion-button-text-color": "#626262",
    "--prompt-suggestion-button-background-hover": "#d9d9d9",
    "--welcome-heading-text-color": "#000000",
    "--welcome-subheading-text-color": "#000000",
    "--welcome-header-order": "1",
    "--prompt-suggestions-flex-direction": "row",
    "--prompt-suggestions-flex-wrap": "wrap"
  }
};
