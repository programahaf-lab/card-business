# Clareza para Decidir

Experiencia imersiva em React inspirada na navegacao do portfolio do Enzo Casalini e na linguagem visual da Nudot: entrada ritualizada, canvas fixo, scroll como timeline, camadas narrativas e leitura inicial interativa.

## Stack

- Vite
- React
- Three.js via `@react-three/fiber`
- Bloom via `@react-three/postprocessing`
- Lenis para scroll suave
- GSAP/ScrollTrigger disponivel para evolucoes de pin/scrub
- Lucide React para icones

## Como rodar

```bash
npm install
npm run dev
```

Depois acesse:

```text
http://localhost:5173
```

Build de producao:

```bash
npm run build
```

Preview local do build:

```bash
npm run preview
```

## Publicacao no GitHub Pages

Este projeto esta configurado para publicar no GitHub Pages do repositorio `programahaf-lab/card-business`.

URL esperada:

```text
https://programahaf-lab.github.io/card-business/
```

O deploy acontece automaticamente a cada push na branch `main` via GitHub Actions em `.github/workflows/deploy.yml`.

Para ativar no GitHub:

1. Abra o repositorio em `Settings > Pages`.
2. Em `Build and deployment`, selecione `GitHub Actions`.
3. Faça push da branch `main`.

Depois disso, o QR code ja pode apontar para a URL publicada.

## Navegacao

A experiencia tem duas fases:

1. Portal `ENTER`, com scroll bloqueado.
2. Imersao com scroll continuo, canvas fixo e cenas controladas pelo progresso da pagina.

As cenas sao:

```text
01 Sinais
02 Mapa
03 Validacao
04 Leitura
05 Contato
```

## Onde editar

- Conteudo, perguntas, resultado e WhatsApp: `src/data.js`
- App, canvas e componentes: `src/main.jsx`
- Visual e responsividade: `src/styles.css`

## Arquivos antigos

Os antigos `styles.css` e `script.js` ainda estao na raiz como referencia da versao HTML pura, mas a aplicacao atual usa `src/styles.css` e `src/main.jsx`.
