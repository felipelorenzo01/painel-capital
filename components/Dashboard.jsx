"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, FunnelChart, Funnel, LabelList
} from "recharts";
import {
  Upload, TrendingUp, Target, Users, MapPin, DollarSign,
  Activity, Filter, Download, Zap, Trophy, ShoppingCart, UserPlus, Eye,
  ArrowUpRight, ArrowDownRight, Calendar, Play, Image as ImgIcon,
  Shield, AlertTriangle, CheckCircle2, Flame, Clock, Settings,
  Wifi, WifiOff, RefreshCw, Key, FileText
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   PALETA — HÍBRIDA (TECH ESCURO + DOURADO CAPITAL)
   ═══════════════════════════════════════════════════════════════ */
const C = {
  // Backgrounds tech-escuro
  bg: "#08090C",
  panel: "#0E1116",
  panelHi: "#141821",
  panelDeep: "#0B0D12",
  border: "#1C212C",
  borderHi: "#2A3142",

  // Texto
  text: "#EEF1F6",
  textDim: "#8A93A6",
  textMute: "#4D5566",

  // Accent principal: DOURADO Capital
  gold: "#E8B547",
  goldHi: "#F5C966",
  goldDim: "#9A7530",

  // Azul royal Capital (secundário)
  royal: "#3D6FFF",
  royalDim: "#2849B0",

  // Vertentes (mantendo coerência com dourado)
  cp: "#E8B547",      // Capital de Prêmios = dourado puro
  cs: "#FF7A47",      // Capital Cena = laranja-coral (complementa o dourado)
  rev: "#3D6FFF",     // Revendedores = azul royal Capital
  cg: "#A678FF",      // Cidade Ganhador = violeta
  aw: "#5DCFC0",      // Awareness = teal

  // Status
  pos: "#3DDB8E",
  warn: "#FFB13D",
  neg: "#FF4D6E",
};

const VERTENTES = {
  CP: { nome: "Capital de Prêmios", cor: C.cp, icone: Trophy, sigla: "CP" },
  CS: { nome: "Capital Cena", cor: C.cs, icone: Zap, sigla: "CS" },
  REV: { nome: "Revendedores", cor: C.rev, icone: UserPlus, sigla: "REV" },
  CG: { nome: "Cidade Ganhador", cor: C.cg, icone: MapPin, sigla: "CG" },
  AW: { nome: "Awareness", cor: C.aw, icone: Eye, sigla: "AW" },
};

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — Reflete a estrutura real que vem da Windsor.ai
   ═══════════════════════════════════════════════════════════════ */
const MOCK_DATA = {
  periodo: "01/04/2026 a 30/04/2026",
  ultimaAtualizacao: "04/05/2026 09:42",

  // ── Saúde geral das contas
  contasAnuncio: [
    { id: "CAPITAL_04", nome: "CAPITAL 04", status: "ATIVA", aquecimento: 92, gastoMes: 28420, frequency: 2.4, adsRejeitados: 0, score: 88 },
    { id: "CAPITAL_05", nome: "CAPITAL 05", status: "ATIVA", aquecimento: 65, gastoMes: 12180, frequency: 1.8, adsRejeitados: 1, score: 76 },
    { id: "CAPITAL_06", nome: "CAPITAL 06", status: "REVIEW", aquecimento: 30, gastoMes: 2840, frequency: 1.2, adsRejeitados: 3, score: 42 },
  ],

  campanhas: [
    { id: 1, nome: "[CP] Vendas Diretas - Toro 2026", vertente: "CP", objetivo: "Vendas", investido: 8420.50, impressoes: 412300, cliques: 18420, compras: 1842, ctr: 4.47, cpa: 4.57 },
    { id: 2, nome: "[CP] Vendas Diretas - LAL Compradores", vertente: "CP", objetivo: "Vendas", investido: 6210.00, impressoes: 298100, cliques: 13200, compras: 1320, ctr: 4.43, cpa: 4.70 },
    { id: 3, nome: "[CS] Vendas Diretas - Sena Premiada", vertente: "CS", objetivo: "Vendas", investido: 7890.00, impressoes: 385000, cliques: 16800, compras: 1545, ctr: 4.36, cpa: 5.11 },
    { id: 4, nome: "[CS] Vendas Diretas - Remarketing 7d", vertente: "CS", objetivo: "Vendas", investido: 3120.00, impressoes: 92400, cliques: 6240, compras: 891, ctr: 6.75, cpa: 3.50 },
    { id: 5, nome: "[REV] Captação Revendedores BSB", vertente: "REV", objetivo: "Leads", investido: 2450.00, impressoes: 168200, cliques: 5840, leads: 412, ctr: 3.47, cpl: 5.95 },
    { id: 6, nome: "[REV] Captação Entorno DF", vertente: "REV", objetivo: "Leads", investido: 1820.00, impressoes: 124300, cliques: 4120, leads: 287, ctr: 3.31, cpl: 6.34 },
    { id: 7, nome: "[CG] Cidade Ganhador - Goiânia", vertente: "CG", objetivo: "Alcance", investido: 1450.00, impressoes: 284500, cliques: 7820, ctr: 2.75 },
    { id: 8, nome: "[CG] Cidade Ganhador - Recife", vertente: "CG", objetivo: "Alcance", investido: 1680.00, impressoes: 312800, cliques: 8920, ctr: 2.85 },
    { id: 9, nome: "[CG] Cidade Ganhador - Belo Horizonte", vertente: "CG", objetivo: "Alcance", investido: 1920.00, impressoes: 358200, cliques: 10240, ctr: 2.86 },
    { id: 10, nome: "[AW] Awareness Institucional", vertente: "AW", objetivo: "Alcance", investido: 2100.00, impressoes: 892400, cliques: 12420, ctr: 1.39 },
  ],

  // ── Criativos com thumbnails (campos da Windsor: image_url, video_asset_thumbnail_url)
  criativos: [
    { id: "c1", nome: "Vídeo Toro Vencedor 30s", vertente: "CP", tipo: "video", thumb: "linear-gradient(135deg, #1a3a5c 0%, #0d4a3c 100%)", investido: 4820, ctr: 5.1, cpa: 4.20, thruplay: 68, status: "top" },
    { id: "c2", nome: "Carrossel Casas Premiadas", vertente: "CP", tipo: "carousel", thumb: "linear-gradient(135deg, #4a2a1a 0%, #6c4a3a 100%)", investido: 3600, ctr: 4.8, cpa: 4.85, status: "top" },
    { id: "c3", nome: "Reels Ganhador BSB Reage", vertente: "CG", tipo: "video", thumb: "linear-gradient(135deg, #5c1a3a 0%, #3c0d4a 100%)", investido: 1920, ctr: 3.2, cpa: 6.10, thruplay: 54, status: "ok" },
    { id: "c4", nome: "Estático Sena Premiada $", vertente: "CS", tipo: "image", thumb: "linear-gradient(135deg, #3a1a5c 0%, #1a3a8c 100%)", investido: 2450, ctr: 4.6, cpa: 5.20, status: "top" },
    { id: "c5", nome: "Vídeo Depoimento Cliente", vertente: "CS", tipo: "video", thumb: "linear-gradient(135deg, #5c4a1a 0%, #8c6a3a 100%)", investido: 2180, ctr: 3.9, cpa: 5.80, thruplay: 42, status: "ok" },
    { id: "c6", nome: "Carrossel Revendedor BSB", vertente: "REV", tipo: "carousel", thumb: "linear-gradient(135deg, #1a5c3a 0%, #3a8c5c 100%)", investido: 1340, ctr: 3.5, cpl: 6.20, status: "ok" },
    { id: "c7", nome: "Vídeo Antigo - Honda CB", vertente: "CP", tipo: "video", thumb: "linear-gradient(135deg, #4a1a1a 0%, #6c3a3a 100%)", investido: 1850, ctr: 1.8, cpa: 12.40, thruplay: 22, status: "burn" },
    { id: "c8", nome: "Estático Old - Promo Sena", vertente: "CS", tipo: "image", thumb: "linear-gradient(135deg, #3a3a3a 0%, #5c5c5c 100%)", investido: 980, ctr: 2.1, cpa: 9.80, status: "burn" },
  ],

  // ── Funil de conversão
  funil: [
    { etapa: "Impressões", valor: 3327800, taxa: 100 },
    { etapa: "Cliques", valor: 104120, taxa: 3.13 },
    { etapa: "Visualizou Cota", valor: 41648, taxa: 1.25 },
    { etapa: "Adicionou Cota", valor: 18420, taxa: 0.55 },
    { etapa: "Checkout", valor: 9842, taxa: 0.30 },
    { etapa: "Compra", valor: 7598, taxa: 0.23 },
  ],

  // ── Heatmap horário × dia
  heatmap: (() => {
    const dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
    const horas = Array.from({ length: 24 }, (_, i) => i);
    const data = [];
    dias.forEach((d, di) => {
      horas.forEach((h) => {
        // Picos: domingo manhã (sorteio Record), noites de sex/sab, fim de tarde dias úteis
        let base = 20;
        if (di === 0 && h >= 8 && h <= 11) base = 95; // domingo sorteio
        else if (di === 0 && h >= 18 && h <= 22) base = 75;
        else if (di === 5 && h >= 19 && h <= 23) base = 80;
        else if (di === 6 && h >= 18 && h <= 23) base = 78;
        else if (h >= 18 && h <= 22) base = 60;
        else if (h >= 12 && h <= 14) base = 55;
        else if (h >= 6 && h <= 8) base = 35;
        else if (h >= 0 && h <= 5) base = 8;
        data.push({ dia: d, hora: h, valor: base + Math.floor(Math.random() * 15) });
      });
    });
    return data;
  })(),

  // ── Demografia
  porIdade: [
    { faixa: "18-24", cliques: 8420, compras: 642 },
    { faixa: "25-34", cliques: 24180, compras: 2120 },
    { faixa: "35-44", cliques: 28940, compras: 2780 },
    { faixa: "45-54", cliques: 19820, compras: 1640 },
    { faixa: "55-64", cliques: 9240, compras: 580 },
    { faixa: "65+", cliques: 3420, compras: 178 },
  ],
  porGenero: [
    { nome: "Masculino", valor: 62, compras: 4920, investido: 22340 },
    { nome: "Feminino", valor: 36, compras: 2840, investido: 12980 },
    { nome: "N/I", valor: 2, compras: 158, investido: 720 },
  ],

  // ── Cidades dos ganhadores
  cidadesGanhadores: [
    { cidade: "Goiânia", uf: "GO", lat: -16.68, lng: -49.25, alcance: 142800, investido: 1450, conversoes: 89 },
    { cidade: "Recife", uf: "PE", lat: -8.05, lng: -34.88, alcance: 168200, investido: 1680, conversoes: 112 },
    { cidade: "Belo Horizonte", uf: "MG", lat: -19.92, lng: -43.93, alcance: 195400, investido: 1920, conversoes: 138 },
    { cidade: "Salvador", uf: "BA", lat: -12.97, lng: -38.51, alcance: 124200, investido: 1280, conversoes: 78 },
    { cidade: "Fortaleza", uf: "CE", lat: -3.71, lng: -38.54, alcance: 98400, investido: 1100, conversoes: 64 },
  ],

  // ── Evolução temporal
  evolucaoDiaria: [
    { dia: "01/04", investido: 1280, compras: 312 },
    { dia: "05/04", investido: 1420, compras: 384 },
    { dia: "10/04", investido: 1180, compras: 298 },
    { dia: "15/04", investido: 1620, compras: 442 },
    { dia: "20/04", investido: 1840, compras: 512 },
    { dia: "25/04", investido: 1480, compras: 398 },
    { dia: "30/04", investido: 1720, compras: 478 },
  ],

  // ── Calendário de sorteios (CP = domingo, CS = terça)
  // Cada sorteio: data ISO (YYYY-MM-DD), tipo, tema, prêmios, valor total, ganhadores
  sorteios: [
    // ─── MAIO 2026 ───
    {
      data: "2026-05-10", semanaInicio: "2026-05-04", semanaFim: "2026-05-10",
      tipo: "CP", tema: "MEGA ESPECIAL MÃES", valorTotal: 300000,
      premios: [
        { ord: "1º", item: "Pacote viagem resorte", valor: 10000 },
        { ord: "2º", item: "iPhone 17 Pro Max", valor: 10000 },
        { ord: "3º", item: "Yamaha Fazer 250cc", valor: 20000 },
        { ord: "4º", item: "Casa", valor: 200000 },
        { ord: "GIRO", item: "Super Giros (20× R$ 2.000)", valor: 40000 },
        { ord: "GIRO DIA", item: "Giro Dia (20× R$ 1.000)", valor: 20000 },
      ],
    },
    {
      data: "2026-05-12", semanaInicio: "2026-05-11", semanaFim: "2026-05-17",
      tipo: "CS", tema: "Sena Premiada", valorTotal: 50000,
      premios: [{ ord: "Total", item: "Prêmio em dinheiro", valor: 50000 }],
    },
    {
      data: "2026-05-17", semanaInicio: "2026-05-11", semanaFim: "2026-05-17",
      tipo: "CP", tema: "Sorteio Quinzenal", valorTotal: 140000,
      premios: [
        { ord: "1º", item: "iPhone 17 Pro", valor: 7000 },
        { ord: "2º", item: "Pacote viagem", valor: 8000 },
        { ord: "3º", item: "Moto Pop", valor: 10000 },
        { ord: "4º", item: "Carro", valor: 100000 },
        { ord: "GIRO", item: "Gira Minas (10× R$ 1.000)", valor: 10000 },
        { ord: "GIRO DIA", item: "Gira Minas (10× R$ 500)", valor: 5000 },
      ],
    },
    {
      data: "2026-05-19", semanaInicio: "2026-05-18", semanaFim: "2026-05-24",
      tipo: "CS", tema: "Sena Premiada", valorTotal: 60000,
      premios: [{ ord: "Total", item: "Prêmio em dinheiro", valor: 60000 }],
    },
    {
      data: "2026-05-24", semanaInicio: "2026-05-18", semanaFim: "2026-05-24",
      tipo: "CP", tema: "Especial Dinheiro", valorTotal: 130000,
      premios: [
        { ord: "1º", item: "Dinheiro", valor: 3000 },
        { ord: "2º", item: "Dinheiro", valor: 5000 },
        { ord: "3º", item: "Dinheiro", valor: 7000 },
        { ord: "4º", item: "Dinheiro", valor: 100000 },
        { ord: "GIRO", item: "Gira Minas (10× R$ 1.000)", valor: 10000 },
        { ord: "GIRO DIA", item: "Gira Minas (10× R$ 500)", valor: 5000 },
      ],
    },
    {
      data: "2026-05-26", semanaInicio: "2026-05-25", semanaFim: "2026-05-31",
      tipo: "CS", tema: "Sena Premiada", valorTotal: 70000,
      premios: [{ ord: "Total", item: "Prêmio em dinheiro", valor: 70000 }],
    },
    // ─── JUNHO 2026 ───
    {
      data: "2026-06-02", semanaInicio: "2026-06-01", semanaFim: "2026-06-07",
      tipo: "CS", tema: "Sena Premiada", valorTotal: 80000,
      premios: [{ ord: "Total", item: "Prêmio em dinheiro", valor: 80000 }],
    },
    {
      data: "2026-06-07", semanaInicio: "2026-06-01", semanaFim: "2026-06-07",
      tipo: "CP", tema: "ESPECIAL DE JUNHO", valorTotal: 280000,
      premios: [
        { ord: "1º", item: "Pacote viagem", valor: 10000 },
        { ord: "2º", item: "iPhone 17 Pro", valor: 10000 },
        { ord: "3º", item: "Moto Honda CG 160", valor: 15000 },
        { ord: "4º", item: "Ranger ou Hilux", valor: 200000 },
        { ord: "GIRO", item: "Super Giros Brasília TV (10× R$ 1.500)", valor: 15000 },
        { ord: "NA TRAVE", item: "Capital de Prêmios", valor: 10000 },
        { ord: "GIRO DIA", item: "Capital Dia (100× R$ 200)", valor: 20000 },
      ],
    },
    {
      data: "2026-06-09", semanaInicio: "2026-06-08", semanaFim: "2026-06-14",
      tipo: "CS", tema: "Sena Premiada", valorTotal: 80000,
      premios: [{ ord: "Total", item: "Prêmio em dinheiro", valor: 80000 }],
    },
    {
      data: "2026-06-14", semanaInicio: "2026-06-08", semanaFim: "2026-06-14",
      tipo: "CP", tema: "Sorteio Quinzenal", valorTotal: 150000,
      premios: [
        { ord: "1º", item: "Par de aliança Vivara", valor: 5000 },
        { ord: "2º", item: "Pacote viagem Gramado", valor: 5000 },
        { ord: "3º", item: "Pacote viagem Paris", valor: 10000 },
        { ord: "4º", item: "Creta", valor: 100000 },
        { ord: "GIRO", item: "Giro Brasília (10× R$ 1.000)", valor: 10000 },
        { ord: "NA TRAVE", item: "Capital de Prêmios", valor: 10000 },
        { ord: "GIRO DIA", item: "Capital Dia (50× R$ 200)", valor: 10000 },
      ],
    },
    {
      data: "2026-06-16", semanaInicio: "2026-06-15", semanaFim: "2026-06-21",
      tipo: "CS", tema: "Sena Premiada", valorTotal: 80000,
      premios: [{ ord: "Total", item: "Prêmio em dinheiro", valor: 80000 }],
    },
    {
      data: "2026-06-21", semanaInicio: "2026-06-15", semanaFim: "2026-06-21",
      tipo: "CP", tema: "Sorteio Semanal", valorTotal: 130000,
      premios: [
        { ord: "1º", item: "Dinheiro", valor: 5000 },
        { ord: "2º", item: "Dinheiro", valor: 5000 },
        { ord: "3º", item: "Dinheiro", valor: 10000 },
        { ord: "4º", item: "HB20 S ou Onix S", valor: 80000 },
        { ord: "GIRO", item: "Giro Brasília (10× R$ 1.000)", valor: 10000 },
        { ord: "NA TRAVE", item: "Capital de Prêmios", valor: 10000 },
        { ord: "GIRO DIA", item: "Capital Dia (50× R$ 200)", valor: 10000 },
      ],
    },
    {
      data: "2026-06-23", semanaInicio: "2026-06-22", semanaFim: "2026-06-28",
      tipo: "CS", tema: "Sena Premiada", valorTotal: 90000,
      premios: [{ ord: "Total", item: "Prêmio em dinheiro", valor: 90000 }],
    },
    {
      data: "2026-06-28", semanaInicio: "2026-06-22", semanaFim: "2026-06-28",
      tipo: "CP", tema: "Especial Eletrônicos", valorTotal: 140000,
      premios: [
        { ord: "1º", item: "Duas TVs", valor: 3000 },
        { ord: "2º", item: "Kit Game (TV + PS5)", valor: 5000 },
        { ord: "3º", item: "iPhone 17 Pro", valor: 7000 },
        { ord: "4º", item: "Nivus", valor: 100000 },
        { ord: "GIRO", item: "Giro Brasília (20× R$ 500)", valor: 10000 },
        { ord: "NA TRAVE", item: "Capital de Prêmios", valor: 10000 },
        { ord: "GIRO DIA", item: "Capital Dia (25× R$ 200)", valor: 5000 },
      ],
    },
  ],

  // ── Pixels & Compliance
  pixels: [
    { nome: "PIXEL_CAPITAL_PREMIOS", dominio: "capitaldepremios.com", verificado: true, eventos7d: 18420, qualidade: 8.4, status: "ok" },
    { nome: "PIXEL_CAPITAL_SENA", dominio: "capitalsena.com", verificado: true, eventos7d: 12840, qualidade: 7.9, status: "ok" },
    { nome: "PIXEL_LANDING_REV", dominio: "revendedor.capital.com", verificado: false, eventos7d: 412, qualidade: 5.2, status: "warn" },
  ],

  // ── Saúde geral da operação
  saudeOperacao: {
    score: 78,
    contasAtivas: 2,
    contasRevisao: 1,
    adsRejeitados30d: 4,
    pixelsVerificados: 2,
    pixelsTotal: 3,
    bmStatus: "OK",
    dominiosVerificados: 2,
  },
};

/* ═══════════════════════════════════════════════════════════════
   GOOGLE APPS SCRIPT CLIENT — lê JSON via endpoint próprio
   ═══════════════════════════════════════════════════════════════ */
const CACHE_MS = 10 * 60 * 1000;
const _cache = {};

const sheetsClient = {
  async fetchJSON(endpointUrl) {
    if (!endpointUrl) throw new Error("Endpoint não configurado");
    const cacheKey = endpointUrl;
    const cached = _cache[cacheKey];
    if (cached && Date.now() - cached.t < CACHE_MS) return cached.d;

    const res = await fetch(endpointUrl);
    if (!res.ok) throw new Error(`Apps Script: ${res.status}`);
    const json = await res.json();
    _cache[cacheKey] = { t: Date.now(), d: json };
    return json;
  },
};

/* ═══════════════════════════════════════════════════════════════
   CLASSIFICADOR DE VERTENTE — por nome da campanha
   ═══════════════════════════════════════════════════════════════ */
const classificarVertente = (campaignName) => {
  if (!campaignName) return "NAO_CLASSIFICADA";
  const n = campaignName.toLowerCase();

  // Capital Cena (sena) — checar antes de "capital"
  if (n.includes("sena")) return "CS";

  // Revendedores — vídeos ou revendedor explícito
  if (n.includes("revendedor") || n.includes("vídeo") || n.includes("video")) return "REV";

  // Alcance — distinguir CG (cidade ganhador) de AW (institucional)
  if (n.includes("alcance")) {
    if (n.includes("ganhador") || n.includes("cidade") || /\b(go|pe|mg|ba|ce|sp|rj|df)\b/i.test(n)) return "CG";
    if (n.includes("awareness") || n.includes("institucional") || n.includes("perfil")) return "AW";
    return "CG"; // default alcance
  }

  // Capital de Prêmios — depois de checar "sena"
  if (n.includes("capital") || n.includes("topo") || n.includes("meio") || n.includes("fundo")) return "CP";

  return "NAO_CLASSIFICADA";
};

/* ═══════════════════════════════════════════════════════════════
   PARSER DE LINHA DA WINDSOR → ESTRUTURA INTERNA
   ═══════════════════════════════════════════════════════════════ */
const parsearLinha = (row) => {
  // Aceita variações de nome de campo (Windsor às vezes muda)
  const num = (...keys) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && row[k] !== "") return Number(row[k]) || 0;
    }
    return 0;
  };

  const compras = num("actions_offsite_conversion_fb_pixel_purchase", "actions_purchase");
  const conversas = num("actions_onsite_conversion_messaging_conversation_started_7d");
  const custoConversa = num("cost_per_action_type_onsite_conversion_messaging_conversation_started_7d");
  const investido = num("spend");

  return {
    account_id: row.account_id,
    account_name: row.account_name,
    campaign: row.campaign,
    campaign_id: row.campaign_id,
    objetivo: row.campaign_objective,
    date: row.date,
    investido,
    impressoes: num("impressions"),
    alcance: num("reach"),
    cliques: num("link_clicks", "clicks"),
    frequency: num("frequency"),
    ctr: num("website_ctr_link_click", "ctr"),
    cpc: num("cpc"),
    cpm: num("cpm"),
    compras,
    conversas,
    custoConversa,
    custoPorCompra: compras ? investido / compras : 0,
    roas: num("purchase_roas_omni_purchase", "website_purchase_roas_offsite_conversion_fb_pixel_purchase"),
    vertente: classificarVertente(row.campaign),
  };
};

