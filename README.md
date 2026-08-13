# Lamparina — organize seus dias

App de organização de atividades/estudos em grupo, com tema escuro,
calendário mensal e a "lamparina" como indicador de progresso do dia
(ela acende quando todas as atividades daquele dia estão 100% concluídas
por quem participa de cada uma).

## Arquivos

- `index.html` — o site inteiro (visual + lógica).
- `firebase-config.js` — onde você cola as chaves do seu projeto Firebase.
- `manifest.json` — permite instalar o site como app (PWA).
- `service-worker.js` — cache básico, exigido pelos navegadores para
  permitir a instalação como app.
- `icons/` — ícones do app (favicon, ícone de instalação, etc). Todos
  precisam ser publicados junto, na mesma pasta do `index.html`.
- `README.md` — este arquivo.

## Histórico de desenvolvimento (resumo por etapa)

1. Painel, Calendário, Atividades, login local, 4 temas de cor.
2. Firebase Auth (e-mail/senha), salas via Firestore, ranking da equipe.
3. Login Google, descrição/prioridade nas atividades, atividades em
   grupo com confirmação individual, salas públicas/privadas, CRUD
   completo, confirmação em exclusões.
4. Regras do Firestore simplificadas, tela de "sala atual" antes de
   trocar, descrição/edição de sala, perfil (nome + cor de avatar).
5. Corrigido bug de inicialização (TDZ) que travava o modo local.
6. Diagnóstico do Firebase reescrito pra mostrar o motivo exato de
   "modo local ativo" direto no app.
7. Aba renomeada pra "Privado", modal de detalhes de sala pública,
   sincronização de sala entre dispositivos (coleção `users`),
   código/senha visíveis só pro dono, PWA instalável (manifest,
   service worker, ícones), horário e repetição semanal em atividades.
8. Corrigido bug do horário sumindo (não era lido de volta do
   Firestore), calendário com 3 estados visuais, caixa "Suas
   pendências", selos de sala corrigidos visualmente.
9. Brilho suave no dia 100% concluído, bolinha de prioridade no
   calendário (verde/amarelo/vermelho), mais espaçamento nos modais.
10. Tela de detalhes da atividade (antes de editar), atividades
    individuais só editáveis por quem criou (app + regra do Firestore).
11. Corrigida regressão de layout no desktop e bug do cache do app
    instalado (service worker "cache primeiro" → "rede primeiro").
12. Atividades atrasadas em vermelho, link/anexo na atividade,
    convite por link (`?sala=codigo`).
13. Corrigido bug do link relativo (faltava `https://`), suporte a
    múltiplos links visíveis.
14. Comentários por atividade, estatísticas da sala (% por dia),
    editar atividade recorrente com opção de propagar.
15. Corrigido overflow do modal de confirmação com 3 botões.
16. Atividades individuais de outras pessoas ganham cor roxa
    separada (calendário e listas), continuam visíveis mas
    diferenciadas das próprias.
17. Reordenado o Calendário: "Suas pendências" primeiro; atividades
    individuais de outras pessoas ficam recolhidas por padrão.
18–19. Duas rodadas de correção de responsividade mobile: `.task-text`
    sem `min-width:0` (texto não encolhia, estourava a página) e depois
    o grid do calendário (`repeat(7,1fr)` sem `minmax(0,1fr)`, mesma
    armadilha do CSS Grid). Resolveu Atividades e Equipe no celular.
20. Corrigido o bug das caixas do Calendário crescendo no celular ao
    tocar num dia com atividade própria: era a mesma armadilha de CSS
    Grid do item 19, só que faltando aplicar em `.cal-layout` (o grid
    que organiza o calendário e o painel lateral) — `1fr` sozinho vira
    `minmax(auto,1fr)`, então o conteúdo da caixa (`taskRow`) podia
    forçar a coluna a crescer; corrigido pra `minmax(0,1fr)`.
21. Modo offline de verdade: persistência do Firestore ativada
    (`enablePersistence`), então sala e atividades ficam salvas no
    aparelho e sobrevivem a recarregar a página sem internet; banner
    "Você está sem internet" aparece/some sozinho conforme a conexão;
    corrigido falso positivo de "sala foi excluída" que a persistência
    poderia causar (só confia em "não existe" quando vem do servidor,
    não do cache); e corrigido o service worker, que bloqueava o cache
    dos próprios scripts do Firebase (gstatic.com) — sem isso o app
    nem conseguia inicializar o modo nuvem estando 100% offline.
