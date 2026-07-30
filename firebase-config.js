// ============================================================
// Configuração do Firebase — Lamparina
// ============================================================
// Enquanto os valores abaixo forem os de exemplo (SUA_API_KEY etc.),
// o site funciona sozinho em "modo local" (dados só no seu navegador).
//
// Para ativar contas de verdade, login com Google e salas compartilhadas:
//
// 1. Acesse https://console.firebase.google.com e crie um projeto novo
//    (gratuito, plano Spark é suficiente para um grupo pequeno).
//
// 2. Vá em "Build > Authentication" > aba "Sign-in method" e ative:
//      - "E-mail/senha"
//      - "Google" (defina um e-mail de suporte quando pedir)
//
// 3. Ainda em Authentication, aba "Settings" > "Authorized domains":
//    adicione o domínio onde o site vai ficar publicado
//    (ex: rafaeeeelcom4e.github.io). Sem isso, o login (inclusive o
//    de e-mail/senha) falha silenciosamente ou trava em "modo local".
//
// 4. Vá em "Build > Firestore Database" > "Criar banco de dados"
//    > "Iniciar em modo de produção" > cole as regras do README.md.
//
// 5. Em "Configurações do projeto" (engrenagem) > "Geral" > role até
//    "Seus aplicativos" > ícone "</>" (Web) > copie os valores gerados
//    e cole abaixo, no lugar dos valores de exemplo.
//
// 6. Salve este arquivo. IMPORTANTE: publique index.html E este
//    firebase-config.js JUNTOS, na mesma pasta do site. Se só o
//    index.html for enviado ao GitHub Pages, o app não encontra a
//    configuração e continua preso no "modo local".
// ============================================================

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
