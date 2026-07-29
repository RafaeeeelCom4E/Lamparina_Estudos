# Lamparina — organize seus dias

App de organização de atividades/estudos em grupo, com tema escuro,
calendário mensal e a "lamparina" como indicador de progresso do dia
(ela acende quando todas as tarefas daquele dia estão concluídas).

## Arquivos

- `index.html` — o site inteiro (visual + lógica).
- `firebase-config.js` — onde você cola as chaves do seu projeto Firebase.
- `README.md` — este arquivo.

## Como abrir

Sem configurar nada, dá para abrir o `index.html` direto no navegador —
ele funciona em **modo local** (perfil e atividades salvos só no seu
aparelho, via `localStorage`). É o jeito mais rápido de testar o visual.

Para ativar contas de verdade e salas compartilhadas com a equipe,
configure o Firebase (passo a passo abaixo) e, de preferência, sirva os
arquivos por um servidor local ou publique no **Firebase Hosting** em vez
de abrir com duplo clique — alguns navegadores restringem login/Firestore
em páginas abertas como `file://`.

Se tiver Python instalado, um jeito rápido de servir localmente:
```
cd pasta-do-projeto
python3 -m http.server 8000
```
e abrir `http://localhost:8000` no navegador.

## Passo a passo do Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
   e crie um projeto (o plano gratuito "Spark" é suficiente para um grupo
   pequeno de estudantes).
2. **Authentication** → aba "Sign-in method" → ative **E-mail/senha**.
3. **Firestore Database** → "Criar banco de dados" → modo produção →
   escolha a região mais próxima de vocês.
4. Em **Regras** do Firestore, cole o conteúdo da seção abaixo e publique.
5. **Configurações do projeto** (engrenagem) → "Geral" → "Seus aplicativos"
   → ícone `</>` (Web) → dê um nome → copie o objeto de configuração
   gerado e cole em `firebase-config.js`, substituindo os valores de
   exemplo.
6. Salve tudo, recarregue a página — a tela de login por e-mail/senha e
   de criação/entrada em sala vai aparecer automaticamente.

## Regras do Firestore

Cole isto nas regras do seu banco (aba **Regras**, dentro de Firestore
Database). Elas são propositalmente simples e permissivas dentro do que
é necessário — pensadas para um grupo pequeno e confiável de
estudantes, não para uso público em larga escala:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;

      match /members/{uid} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == uid;
      }

      match /activities/{activityId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null
                       && request.resource.data.uid == request.auth.uid;
        allow update, delete: if request.auth != null;
      }
    }
  }
}
```

O que essas regras significam, em resumo:
- Só quem estiver logado (com conta de e-mail/senha) pode ler ou
  escrever qualquer coisa.
- Cada pessoa só edita seu próprio registro de membro.
- Qualquer atividade criada precisa estar marcada com o `uid` de quem
  criou (evita que alguém crie tarefa em nome de outro membro).
- Qualquer membro autenticado pode marcar como feito/apagar qualquer
  atividade da sala — de propósito, para permitir colaboração livre
  dentro do pequeno grupo. Se quiser travar mais (por exemplo, só o
  autor da tarefa pode apagá-la), me avise que ajusto a regra.

## Como funciona a sala

- Uma pessoa cria a sala com um código (ex: `calc2-turma-a`).
- As demais pessoas entram usando o mesmo código, em "Entrar em sala
  existente".
- Todo mundo da sala vê as mesmas atividades em tempo real e aparece
  no ranking da aba **Equipe**, comparando tarefas concluídas.
- Dá para trocar de sala a qualquer momento clicando no chip "Sala:"
  na barra lateral.

## Próxima etapa sugerida

- Edição de tarefas existentes (hoje só dá para marcar/apagar).
- Notificação visual de atividades atrasadas (data passou e não foi
  concluída).
- Exportar/importar dados do modo local para uma conta na nuvem, para
  quem já vinha usando localmente e quer migrar para uma sala.