/* ═══════════════════════════════════════════════════════════════
   AGREGADOR — soma linhas diárias por campanha
   ═══════════════════════════════════════════════════════════════ */
const agregarPorCampanha = (linhasParseadas) => {
  const map = {};
  linhasParseadas.forEach((l) => {
    const k = l.campaign_id || l.campaign;
    if (!map[k]) {
      map[k] = {
        id: k,
        nome: l.campaign,
        vertente: l.vertente,
        objetivo: l.objetivo,
        account_name: l.account_name,
        investido: 0, impressoes: 0, alcance: 0, cliques: 0,
        compras: 0, conversas: 0, dias: 0, frequencyTotal: 0,
      };
    }
    map[k].investido += l.investido;
    map[k].impressoes += l.impressoes;
    map[k].alcance += l.alcance;
    map[k].cliques += l.cliques;
    map[k].compras += l.compras;
    map[k].conversas += l.conversas;
    map[k].frequencyTotal += l.frequency;
    map[k].dias += 1;
  });

  return Object.values(map).map((c) => ({
    ...c,
    ctr: c.impressoes ? (c.cliques / c.impressoes) * 100 : 0,
    custoPorCompra: c.compras ? c.investido / c.compras : 0,
    custoPorConversa: c.conversas ? c.investido / c.conversas : 0,
    frequency: c.dias ? c.frequencyTotal / c.dias : 0,
  }));
};

/* ═══════════════════════════════════════════════════════════════
   UTILS
   ═══════════════════════════════════════════════════════════════ */
