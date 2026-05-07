// Função para voltar ao passo anterior do formulário
function prevStep() {
  // Localiza a aba que está visível no momento
  const currentActive = document.querySelector('.form-step.active');
  // Extrai o número do ID (ex: "step-2" vira 2)
  const currentId = parseInt(currentActive.id.split('-')[1]);

  // Só permite voltar se não estiver no primeiro passo
  if (currentId > 1) {
    // Esconde a aba que está visível agora
    currentActive.classList.remove('active');

    // Define o ID da aba anterior e a torna visível
    const prevStepId = currentId - 1;
    document.getElementById(`step-${prevStepId}`).classList.add('active');

    // Busca todas as bolinhas de progresso no topo
    const steps = document.querySelectorAll('.step');
    // Remove o destaque da bolinha atual
    steps[currentId - 1].classList.remove('active');
    // Adiciona o destaque na bolinha anterior
    steps[prevStepId - 1].classList.add('active');

    // Caso o usuário esteja voltando da última tela (Confirmação)
    const nextBtn = document.getElementById('nextBtn');
    // Volta o texto do botão para "Próximo"
    nextBtn.innerHTML = 'Próximo <span>›</span>';
    // Garante que o clique volte a executar a função nextStep
    nextBtn.onclick = nextStep;

    // Se voltamos para o passo 1, o botão "Voltar" deve sumir novamente
    if (prevStepId === 1) {
      document.getElementById('prevBtn').style.display = 'none';
    }
  }
}

// Função para avançar para o próximo passo do formulário
function nextStep() {
  // Localiza o elemento da aba que está ativa no momento
  const currentActive = document.querySelector('.form-step.active');
  // Extrai o número do ID atual
  const currentId = parseInt(currentActive.id.split('-')[1]);

  // Validação específica para o Passo 2 (Serviços)
  if (currentId === 2) {
    // Seleciona todos os serviços marcados
    const selected = document.querySelectorAll('input[name="servico"]:checked');
    // Verifica se pelo menos um foi escolhido
    if (selected.length === 0) {
      alert("Por favor, selecione pelo menos um serviço.");
      return;
    }
    // Limita a escolha para evitar agendamentos muito longos/complexos
    if (selected.length > 2) {
      alert("Você pode selecionar no máximo 2 serviços.");
      return;
    }
  }

  // Validação do Passo 3: Obriga a escolha de uma data e um horário
  if (currentId === 3 && (!document.getElementById("data").value || !document.getElementById("hora").value)) {
    alert("Por favor, selecione a data e o horário.");
    return;
  }
  // Validação do Passo 4: Obriga o preenchimento do nome
  if (currentId === 4 && !document.getElementById("nome").value) {
    alert("Por favor, digite seu nome.");
    return;
  }

  // Se não chegamos no último passo (5), avançamos
  if (currentId < 5) {
    // Remove a classe de visibilidade da aba atual
    currentActive.classList.remove('active');
    // Adiciona a classe de visibilidade na próxima aba
    document.getElementById(`step-${currentId + 1}`).classList.add('active');

    // Garante que o botão de "Voltar" esteja visível (caso estivéssemos no passo 1)
    document.getElementById('prevBtn').style.display = 'inline-block';

    // Atualiza o estado visual das bolinhas de progresso
    const steps = document.querySelectorAll('.step');
    steps[currentId - 1].classList.remove('active');
    steps[currentId].classList.add('active');

    // Se o próximo passo for o 5 (Resumo final)
    if (currentId + 1 === 5) {
      // Coleta o tipo de atendimento escolhido (Novo ou Manutenção)
      const tipo = document.querySelector('input[name="tipo"]:checked').value;
      // Coleta os serviços marcados e transforma em uma lista de texto
      const selectedNodes = document.querySelectorAll('input[name="servico"]:checked');
      const servico = Array.from(selectedNodes).map(cb => cb.value).join(', ');
      // Formata a data de AAAA-MM-DD para DD/MM/AAAA
      const data = document.getElementById("data").value.split('-').reverse().join('/');
      const hora = document.getElementById("hora").value;
      const nome = document.getElementById("nome").value;

      // Constrói o HTML que será exibido no quadro de resumo do Passo 5
      document.getElementById('summary').innerHTML = `
              <p><strong>Nome:</strong> ${nome}</p>
              <p><strong>Tipo:</strong> ${tipo}</p>
              <p><strong>Serviço:</strong> ${servico}</p>
              <p><strong>Data:</strong> ${data}</p>
              <p><strong>Horário:</strong> ${hora}h</p>
            `;

      // Seleciona o botão de ação principal
      const btn = document.querySelector('.next-btn');
      // Altera o texto para indicar a finalização no WhatsApp
      btn.innerHTML = 'Agendar no WhatsApp <span>›</span>';
      // Muda o comportamento do botão para chamar a função de envio do WhatsApp
      btn.onclick = agendarWhatsApp;
    }
  }
}

// Função final que monta a mensagem e abre o WhatsApp
function agendarWhatsApp() {
  // Coleta todos os dados finais do formulário
  const nome = document.getElementById("nome").value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  const data = document.getElementById("data").value.split('-').reverse().join('/');
  const hora = document.getElementById("hora").value;
  const selectedNodes = document.querySelectorAll('input[name="servico"]:checked');
  const servico = Array.from(selectedNodes).map(cb => cb.value).join(', ');
  const telefone = "5585996552807"; // Número da Jéssica com código do país e DDD
  
  // Monta o link da API do WhatsApp com a mensagem pré-preenchida codificada
  const mensagem = `Olá Jéssica! Gostaria de agendar um horário.%0A%0A*Nome:* ${nome}%0A*Atendimento:* ${tipo}%0A*Serviço:* ${servico}%0A*Data:* ${data}%0A*Horário:* ${hora}h`;
  // Abre uma nova aba no navegador com a conversa iniciada
  window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");
}