22. Corrigido o motivo real de as atividades já existentes não
    aparecerem offline: `joinRoom()` tinha um `await` numa escrita no
    Firestore (atualizar o registro de "membro" da sala) antes de ligar
    os listeners de atividades — offline, essa escrita só é confirmada
    quando a internet volta, então o app ficava travado esperando pra
    sempre e nunca chegava a mostrar nada. Agora a sala é aberta e os
    listeners ligam imediatamente; essas escritas rodam em segundo
    plano e ficam na fila até a conexão voltar.
23. Notificações no navegador: botão "Ativar notificações" na topbar,
    avisa 15 minutos antes do horário de cada atividade sua do dia
    (que ainda não foi concluída). **Limitação importante:** como o
    site é estático (sem servidor), só funciona enquanto o app/aba
    estiver aberto (mesmo que em segundo plano) — não tem como avisar
    com o app totalmente fechado; isso exigiria um servidor de push
    (Firebase Cloud Functions).
24. Busca e filtro por prioridade na aba Atividades: campo de busca
    (por título/descrição) e pills de prioridade (Baixa/Média/Alta),
    combinam com o filtro de status (Todas/Pendentes/Concluídas) que
    já existia.

## ⚠️ Problema conhecido em aberto: nenhum no momento

O bug das caixas do Calendário crescendo no celular (visto nas etapas
anteriores) foi corrigido na etapa 20 — ver histórico acima.

## Ideias discutidas, ainda não implementadas

- Exportar/imprimir a semana em PDF ou texto.
- Upload de foto de perfil real (precisa configurar Firebase Storage
  primeiro, é um passo a mais no console do Firebase).

Clique em "Instalar app" no topo da tela. No computador ou Android
isso abre o instalador nativo do navegador; no iPhone/iPad (Safari não
tem esse recurso) o botão mostra o passo a passo — toque no ícone de
Compartilhar e escolha "Adicionar à Tela de Início".

## ⚠️ App instalado ficava "travado" numa versão antiga

Se o app instalado no celular estava se comportando diferente do site
aberto no navegador (por exemplo, o menu não abria direito num mas
abria no outro): o `service-worker.js` usava uma estratégia de cache
que guardava a primeira versão do site vista e nunca mais buscava uma
atualizada — o app instalado congelava numa versão antiga para
sempre, mesmo depois de várias atualizações no site. Corrigido nesta
versão (agora ele sempre busca a versão mais nova quando há internet,
só usando o cache se estiver offline).

Depois de publicar esta atualização, feche e abra o app instalado de
novo. Se ainda parecer o mesmo bug, desinstale e instale de novo pra
garantir — isso força a limpeza do cache antigo.

## ⚠️ "Uncaught ReferenceError: Cannot access '...' before initialization"

Se você viu esse erro no console (mencionando `AVATAR_COLORS` ou algo
parecido) em uma versão anterior deste arquivo: era um bug real do
código, já corrigido nesta versão — duas constantes (`AVATAR_COLORS` e
`MONTHS`) estavam declaradas mais abaixo no arquivo do que o ponto em
que o modo local tentava usá-las ao carregar a página, o que travava
a inicialização inteira para quem já tinha um perfil local salvo no
navegador. Baixe esta versão do `index.html` para resolver.

## ⚠️ Regras e domínio certos, mas o site ainda cai em "Modo local ativo"

O app agora mostra o **motivo exato** direto no banner amarelo (não
precisa mais abrir o Console do navegador) — recarregue a página e
leia o texto ao lado de "Modo local ativo.". As causas possíveis são:

- **Os scripts do Firebase não carregaram** (hospedados em
  `gstatic.com`) — geralmente é bloqueador de anúncios/extensão de
  privacidade barrando esse domínio, ou falta de conexão no momento
  do carregamento. Teste numa aba anônima com as extensões desativadas.
- **`firebase-config.js` não foi encontrado** — não foi publicado na
  mesma pasta do `index.html`.
- **`firebase-config.js` ainda com valores de exemplo.**
- **Erro ao inicializar** — o banner mostra a mensagem de erro exata
  do Firebase, que ajuda a identificar o problema (ex: projeto errado,
  domínio não autorizado etc).

