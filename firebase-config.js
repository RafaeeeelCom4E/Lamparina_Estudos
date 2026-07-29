// ============================================================
// Configuração do Firebase — Lamparina
// ============================================================
// Enquanto os valores abaixo forem os de exemplo (SUA_API_KEY etc.),
// o site funciona sozinho em "modo local" (dados só no seu navegador).
//
// Para ativar contas de verdade e salas compartilhadas com sua equipe:
//
// 1. Acesse https://console.firebase.google.com e crie um projeto novo
//    (gratuito, plano Spark é suficiente para um grupo pequeno).
//
// 2. No menu lateral, vá em "Build > Authentication" > aba "Sign-in method"
//    e ative o provedor "E-mail/senha".
//
// 3. Vá em "Build > Firestore Database" > "Criar banco de dados"
//    > escolha "Iniciar em modo de produção" (as regras ficam no README.md).
//
// 4. Vá em "Configurações do projeto" (ícone de engrenagem) > aba "Geral"
//    > role até "Seus aplicativos" > clique no ícone "</>" (Web)
//    > dê um nome ao app > copie os valores gerados e cole abaixo.
//
// 5. Salve este arquivo, publique os arquivos (index.html + este arquivo
//    juntos, na mesma pasta) e recarregue a página.
// ============================================================

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