function configurarArrasteHorizontal(seletor) {
  const container = document.querySelector(seletor);
  if (!container) return;

  let segurando = false;
  let inicioX;
  let scrollInicial;

  container.addEventListener("mousedown", (e) => {
    segurando = true;
    inicioX = e.pageX - container.offsetLeft;
    scrollInicial = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    segurando = false;
  });

  container.addEventListener("mouseup", () => {
    segurando = false;
  });

  container.addEventListener("mousemove", (e) => {
    if (!segurando) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const movimento = (x - inicioX) * 2;
    container.scrollLeft = scrollInicial - movimento;
  });
}

// CONFIGURAÇÃO DO FIREBASE (Substitua pelos dados que você copiou do console)
const firebaseConfig = { 
  apiKey: "AIzaSyCS2Q8uqpT3x5oeDQPblHlYQa1uc0UYD4o",
  authDomain: "jessica-brito.firebaseapp.com",
  databaseURL: "https://jessica-brito-default-rtdb.firebaseio.com",
  projectId: "jessica-brito",
  storageBucket: "jessica-brito.firebasestorage.app",
  messagingSenderId: "131337450355",
  appId: "1:131337450355:web:86a29f32ff41a587f98b06"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const feedbacksRef = database.ref('feedbacks');

// Lógica de Feedback sincronizada
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#feedbackForm");
  const nomeInput = document.querySelector("#nomeFeedback");
  const mensagemInput = document.querySelector("#mensagemFeedback");
  const estrelasInput = document.querySelector("#estrelasFeedback");
  const listaFeedbacks = document.querySelector("#listaFeedbacks");

  // Escuta novos feedbacks em TEMPO REAL (Sempre ativo se a lista existir)
  if (listaFeedbacks) {
    feedbacksRef.on("child_added", function(snapshot) {
      const feedback = snapshot.val();
      adicionarFeedbackNaTela(feedback, snapshot.key);
    });

    // Escuta remoção de feedbacks para atualizar a tela simultaneamente
    feedbacksRef.on("child_removed", function (snapshot) {
      const card = document.querySelector(`[data-id="${snapshot.key}"]`);
      if (card) card.remove();
    });
  }

  if (form) {
    // Envio do formulário
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const feedbackData = {
        nome: nomeInput.value.trim() || "Cliente Anônima",
        mensagem: mensagemInput.value.trim(),
        estrelas: Number(estrelasInput.value),
        timestamp: Date.now()
      };

      feedbacksRef.push(feedbackData);
      form.reset();
      alert("Obrigada pelo seu feedback!");
    });
  }

  function adicionarFeedbackNaTela(feedback, key) {
    const card = document.createElement("div");
    card.classList.add("card-feedback");
    card.setAttribute('data-id', key); // Identificador para remoção
    
    const estrelas = "⭐".repeat(feedback.estrelas || 5);

    const agora = Date.now();
    const trintaSegundosMs = 30000;
    const tempoDecorrido = agora - (feedback.timestamp || 0);
    
    // Verifica se o comentário foi feito há menos de 30 segundos
    const podeApagar = feedback.timestamp && (tempoDecorrido < trintaSegundosMs);
    const btnApagarHtml = podeApagar ? `<button class="btn-delete" id="btn-del-${key}" title="Excluir comentário">🗑️</button>` : '';

    card.innerHTML = `
      <h4>${feedback.nome} ${btnApagarHtml}</h4>
      <div class="stars">${estrelas}</div>
      <p>“${feedback.mensagem || ''}”</p>
    `;

    // Se o botão existe, adicionamos o evento de clique e o cronômetro para sumir
    if (podeApagar) {
      const btn = card.querySelector(".btn-delete");
      btn.addEventListener("click", () => {
        if (confirm("Deseja realmente apagar seu feedback?")) {
          feedbacksRef.child(key).remove();
        }
      });

      setTimeout(() => {
        if (btn) btn.remove();
      }, trintaSegundosMs - tempoDecorrido);
    }

    listaFeedbacks.appendChild(card); // Adiciona ao final (lado direito) conforme solicitado
    if(document.getElementById('media-area')) document.getElementById('media-area').style.display = 'block';
    
    // Rola automaticamente para o final da lista para mostrar o novo feedback
    setTimeout(() => {
      listaFeedbacks.scrollLeft = listaFeedbacks.scrollWidth;
    }, 100);
  }
});

// Ativa o arraste na galeria e na grade de projetos
configurarArrasteHorizontal(".galeria-scroll");
configurarArrasteHorizontal(".projetos-grid");
configurarArrasteHorizontal(".booking-wrapper");
configurarArrasteHorizontal(".cards-feedback");
configurarArrasteHorizontal(".feedback-container");
configurarArrasteHorizontal(".topicos-site");

// Função para observar e revelar elementos ao rolar a página
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.15 // Gatilho quando 15% da seção estiver visível
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Revela apenas uma vez para performance
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

initScrollReveal();