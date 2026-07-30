# Lamparina — organize seus dias

App de organização de atividades/estudos em grupo, com tema escuro,
calendário mensal e a "lamparina" como indicador de progresso do dia
(ela acende quando todas as atividades daquele dia estão 100% concluídas
por quem participa de cada uma).

## Arquivos

- `index.html` — o site inteiro (visual + lógica).
- `firebase-config.js` — onde você cola as chaves do seu projeto Firebase.
- `README.md` — este arquivo.

## ⚠️ Se o site ficar preso em "Modo local ativo"

Isso é exatamente o que a captura de tela mostrou. As causas mais comuns:

1. **O `firebase-config.js` não foi publicado junto com o `index.html`.**
   No GitHub Pages, os dois arquivos precisam estar na mesma pasta do
   repositório e ambos enviados (`git add`, `commit`, `push`).
2. **O `firebase-config.js` ainda tem os valores de exemplo**
   (`SUA_API_KEY` etc.) — copie os valores reais do seu projeto Firebase.
3. **O domínio do site não está autorizado no Firebase** — isso trava o
   login mesmo com a configuração certa. Veja o passo 3 abaixo.

Depois de corrigir, abra o DevTools do navegador (menu > mais ferramentas
> ferramentas do desenvolvedor, aba "Console") — se `firebase-config.js`
não carregar ou os valores estiverem errados, vai aparecer um erro ali
que ajuda a identificar o problema.

## Passo a passo do Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
   e crie um projeto (plano gratuito "Spark" é suficiente para um grupo
   pequeno de estudantes).
2. **Authentication** → aba "Sign-in method" → ative:
   - **E-mail/senha**
   - **Google** (escolha um e-mail de suporte do projeto quando pedir)
3. Ainda em **Authentication** → aba **Settings** → **Authorized domains**
   → clique em "Adicionar domínio" e inclua o domínio onde o site vai
   ficar publicado (ex: `rafaeeeelcom4e.github.io`). **Esse passo é o
   que mais gera dor de cabeça e costuma ser esquecido.**
4. **Firestore Database** → "Criar banco de dados" → modo produção →
   escolha a região mais próxima de vocês.
5. Em **Regras** do Firestore, cole o conteúdo da seção abaixo e publique.
6. **Configurações do projeto** (engrenagem) → "Geral" → "Seus aplicativos"
   → ícone `</>` (Web) → dê um nome → copie o objeto de configuração
   gerado e cole em `firebase-config.js`, substituindo os valores de
   exemplo.
7. Salve e publique **os dois arquivos juntos**. Recarregue a página —
   a tela de login (e-mail/senha ou Google) deve aparecer.

## Regras do Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null
                     && request.auth.uid == resource.data.ownerUid;

      match /members/{uid} {
        allow read: if request.auth != null;
        allow write: if request.auth != null &&
          (request.auth.uid == uid ||
           request.auth.uid == get(/databases/$(database)/documents/rooms/$(roomId)).data.ownerUid);
      }

      match /activities/{activityId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null
                       && request.resource.data.creatorUid == request.auth.uid;
        allow update, delete: if request.auth != null;
      }
    }
  }
}
```

O que isso significa, em resumo:
- Só quem está logado pode ler ou escrever.
- Uma sala só pode ser excluída por quem a criou (`ownerUid`).
- Cada pessoa escreve seu próprio registro de membro; o dono da sala
  também pode escrever/remover o registro de qualquer membro (usado
  para "remover da sala").
- Toda atividade precisa nascer com o `creatorUid` de quem está logado.
- Qualquer membro autenticado pode atualizar (marcar sua parte) ou
  apagar qualquer atividade da sala — de propósito, para permitir
  colaboração livre num grupo pequeno de confiança.

**Sobre a senha de salas privadas:** ela fica salva como texto simples
no documento da sala e funciona como uma barreira leve para impedir
que estranhos entrem por acaso — **não é uma senha criptografada** e
qualquer pessoa autenticada tecnicamente consegue lê-la direto do
banco. Para um grupo de estudos isso costuma ser suficiente, mas não
trate como segurança forte.

## Como funcionam as atividades

- **Descrição, prioridade e data**: clique em qualquer atividade (ou no
  ícone de lápis) para abrir os detalhes e editar; título, descrição,
  data e prioridade (baixa/média/alta) ficam ali.
- **Atividades em grupo**: ao criar/editar uma atividade dentro de uma
  sala, você pode marcar quem participa. Cada pessoa marcada precisa
  confirmar a própria parte (clicando na caixinha de "feito"). Se 3
  pessoas participam e só 2 confirmaram, a atividade aparece com uma
  barra amarela e "2/3 confirmaram" — só fica com a lamparina acesa
  quando todo mundo confirmar.
- **CRUD completo**: criar (botão "Adicionar" ou "Detalhes"), editar
  (clique na atividade), marcar/desmarcar sua própria confirmação, e
  excluir (ícone de lixeira) — toda exclusão pede confirmação antes.
- O Painel mostra só **as suas** atividades (as que você participa);
  Calendário e Atividades mostram as da sala inteira.

## Como funcionam as salas

- **Pública**: aparece na aba "Salas públicas" para qualquer pessoa
  logada entrar direto, sem senha.
- **Privada**: só entra quem tiver o código exato e a senha definida
  na criação.
- Quem cria a sala vira o "dono(a)" e, na aba Equipe → "Gerenciar
  sala", pode remover qualquer membro ou excluir a sala inteira
  (com confirmação). Quem não é dono só pode sair da sala.
- Se você for removido de uma sala por outra pessoa, o app detecta
  isso automaticamente e te leva de volta para a tela de escolher
  sala, com um aviso.

## Próxima etapa sugerida

- Notificação visual de atividades atrasadas (data passou e ainda não
  foi concluída por todo mundo).
- Busca/filtro por prioridade na aba Atividades.
- Exportar/importar dados do modo local para uma conta na nuvem.