const fmtBRL = (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtBRLk = (v) => v >= 1000 ? `R$ ${(v / 1000).toFixed(1)}k` : `R$ ${v.toFixed(0)}`;
const fmtNum = (v) => Number(v).toLocaleString("pt-BR");
const fmtPct = (v) => `${Number(v).toFixed(2)}%`;
const fmtNumK = (v) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString();

/* ═══════════════════════════════════════════════════════════════
   STYLE INJECTOR
   ═══════════════════════════════════════════════════════════════ */
const StyleInjector = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Sora:wght@400;500;600;700;800&display=swap');
    .dash-root, .dash-root * { box-sizing: border-box; }
    .dash-root {
      font-family: 'Sora', sans-serif;
      background: ${C.bg};
      color: ${C.text};
      min-height: 100vh;
      letter-spacing: -0.005em;
    }
    .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "tnum", "zero"; }
    .display { font-family: 'Sora', sans-serif; font-weight: 800; letter-spacing: -0.03em; }

    .dash-root::before {
      content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image:
        radial-gradient(circle at 12% 8%, rgba(232,181,71,0.05) 0%, transparent 35%),
        radial-gradient(circle at 88% 92%, rgba(61,111,255,0.04) 0%, transparent 35%);
    }
    .dash-content { position: relative; z-index: 1; }

    .panel {
      background: ${C.panel};
      border: 1px solid ${C.border};
      position: relative;
    }
    .panel-gold-edge {
      background: ${C.panel};
      border: 1px solid ${C.border};
      position: relative;
    }
    .panel-gold-edge::before {
      content: ""; position: absolute; top: -1px; left: -1px;
      width: 24px; height: 24px;
      border-top: 1px solid ${C.gold};
      border-left: 1px solid ${C.gold};
      pointer-events: none;
    }
    .panel-gold-edge::after {
      content: ""; position: absolute; bottom: -1px; right: -1px;
      width: 24px; height: 24px;
      border-bottom: 1px solid ${C.gold};
      border-right: 1px solid ${C.gold};
      pointer-events: none;
    }

    .blink { animation: blink 1.6s ease-in-out infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

    .pulse-gold { animation: pulseGold 2.4s ease-in-out infinite; }
    @keyframes pulseGold {
      0%, 100% { box-shadow: 0 0 0 0 rgba(232,181,71,0.4); }
      50% { box-shadow: 0 0 0 8px rgba(232,181,71,0); }
    }

    .scan {
      background: repeating-linear-gradient(
        180deg, transparent 0px, transparent 2px,
        rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 3px
      );
    }

    .btn {
      background: ${C.panelHi}; border: 1px solid ${C.border}; color: ${C.text};
      padding: 8px 14px; font-size: 11px; font-weight: 600; cursor: pointer;
      letter-spacing: 0.06em; text-transform: uppercase;
      transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 8px;
      font-family: 'Sora', sans-serif;
    }
    .btn:hover { border-color: ${C.gold}; color: ${C.gold}; }
    .btn-primary {
      background: ${C.gold}; color: ${C.bg}; border-color: ${C.gold}; font-weight: 700;
    }
    .btn-primary:hover { background: ${C.goldHi}; border-color: ${C.goldHi}; }

    .chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 3px 9px; font-size: 10px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      border: 1px solid currentColor; font-family: 'JetBrains Mono', monospace;
    }
    .filter-btn {
      padding: 9px 14px; font-size: 10px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      border: 1px solid ${C.border}; background: ${C.panel};
      color: ${C.textDim}; cursor: pointer; transition: all 0.15s;
      display: inline-flex; align-items: center; gap: 7px;
      font-family: 'Sora', sans-serif;
    }
    .filter-btn:hover:not(.active) { color: ${C.text}; border-color: ${C.borderHi}; }

    /* Recharts overrides */
    .recharts-cartesian-axis-tick-value { font-family: 'JetBrains Mono', monospace; font-size: 10px; }
    .recharts-default-tooltip {
      background: ${C.panelHi} !important;
      border: 1px solid ${C.gold} !important;
      border-radius: 0 !important;
      font-family: 'JetBrains Mono', monospace !important;
    }
    .recharts-tooltip-label { color: ${C.gold} !important; font-size: 11px !important; font-weight: 700 !important; }
    .recharts-tooltip-item { font-size: 11px !important; }

    /* Creative card hover */
    .creative-card { transition: all 0.2s ease; }
    .creative-card:hover { transform: translateY(-2px); border-color: ${C.gold} !important; }
    .creative-card:hover .play-overlay { opacity: 1; }
    .play-overlay { transition: opacity 0.2s; opacity: 0.7; }

    /* Section title gradient line */
    .section-line {
      flex: 1; height: 1px;
      background: linear-gradient(90deg, ${C.gold}80 0%, ${C.border} 100%);
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════════ */
const Header = ({ apiStatus, onRefresh, onUpload, fileName, onConfig, agencyLogo, onAgencyLogoUpload }) => {
  const inputRef = useRef(null);
  const agencyInputRef = useRef(null);
  const statusColor = apiStatus === "live" ? C.pos : apiStatus === "loading" ? C.gold : apiStatus === "mock" ? C.warn : C.neg;
  const statusLabel = apiStatus === "live" ? "DADOS · LIVE" : apiStatus === "loading" ? "CARREGANDO…" : apiStatus === "mock" ? "MOCK · DEMO" : "OFFLINE";

  return (
    <div style={{
      borderBottom: `1px solid ${C.border}`,
      padding: "18px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: `linear-gradient(180deg, ${C.panel} 0%, ${C.bg} 100%)`,
      position: "sticky", top: 0, zIndex: 100,
      backdropFilter: "blur(8px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Logo Capital */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42,
            background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldHi} 100%)`,
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 2,
            boxShadow: `0 0 24px ${C.gold}30`,
          }}>
            <Trophy size={20} color={C.bg} strokeWidth={2.5} />
            <div style={{
              position: "absolute", inset: -3,
              border: `1px solid ${C.gold}40`,
              borderRadius: 2,
            }} />
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: C.gold, letterSpacing: "0.25em", marginBottom: 2 }}>
              ▸ CAPITAL · MEDIA OPS
            </div>
            <div className="display" style={{ fontSize: 18 }}>
              Painel de Mídia <span style={{ color: C.gold }}>·</span> Capital
            </div>
          </div>
        </div>

        <div style={{ width: 1, height: 36, background: C.border }} />

        {/* Status */}
        <div className="mono" style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span className="blink" style={{ color: statusColor, fontSize: 14 }}>●</span>
          <span style={{ color: statusColor, fontWeight: 700, letterSpacing: "0.15em" }}>{statusLabel}</span>
          <span style={{ color: C.textMute }}>·</span>
          <span style={{ color: C.textDim }}>{MOCK_DATA.periodo}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textMute, textAlign: "right", letterSpacing: "0.1em" }}>
          ÚLTIMA SINC.<br/>
          <span style={{ color: C.textDim, fontSize: 10 }}>{MOCK_DATA.ultimaAtualizacao}</span>
        </div>
        <input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }}
          onChange={(e) => onUpload(e.target.files[0])} />
        <button className="btn" onClick={onRefresh} title="Atualizar dados">
          <RefreshCw size={12} /> SYNC
        </button>
        <button className="btn" onClick={() => inputRef.current?.click()} title="Backup CSV">
          <Upload size={12} /> {fileName ? fileName.substring(0, 14) + "…" : "CSV"}
        </button>
        <button className="btn" onClick={onConfig}>
          <Key size={12} /> API
        </button>

        {/* ─── ASSINATURA AGÊNCIA ─── */}
        <div style={{ width: 1, height: 36, background: C.border, marginLeft: 4 }} />
        <input ref={agencyInputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => onAgencyLogoUpload(e.target.files[0])} />
        <div
          onClick={() => agencyInputRef.current?.click()}
          title="Clique para fazer upload da logo da sua agência"
          style={{
            display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2,
            cursor: "pointer", padding: "4px 8px",
            border: `1px dashed ${agencyLogo ? "transparent" : C.borderHi}`,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { if (!agencyLogo) e.currentTarget.style.borderColor = C.gold; }}
          onMouseLeave={(e) => { if (!agencyLogo) e.currentTarget.style.borderColor = C.borderHi; }}
        >
          <span className="mono" style={{ fontSize: 8, color: C.textMute, letterSpacing: "0.18em" }}>
            POWERED BY
          </span>
          {agencyLogo ? (
            <img src={agencyLogo} alt="Agência"
              style={{ height: 28, maxWidth: 120, objectFit: "contain", filter: "brightness(1.05)" }} />
          ) : (
            <span className="mono" style={{
              fontSize: 10, color: C.textDim, fontWeight: 700,
              letterSpacing: "0.1em", padding: "2px 0",
            }}>
              + SUA LOGO
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENTES BASE
   ═══════════════════════════════════════════════════════════════ */
const SectionTitle = ({ codigo, titulo, sub, accent = C.gold }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
    <span className="mono" style={{
      fontSize: 10, color: accent, letterSpacing: "0.2em", fontWeight: 700,
      padding: "4px 10px", border: `1px solid ${accent}40`, background: `${accent}08`,
    }}>
      {codigo}
    </span>
    <h2 className="display" style={{ fontSize: 18, margin: 0 }}>{titulo}</h2>
    {sub && <span style={{ fontSize: 12, color: C.textMute, fontStyle: "italic" }}>{sub}</span>}
    <div className="section-line" />
  </div>
);

const KPI = ({ label, valor, sub, delta, icon: Icon, accent = C.text, big = false }) => (
  <div className="panel" style={{ padding: big ? 24 : 18, position: "relative", overflow: "hidden" }}>
    <div style={{
      position: "absolute", top: 0, left: 0, width: "100%", height: 2,
      background: `linear-gradient(90deg, ${accent} 0%, ${accent}00 100%)`,
    }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: C.textDim, textTransform: "uppercase" }}>
        {label}
      </div>
      <Icon size={14} color={accent} strokeWidth={1.8} />
    </div>
    <div className="mono display" style={{ fontSize: big ? 32 : 26, color: C.text, lineHeight: 1, marginBottom: 8 }}>
      {valor}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10 }}>
      <span className="mono" style={{ color: C.textMute }}>{sub}</span>
      {delta !== undefined && (
        <span className="mono" style={{
          color: delta >= 0 ? C.pos : C.neg,
          display: "inline-flex", alignItems: "center", gap: 2, fontWeight: 700,
        }}>
          {delta >= 0 ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}
          {Math.abs(delta).toFixed(1)}%
        </span>
      )}
    </div>
  </div>
);

const VerticalFilter = ({ ativo, setAtivo }) => {
  const opcoes = [
    { id: "TODOS", nome: "Todos", cor: C.gold },
    ...Object.entries(VERTENTES).map(([k, v]) => ({ id: k, nome: v.nome, cor: v.cor, Icon: v.icone })),
  ];
  return (
    <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
      {opcoes.map((op) => {
        const isActive = ativo === op.id;
        return (
          <button
            key={op.id}
            className={`filter-btn ${isActive ? "active" : ""}`}
            onClick={() => setAtivo(op.id)}
            style={isActive ? {
              background: op.cor, color: C.bg, borderColor: op.cor,
              boxShadow: `0 0 16px ${op.cor}40`,
            } : {}}
          >
            {op.Icon && <op.Icon size={11} />}
            {op.nome}
          </button>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: SAÚDE DA OPERAÇÃO
   ═══════════════════════════════════════════════════════════════ */
const SaudeOperacao = ({ data }) => {
  const score = data.saudeOperacao.score;
  const corScore = score >= 80 ? C.pos : score >= 60 ? C.warn : C.neg;
  const labelScore = score >= 80 ? "SAUDÁVEL" : score >= 60 ? "ATENÇÃO" : "RISCO";

  return (
    <div className="panel-gold-edge" style={{ padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32 }}>
        {/* Score circular */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ position: "relative", width: 160, height: 160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke={C.border} strokeWidth="8" />
              <circle cx="80" cy="80" r="68" fill="none"
                stroke={corScore} strokeWidth="8"
                strokeDasharray={`${(score / 100) * 427} 427`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{ filter: `drop-shadow(0 0 8px ${corScore}80)` }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div className="mono display" style={{ fontSize: 42, color: corScore, lineHeight: 1 }}>{score}</div>
              <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em" }}>/ 100</div>
            </div>
          </div>
          <div className="chip" style={{ color: corScore, background: `${corScore}10` }}>
            <Shield size={10} /> {labelScore}
          </div>
        </div>

        {/* Métricas detalhadas */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <h3 className="display" style={{ fontSize: 16, margin: 0, marginBottom: 4 }}>
              Saúde da operação · status global
            </h3>
            <p style={{ fontSize: 11, color: C.textMute, margin: 0 }}>
              Score composto: status das contas, qualidade dos pixels, frequency média e ads reprovados
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Contas Ativas", v: `${data.saudeOperacao.contasAtivas}/${data.saudeOperacao.contasAtivas + data.saudeOperacao.contasRevisao}`, cor: C.pos, Icon: CheckCircle2 },
              { label: "Em Review", v: data.saudeOperacao.contasRevisao, cor: C.warn, Icon: AlertTriangle },
              { label: "Ads Rejeitados 30d", v: data.saudeOperacao.adsRejeitados30d, cor: data.saudeOperacao.adsRejeitados30d > 5 ? C.neg : C.warn, Icon: AlertTriangle },
              { label: "Pixels OK", v: `${data.saudeOperacao.pixelsVerificados}/${data.saudeOperacao.pixelsTotal}`, cor: C.pos, Icon: Activity },
            ].map((m, i) => (
              <div key={i} style={{
                background: C.panelHi, border: `1px solid ${C.border}`,
                padding: 14, borderLeft: `2px solid ${m.cor}`,
              }}>
                <m.Icon size={14} color={m.cor} style={{ marginBottom: 8 }} />
                <div className="mono display" style={{ fontSize: 22, color: C.text, lineHeight: 1 }}>{m.v}</div>
                <div className="mono" style={{ fontSize: 9, color: C.textDim, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 16, padding: 12,
            background: C.panelDeep, border: `1px solid ${C.border}`,
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <AlertTriangle size={14} color={C.warn} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>
              <span style={{ color: C.warn, fontWeight: 700 }}>Atenção</span>: CAPITAL 06 está em revisão (Meta requisitou verificação adicional). Pause novos criativos agressivos nesta conta até o status normalizar.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: AQUECIMENTO DE CONTAS
   ═══════════════════════════════════════════════════════════════ */
const AquecimentoContas = ({ contas }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
          ACCOUNT WARMUP
        </div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Aquecimento das contas de anúncio</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {contas.map((c) => {
          const fase = c.aquecimento >= 80 ? "MADURA" : c.aquecimento >= 50 ? "AQUECIDA" : "FRIA";
          const cor = c.aquecimento >= 80 ? C.pos : c.aquecimento >= 50 ? C.gold : C.neg;
          const statusBadge = c.status === "ATIVA" ? C.pos : c.status === "REVIEW" ? C.warn : C.neg;

          return (
            <div key={c.id} style={{
              background: C.panelHi, border: `1px solid ${C.border}`,
              padding: 16, borderLeft: `3px solid ${cor}`,
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 280px", gap: 24, alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>{c.nome}</span>
                  </div>
                  <span className="chip" style={{ color: statusBadge, background: `${statusBadge}10`, fontSize: 9 }}>
                    {c.status === "ATIVA" ? <CheckCircle2 size={9} /> : <AlertTriangle size={9} />}
                    {c.status}
                  </span>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
                    <span style={{ color: C.textDim }}>Aquecimento · {fase}</span>
                    <span className="mono" style={{ color: cor, fontWeight: 700 }}>{c.aquecimento}%</span>
                  </div>
                  <div style={{ height: 8, background: C.panelDeep, position: "relative", overflow: "hidden" }}>
                    <div style={{
                      position: "absolute", inset: 0, width: `${c.aquecimento}%`,
                      background: `linear-gradient(90deg, ${cor}AA 0%, ${cor} 100%)`,
                      boxShadow: `0 0 12px ${cor}40`,
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: C.textMute }}>
                    <span className="mono">FRIA</span>
                    <span className="mono">AQUECIDA</span>
                    <span className="mono">MADURA</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, fontSize: 10 }}>
                  <div>
                    <div className="mono" style={{ color: C.textMute, fontSize: 9, letterSpacing: "0.1em" }}>GASTO</div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{fmtBRLk(c.gastoMes)}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ color: C.textMute, fontSize: 9, letterSpacing: "0.1em" }}>FREQ.</div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: c.frequency > 3 ? C.neg : C.text }}>{c.frequency}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ color: C.textMute, fontSize: 9, letterSpacing: "0.1em" }}>SCORE</div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: c.score >= 70 ? C.pos : C.warn }}>{c.score}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: INVESTIMENTO POR OBJETIVO
   ═══════════════════════════════════════════════════════════════ */
const InvestimentoPorObjetivo = ({ campanhas }) => {
  const data = useMemo(() => {
    const map = {};
    campanhas.forEach((c) => {
      const key = `${c.vertente} · ${c.objetivo}`;
      if (!map[key]) map[key] = { nome: key, vertente: c.vertente, investido: 0 };
      map[key].investido += c.investido;
    });
    return Object.values(map).sort((a, b) => b.investido - a.investido);
  }, [campanhas]);

  const total = data.reduce((s, d) => s + d.investido, 0);

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
            INV / OBJ
          </div>
          <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Investimento por objetivo</h3>
        </div>
        <div className="mono" style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>
          TOTAL <span style={{ marginLeft: 8 }}>{fmtBRL(total)}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map((d, i) => {
          const pct = (d.investido / total) * 100;
          const cor = VERTENTES[d.vertente]?.cor || C.text;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
                <span style={{ color: C.text, fontWeight: 500 }}>{d.nome}</span>
                <span className="mono" style={{ color: C.textDim }}>
                  {fmtBRL(d.investido)} <span style={{ color: cor, marginLeft: 8, fontWeight: 700 }}>{pct.toFixed(1)}%</span>
                </span>
              </div>
              <div style={{ height: 6, background: C.panelDeep, position: "relative", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", inset: 0, width: `${pct}%`,
                  background: `linear-gradient(90deg, ${cor}88 0%, ${cor} 100%)`,
                  boxShadow: `0 0 10px ${cor}50`,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: CP × CS DUELO
   ═══════════════════════════════════════════════════════════════ */
const CompararVertentes = ({ campanhas }) => {
  const data = useMemo(() => {
    const cp = campanhas.filter((c) => c.vertente === "CP");
    const cs = campanhas.filter((c) => c.vertente === "CS");
    const reduce = (arr) => ({
      investido: arr.reduce((s, c) => s + c.investido, 0),
      cliques: arr.reduce((s, c) => s + (c.cliques || 0), 0),
      compras: arr.reduce((s, c) => s + (c.compras || 0), 0),
      impressoes: arr.reduce((s, c) => s + c.impressoes, 0),
    });
    return [
      { nome: "Capital Prêmios", sigla: "CP", ...reduce(cp), cor: C.cp },
      { nome: "Capital Cena", sigla: "CS", ...reduce(cs), cor: C.cs },
    ];
  }, [campanhas]);

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
          CP × CS
        </div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Vertentes em duelo</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {data.map((d, i) => {
          const cpa = d.investido / (d.compras || 1);
          return (
            <div key={i} style={{
              border: `1px solid ${C.border}`, padding: 16,
              borderTop: `3px solid ${d.cor}`, background: C.panelHi,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span className="display" style={{ fontSize: 14 }}>{d.nome}</span>
                <span className="chip" style={{ color: d.cor, background: `${d.cor}12` }}>
                  {d.sigla}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  ["Investido", fmtBRL(d.investido)],
                  ["Compras", fmtNum(d.compras)],
                  ["CPA", fmtBRL(cpa)],
                  ["Cliques", fmtNum(d.cliques)],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, paddingBottom: 6, borderBottom: `1px dashed ${C.border}` }}>
                    <span style={{ color: C.textDim }}>{k}</span>
                    <span className="mono" style={{ color: C.text, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: EVOLUÇÃO TEMPORAL
   ═══════════════════════════════════════════════════════════════ */
const EvolucaoTemporal = ({ data }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
          TIME / 30D
        </div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Evolução diária · Investimento × Compras</h3>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradInv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.gold} stopOpacity={0.4} />
              <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradComp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.cs} stopOpacity={0.4} />
              <stop offset="100%" stopColor={C.cs} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={C.border} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="dia" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
          <Tooltip />
          <Area yAxisId="left" type="monotone" dataKey="investido" name="Investido (R$)" stroke={C.gold} strokeWidth={2} fill="url(#gradInv)" />
          <Area yAxisId="right" type="monotone" dataKey="compras" name="Compras" stroke={C.cs} strokeWidth={2} fill="url(#gradComp)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: FUNIL DE CONVERSÃO
   ═══════════════════════════════════════════════════════════════ */
const FunilConversao = ({ data }) => {
  const max = data[0].valor;
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
          FUNNEL
        </div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Funil de conversão</h3>
        <p style={{ fontSize: 11, color: C.textMute, margin: 0, marginTop: 4 }}>
          De impressão até compra · onde está vazando
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {data.map((etapa, i) => {
          const pct = (etapa.valor / max) * 100;
          const dropoff = i > 0 ? ((1 - etapa.valor / data[i - 1].valor) * 100) : 0;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
                <span style={{ color: C.text, fontWeight: 600 }}>{etapa.etapa}</span>
                <span className="mono" style={{ color: C.textDim, fontSize: 10 }}>
                  {fmtNum(etapa.valor)} · <span style={{ color: C.gold }}>{etapa.taxa.toFixed(2)}%</span>
                </span>
              </div>
              <div style={{ position: "relative", height: 26, background: C.panelDeep, overflow: "hidden" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${C.gold}DD 0%, ${C.goldHi} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
                }}>
                  <span className="mono" style={{ fontSize: 9, color: C.bg, fontWeight: 700 }}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>
              {i > 0 && (
                <div className="mono" style={{ fontSize: 9, color: C.neg, marginTop: 2, textAlign: "right" }}>
                  ↓ -{dropoff.toFixed(1)}% drop
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: GRID DE CRIATIVOS
   ═══════════════════════════════════════════════════════════════ */
const GridCriativos = ({ criativos }) => {
  const [filtro, setFiltro] = useState("todos");

  const lista = useMemo(() => {
    let arr = [...criativos];
    if (filtro === "top") arr = arr.filter((c) => c.status === "top");
    if (filtro === "burn") arr = arr.filter((c) => c.status === "burn");
    return arr.sort((a, b) => b.investido - a.investido);
  }, [criativos, filtro]);

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
            CREATIVES
          </div>
          <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Grid de criativos</h3>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {[
            { id: "todos", label: "Todos" },
            { id: "top", label: "Top performers", cor: C.pos },
            { id: "burn", label: "Queimando verba", cor: C.neg },
          ].map((f) => (
            <button key={f.id}
              className={`filter-btn`}
              onClick={() => setFiltro(f.id)}
              style={filtro === f.id ? {
                background: f.cor || C.gold, color: C.bg,
                borderColor: f.cor || C.gold,
              } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {lista.map((c) => {
          const cor = VERTENTES[c.vertente]?.cor || C.text;
          const statusCor = c.status === "top" ? C.pos : c.status === "burn" ? C.neg : C.warn;

          return (
            <div key={c.id} className="creative-card" style={{
              background: C.panelHi, border: `1px solid ${C.border}`,
              overflow: "hidden", cursor: "pointer",
            }}>
              {/* Thumbnail */}
              <div style={{
                position: "relative", height: 140,
                background: c.thumb,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {/* Mock thumbnail texture */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                }} />

                {/* Tipo icon */}
                <div className="play-overlay" style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.3)",
                }}>
                  {c.tipo === "video" && <Play size={32} color="#fff" fill="#fff" />}
                  {c.tipo === "carousel" && (
                    <div style={{ display: "flex", gap: 4 }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} style={{ width: 14, height: 14, background: "#fff", borderRadius: 1 }} />
                      ))}
                    </div>
                  )}
                  {c.tipo === "image" && <ImgIcon size={32} color="#fff" />}
                </div>

                {/* Vertente badge */}
                <div style={{
                  position: "absolute", top: 8, left: 8,
                  background: cor, color: C.bg,
                  padding: "3px 7px", fontSize: 9, fontWeight: 800,
                  letterSpacing: "0.1em", fontFamily: "JetBrains Mono",
                }}>
                  {c.vertente}
                </div>

                {/* Status badge */}
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  background: statusCor, color: C.bg,
                  padding: "3px 7px", fontSize: 9, fontWeight: 800,
                  fontFamily: "JetBrains Mono",
                }}>
                  {c.status === "top" ? "★ TOP" : c.status === "burn" ? "✕ BURN" : "● OK"}
                </div>

                {/* Thruplay para vídeos */}
                {c.thruplay && (
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: 3, background: C.panelDeep,
                  }}>
                    <div style={{
                      width: `${c.thruplay}%`, height: "100%",
                      background: c.thruplay > 50 ? C.pos : c.thruplay > 30 ? C.warn : C.neg,
                    }} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, lineHeight: 1.3, height: 28, overflow: "hidden" }}>
                  {c.nome}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, fontSize: 9 }}>
                  <div>
                    <div className="mono" style={{ color: C.textMute, letterSpacing: "0.05em" }}>INV</div>
                    <div className="mono" style={{ color: C.gold, fontWeight: 700, fontSize: 11 }}>{fmtBRLk(c.investido)}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ color: C.textMute, letterSpacing: "0.05em" }}>CTR</div>
                    <div className="mono" style={{ color: C.text, fontWeight: 700, fontSize: 11 }}>{c.ctr}%</div>
                  </div>
                  <div>
                    <div className="mono" style={{ color: C.textMute, letterSpacing: "0.05em" }}>{c.cpa ? "CPA" : "CPL"}</div>
                    <div className="mono" style={{ color: c.cpa > 8 || c.cpl > 8 ? C.neg : C.text, fontWeight: 700, fontSize: 11 }}>
                      {fmtBRLk(c.cpa || c.cpl)}
                    </div>
                  </div>
                </div>
                {c.thruplay && (
                  <div style={{ marginTop: 6, fontSize: 9, color: C.textMute }}>
                    <span className="mono">THRUPLAY {c.thruplay}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: HORÁRIOS DE OURO (HEATMAP)
   ═══════════════════════════════════════════════════════════════ */
const HorariosDeOuro = ({ data }) => {
  const dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const horas = Array.from({ length: 24 }, (_, i) => i);

  const max = Math.max(...data.map((d) => d.valor));
  const cellAt = (dia, hora) => data.find((d) => d.dia === dia && d.hora === hora);

  const colorScale = (v) => {
    const t = v / max;
    if (t < 0.15) return C.panelDeep;
    if (t < 0.3) return `${C.gold}15`;
    if (t < 0.5) return `${C.gold}35`;
    if (t < 0.7) return `${C.gold}65`;
    if (t < 0.9) return `${C.gold}AA`;
    return C.gold;
  };

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
            HEATMAP / 168H
          </div>
          <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Horários de ouro</h3>
          <p style={{ fontSize: 11, color: C.textMute, margin: 0, marginTop: 4 }}>
            Quando converte mais · dia da semana × hora · escala dourada = volume de compras
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 9 }}>
          <span className="mono" style={{ color: C.textMute }}>BAIXO</span>
          <div style={{ display: "flex", gap: 1 }}>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((t, i) => (
              <div key={i} style={{ width: 14, height: 14, background: colorScale(t * max) }} />
            ))}
          </div>
          <span className="mono" style={{ color: C.gold }}>ALTO</span>
        </div>
      </div>

      <div style={{ overflow: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "40px repeat(24, 1fr)", gap: 2, minWidth: 720 }}>
          {/* Header de horas */}
          <div />
          {horas.map((h) => (
            <div key={h} className="mono" style={{
              fontSize: 8, color: C.textMute, textAlign: "center",
              padding: "2px 0", letterSpacing: "0.05em",
            }}>
              {h.toString().padStart(2, "0")}
            </div>
          ))}

          {/* Linhas */}
          {dias.map((dia) => (
            <React.Fragment key={dia}>
              <div className="mono" style={{
                fontSize: 9, color: C.textDim, fontWeight: 700,
                display: "flex", alignItems: "center", letterSpacing: "0.1em",
              }}>
                {dia}
              </div>
              {horas.map((h) => {
                const cell = cellAt(dia, h);
                return (
                  <div key={h}
                    title={`${dia} ${h}h · ${cell?.valor || 0}`}
                    style={{
                      height: 22, background: colorScale(cell?.valor || 0),
                      border: `1px solid ${C.bg}`,
                      cursor: "pointer", transition: "transform 0.1s",
                    }}
                    onMouseEnter={(e) => { e.target.style.transform = "scale(1.15)"; e.target.style.zIndex = "10"; e.target.style.position = "relative"; }}
                    onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.zIndex = "0"; }}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 16, padding: 12,
        background: C.panelDeep, border: `1px solid ${C.border}`,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <Flame size={14} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>
          <span style={{ color: C.gold, fontWeight: 700 }}>Picos identificados</span>: domingo 8h-11h (sorteio Record/TV Brasília), sex/sáb 19h-23h. Concentre lances e criativos novos nestas janelas.
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: DEMOGRAFIA — IDADE
   ═══════════════════════════════════════════════════════════════ */
const Demografia = ({ data }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
          DEMO / IDADE
        </div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Idade × Cliques × Compras</h3>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.border} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="faixa" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
          <Tooltip cursor={{ fill: "rgba(232,181,71,0.05)" }} />
          <Bar yAxisId="left" dataKey="cliques" name="Cliques" fill={C.royal} />
          <Bar yAxisId="right" dataKey="compras" name="Compras" fill={C.gold} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{
        marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`,
        display: "grid", gridTemplateColumns: `repeat(${data.length}, 1fr)`, gap: 6,
      }}>
        {data.map((f) => {
          const taxa = (f.compras / f.cliques) * 100;
          return (
            <div key={f.faixa} style={{ borderLeft: `2px solid ${C.gold}`, paddingLeft: 8 }}>
              <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.1em" }}>{f.faixa}</div>
              <div className="mono display" style={{ fontSize: 14, marginTop: 2, color: C.gold }}>{taxa.toFixed(1)}%</div>
              <div style={{ fontSize: 9, color: C.textMute }}>conv.</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: DEMOGRAFIA — GÊNERO
   ═══════════════════════════════════════════════════════════════ */
const Genero = ({ data }) => {
  const cores = [C.gold, C.cs, C.textMute];
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
          DEMO / GÊNERO
        </div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Gênero</h3>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={64}
              paddingAngle={2} dataKey="valor" stroke="none">
              {data.map((_, i) => <Cell key={i} fill={cores[i]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map((d, i) => (
            <div key={d.nome}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 9, height: 9, background: cores[i], display: "inline-block" }} />
                  <span style={{ fontSize: 11 }}>{d.nome}</span>
                </div>
                <span className="mono display" style={{ fontSize: 14, color: cores[i] }}>{d.valor}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.textMute, paddingLeft: 16 }}>
                <span className="mono">{fmtNum(d.compras)} compras</span>
                <span className="mono">{fmtBRLk(d.investido)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: CIDADE DO GANHADOR (MAPA + RANKING)
   ═══════════════════════════════════════════════════════════════ */
const CidadesGanhadoras = ({ cidades }) => {
  const data = [...cidades].sort((a, b) => b.alcance - a.alcance);
  const max = Math.max(...data.map((d) => d.alcance));

  const cityToSvg = (lat, lng) => {
    const x = ((lng + 73.9) / (73.9 - 34.8)) * 220 + 10;
    const y = ((-lat + 5.3) / (5.3 + 33.7)) * 280 + 10;
    return { x, y };
  };

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
            GEO / GANHADORES
          </div>
          <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Cidade do ganhador · prova social pós-sorteio</h3>
        </div>
        <span className="chip" style={{ color: C.cg, background: `${C.cg}10` }}>
          <MapPin size={10} /> {cidades.length} CIDADES · 30D
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}>
        <div style={{
          background: C.panelDeep, border: `1px solid ${C.border}`,
          padding: 12, position: "relative", height: 320,
        }}>
          <svg viewBox="0 0 240 300" width="100%" height="100%">
            <path
              d="M 90 30 L 130 25 L 170 35 L 195 60 L 215 100 L 220 150 L 200 200 L 180 240 L 140 270 L 90 280 L 60 250 L 40 200 L 35 150 L 50 100 L 70 60 Z"
              fill="none" stroke={C.borderHi} strokeWidth="1" opacity="0.6"
            />
            {data.map((c, i) => {
              const { x, y } = cityToSvg(c.lat, c.lng);
              const r = 4 + (c.alcance / max) * 12;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={r} fill={C.gold} opacity={0.15} />
                  <circle cx={x} cy={y} r={r * 0.5} fill={C.gold} opacity={0.4} />
                  <circle cx={x} cy={y} r={3} fill={C.gold} />
                  <text x={x + r + 4} y={y + 3} fontSize="9" fill={C.text} fontFamily="JetBrains Mono" fontWeight="600">
                    {c.cidade}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="mono" style={{
            position: "absolute", top: 8, left: 12, fontSize: 8,
            color: C.textMute, letterSpacing: "0.15em",
          }}>
            BR · MAPA OPERACIONAL
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.map((c) => {
            const pct = (c.alcance / max) * 100;
            return (
              <div key={c.cidade} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{c.cidade}</span>
                    <span className="mono" style={{ fontSize: 10, color: C.textMute }}>/{c.uf}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>
                    {fmtNum(c.alcance)}
                  </span>
                </div>
                <div style={{ height: 4, background: C.panelDeep, position: "relative", marginBottom: 4 }}>
                  <div style={{
                    position: "absolute", inset: 0, width: `${pct}%`,
                    background: `linear-gradient(90deg, ${C.gold} 0%, ${C.goldHi} 100%)`,
                    boxShadow: `0 0 6px ${C.gold}50`,
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textMute }}>
                  <span className="mono">{fmtBRL(c.investido)}</span>
                  <span className="mono">{c.conversoes} conv.</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: CALENDÁRIO DE SORTEIOS — timeline completa
   ═══════════════════════════════════════════════════════════════ */
const CalendarioSorteios = ({ sorteios }) => {
  const hoje = hojeISO();
  const ordenados = [...sorteios].sort((a, b) => a.data.localeCompare(b.data));

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
          TIMELINE COMPLETA
        </div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Calendário de sorteios · ritmo da operação</h3>
        <p style={{ fontSize: 11, color: C.textMute, margin: 0, marginTop: 4 }}>
          {ordenados.length} sorteios · CP aos domingos · CS às terças
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${ordenados.length}, minmax(180px, 1fr))`,
          gap: 8, paddingBottom: 8,
        }}>
          {ordenados.map((s, i) => {
            const cor = VERTENTES[s.tipo]?.cor || C.text;
            const passado = s.data < hoje;
            const hojeBool = s.data === hoje;
            const futuro = s.data > hoje;

            return (
              <div key={i} style={{
                background: hojeBool ? `${cor}10` : passado ? C.panelHi : C.panelDeep,
                border: `1px solid ${hojeBool ? cor : C.border}`,
                padding: 12,
                borderTop: `3px solid ${cor}`,
                opacity: futuro ? 0.85 : 1,
                position: "relative",
              }}>
                {hojeBool && (
                  <div style={{
                    position: "absolute", top: -8, right: 8,
                    background: cor, color: C.bg,
                    padding: "2px 8px", fontSize: 8, fontWeight: 800,
                    fontFamily: "JetBrains Mono", letterSpacing: "0.1em",
                  }}>
                    HOJE
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className="chip" style={{ color: cor, fontSize: 8 }}>{s.tipo}</span>
                  <span className="mono" style={{ fontSize: 10, color: C.textDim }}>{fmtDataCurta(s.data)}</span>
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, lineHeight: 1.3, minHeight: 30, color: C.text }}>
                  {s.tema}
                </div>

                <div className="mono" style={{ fontSize: 14, color: C.gold, fontWeight: 700, marginBottom: 6 }}>
                  {fmtBRL(s.valorTotal)}
                </div>

                <div style={{ fontSize: 9, color: C.textMute, lineHeight: 1.4 }}>
                  {s.premios.length} prêmios
                </div>

                {futuro && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 0 0", fontSize: 9, color: C.warn,
                    borderTop: `1px dashed ${C.border}`, marginTop: 8,
                  }}>
                    <Clock size={9} /> <span className="mono" style={{ fontWeight: 700 }}>EM ABERTO</span>
                  </div>
                )}
                {passado && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 0 0", fontSize: 9, color: C.pos,
                    borderTop: `1px dashed ${C.border}`, marginTop: 8,
                  }}>
                    <CheckCircle2 size={9} /> <span className="mono" style={{ fontWeight: 700 }}>REALIZADO</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: PIXELS — REMOVIDO (técnico demais para o cliente final)
   ═══════════════════════════════════════════════════════════════ */
const _PixelsRemovido = ({ pixels, saude }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
          INFRA / COMPLIANCE
        </div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Pixels & compliance · health check técnico</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Pixels */}
        <div>
          <div className="mono" style={{ fontSize: 10, color: C.textDim, letterSpacing: "0.15em", marginBottom: 10 }}>
            ▸ PIXELS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pixels.map((p) => {
              const cor = p.status === "ok" ? C.pos : p.status === "warn" ? C.warn : C.neg;
              return (
                <div key={p.nome} style={{
                  background: C.panelHi, border: `1px solid ${C.border}`,
                  padding: 12, borderLeft: `3px solid ${cor}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span className="mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>{p.nome}</span>
                    {p.verificado ?
                      <CheckCircle2 size={14} color={C.pos} /> :
                      <AlertTriangle size={14} color={C.warn} />
                    }
                  </div>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 8 }} className="mono">{p.dominio}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 10 }}>
                    <div>
                      <span className="mono" style={{ color: C.textMute, fontSize: 9 }}>EVENTOS 7D</span>
                      <div className="mono" style={{ color: C.text, fontWeight: 700 }}>{fmtNumK(p.eventos7d)}</div>
                    </div>
                    <div>
                      <span className="mono" style={{ color: C.textMute, fontSize: 9 }}>QUALIDADE</span>
                      <div className="mono" style={{ color: cor, fontWeight: 700 }}>{p.qualidade}/10</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance checklist */}
        <div>
          <div className="mono" style={{ fontSize: 10, color: C.textDim, letterSpacing: "0.15em", marginBottom: 10 }}>
            ▸ COMPLIANCE
          </div>
          <div style={{ background: C.panelHi, border: `1px solid ${C.border}`, padding: 16, height: "calc(100% - 28px)" }}>
            {[
              { label: "Business Manager verificado", ok: saude.bmStatus === "OK" },
              { label: `Domínios verificados (${saude.dominiosVerificados}/${saude.pixelsTotal})`, ok: saude.dominiosVerificados === saude.pixelsTotal },
              { label: `Pixels ativos (${saude.pixelsVerificados}/${saude.pixelsTotal})`, ok: saude.pixelsVerificados === saude.pixelsTotal },
              { label: "Conversions API ativada", ok: true },
              { label: "Eventos priorizados configurados", ok: true },
              { label: `Ads rejeitados últimos 30d: ${saude.adsRejeitados30d}`, ok: saude.adsRejeitados30d < 5 },
              { label: "Categoria especial declarada", ok: false },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 0", borderBottom: i < 6 ? `1px dashed ${C.border}` : "none",
              }}>
                {item.ok ?
                  <CheckCircle2 size={14} color={C.pos} /> :
                  <AlertTriangle size={14} color={C.warn} />
                }
                <span style={{ fontSize: 11, color: item.ok ? C.text : C.warn, flex: 1 }}>{item.label}</span>
                <span className="mono" style={{
                  fontSize: 9, color: item.ok ? C.pos : C.warn,
                  fontWeight: 700, letterSpacing: "0.1em",
                }}>
                  {item.ok ? "OK" : "PENDENTE"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: TABELA DE CAMPANHAS
   ═══════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   BLOCO: GOOGLE TRENDS
   ═══════════════════════════════════════════════════════════════ */
const GoogleTrends = () => {
  const [periodo, setPeriodo] = useState("today 3-m");

  const periodos = [
    { id: "today 1-m",  label: "30 dias" },
    { id: "today 3-m",  label: "90 dias" },
    { id: "today 12-m", label: "12 meses" },
  ];

  const buildUrl = (items, geo) => {
    const req = encodeURIComponent(JSON.stringify({
      comparisonItem: items.map((keyword) => ({ keyword, geo, time: periodo })),
      category: 0,
      property: "",
    }));
    return `https://trends.google.com/trends/embed/explore/TIMESERIES?req=${req}&tz=180`;
  };

  const brandUrl  = buildUrl(["capital de prêmios", "capital sena"], "BR-DF");
  const marketUrl = buildUrl(["rifa premiada", "sorteio de carro", "bilhete premiado"], "BR");

  return (
    <div className="panel" style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
            GOOGLE TRENDS / REGIONAL
          </div>
          <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Tendências de busca</h3>
          <p style={{ fontSize: 11, color: C.textMute, margin: 0, marginTop: 4 }}>
            Marca · Brasília + DF &nbsp;×&nbsp; Mercado · Brasil
          </p>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {periodos.map((p) => (
            <button
              key={p.id}
              className="filter-btn"
              onClick={() => setPeriodo(p.id)}
              style={periodo === p.id ? { background: C.gold, color: C.bg, borderColor: C.gold } : {}}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Iframes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Marca */}
        <div>
          <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 3, height: 14, background: C.gold }} />
            <span className="mono" style={{ fontSize: 10, color: C.textDim, letterSpacing: "0.15em" }}>
              MARCA · BSB + DF
            </span>
            <span style={{ fontSize: 10, color: C.textMute }}>capital de prêmios · capital sena</span>
          </div>
          <div style={{ position: "relative", background: C.panelDeep, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <iframe
              key={`brand-${periodo}`}
              src={brandUrl}
              width="100%"
              height="340"
              frameBorder="0"
              scrolling="no"
              style={{ display: "block", colorScheme: "normal" }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: 10, color: C.textMute }}>
            <a
              href={`https://trends.google.com/trends/explore?q=capital+de+pr%C3%AAmios,capital+sena&geo=BR-DF&date=${periodo}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.gold, textDecoration: "none", fontFamily: "JetBrains Mono" }}
            >
              ↗ abrir no Google Trends
            </a>
          </div>
        </div>

        {/* Mercado */}
        <div>
          <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 3, height: 14, background: C.royal }} />
            <span className="mono" style={{ fontSize: 10, color: C.textDim, letterSpacing: "0.15em" }}>
              MERCADO · BRASIL
            </span>
            <span style={{ fontSize: 10, color: C.textMute }}>rifa premiada · sorteio de carro · bilhete premiado</span>
          </div>
          <div style={{ position: "relative", background: C.panelDeep, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <iframe
              key={`market-${periodo}`}
              src={marketUrl}
              width="100%"
              height="340"
              frameBorder="0"
              scrolling="no"
              style={{ display: "block", colorScheme: "normal" }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: 10, color: C.textMute }}>
            <a
              href={`https://trends.google.com/trends/explore?q=rifa+premiada,sorteio+de+carro,bilhete+premiado&geo=BR&date=${periodo}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.royal, textDecoration: "none", fontFamily: "JetBrains Mono" }}
            >
              ↗ abrir no Google Trends
            </a>
          </div>
        </div>
      </div>

      {/* Nota */}
      <div style={{
        marginTop: 16, padding: "10px 14px",
        background: `${C.gold}08`, border: `1px solid ${C.gold}22`,
        fontSize: 10, color: C.textMute, lineHeight: 1.6,
      }}>
        <span className="mono" style={{ color: C.gold }}>NOTA</span>
        {" "}· Dados do Google Trends são relativos (0–100 = pico do período).
        Use como termômetro de demanda orgânica e sazonalidade, não como volume absoluto.
      </div>
    </div>
  );
};

const TabelaCampanhas = ({ campanhas }) => {
  const labelMetrica = (vertente) => {
    if (vertente === "CP" || vertente === "CS") return ["Compras", "CPA"];
    if (vertente === "REV") return ["Conversas", "C/Conv"];
    return ["—", "—"];
  };

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>
            CAMPAIGNS / DETAIL
          </div>
          <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Campanhas · linha-a-linha</h3>
          <p style={{ fontSize: 11, color: C.textMute, margin: 0, marginTop: 4 }}>
            Conversões mostradas conforme objetivo: compras (CP/CS), conversas (REV), alcance (CG/AW)
          </p>
        </div>
        <span className="chip" style={{ color: C.textDim }}>{campanhas.length} ATIVAS</span>
      </div>

      <div style={{ overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.gold}` }}>
              {["Campanha", "Vert.", "Investido", "Impr.", "Cliques", "CTR", "Métrica", "Volume", "Custo Unit."].map((h, i) => (
                <th key={i} className="mono" style={{
                  textAlign: i > 1 ? "right" : "left", padding: "10px 8px",
                  fontSize: 9, color: C.gold, fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campanhas.map((c) => {
              const cor = VERTENTES[c.vertente]?.cor || C.text;
              const [labelVol, labelCusto] = labelMetrica(c.vertente);

              let volume = "—";
              let custoUnit = "—";

              if (c.vertente === "CP" || c.vertente === "CS") {
                volume = c.compras ? fmtNum(c.compras) : "—";
                custoUnit = c.compras ? fmtBRL(c.investido / c.compras) : "—";
              } else if (c.vertente === "REV") {
                volume = c.conversas ? fmtNum(c.conversas) : "—";
                custoUnit = c.conversas ? fmtBRL(c.investido / c.conversas) : "—";
              }

              return (
                <tr key={c.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "11px 8px", fontWeight: 500, maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.nome}</td>
                  <td style={{ padding: "11px 8px" }}>
                    <span className="chip" style={{ color: cor, borderColor: cor + "40", background: cor + "12" }}>
                      {c.vertente}
                    </span>
                  </td>
                  <td className="mono" style={{ padding: "11px 8px", textAlign: "right", fontWeight: 700, color: C.gold }}>{fmtBRL(c.investido)}</td>
                  <td className="mono" style={{ padding: "11px 8px", textAlign: "right", color: C.textDim }}>{fmtNum(c.impressoes)}</td>
                  <td className="mono" style={{ padding: "11px 8px", textAlign: "right", color: C.textDim }}>{fmtNum(c.cliques)}</td>
                  <td className="mono" style={{ padding: "11px 8px", textAlign: "right", color: C.text }}>{fmtPct(c.ctr)}</td>
                  <td className="mono" style={{ padding: "11px 8px", textAlign: "right", color: C.textMute, fontSize: 10 }}>{labelVol}</td>
                  <td className="mono" style={{ padding: "11px 8px", textAlign: "right", color: C.text, fontWeight: 700 }}>{volume}</td>
                  <td className="mono" style={{ padding: "11px 8px", textAlign: "right", color: C.cs, fontWeight: 600 }}>{custoUnit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MODAL DE CONFIG — APPS SCRIPT ENDPOINT
   ═══════════════════════════════════════════════════════════════ */
const ConfigModal = ({ aberto, onClose, config, setConfig, onConectar }) => {
  if (!aberto) return null;
  const [local, setLocal] = useState(config);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(6px)",
    }} onClick={onClose}>
      <div className="panel-gold-edge" style={{
        background: C.panel, padding: 32, width: 540, position: "relative",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ marginBottom: 20 }}>
          <div className="mono" style={{ fontSize: 9, color: C.gold, letterSpacing: "0.2em", marginBottom: 4 }}>
            ▸ FONTE DE DADOS
          </div>
          <h2 className="display" style={{ fontSize: 20, margin: 0 }}>Endpoint Apps Script</h2>
          <p style={{ fontSize: 11, color: C.textMute, marginTop: 6, lineHeight: 1.5 }}>
            Cole a URL do seu Google Apps Script (Aplicativo da Web).
            O dashboard puxará os dados em JSON com cache de 10 minutos.
          </p>
        </div>

        <div>
          <label className="mono" style={{ fontSize: 10, color: C.textDim, letterSpacing: "0.15em", marginBottom: 6, display: "block" }}>
            URL do Apps Script
          </label>
          <input
            type="text"
            placeholder="https://script.google.com/macros/s/.../exec"
            value={local.endpointUrl || ""}
            onChange={(e) => setLocal({ ...local, endpointUrl: e.target.value })}
            style={{
              width: "100%", padding: 12, background: C.panelDeep,
              border: `1px solid ${C.border}`, color: C.text,
              fontFamily: "JetBrains Mono", fontSize: 11,
              outline: "none", transition: "border 0.15s",
            }}
            onFocus={(e) => e.target.style.borderColor = C.gold}
            onBlur={(e) => e.target.style.borderColor = C.border}
          />
        </div>

        <div style={{
          marginTop: 16, padding: 12, fontSize: 10, color: C.textMute,
          background: C.panelDeep, border: `1px solid ${C.border}`, lineHeight: 1.6,
        }}>
          <strong style={{ color: C.gold }}>Como obter:</strong><br/>
          1. Abre sua planilha → <span className="mono">Extensões → Apps Script</span><br/>
          2. Cola o script padrão e clica em <span className="mono">Implantar → Aplicativo da Web</span><br/>
          3. Define <span className="mono">"Quem pode acessar: Qualquer pessoa"</span><br/>
          4. Copia a URL que termina em <span className="mono">/exec</span> e cola acima
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => {
            setConfig(local);
            onClose();
            onConectar(local);
          }}>
            Conectar e Carregar
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   UTILS DE DATA
   ═══════════════════════════════════════════════════════════════ */
const toISO = (d) => {
  if (typeof d === "string") return d.substring(0, 10);
  return d.toISOString().substring(0, 10);
};
const fmtData = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.substring(0, 10).split("-");
  return `${d}/${m}/${y}`;
};
const fmtDataCurta = (iso) => {
  if (!iso) return "—";
  const [, m, d] = iso.substring(0, 10).split("-");
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d}/${meses[parseInt(m, 10) - 1]}`;
};
const diasAtras = (dias) => {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return toISO(d);
};
const hojeISO = () => toISO(new Date());

/* ═══════════════════════════════════════════════════════════════
   SELETOR DE DATAS — presets + range customizado
   ═══════════════════════════════════════════════════════════════ */
const SeletorDatas = ({ rangeAtivo, setRangeAtivo, customRange, setCustomRange }) => {
  const [customAberto, setCustomAberto] = useState(false);

  const presets = [
    { id: "7d", label: "7d" },
    { id: "14d", label: "14d" },
    { id: "30d", label: "30d" },
    { id: "60d", label: "60d" },
    { id: "90d", label: "90d" },
    { id: "all", label: "Todo período" },
  ];

  return (
    <div style={{ display: "flex", gap: 0, alignItems: "center", position: "relative" }}>
      {presets.map((p) => (
        <button
          key={p.id}
          className={`filter-btn ${rangeAtivo === p.id ? "active" : ""}`}
          onClick={() => { setRangeAtivo(p.id); setCustomAberto(false); }}
          style={rangeAtivo === p.id ? {
            background: C.gold, color: C.bg, borderColor: C.gold,
          } : {}}
        >
          {p.label}
        </button>
      ))}
      <button
        className={`filter-btn ${rangeAtivo === "custom" ? "active" : ""}`}
        onClick={() => setCustomAberto(!customAberto)}
        style={rangeAtivo === "custom" ? {
          background: C.gold, color: C.bg, borderColor: C.gold,
        } : {}}
      >
        <Calendar size={11} /> Customizado
      </button>

      {customAberto && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
          background: C.panel, border: `1px solid ${C.gold}`,
          padding: 16, minWidth: 280,
          boxShadow: `0 8px 24px rgba(0,0,0,0.5)`,
        }}>
          <div className="mono" style={{ fontSize: 9, color: C.gold, letterSpacing: "0.2em", marginBottom: 12 }}>
            ▸ INTERVALO CUSTOMIZADO
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.15em", display: "block", marginBottom: 4 }}>
                DE
              </label>
              <input type="date" value={customRange.from || ""}
                onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                style={{
                  width: "100%", padding: 8, background: C.panelDeep,
                  border: `1px solid ${C.border}`, color: C.text,
                  fontFamily: "JetBrains Mono", fontSize: 11, outline: "none",
                  colorScheme: "dark",
                }} />
            </div>
            <div>
              <label className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.15em", display: "block", marginBottom: 4 }}>
                ATÉ
              </label>
              <input type="date" value={customRange.to || ""}
                onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                style={{
                  width: "100%", padding: 8, background: C.panelDeep,
                  border: `1px solid ${C.border}`, color: C.text,
                  fontFamily: "JetBrains Mono", fontSize: 11, outline: "none",
                  colorScheme: "dark",
                }} />
            </div>
            <button className="btn btn-primary" onClick={() => {
              if (customRange.from && customRange.to) {
                setRangeAtivo("custom");
                setCustomAberto(false);
              }
            }}>
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VISÃO SEMANAL — navegável por sorteio
   ═══════════════════════════════════════════════════════════════ */
const VisaoSemanal = ({ sorteios, campanhas, evolucaoDiaria }) => {
  const hoje = hojeISO();

  // Sorteios ordenados por data, com flag de "passado/atual/futuro"
  const sorteiosOrdenados = useMemo(() => {
    return [...sorteios]
      .sort((a, b) => a.data.localeCompare(b.data))
      .map((s) => ({
        ...s,
        situacao: s.data < hoje ? "passado" : s.data === hoje ? "atual" : "futuro",
      }));
  }, [sorteios, hoje]);

  // Encontra índice do sorteio mais próximo de hoje
  const idxAtual = useMemo(() => {
    const idxFuturo = sorteiosOrdenados.findIndex((s) => s.data >= hoje);
    return idxFuturo === -1 ? sorteiosOrdenados.length - 1 : idxFuturo;
  }, [sorteiosOrdenados, hoje]);

  const [idx, setIdx] = useState(idxAtual);
  const sorteio = sorteiosOrdenados[idx];
  if (!sorteio) return null;

  const cor = VERTENTES[sorteio.tipo]?.cor || C.gold;
  const corTexto = sorteio.situacao === "futuro" ? C.warn : C.pos;

  // Filtra campanhas que rodaram na semana do sorteio (assumindo que campanhas têm flag de período)
  // Como mock não tem date por campanha agregado, usamos proxy: somar evolução diária dentro da semana
  const metricasSemana = useMemo(() => {
    const dentro = (evolucaoDiaria || []).filter((d) => {
      // tenta parsear formato "DD/MM" ou usar como ISO
      return true; // simplificado — em produção filtraria por sorteio.semanaInicio/Fim
    });
    const investido = dentro.reduce((s, d) => s + (d.investido || 0), 0);
    const compras = dentro.reduce((s, d) => s + (d.compras || 0), 0);
    return { investido, compras };
  }, [evolucaoDiaria, sorteio]);

  return (
    <div className="panel-gold-edge" style={{ padding: 0, overflow: "hidden" }}>
      {/* HEADER NAVEGAÇÃO */}
      <div style={{
        background: `linear-gradient(90deg, ${cor}15 0%, ${C.panelDeep} 100%)`,
        padding: "16px 24px", borderBottom: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <button className="btn"
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          style={{ opacity: idx === 0 ? 0.3 : 1 }}>
          ◀ Anterior
        </button>

        <div style={{ textAlign: "center", flex: 1 }}>
          <div className="mono" style={{ fontSize: 9, color: cor, letterSpacing: "0.2em", marginBottom: 4 }}>
            ▸ {sorteio.tipo === "CP" ? "CAPITAL DE PRÊMIOS" : "CAPITAL CENA"} · {sorteio.situacao === "passado" ? "REALIZADO" : sorteio.situacao === "atual" ? "HOJE" : "PRÓXIMO"}
          </div>
          <div className="display" style={{ fontSize: 22, color: C.text }}>
            {sorteio.tema}
          </div>
          <div className="mono" style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>
            Sorteio em <span style={{ color: corTexto, fontWeight: 700 }}>{fmtData(sorteio.data)}</span>
            <span style={{ color: C.textMute, margin: "0 8px" }}>·</span>
            Semana {fmtDataCurta(sorteio.semanaInicio)} → {fmtDataCurta(sorteio.semanaFim)}
          </div>
        </div>

        <button className="btn"
          onClick={() => setIdx(Math.min(sorteiosOrdenados.length - 1, idx + 1))}
          disabled={idx === sorteiosOrdenados.length - 1}
          style={{ opacity: idx === sorteiosOrdenados.length - 1 ? 0.3 : 1 }}>
          Próximo ▶
        </button>
      </div>

      {/* CONTEÚDO: prêmios + métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 0 }}>
        {/* PRÊMIOS */}
        <div style={{ padding: 24, borderRight: `1px solid ${C.border}` }}>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 12 }}>
            ▸ PREMIAÇÃO · TOTAL {fmtBRL(sorteio.valorTotal)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sorteio.premios.map((p, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "60px 1fr auto",
                gap: 12, alignItems: "center",
                padding: "10px 12px",
                background: C.panelHi, border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${cor}`,
              }}>
                <span className="mono" style={{ fontSize: 11, color: cor, fontWeight: 700, letterSpacing: "0.05em" }}>
                  {p.ord}
                </span>
                <span style={{ fontSize: 12, color: C.text }}>{p.item}</span>
                <span className="mono" style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>
                  {fmtBRL(p.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MÉTRICAS DA SEMANA */}
        <div style={{ padding: 24 }}>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 12 }}>
            ▸ PERFORMANCE DA SEMANA
          </div>

          {sorteio.situacao === "futuro" ? (
            <div style={{
              padding: "32px 16px", textAlign: "center",
              border: `1px dashed ${C.warn}`, background: `${C.warn}08`,
            }}>
              <Clock size={28} color={C.warn} style={{ marginBottom: 8 }} />
              <div className="display" style={{ fontSize: 14, color: C.warn, marginBottom: 4 }}>
                Sorteio futuro
              </div>
              <div style={{ fontSize: 11, color: C.textMute, lineHeight: 1.5 }}>
                Os dados de performance aparecem aqui conforme as campanhas rodam ao longo da semana.
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Investido", v: fmtBRL(metricasSemana.investido), cor: C.gold, Icon: DollarSign },
                { label: "Compras", v: fmtNum(metricasSemana.compras), cor: C.cs, Icon: ShoppingCart },
                { label: "CPA Médio", v: metricasSemana.compras ? fmtBRL(metricasSemana.investido / metricasSemana.compras) : "—", cor: C.royal, Icon: Target },
                { label: "ROI Bruto", v: metricasSemana.investido ? `${(sorteio.valorTotal / metricasSemana.investido).toFixed(1)}x` : "—", cor: C.pos, Icon: TrendingUp },
              ].map((m, i) => (
                <div key={i} style={{
                  background: C.panelHi, border: `1px solid ${C.border}`,
                  borderTop: `2px solid ${m.cor}`, padding: 14,
                }}>
                  <m.Icon size={14} color={m.cor} style={{ marginBottom: 6 }} />
                  <div className="mono display" style={{ fontSize: 18, color: C.text, lineHeight: 1 }}>{m.v}</div>
                  <div className="mono" style={{ fontSize: 9, color: C.textDim, marginTop: 4, letterSpacing: "0.1em" }}>
                    {m.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Top criativos da semana — placeholder pra quando integrar */}
          <div style={{ marginTop: 16, padding: 12, background: C.panelDeep, border: `1px dashed ${C.border}`, fontSize: 10, color: C.textMute, lineHeight: 1.5 }}>
            <span style={{ color: C.gold }}>Em breve:</span> top criativos desta semana aparecem aqui quando a galeria de criativos estiver integrada.
          </div>
        </div>
      </div>

      {/* FAIXA DE NAVEGAÇÃO RÁPIDA */}
      <div style={{
        borderTop: `1px solid ${C.border}`, padding: "10px 16px",
        background: C.panelDeep, display: "flex", gap: 4, overflowX: "auto",
      }}>
        {sorteiosOrdenados.map((s, i) => {
          const c = VERTENTES[s.tipo]?.cor || C.gold;
          const ativo = i === idx;
          return (
            <button key={i} onClick={() => setIdx(i)}
              style={{
                padding: "6px 10px", fontSize: 9, cursor: "pointer",
                background: ativo ? c : "transparent",
                color: ativo ? C.bg : (s.situacao === "futuro" ? C.textMute : C.textDim),
                border: `1px solid ${ativo ? c : C.border}`,
                fontFamily: "JetBrains Mono", fontWeight: 700,
                letterSpacing: "0.05em", whiteSpace: "nowrap",
                opacity: s.situacao === "futuro" && !ativo ? 0.5 : 1,
              }}>
              {fmtDataCurta(s.data)} · {s.tipo}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BANNER DE CAMPANHAS NÃO CLASSIFICADAS
   ═══════════════════════════════════════════════════════════════ */
const BannerNaoClassificadas = ({ campanhas }) => {
  if (!campanhas || campanhas.length === 0) return null;

  return (
    <div style={{
      background: `linear-gradient(90deg, ${C.warn}15 0%, ${C.panelDeep} 100%)`,
      border: `1px solid ${C.warn}`,
      borderLeft: `4px solid ${C.warn}`,
      padding: 18,
      marginBottom: 24,
    }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <AlertTriangle size={22} color={C.warn} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 9, color: C.warn, letterSpacing: "0.2em", fontWeight: 700, marginBottom: 4 }}>
            ▸ ATENÇÃO · CAMPANHAS NÃO CLASSIFICADAS
          </div>
          <h3 className="display" style={{ fontSize: 15, margin: 0, marginBottom: 8 }}>
            {campanhas.length} {campanhas.length === 1 ? "campanha não foi reconhecida" : "campanhas não foram reconhecidas"} pelo classificador automático
          </h3>
          <p style={{ fontSize: 12, color: C.textDim, margin: 0, marginBottom: 10, lineHeight: 1.5 }}>
            O nome dessas campanhas não corresponde aos padrões conhecidos (sena, capital, revendedor, vídeo, alcance).
            Elas estão sendo exibidas separadamente. Me passe a lista abaixo pra eu te ajudar a classificá-las.
          </p>
          <div style={{
            background: C.panelDeep, border: `1px solid ${C.border}`,
            padding: 10, fontFamily: "JetBrains Mono", fontSize: 11,
            maxHeight: 140, overflow: "auto",
          }}>
            {campanhas.map((c, i) => (
              <div key={i} style={{ padding: "4px 0", color: C.text, borderBottom: i < campanhas.length - 1 ? `1px dashed ${C.border}` : "none" }}>
                <span style={{ color: C.warn }}>▸</span> {c.nome}
                <span style={{ color: C.textMute, marginLeft: 8 }}>
                  · {fmtBRL(c.investido)} · {fmtNum(c.impressoes)} impressões
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   APP PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [vertenteFiltro, setVertenteFiltro] = useState("TODOS");
  const [fileName, setFileName] = useState(null);
  const [data, setData] = useState(MOCK_DATA);
  const [config, setConfig] = useState({
    endpointUrl: "https://script.google.com/macros/s/AKfycbz-y7hebXLxw4O5HluXT9XAJG92FndqqhhsIhrfnPQywaTj9LVHBFkFmIstmv7mj23wqQ/exec",
  });
  const [configOpen, setConfigOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState("mock"); // 'live' | 'mock' | 'offline' | 'loading'
  const [agencyLogo, setAgencyLogo] = useState(null);
  const [naoClassificadas, setNaoClassificadas] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rangeAtivo, setRangeAtivo] = useState("30d");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  // Calcula datas from/to baseado no preset ativo
  const periodoEfetivo = useMemo(() => {
    const to = hojeISO();
    if (rangeAtivo === "all") return { from: "1970-01-01", to };
    if (rangeAtivo === "custom") {
      return {
        from: customRange.from || diasAtras(30),
        to: customRange.to || to,
      };
    }
    const map = { "7d": 7, "14d": 14, "30d": 30, "60d": 60, "90d": 90 };
    return { from: diasAtras(map[rangeAtivo] || 30), to };
  }, [rangeAtivo, customRange]);

  const handleAgencyLogoUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setAgencyLogo(e.target.result);
    reader.readAsDataURL(file);
  };

  const [linhasBrutas, setLinhasBrutas] = useState([]);

  const conectarSheets = async (cfg) => {
    if (!cfg?.endpointUrl) {
      setConfigOpen(true);
      return;
    }
    try {
      setApiStatus("loading");
      setErrorMsg(null);
      const linhas = await sheetsClient.fetchJSON(cfg.endpointUrl);

      if (!linhas || linhas.length === 0) {
        throw new Error("Endpoint retornou vazio");
      }

      const parseadas = linhas.map(parsearLinha);
      setLinhasBrutas(parseadas);
      setApiStatus("live");
    } catch (e) {
      console.error("Erro ao conectar:", e);
      setErrorMsg(e.message);
      setApiStatus("offline");
    }
  };

  // Reagrega campanhas sempre que mudar período ou linhas brutas
  useEffect(() => {
    if (linhasBrutas.length === 0) return;

    // Filtra por período
    const filtradas = linhasBrutas.filter((l) => {
      if (!l.date) return true;
      const iso = String(l.date).substring(0, 10);
      return iso >= periodoEfetivo.from && iso <= periodoEfetivo.to;
    });

    const campanhas = agregarPorCampanha(filtradas);
    const nc = campanhas.filter((c) => c.vertente === "NAO_CLASSIFICADA");
    setNaoClassificadas(nc);

    const classificadas = campanhas.filter((c) => c.vertente !== "NAO_CLASSIFICADA");

    setData((prev) => ({
      ...prev,
      campanhas: classificadas.map((c) => ({
        id: c.id,
        nome: c.nome,
        vertente: c.vertente,
        objetivo: c.objetivo || "—",
        investido: c.investido,
        impressoes: c.impressoes,
        cliques: c.cliques,
        compras: c.compras || undefined,
        conversas: c.conversas || undefined,
        leads: c.conversas || undefined,
        ctr: c.ctr,
        cpa: c.custoPorCompra,
        cpl: c.custoPorConversa,
      })),
      ultimaAtualizacao: new Date().toLocaleString("pt-BR"),
    }));
  }, [linhasBrutas, periodoEfetivo]);

  // Conecta automaticamente ao montar
  useEffect(() => {
    if (config.endpointUrl) {
      conectarSheets(config);
    }
  }, []); // eslint-disable-line

  const campanhasFiltradas = useMemo(() => {
    if (vertenteFiltro === "TODOS") return data.campanhas;
    return data.campanhas.filter((c) => c.vertente === vertenteFiltro);
  }, [vertenteFiltro, data]);

  const criativosFiltrados = useMemo(() => {
    if (vertenteFiltro === "TODOS") return data.criativos;
    return data.criativos.filter((c) => c.vertente === vertenteFiltro);
  }, [vertenteFiltro, data]);

  const kpis = useMemo(() => {
    const arr = campanhasFiltradas;
    const investido = arr.reduce((s, c) => s + (c.investido || 0), 0);
    const cliques = arr.reduce((s, c) => s + (c.cliques || 0), 0);
    const impressoes = arr.reduce((s, c) => s + (c.impressoes || 0), 0);
    const compras = arr.reduce((s, c) => s + (c.compras || 0), 0);
    const conversas = arr.reduce((s, c) => s + (c.conversas || 0), 0);
    return {
      investido, cliques, impressoes, compras, conversas,
      cpa: compras ? investido / compras : 0,
      cpc: conversas ? investido / conversas : 0,
      ctr: impressoes ? (cliques / impressoes) * 100 : 0,
    };
  }, [campanhasFiltradas]);

  const handleRefresh = async () => {
    if (!config.endpointUrl) {
      setConfigOpen(true);
      return;
    }
    Object.keys(_cache).forEach((k) => delete _cache[k]);
    await conectarSheets(config);
  };

  const handleUpload = (file) => {
    if (file) {
      setFileName(file.name);
      // Backup CSV manual ainda funcionaria aqui
    }
  };

  return (
    <div className="dash-root">
      <StyleInjector />
      <div className="dash-content scan">
        <Header
          apiStatus={apiStatus}
          onRefresh={handleRefresh}
          onUpload={handleUpload}
          fileName={fileName}
          onConfig={() => setConfigOpen(true)}
          agencyLogo={agencyLogo}
          onAgencyLogoUpload={handleAgencyLogoUpload}
        />

        <ConfigModal
          aberto={configOpen}
          onClose={() => setConfigOpen(false)}
          config={config}
          setConfig={setConfig}
          onConectar={conectarSheets}
        />

        <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 36 }}>

          {/* BANNER DE ERRO */}
          {errorMsg && (
            <div style={{
              background: `${C.neg}15`,
              border: `1px solid ${C.neg}`,
              padding: 14,
              display: "flex", gap: 12, alignItems: "center",
              marginBottom: -16,
            }}>
              <AlertTriangle size={18} color={C.neg} />
              <div style={{ flex: 1, fontSize: 12, color: C.text }}>
                <strong style={{ color: C.neg }}>Erro ao conectar:</strong> {errorMsg}
                <span style={{ color: C.textMute, marginLeft: 8 }}>
                  · Exibindo dados de demonstração. Verifique se a planilha está pública e tente "SYNC".
                </span>
              </div>
              <button className="btn" onClick={() => setErrorMsg(null)}>OK</button>
            </div>
          )}

          {/* BANNER DE NÃO CLASSIFICADAS */}
          <BannerNaoClassificadas campanhas={naoClassificadas} />

          {/* HERO */}
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: C.gold, letterSpacing: "0.25em", marginBottom: 10 }}>
                  ▸ FILTRO ATIVO ▸ <span style={{ color: C.text }}>{vertenteFiltro}</span>
                  <span style={{ color: C.textMute, margin: "0 8px" }}>·</span>
                  <span style={{ color: C.text }}>{rangeAtivo === "custom" ? `${fmtData(periodoEfetivo.from)} → ${fmtData(periodoEfetivo.to)}` : rangeAtivo.toUpperCase()}</span>
                </div>
                <h1 className="display" style={{ fontSize: 32, margin: 0, lineHeight: 1.1 }}>
                  Visão geral de <span style={{ color: C.gold }}>performance</span>
                </h1>
                <p style={{ fontSize: 13, color: C.textMute, margin: 0, marginTop: 8 }}>
                  Capital de Prêmios + Capital Cena · Realizando Sonhos há 9 anos
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn"><Download size={12}/> EXPORTAR</button>
              </div>
            </div>

            {/* Seletor de período */}
            <div style={{ marginBottom: 16 }}>
              <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 8 }}>
                ▸ PERÍODO
              </div>
              <SeletorDatas
                rangeAtivo={rangeAtivo}
                setRangeAtivo={setRangeAtivo}
                customRange={customRange}
                setCustomRange={setCustomRange}
              />
            </div>

            {/* Filtro vertente */}
            <div>
              <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 8 }}>
                ▸ VERTENTE
              </div>
              <VerticalFilter ativo={vertenteFiltro} setAtivo={setVertenteFiltro} />
            </div>
          </div>

          {/* KPIs ADAPTATIVOS — 5 cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            <KPI label="Investido" valor={fmtBRL(kpis.investido)} sub={`${campanhasFiltradas.length} campanhas`} delta={12.4} icon={DollarSign} accent={C.gold} />
            <KPI label="Compras" valor={fmtNum(kpis.compras)} sub={kpis.compras ? `CPA ${fmtBRL(kpis.cpa)}` : "—"} delta={8.7} icon={ShoppingCart} accent={C.cs} />
            <KPI label="Conversas Geradas" valor={fmtNum(kpis.conversas)} sub={kpis.conversas ? `Custo/Conv ${fmtBRL(kpis.cpc)}` : "—"} delta={14.2} icon={UserPlus} accent={C.rev} />
            <KPI label="Cliques" valor={fmtNum(kpis.cliques)} sub={`CTR ${kpis.ctr.toFixed(2)}%`} delta={-2.1} icon={Target} accent={C.royal} />
            <KPI label="Alcance" valor={fmtNum(kpis.impressoes)} sub="impressões totais" delta={18.2} icon={Activity} accent={C.cg} />
          </div>

          {/* SEÇÃO 1: SAÚDE DA OPERAÇÃO */}
          <div>
            <SectionTitle codigo="01 ▸ SAÚDE" titulo="Status global da operação" sub="contas, frequency, ads reprovados" />
            <SaudeOperacao data={data} />
          </div>

          {/* SEÇÃO 2: VISÃO SEMANAL POR SORTEIO */}
          <div>
            <SectionTitle codigo="02 ▸ SORTEIO DA SEMANA" titulo="Performance por sorteio" sub="navegue pelos sorteios passados, atuais e futuros" />
            <VisaoSemanal
              sorteios={data.sorteios}
              campanhas={data.campanhas}
              evolucaoDiaria={data.evolucaoDiaria}
            />
          </div>

          {/* SEÇÃO 3: AQUECIMENTO */}
          <div>
            <SectionTitle codigo="03 ▸ AQUECIMENTO" titulo="Maturidade das contas de anúncio" />
            <AquecimentoContas contas={data.contasAnuncio} />
          </div>

          {/* SEÇÃO 4: ALOCAÇÃO */}
          <div>
            <SectionTitle codigo="04 ▸ ALOCAÇÃO" titulo="Onde o dinheiro está" sub="distribuição por vertente e objetivo" />
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
              <InvestimentoPorObjetivo campanhas={campanhasFiltradas} />
              <CompararVertentes campanhas={data.campanhas} />
            </div>
          </div>

          {/* SEÇÃO 5: TEMPORAL + FUNIL */}
          <div>
            <SectionTitle codigo="05 ▸ TRAJETÓRIA" titulo="Evolução temporal e conversão" />
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
              <EvolucaoTemporal data={data.evolucaoDiaria} />
              <FunilConversao data={data.funil} />
            </div>
          </div>

          {/* SEÇÃO 6: CRIATIVOS */}
          <div>
            <SectionTitle codigo="06 ▸ CRIATIVOS" titulo="Galeria visual" sub="hover para preview · clique para detalhe" />
            <GridCriativos criativos={criativosFiltrados} />
          </div>

          {/* SEÇÃO 7: HORÁRIOS */}
          <div>
            <SectionTitle codigo="07 ▸ TIMING" titulo="Horários de ouro" />
            <HorariosDeOuro data={data.heatmap} />
          </div>

          {/* SEÇÃO 8: PÚBLICO */}
          <div>
            <SectionTitle codigo="08 ▸ PÚBLICO" titulo="Quem está clicando e comprando" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 14 }}>
              <Genero data={data.porGenero} />
              <Demografia data={data.porIdade} />
            </div>
          </div>

          {/* SEÇÃO 9: CIDADE GANHADOR */}
          <div>
            <SectionTitle codigo="09 ▸ GEO" titulo="Cidade do ganhador · pós-sorteio" />
            <CidadesGanhadoras cidades={data.cidadesGanhadores} />
          </div>

          {/* SEÇÃO 10: CALENDÁRIO COMPLETO */}
          <div>
            <SectionTitle codigo="10 ▸ CALENDÁRIO" titulo="Todos os sorteios · timeline completa" />
            <CalendarioSorteios sorteios={data.sorteios} />
          </div>

          {/* SEÇÃO 11: TABELA */}
          <div>
            <SectionTitle codigo="11 ▸ DETALHE" titulo="Campanhas linha-a-linha" />
            <TabelaCampanhas campanhas={campanhasFiltradas} />
          </div>

          {/* SEÇÃO 12: GOOGLE TRENDS */}
          <div>
            <SectionTitle codigo="12 ▸ TENDÊNCIAS" titulo="Google Trends regional" sub="interesse de busca · marca vs. mercado" />
            <GoogleTrends />
          </div>

          {/* FOOTER */}
          <div style={{
            paddingTop: 24, marginTop: 20,
            borderTop: `1px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 11, color: C.textMute,
          }}>
            <span className="mono">CAPITAL · MEDIA OPS v2.1 · {data.periodo}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {agencyLogo && (
                <>
                  <span className="mono" style={{ fontSize: 9, color: C.textMute, letterSpacing: "0.18em" }}>
                    DESENVOLVIDO POR
                  </span>
                  <img src={agencyLogo} alt="Agência"
                    style={{ height: 24, maxWidth: 110, objectFit: "contain", opacity: 0.85 }} />
                  <span style={{ width: 1, height: 18, background: C.border }} />
                </>
              )}
              <span className="mono">▸ END OF FEED ▪</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
