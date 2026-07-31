# Lamparina — organize seus dias

App de organização de atividades/estudos em grupo, com tema escuro,
calendário mensal e a "lamparina" como indicador de progresso do dia
(ela acende quando todas as atividades daquele dia estão 100% concluídas
por quem participa de cada uma).

## Arquivos

- `index.html` — o site inteiro (visual + lógica).
- `firebase-config.js` — onde você cola as chaves do seu projeto Firebase.
- `README.md` — este arquivo.

## ⚠️ Erros de "Missing or insufficient permissions"

Se aparecer essa mensagem ao criar atividade, excluir sala ou remover
alguém, o motivo quase sempre é o mesmo: **as regras do Firestore
publicadas no console não são (ou não são mais) as regras deste app.**
Isso acontece com frequência quando as regras de uma etapa anterior
ficaram publicadas e as novas (abaixo) nunca chegaram a ser coladas e
publicadas de verdade.

**Confira agora:** Firebase Console → Firestore Database → aba
**Regras** → apague todo o conteúdo → cole exatamente o bloco abaixo →
clique no botão **Publicar** (não basta salvar o rascunho, o botão
"Publicar" precisa ser clicado). Depois disso, recarregue o site.

## ⚠️ Se o site ficar preso em "Modo local ativo"

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
5. Em **Regras** do Firestore, cole o conteúdo da seção abaixo e
   **publique** (veja o aviso no topo deste README).
6. **Configurações do projeto** (engrenagem) → "Geral" → "Seus aplicativos"
   → ícone `</>` (Web) → dê um nome → copie o objeto de configuração
   gerado e cole em `firebase-config.js`, substituindo os valores de
   exemplo.
7. Salve e publique **os dois arquivos juntos**. Recarregue a página —
   a tela de login (e-mail/senha ou Google) deve aparecer.

## Regras do Firestore

Estas regras foram simplificadas nesta etapa (menos dependências entre
coleções) exatamente para reduzir a chance de erros de permissão:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null
                     && request.auth.uid == resource.data.ownerUid;
      allow delete: if request.auth != null
                     && request.auth.uid == resource.data.ownerUid;

      match /members/{uid} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
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
- Uma sala só pode ser **editada ou excluída** por quem a criou
  (`ownerUid`) — é assim que "Editar sala", "Remover membro" (feito
  pelo dono) e "Excluir sala" funcionam.
- Qualquer pessoa autenticada pode escrever em `members` — isso é o
  que permite tanto sair da sala sozinho quanto o dono remover
  outra pessoa, sem depender de uma checagem cruzada mais complexa
  (que era a causa mais provável do erro de permissão ao expulsar
  alguém). Do lado do app, o botão "Remover" só aparece para quem é
  dono — a regra em si confia no grupo pequeno, como já acontece com
  as atividades.
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
- Os nomes e cores mostrados nos participantes são sempre os **atuais**
  — se alguém mudar o nome no perfil, atividades antigas também
  atualizam, em vez de ficar com o nome antigo congelado.
- O Painel mostra só **as suas** atividades (as que você participa);
  Calendário e Atividades mostram as da sala inteira.

## Como funcionam as salas

- **Pública**: aparece na aba "Salas públicas" para qualquer pessoa
  logada entrar direto, sem senha.
- **Privada**: só entra quem tiver o código exato e a senha definida
  na criação.
- Ao clicar em "Sala:" na barra lateral (ou "Trocar de sala" na aba
  Equipe), agora aparece primeiro um resumo da **sala em que você já
  está** — nome, descrição, código e visibilidade — em vez de ir
  direto para a tela de criar/entrar em outra. Só depois de confirmar
  "Trocar de sala" (que sai da sala atual) é que a tela de escolher
  uma nova sala aparece. Isso evita o estado confuso de ficar
  "meio dentro, meio fora" de duas salas ao mesmo tempo.
- Quem cria a sala vira o "dono(a)" e, na aba Equipe → "Gerenciar
  sala", pode **remover qualquer membro**, **editar** nome/descrição/
  visibilidade/senha da sala (botão "Editar sala"), ou excluir a sala
  inteira (com confirmação). Quem não é dono só pode sair da sala.
- Se você for removido de uma sala por outra pessoa, o app detecta
  isso automaticamente e te leva de volta para a tela de escolher
  sala, com um aviso.

## Perfil

- Clique no seu nome/avatar na barra lateral (não no ícone de sair) para
  abrir "Seu perfil": dá para mudar seu **nome de exibição** e escolher
  uma **cor de avatar** entre seis opções.
- **Foto de perfil de verdade não está incluída ainda** — isso exige
  configurar o Firebase Storage (upload de arquivo), que é um passo a
  mais no Firebase e pode ter custo dependendo do uso. Se quiser, essa
  é uma boa próxima etapa; por enquanto a cor do avatar já ajuda a
  diferenciar cada pessoa visualmente nas listas e no ranking.

## Próxima etapa sugerida

- Upload de foto de perfil real (requer Firebase Storage).
- Notificação visual de atividades atrasadas (data passou e ainda não
  foi concluída por todo mundo).
- Busca/filtro por prioridade na aba Atividades.
- Exportar/importar dados do modo local para uma conta na nuvem.
