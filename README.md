# Painel Capital · Media Ops

Dashboard de performance de mídia para Capital de Prêmios + Capital Cena.

## Stack

- Next.js 14 (App Router)
- React 18
- Recharts (gráficos)
- Lucide React (ícones)
- Fonte de dados: Google Apps Script → Google Sheets (alimentado pela Windsor.ai)

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Deploy no Vercel

1. Sobe esse repositório no GitHub
2. No Vercel, clica em "Add New Project" e seleciona o repositório
3. Vercel detecta Next.js automaticamente — só clicar em Deploy
4. Em 2 minutos sua URL fica pronta

## Configurar fonte de dados

A URL do Apps Script já está configurada como padrão dentro de `components/Dashboard.jsx`:

```
https://script.google.com/macros/s/AKfycbz.../exec
```

Para trocar por outra URL, clica no botão "API" no header e cola a nova URL.

## Estrutura

- `app/page.js` — entrada da aplicação
- `app/layout.js` — layout raiz
- `components/Dashboard.jsx` — componente único com todo o dashboard

## Classificação de campanhas

O dashboard classifica automaticamente cada campanha pelo nome:

- contém `sena` → **CS** (Capital Cena)
- contém `revendedor` ou `vídeo` → **REV** (Revendedores)
- contém `alcance` + (cidade/UF/ganhador) → **CG** (Cidade Ganhador)
- contém `alcance` + (institucional/awareness) → **AW**
- contém `capital`, `topo`, `meio`, `fundo` → **CP** (Capital de Prêmios)
- nenhuma das acima → **NÃO CLASSIFICADA** (aparece em banner amarelo de aviso)
