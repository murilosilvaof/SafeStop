# SafeStop UFRN

MVP de aplicativo multiplataforma em React Native com Expo para registrar alertas de insegurança nas paradas do circular da UFRN. O foco desta primeira versão é o fluxo principal: um usuário aperta o botão de alerta, informa o motivo e o sistema compartilha esse aviso com a comunidade e com a segurança patrimonial.

## O que esta versão entrega

- Botão principal para acionar um alerta da parada em foco.
- Formulário com escolha da parada, nível de risco, mensagem e opção de anonimato.
- Feed de alertas recentes com confirmações de outros usuários.
- Chat simulado com a equipe de segurança.
- Painel de notificações preventivas e resumo das paradas monitoradas.

## Estrutura

- `App.js`: composição da tela principal do MVP.
- `src/components`: cards, feed, chat e modal de criação do alerta.
- `src/hooks/useSafeStopState.js`: estado local do aplicativo e regras do fluxo.
- `src/data/mockData.js`: dados simulados para demonstrar a experiência.

## Como executar

1. Instale as dependências com `npm install`.
2. Inicie o menu do Expo com `npm run start`.
3. Para abrir direto no navegador, use `npm run web`.
4. Para celular, escaneie o QR code no Expo Go.
5. Para emulador Android ou simulador iOS, use `npm run android` ou `npm run ios`.

## Próximos passos recomendados

1. Integrar autenticação institucional para separar usuário comum, motorista e segurança patrimonial.
2. Substituir os dados mockados por backend com banco de dados, geolocalização real e histórico por parada.
3. Conectar push notifications e WebSocket para alertas em tempo real.
4. Integrar o totem físico via API e registrar telemetria NB-IoT para redundância de comunicação.
5. Adicionar mapa do campus, rota segura e analytics de incidentes por faixa de horário.