Regras do Firestore e domínio autorizado são configurações do lado do
**Firebase** (servidor); a inicialização acima é decidida pelo
**navegador**, olhando só para os arquivos publicados. São coisas
independentes — corrigir uma não corrige a outra.

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
coleções) exatamente para reduzir a chance de erros de permissão. Elas
mudaram nesta versão: entrou a coleção `users`, usada para lembrar em
qual sala você está e sincronizar isso entre computador e celular —
**se você já publicou uma versão anterior destas regras, precisa
publicar esta de novo**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

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
        allow update, delete: if request.auth != null
                               && (resource.data.assignees.size() > 1
                                   || resource.data.creatorUid == request.auth.uid);

        match /comments/{commentId} {
          allow read: if request.auth != null;
          allow create: if request.auth != null
                         && request.resource.data.uid == request.auth.uid;
        }
      }
    }
  }
}
```

O que isso significa, em resumo:
- Só quem está logado pode ler ou escrever, e cada pessoa só mexe no
  próprio documento em `users/{uid}` — é ali que fica guardado "qual é
  a minha sala atual", para funcionar igual no computador e no celular.
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
- **Atividades com mais de uma pessoa** (grupo) continuam abertas para
  qualquer membro autenticado editar/apagar — colaboração livre, de
  propósito. **Atividades individuais** (só uma pessoa participando)
  agora só podem ser editadas/apagadas por quem criou — tanto no app
  quanto aqui nas regras (antes só o app escondia o botão; agora o
  Firestore também recusa a escrita, então nem chamando a API
  diretamente dá pra mexer na tarefa de outra pessoa).

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
- **Horário**: ao criar/editar, dá pra definir um horário (opcional).
  Ele aparece como um selinho antes do título, e as listas (Painel,
  Calendário, Atividades) passam a ordenar as atividades do dia pelo
  horário, além de por concluído/pendente.
- **Repetição semanal**: só ao criar uma atividade nova (não ao
  editar), marque os dias da semana em que ela deve se repetir e até
  quando — o app cria uma atividade independente para cada dia
  correspondente, até um teto de 6 meses à frente. Atividades assim
  ganham um ícone ↻. Ao excluir uma delas, você escolhe entre apagar
  "só este dia" ou "todos os dias" da série.
- Os nomes e cores mostrados nos participantes são sempre os **atuais**
  — se alguém mudar o nome no perfil, atividades antigas também
  atualizam, em vez de ficar com o nome antigo congelado.
- O Painel mostra só **as suas** atividades (as que você participa);
  Calendário e Atividades mostram as da sala inteira.

## Como funcionam as salas

- **O que é o código**: é o identificador único da sala — funciona como
  um "nome de usuário" para a sala. Compartilhe-o com quem você quer
  que entre. Em salas privadas, além do código é preciso saber a
  senha; em salas públicas, o código nem é estritamente necessário,
  já que a sala aparece listada na aba "Públicas" pelo nome.
- **Pública**: aparece na aba "Salas públicas" para qualquer pessoa
  logada ver os detalhes (nome, descrição, criador, data de criação) e
  entrar direto, sem senha. Tocar numa sala da lista abre esses
  detalhes antes de entrar, em vez de um botão gigante.
- **Privada**: só entra quem tiver o código exato e a senha definida
  na criação.
- **Só o dono vê o código e a senha da própria sala** num quadro
  dedicado na aba Equipe (com um botão "mostrar/ocultar senha") — isso
  resolve o problema de esquecer a senha depois de criar a sala.
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
- **Computador e celular na mesma conta**: a sala em que você está
  agora é salva na nuvem (não só no navegador), então entrar com a
  mesma conta em outro aparelho já te leva direto pra sua sala atual,
  sem precisar escolher de novo.

## Perfil

- Clique no seu nome/avatar na barra lateral (não no ícone de sair) para
  abrir "Seu perfil": dá para mudar seu **nome de exibição** e escolher
  uma **cor de avatar** entre seis opções.
- **Foto de perfil de verdade não está incluída ainda** — isso exige
  configurar o Firebase Storage (upload de arquivo), que é um passo a
  mais no Firebase e pode ter custo dependendo do uso. Se quiser, essa
  é uma boa próxima etapa; por enquanto a cor do avatar já ajuda a
  diferenciar cada pessoa visualmente nas listas e no ranking.

## Novidades desta etapa

- **Busca/filtro por prioridade**: aba Atividades ganhou campo de
  busca (título/descrição) e pills de prioridade, combinando com o
  filtro de status que já existia (ver item 24 do histórico).

## Próxima etapa sugerida

- Exportar semana em PDF, upload de foto de perfil real.
