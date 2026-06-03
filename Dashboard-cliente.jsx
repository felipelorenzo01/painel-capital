"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import {
  Upload, TrendingUp, Target, Users, MapPin, DollarSign,
  Activity, Filter, Download, Zap, Trophy, ShoppingCart, UserPlus, Eye,
  ArrowUpRight, ArrowDownRight, Calendar, Play, Image as ImgIcon,
  Shield, AlertTriangle, CheckCircle2, Flame, Clock, Settings,
  Wifi, WifiOff, RefreshCw, Key, FileText
} from "lucide-react";


/* ═══════════════════════════════════════════════════════════════
   LOGOS DA AGÊNCIA
   ═══════════════════════════════════════════════════════════════ */
const AGENCY_LOGOS = [
  { id: "m",     src: "data:image/png;base64,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",     label: "m" },
  { id: "sumos", src: "data:image/png;base64,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", label: "Sumos" },
];
/* ═══════════════════════════════════════════════════════════════
   PALETA — HÍBRIDA (TECH ESCURO + DOURADO CAPITAL)
   ═══════════════════════════════════════════════════════════════ */
const C = {
  bg: "#08090C",
  panel: "#0E1116",
  panelHi: "#141821",
  panelDeep: "#0B0D12",
  border: "#1C212C",
  borderHi: "#2A3142",
  text: "#EEF1F6",
  textDim: "#8A93A6",
  textMute: "#4D5566",
  gold: "#E8B547",
  goldHi: "#F5C966",
  goldDim: "#9A7530",
  royal: "#3D6FFF",
  royalDim: "#2849B0",
  cp: "#E8B547",
  cs: "#FF7A47",
  rev: "#3D6FFF",
  cg: "#A678FF",
  aw: "#5DCFC0",
  pos: "#3DDB8E",
  warn: "#FFB13D",
  neg: "#FF4D6E",
};

const VERTENTES = {
  CP: { nome: "Capital de Prêmios", cor: C.cp, icone: Trophy, sigla: "CP" },
  CS: { nome: "Capital Sena", cor: C.cs, icone: Zap, sigla: "CS" },
  REV: { nome: "Revendedores", cor: C.rev, icone: UserPlus, sigla: "REV" },
  CG: { nome: "Cidade Ganhador", cor: C.cg, icone: MapPin, sigla: "CG" },
  AW: { nome: "Awareness", cor: C.aw, icone: Eye, sigla: "AW" },
};

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════ */
const MOCK_DATA = {
  periodo: "01/04/2026 a 01/06/2026",
  ultimaAtualizacao: "02/06/2026 22:12",

  contasAnuncio: [
    { id: "CAPITAL_01", nome: "CAPITAL 01", status: "ATIVA", aquecimento: 85, gastoMes: 9936, frequency: 2.1, adsRejeitados: 0, score: 84 },
    { id: "CAPITAL_03", nome: "CAPITAL 03", status: "ATIVA", aquecimento: 72, gastoMes: 4196, frequency: 1.6, adsRejeitados: 0, score: 78 },
    { id: "CAPITAL_04", nome: "CAPITAL 04", status: "ATIVA", aquecimento: 68, gastoMes: 1907, frequency: 1.9, adsRejeitados: 0, score: 74 },
  ],

  campanhas: [
    { id: 1,  nome: "[1] TOPO [VENDAS] {SENA}",                 vertente: "CS",  objetivo: "Vendas",  investido: 6583.95, impressoes: 414015, cliques: 8674, compras: 2071, conversas: 0,   ctr: 2.10, cpa: 3.18,  cpl: 0, roas: 2.82 },
    { id: 2,  nome: "[1] TOPO [VENDAS] {CAPITAL}",              vertente: "CP",  objetivo: "Vendas",  investido: 1540.78, impressoes: 93534,  cliques: 837,  compras: 58,   conversas: 0,   ctr: 0.89, cpa: 26.57, cpl: 0, roas: 0.90 },
    { id: 3,  nome: "[SUMOS] [CAPTAÇÃO] [EBOOK]",               vertente: "REV", objetivo: "Leads",   investido: 1498.34, impressoes: 16785,  cliques: 196,  compras: 0,    conversas: 5,   ctr: 1.17, cpa: 0,     cpl: 299.67 },
    { id: 4,  nome: "[ABO] [LEADS] [CAPTAÇÃO]",                 vertente: "REV", objetivo: "Leads",   investido: 1449.53, impressoes: 12119,  cliques: 101,  compras: 0,    conversas: 0,   ctr: 0.83, cpa: 0,     cpl: 0 },
    { id: 5,  nome: "[2] MEIO [VENDAS] {CAPITAL}",              vertente: "CP",  objetivo: "Vendas",  investido: 1409.54, impressoes: 53705,  cliques: 533,  compras: 48,   conversas: 0,   ctr: 0.99, cpa: 29.37, cpl: 0 },
    { id: 6,  nome: "[SUMOS] [CAPTAÇÃO] [FRANQUEADO]",          vertente: "REV", objetivo: "Leads",   investido: 1132.44, impressoes: 39017,  cliques: 396,  compras: 0,    conversas: 189, ctr: 1.01, cpa: 0,     cpl: 5.99 },
    { id: 7,  nome: "[SUMOS] [CONVERSÃO] [CDP] [DIA DAS MÃES]", vertente: "REV", objetivo: "Vendas",  investido: 734.22,  impressoes: 22353,  cliques: 369,  compras: 25,   conversas: 0,   ctr: 1.65, cpa: 29.37, cpl: 0 },
    { id: 8,  nome: "[3] FUNDO [VENDAS] {CAPITAL}",             vertente: "CP",  objetivo: "Vendas",  investido: 489.61,  impressoes: 14136,  cliques: 153,  compras: 9,    conversas: 0,   ctr: 1.08, cpa: 54.40, cpl: 0 },
    { id: 9,  nome: "[AB0] [LEADS] [CAPTAÇÃO] V2]",             vertente: "REV", objetivo: "Leads",   investido: 331.43,  impressoes: 1873,   cliques: 17,   compras: 0,    conversas: 0,   ctr: 0.91, cpa: 0,     cpl: 0 },
    { id: 10, nome: "[1] TOPO [LEADS]",                         vertente: "CP",  objetivo: "Leads",   investido: 273.76,  impressoes: 6536,   cliques: 52,   compras: 0,    conversas: 4,   ctr: 0.80, cpa: 0,     cpl: 68.44 },
    { id: 11, nome: "[SUMOS] [VENDAS] [CAPITAL] [BASE]",        vertente: "REV", objetivo: "Vendas",  investido: 222.92,  impressoes: 8545,   cliques: 87,   compras: 6,    conversas: 0,   ctr: 1.02, cpa: 37.15, cpl: 0 },
    { id: 12, nome: "[ALCANCE] [VENCEDORES]",                   vertente: "CG",  objetivo: "Alcance", investido: 180.50,  impressoes: 96218,  cliques: 114,  compras: 0,    conversas: 0,   ctr: 0.12, cpa: 0,     cpl: 0 },
    { id: 13, nome: "[SUMOS] [VENDAS] [SENA] [BASE]",           vertente: "CS",  objetivo: "Vendas",  investido: 145.13,  impressoes: 5471,   cliques: 43,   compras: 1,    conversas: 0,   ctr: 0.79, cpa: 145.13,cpl: 0 },
    { id: 14, nome: "[SUMOS] [VENDAS] [SENA] [BASE] v2",        vertente: "CS",  objetivo: "Vendas",  investido: 46.89,   impressoes: 2494,   cliques: 14,   compras: 9,    conversas: 0,   ctr: 0.56, cpa: 5.21,  cpl: 0 },
  ],

  funil: [
    { etapa: "Impressões", valor: 786801, taxa: 100 },
    { etapa: "Cliques",    valor: 11586,  taxa: 1.47 },
    { etapa: "Compras",    valor: 2227,   taxa: 0.28 },
  ],

  heatmap: (() => {
    const dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
    const horas = Array.from({ length: 24 }, (_, i) => i);
    const data = [];
    dias.forEach((d, di) => {
      horas.forEach((h) => {
        let base = 20;
        if (di === 0 && h >= 8 && h <= 11) base = 95;
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

  evolucaoDiaria: [
    { dia: "01/04", investido: 1280, compras: 312 },
    { dia: "05/04", investido: 1420, compras: 384 },
    { dia: "10/04", investido: 1180, compras: 298 },
    { dia: "15/04", investido: 1620, compras: 442 },
    { dia: "20/04", investido: 1840, compras: 512 },
    { dia: "25/04", investido: 1480, compras: 398 },
    { dia: "30/04", investido: 1720, compras: 478 },
  ],

  sorteios: [
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


};

/* ═══════════════════════════════════════════════════════════════
   APPS SCRIPT CLIENT
   ═══════════════════════════════════════════════════════════════ */
const CACHE_MS = 10 * 60 * 1000;
const _cache = {};

const sheetsClient = {
  async fetchJSON(endpointUrl) {
    if (!endpointUrl) throw new Error("Endpoint não configurado");
    const cached = _cache[endpointUrl];
    if (cached && Date.now() - cached.t < CACHE_MS) return cached.d;
    const res = await fetch(endpointUrl);
    if (!res.ok) throw new Error(`Apps Script: ${res.status}`);
    const json = await res.json();
    _cache[endpointUrl] = { t: Date.now(), d: json };
    return json;
  },
};

/* ═══════════════════════════════════════════════════════════════
   CLASSIFICADOR + PARSER + AGREGADOR
   ═══════════════════════════════════════════════════════════════ */
const classificarVertente = (campaignName) => {
  if (!campaignName) return "NAO_CLASSIFICADA";
  const n = campaignName.toLowerCase();
  if (n.includes("sena")) return "CS";
  if (n.includes("revendedor") || n.includes("vídeo") || n.includes("video")) return "REV";
  if (n.includes("alcance")) {
    if (n.includes("ganhador") || n.includes("cidade") || /\b(go|pe|mg|ba|ce|sp|rj|df)\b/i.test(n)) return "CG";
    if (n.includes("awareness") || n.includes("institucional") || n.includes("perfil")) return "AW";
    return "CG";
  }
  if (n.includes("capital") || n.includes("topo") || n.includes("meio") || n.includes("fundo")) return "CP";
  return "NAO_CLASSIFICADA";
};

const parsearLinha = (row) => {
  const num = (...keys) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && row[k] !== "") return Number(row[k]) || 0;
    }
    return 0;
  };
  const compras = num("actions_offsite_conversion_fb_pixel_purchase", "actions_purchase");
  const conversas = num("actions_onsite_conversion_messaging_conversation_started_7d");
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
    compras,
    conversas,
    custoPorCompra: compras ? investido / compras : 0,
    vertente: classificarVertente(row.campaign),
  };
};

const agregarPorCampanha = (linhas) => {
  const map = {};
  linhas.forEach((l) => {
    const k = l.campaign_id || l.campaign;
    if (!map[k]) {
      map[k] = { id: k, nome: l.campaign, vertente: l.vertente, objetivo: l.objetivo,
        account_name: l.account_name, investido: 0, impressoes: 0, alcance: 0,
        cliques: 0, compras: 0, conversas: 0, dias: 0, frequencyTotal: 0 };
    }
    map[k].investido += l.investido;
    map[k].impressoes += l.impressoes;
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
const toISO = (d) => { if (typeof d === "string") return d.substring(0, 10); return d.toISOString().substring(0, 10); };
const fmtData = (iso) => { if (!iso) return "—"; const [y, m, d] = iso.substring(0, 10).split("-"); return `${d}/${m}/${y}`; };
const fmtDataCurta = (iso) => {
  if (!iso) return "—";
  const [, m, d] = iso.substring(0, 10).split("-");
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d}/${meses[parseInt(m, 10) - 1]}`;
};
const diasAtras = (dias) => { const d = new Date(); d.setDate(d.getDate() - dias); return toISO(d); };
const hojeISO = () => toISO(new Date());

/* ═══════════════════════════════════════════════════════════════
   STYLE INJECTOR
   ═══════════════════════════════════════════════════════════════ */
const StyleInjector = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Sora:wght@400;500;600;700;800&display=swap');
    .dash-root, .dash-root * { box-sizing: border-box; }
    .dash-root { font-family: 'Sora', sans-serif; background: ${C.bg}; color: ${C.text}; min-height: 100vh; letter-spacing: -0.005em; }
    .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "tnum", "zero"; }
    .display { font-family: 'Sora', sans-serif; font-weight: 800; letter-spacing: -0.03em; }
    .dash-root::before { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: radial-gradient(circle at 12% 8%, rgba(232,181,71,0.05) 0%, transparent 35%), radial-gradient(circle at 88% 92%, rgba(61,111,255,0.04) 0%, transparent 35%); }
    .dash-content { position: relative; z-index: 1; }
    .panel { background: ${C.panel}; border: 1px solid ${C.border}; position: relative; }
    .panel-gold-edge { background: ${C.panel}; border: 1px solid ${C.border}; position: relative; }
    .panel-gold-edge::before { content: ""; position: absolute; top: -1px; left: -1px; width: 24px; height: 24px; border-top: 1px solid ${C.gold}; border-left: 1px solid ${C.gold}; pointer-events: none; }
    .panel-gold-edge::after { content: ""; position: absolute; bottom: -1px; right: -1px; width: 24px; height: 24px; border-bottom: 1px solid ${C.gold}; border-right: 1px solid ${C.gold}; pointer-events: none; }
    .blink { animation: blink 1.6s ease-in-out infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
    .scan { background: repeating-linear-gradient(180deg, transparent 0px, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 3px); }
    .btn { background: ${C.panelHi}; border: 1px solid ${C.border}; color: ${C.text}; padding: 8px 14px; font-size: 11px; font-weight: 600; cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; }
    .btn:hover { border-color: ${C.gold}; color: ${C.gold}; }
    .btn-primary { background: ${C.gold}; color: ${C.bg}; border-color: ${C.gold}; font-weight: 700; }
    .btn-primary:hover { background: ${C.goldHi}; border-color: ${C.goldHi}; }
    .chip { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid currentColor; font-family: 'JetBrains Mono', monospace; }
    .filter-btn { padding: 9px 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; border: 1px solid ${C.border}; background: ${C.panel}; color: ${C.textDim}; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 7px; font-family: 'Sora', sans-serif; }
    .filter-btn:hover:not(.active) { color: ${C.text}; border-color: ${C.borderHi}; }
    .recharts-cartesian-axis-tick-value { font-family: 'JetBrains Mono', monospace; font-size: 10px; }
    .recharts-default-tooltip { background: ${C.panelHi} !important; border: 1px solid ${C.gold} !important; border-radius: 0 !important; font-family: 'JetBrains Mono', monospace !important; }
    .recharts-tooltip-label { color: ${C.gold} !important; font-size: 11px !important; font-weight: 700 !important; }
    .recharts-tooltip-item { font-size: 11px !important; }
    .section-line { flex: 1; height: 1px; background: linear-gradient(90deg, ${C.gold}80 0%, ${C.border} 100%); }
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
    <div style={{ borderBottom: `1px solid ${C.border}`, padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: `linear-gradient(180deg, ${C.panel} 0%, ${C.bg} 100%)`, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(8px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldHi} 100%)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, boxShadow: `0 0 24px ${C.gold}30` }}>
            <Trophy size={20} color={C.bg} strokeWidth={2.5} />
            <div style={{ position: "absolute", inset: -3, border: `1px solid ${C.gold}40`, borderRadius: 2 }} />
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: C.gold, letterSpacing: "0.25em", marginBottom: 2 }}>▸ CAPITAL · MEDIA OPS</div>
            <div className="display" style={{ fontSize: 18 }}>Painel de Mídia <span style={{ color: C.gold }}>·</span> Capital</div>
          </div>
        </div>
        <div style={{ width: 1, height: 36, background: C.border }} />
        <div className="mono" style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span className="blink" style={{ color: statusColor, fontSize: 14 }}>●</span>
          <span style={{ color: statusColor, fontWeight: 700, letterSpacing: "0.15em" }}>{statusLabel}</span>
          <span style={{ color: C.textMute }}>·</span>
          <span style={{ color: C.textDim }}>{MOCK_DATA.periodo}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textMute, textAlign: "right", letterSpacing: "0.1em" }}>
          ÚLTIMA SINC.<br/><span style={{ color: C.textDim, fontSize: 10 }}>{MOCK_DATA.ultimaAtualizacao}</span>
        </div>
        <input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => onUpload(e.target.files[0])} />
        <button className="btn" onClick={onRefresh}><RefreshCw size={12} /> SYNC</button>
        <button className="btn" onClick={() => inputRef.current?.click()}><Upload size={12} /> {fileName ? fileName.substring(0, 14) + "…" : "CSV"}</button>
        <button className="btn" onClick={onConfig}><Key size={12} /> API</button>
        <div style={{ width: 1, height: 36, background: C.border, marginLeft: 4 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span className="mono" style={{ fontSize: 8, color: C.textMute, letterSpacing: "0.18em" }}>POWERED BY</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {AGENCY_LOGOS.map((logo) => (
              <img key={logo.id} src={logo.src} alt={logo.label}
                onClick={() => onAgencyLogoUpload(logo.src)}
                title={`Usar logo ${logo.label}`}
                style={{
                  height: logo.id === "m" ? 28 : 24,
                  maxWidth: 90, objectFit: "contain",
                  cursor: "pointer", opacity: agencyLogo === logo.src ? 1 : 0.45,
                  filter: "brightness(1.1)",
                  border: agencyLogo === logo.src ? `1px solid ${C.gold}` : "1px solid transparent",
                  padding: 2, transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.target.style.opacity = "1"; }}
                onMouseLeave={(e) => { e.target.style.opacity = agencyLogo === logo.src ? "1" : "0.45"; }}
              />
            ))}
          </div>
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
    <span className="mono" style={{ fontSize: 10, color: accent, letterSpacing: "0.2em", fontWeight: 700, padding: "4px 10px", border: `1px solid ${accent}40`, background: `${accent}08` }}>{codigo}</span>
    <h2 className="display" style={{ fontSize: 18, margin: 0 }}>{titulo}</h2>
    {sub && <span style={{ fontSize: 12, color: C.textMute, fontStyle: "italic" }}>{sub}</span>}
    <div className="section-line" />
  </div>
);

const KPI = ({ label, valor, sub, delta, icon: Icon, accent = C.text, big = false }) => (
  <div className="panel" style={{ padding: big ? 24 : 18, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${accent} 0%, ${accent}00 100%)` }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: C.textDim, textTransform: "uppercase" }}>{label}</div>
      <Icon size={14} color={accent} strokeWidth={1.8} />
    </div>
    <div className="mono display" style={{ fontSize: big ? 32 : 26, color: C.text, lineHeight: 1, marginBottom: 8 }}>{valor}</div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10 }}>
      <span className="mono" style={{ color: C.textMute }}>{sub}</span>
      {delta !== undefined && (
        <span className="mono" style={{ color: delta >= 0 ? C.pos : C.neg, display: "inline-flex", alignItems: "center", gap: 2, fontWeight: 700 }}>
          {delta >= 0 ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}{Math.abs(delta).toFixed(1)}%
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
          <button key={op.id} className={`filter-btn ${isActive ? "active" : ""}`} onClick={() => setAtivo(op.id)}
            style={isActive ? { background: op.cor, color: C.bg, borderColor: op.cor, boxShadow: `0 0 16px ${op.cor}40` } : {}}>
            {op.Icon && <op.Icon size={11} />}{op.nome}
          </button>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: SAÚDE — APENAS ADS REJEITADOS
   ═══════════════════════════════════════════════════════════════ */
const AdsRejeitados = ({ data }) => {
  const total = data.saudeOperacao.adsRejeitados30d;
  const cor = total === 0 ? C.pos : total <= 3 ? C.warn : C.neg;
  const label = total === 0 ? "NENHUMA REJEIÇÃO" : total <= 3 ? "ATENÇÃO" : "RISCO";
  const historico = data.saudeOperacao.historico || [];

  return (
    <div className="panel-gold-edge" style={{ padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 32, alignItems: "center" }}>
        {/* Score */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ position: "relative", width: 160, height: 160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke={C.border} strokeWidth="8" />
              <circle cx="80" cy="80" r="68" fill="none" stroke={cor} strokeWidth="8"
                strokeDasharray={`${Math.max(0, (1 - total / 20) * 427)} 427`}
                strokeLinecap="round" transform="rotate(-90 80 80)"
                style={{ filter: `drop-shadow(0 0 8px ${cor}80)` }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="mono display" style={{ fontSize: 52, color: cor, lineHeight: 1 }}>{total}</div>
              <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.15em", marginTop: 2 }}>ads rejeit. 30d</div>
            </div>
          </div>
          <div className="chip" style={{ color: cor, background: `${cor}10` }}>
            <AlertTriangle size={10} /> {label}
          </div>
        </div>

        {/* Histórico + contexto */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <h3 className="display" style={{ fontSize: 16, margin: 0, marginBottom: 4 }}>Ads rejeitados · histórico</h3>
            <p style={{ fontSize: 11, color: C.textMute, margin: 0 }}>
              Monitoramento de anúncios reprovados pelo Meta ao longo do tempo
            </p>
          </div>

          {/* Barras de histórico */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {historico.map((h, i) => {
              const maxH = Math.max(...historico.map((x) => x.rejeitados), 1);
              const pct = (h.rejeitados / maxH) * 100;
              const c = h.rejeitados === 0 ? C.pos : h.rejeitados <= 3 ? C.warn : C.neg;
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                    <span className="mono" style={{ color: C.textDim, letterSpacing: "0.08em" }}>{h.periodo}</span>
                    <span className="mono" style={{ color: c, fontWeight: 700 }}>{h.rejeitados} {h.rejeitados === 1 ? "rejeição" : "rejeições"}</span>
                  </div>
                  <div style={{ height: 6, background: C.panelDeep, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: `linear-gradient(90deg, ${c}88 0%, ${c} 100%)`, boxShadow: `0 0 8px ${c}50` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {total > 0 && (
            <div style={{ padding: 12, background: C.panelDeep, border: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <AlertTriangle size={14} color={C.warn} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>
                <span style={{ color: C.warn, fontWeight: 700 }}>Atenção</span>: CAPITAL 06 está em revisão (Meta requisitou verificação adicional). Pause novos criativos agressivos nesta conta até o status normalizar.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: SORTEIO DA SEMANA
   ═══════════════════════════════════════════════════════════════ */
const VisaoSemanal = ({ sorteios, evolucaoDiaria }) => {
  const hoje = hojeISO();
  const sorteiosOrdenados = useMemo(() => {
    return [...sorteios].sort((a, b) => a.data.localeCompare(b.data)).map((s) => ({
      ...s, situacao: s.data < hoje ? "passado" : s.data === hoje ? "atual" : "futuro",
    }));
  }, [sorteios, hoje]);

  const idxAtual = useMemo(() => {
    const idxFuturo = sorteiosOrdenados.findIndex((s) => s.data >= hoje);
    return idxFuturo === -1 ? sorteiosOrdenados.length - 1 : idxFuturo;
  }, [sorteiosOrdenados, hoje]);

  const [idx, setIdx] = useState(idxAtual);
  const sorteio = sorteiosOrdenados[idx];
  if (!sorteio) return null;

  const cor = VERTENTES[sorteio.tipo]?.cor || C.gold;
  const corTexto = sorteio.situacao === "futuro" ? C.warn : C.pos;

  const metricasSemana = useMemo(() => {
    const investido = (evolucaoDiaria || []).reduce((s, d) => s + (d.investido || 0), 0);
    const compras = (evolucaoDiaria || []).reduce((s, d) => s + (d.compras || 0), 0);
    return { investido, compras };
  }, [evolucaoDiaria, sorteio]);

  return (
    <div className="panel-gold-edge" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ background: `linear-gradient(90deg, ${cor}15 0%, ${C.panelDeep} 100%)`, padding: "16px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1 }}>◀ Anterior</button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div className="mono" style={{ fontSize: 9, color: cor, letterSpacing: "0.2em", marginBottom: 4 }}>
            ▸ {sorteio.tipo === "CP" ? "CAPITAL DE PRÊMIOS" : "CAPITAL CENA"} · {sorteio.situacao === "passado" ? "REALIZADO" : sorteio.situacao === "atual" ? "HOJE" : "PRÓXIMO"}
          </div>
          <div className="display" style={{ fontSize: 22, color: C.text }}>{sorteio.tema}</div>
          <div className="mono" style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>
            Sorteio em <span style={{ color: corTexto, fontWeight: 700 }}>{fmtData(sorteio.data)}</span>
            <span style={{ color: C.textMute, margin: "0 8px" }}>·</span>
            Semana {fmtDataCurta(sorteio.semanaInicio)} → {fmtDataCurta(sorteio.semanaFim)}
          </div>
        </div>
        <button className="btn" onClick={() => setIdx(Math.min(sorteiosOrdenados.length - 1, idx + 1))} disabled={idx === sorteiosOrdenados.length - 1} style={{ opacity: idx === sorteiosOrdenados.length - 1 ? 0.3 : 1 }}>Próximo ▶</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 0 }}>
        <div style={{ padding: 24, borderRight: `1px solid ${C.border}` }}>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 12 }}>▸ PREMIAÇÃO · TOTAL {fmtBRL(sorteio.valorTotal)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sorteio.premios.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 12, alignItems: "center", padding: "10px 12px", background: C.panelHi, border: `1px solid ${C.border}`, borderLeft: `3px solid ${cor}` }}>
                <span className="mono" style={{ fontSize: 11, color: cor, fontWeight: 700, letterSpacing: "0.05em" }}>{p.ord}</span>
                <span style={{ fontSize: 12, color: C.text }}>{p.item}</span>
                <span className="mono" style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>{fmtBRL(p.valor)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 12 }}>▸ PERFORMANCE DA SEMANA</div>
          {sorteio.situacao === "futuro" ? (
            <div style={{ padding: "32px 16px", textAlign: "center", border: `1px dashed ${C.warn}`, background: `${C.warn}08` }}>
              <Clock size={28} color={C.warn} style={{ marginBottom: 8 }} />
              <div className="display" style={{ fontSize: 14, color: C.warn, marginBottom: 4 }}>Sorteio futuro</div>
              <div style={{ fontSize: 11, color: C.textMute, lineHeight: 1.5 }}>Os dados de performance aparecem aqui conforme as campanhas rodam ao longo da semana.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Investido", v: fmtBRL(metricasSemana.investido), cor: C.gold, Icon: DollarSign },
                { label: "Compras", v: fmtNum(metricasSemana.compras), cor: C.cs, Icon: ShoppingCart },
                { label: "CPA Médio", v: metricasSemana.compras ? fmtBRL(metricasSemana.investido / metricasSemana.compras) : "—", cor: C.royal, Icon: Target },
                { label: "ROI Bruto", v: metricasSemana.investido ? `${(sorteio.valorTotal / metricasSemana.investido).toFixed(1)}x` : "—", cor: C.pos, Icon: TrendingUp },
              ].map((m, i) => (
                <div key={i} style={{ background: C.panelHi, border: `1px solid ${C.border}`, borderTop: `2px solid ${m.cor}`, padding: 14 }}>
                  <m.Icon size={14} color={m.cor} style={{ marginBottom: 6 }} />
                  <div className="mono display" style={{ fontSize: 18, color: C.text, lineHeight: 1 }}>{m.v}</div>
                  <div className="mono" style={{ fontSize: 9, color: C.textDim, marginTop: 4, letterSpacing: "0.1em" }}>{m.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 16px", background: C.panelDeep, display: "flex", gap: 4, overflowX: "auto" }}>
        {sorteiosOrdenados.map((s, i) => {
          const c = VERTENTES[s.tipo]?.cor || C.gold;
          const ativo = i === idx;
          return (
            <button key={i} onClick={() => setIdx(i)} style={{ padding: "6px 10px", fontSize: 9, cursor: "pointer", background: ativo ? c : "transparent", color: ativo ? C.bg : (s.situacao === "futuro" ? C.textMute : C.textDim), border: `1px solid ${ativo ? c : C.border}`, fontFamily: "JetBrains Mono", fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap", opacity: s.situacao === "futuro" && !ativo ? 0.5 : 1 }}>
              {fmtDataCurta(s.data)} · {s.tipo}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: ALOCAÇÃO
   ═══════════════════════════════════════════════════════════════ */
const InvestimentoPorObjetivo = ({ campanhas }) => {
  // Cores fixas por objetivo
  const COR_OBJ = { Vendas: C.gold, Alcance: C.cg, Leads: C.rev };

  const data = useMemo(() => {
    const map = {};
    campanhas.forEach((c) => {
      const key = c.objetivo || "Outros";
      if (!map[key]) map[key] = { nome: key, investido: 0 };
      map[key].investido += c.investido;
    });
    return Object.values(map).sort((a, b) => b.investido - a.investido);
  }, [campanhas]);
  const total = data.reduce((s, d) => s + d.investido, 0);

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>INV / OBJ</div>
          <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Investimento por objetivo</h3>
        </div>
        <div className="mono" style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>TOTAL <span style={{ marginLeft: 8 }}>{fmtBRL(total)}</span></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {data.map((d, i) => {
          const pct = (d.investido / total) * 100;
          const cor = COR_OBJ[d.nome] || C.text;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
                <span style={{ color: C.text, fontWeight: 600, fontSize: 13 }}>{d.nome}</span>
                <span className="mono" style={{ color: C.textDim }}>{fmtBRL(d.investido)} <span style={{ color: cor, marginLeft: 8, fontWeight: 700 }}>{pct.toFixed(1)}%</span></span>
              </div>
              <div style={{ height: 8, background: C.panelDeep, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: `linear-gradient(90deg, ${cor}88 0%, ${cor} 100%)`, boxShadow: `0 0 10px ${cor}50` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CompararVertentes = ({ campanhas }) => {
  const data = useMemo(() => {
    const cp = campanhas.filter((c) => c.vertente === "CP");
    const cs = campanhas.filter((c) => c.vertente === "CS");
    const reduce = (arr) => {
      const investido = arr.reduce((s, c) => s + c.investido, 0);
      const roasNumerador = arr.reduce((s, c) => s + (c.roas ? c.roas * c.investido : 0), 0);
      const roasDenominador = arr.filter(c => c.roas).reduce((s, c) => s + c.investido, 0);
      return {
        investido,
        cliques: arr.reduce((s, c) => s + (c.cliques || 0), 0),
        compras: arr.reduce((s, c) => s + (c.compras || 0), 0),
        roas: roasDenominador ? roasNumerador / roasDenominador : 0,
      };
    };
    return [
      { nome: "Capital Prêmios", sigla: "CP", ...reduce(cp), cor: C.cp },
      { nome: "Capital Sena", sigla: "CS", ...reduce(cs), cor: C.cs },
    ];
  }, [campanhas]);

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>CP × CS</div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Vertentes em duelo</h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {data.map((d, i) => {
          const cpa = d.investido / (d.compras || 1);
          return (
            <div key={i} style={{ border: `1px solid ${C.border}`, padding: 16, borderTop: `3px solid ${d.cor}`, background: C.panelHi }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span className="display" style={{ fontSize: 14 }}>{d.nome}</span>
                <span className="chip" style={{ color: d.cor, background: `${d.cor}12` }}>{d.sigla}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[["Investido", fmtBRL(d.investido)], ["Compras", fmtNum(d.compras)], ["CPA", fmtBRL(cpa)], ["ROAS", d.roas ? `${d.roas.toFixed(2)}x` : "—"], ["Cliques", fmtNum(d.cliques)]].map(([k, v]) => (
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
   BLOCO: TRAJETÓRIA
   ═══════════════════════════════════════════════════════════════ */
const EvolucaoTemporal = ({ data, fator = 1 }) => {
  const dadosFatorados = data.map(d => ({
    ...d,
    investido: Math.round(d.investido * fator * 100) / 100,
    compras: Math.round(d.compras * fator),
  }));
  return (
  <div className="panel" style={{ padding: 24 }}>
    <div style={{ marginBottom: 16 }}>
      <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>TIME / 30D</div>
      <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Evolução diária · Investimento × Compras</h3>
    </div>
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={dadosFatorados}>
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

const FunilConversao = ({ data }) => {
  const max = data[0].valor;
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>FUNNEL</div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Funil de conversão</h3>
        <p style={{ fontSize: 11, color: C.textMute, margin: 0, marginTop: 4 }}>De impressão até compra · onde está vazando</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {data.map((etapa, i) => {
          const pct = (etapa.valor / max) * 100;
          const dropoff = i > 0 ? ((1 - etapa.valor / data[i - 1].valor) * 100) : 0;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
                <span style={{ color: C.text, fontWeight: 600 }}>{etapa.etapa}</span>
                <span className="mono" style={{ color: C.textDim, fontSize: 10 }}>{fmtNum(etapa.valor)} · <span style={{ color: C.gold }}>{etapa.taxa.toFixed(2)}%</span></span>
              </div>
              <div style={{ position: "relative", height: 26, background: C.panelDeep, overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `linear-gradient(90deg, ${C.gold}DD 0%, ${C.goldHi} 100%)`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                  <span className="mono" style={{ fontSize: 9, color: C.bg, fontWeight: 700 }}>{pct.toFixed(1)}%</span>
                </div>
              </div>
              {i > 0 && <div className="mono" style={{ fontSize: 9, color: C.neg, marginTop: 2, textAlign: "right" }}>↓ -{dropoff.toFixed(1)}% drop</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: HORÁRIOS DE OURO
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
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>HEATMAP / 168H</div>
          <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Horários de ouro</h3>
          <p style={{ fontSize: 11, color: C.textMute, margin: 0, marginTop: 4 }}>Quando converte mais · dia da semana × hora · escala dourada = volume de compras</p>
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
          <div />
          {horas.map((h) => (
            <div key={h} className="mono" style={{ fontSize: 8, color: C.textMute, textAlign: "center", padding: "2px 0", letterSpacing: "0.05em" }}>{h.toString().padStart(2, "0")}</div>
          ))}
          {dias.map((dia) => (
            <React.Fragment key={dia}>
              <div className="mono" style={{ fontSize: 9, color: C.textDim, fontWeight: 700, display: "flex", alignItems: "center", letterSpacing: "0.1em" }}>{dia}</div>
              {horas.map((h) => {
                const cell = cellAt(dia, h);
                return (
                  <div key={h} title={`${dia} ${h}h · ${cell?.valor || 0}`}
                    style={{ height: 22, background: colorScale(cell?.valor || 0), border: `1px solid ${C.bg}`, cursor: "pointer", transition: "transform 0.1s" }}
                    onMouseEnter={(e) => { e.target.style.transform = "scale(1.15)"; e.target.style.zIndex = "10"; e.target.style.position = "relative"; }}
                    onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.zIndex = "0"; }} />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 12, background: C.panelDeep, border: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Flame size={14} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>
          <span style={{ color: C.gold, fontWeight: 700 }}>Picos identificados</span>: domingo 8h-11h (sorteio Record/TV Brasília), sex/sáb 19h-23h. Concentre lances e criativos novos nestas janelas.
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BLOCO: PÚBLICO
   ═══════════════════════════════════════════════════════════════ */
const Genero = ({ data }) => {
  const cores = [C.gold, C.cs, C.textMute];
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>DEMO / GÊNERO</div>
        <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Gênero</h3>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={64} paddingAngle={2} dataKey="valor" stroke="none">
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

const Demografia = ({ data }) => (
  <div className="panel" style={{ padding: 24 }}>
    <div style={{ marginBottom: 18 }}>
      <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>DEMO / IDADE × COMPRAS</div>
      <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Idade × Compras</h3>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={C.border} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="faixa" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
        <YAxis tick={{ fill: C.textDim, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
        <Tooltip cursor={{ fill: "rgba(232,181,71,0.05)" }} />
        <Bar dataKey="compras" name="Compras" fill={C.gold} radius={[2,2,0,0]} />
      </BarChart>
    </ResponsiveContainer>
    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: `repeat(${data.length}, 1fr)`, gap: 6 }}>
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

/* ═══════════════════════════════════════════════════════════════
   BLOCO: TABELA DE CAMPANHAS
   ═══════════════════════════════════════════════════════════════ */
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
          <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 4 }}>CAMPAIGNS / DETAIL</div>
          <h3 className="display" style={{ fontSize: 16, margin: 0 }}>Campanhas · linha-a-linha</h3>
          <p style={{ fontSize: 11, color: C.textMute, margin: 0, marginTop: 4 }}>Conversões mostradas conforme objetivo: compras (CP/CS), conversas (REV), alcance (CG/AW)</p>
        </div>
        <span className="chip" style={{ color: C.textDim }}>{campanhas.length} ATIVAS</span>
      </div>
      <div style={{ overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.gold}` }}>
              {["Campanha", "Vert.", "Investido", "Impr.", "Cliques", "CTR", "Métrica", "Volume", "Custo Unit."].map((h, i) => (
                <th key={i} className="mono" style={{ textAlign: i > 1 ? "right" : "left", padding: "10px 8px", fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campanhas.map((c) => {
              const cor = VERTENTES[c.vertente]?.cor || C.text;
              const [labelVol] = labelMetrica(c.vertente);
              let volume = "—", custoUnit = "—";
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
                  <td style={{ padding: "11px 8px" }}><span className="chip" style={{ color: cor, borderColor: cor + "40", background: cor + "12" }}>{c.vertente}</span></td>
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
   MODAL CONFIG
   ═══════════════════════════════════════════════════════════════ */
const ConfigModal = ({ aberto, onClose, config, setConfig, onConectar }) => {
  if (!aberto) return null;
  const [local, setLocal] = useState(config);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="panel-gold-edge" style={{ background: C.panel, padding: 32, width: 540, position: "relative" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ marginBottom: 20 }}>
          <div className="mono" style={{ fontSize: 9, color: C.gold, letterSpacing: "0.2em", marginBottom: 4 }}>▸ FONTE DE DADOS</div>
          <h2 className="display" style={{ fontSize: 20, margin: 0 }}>Endpoint Apps Script</h2>
          <p style={{ fontSize: 11, color: C.textMute, marginTop: 6, lineHeight: 1.5 }}>Cole a URL do seu Google Apps Script (Aplicativo da Web). O dashboard puxará os dados em JSON com cache de 10 minutos.</p>
        </div>
        <div>
          <label className="mono" style={{ fontSize: 10, color: C.textDim, letterSpacing: "0.15em", marginBottom: 6, display: "block" }}>URL do Apps Script</label>
          <input type="text" placeholder="https://script.google.com/macros/s/.../exec" value={local.endpointUrl || ""} onChange={(e) => setLocal({ ...local, endpointUrl: e.target.value })}
            style={{ width: "100%", padding: 12, background: C.panelDeep, border: `1px solid ${C.border}`, color: C.text, fontFamily: "JetBrains Mono", fontSize: 11, outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = C.gold}
            onBlur={(e) => e.target.style.borderColor = C.border} />
        </div>
        <div style={{ marginTop: 16, padding: 12, fontSize: 10, color: C.textMute, background: C.panelDeep, border: `1px solid ${C.border}`, lineHeight: 1.6 }}>
          <strong style={{ color: C.gold }}>Como obter:</strong><br/>
          1. Abre sua planilha → <span className="mono">Extensões → Apps Script</span><br/>
          2. Cola o script e clica em <span className="mono">Implantar → Aplicativo da Web</span><br/>
          3. Define <span className="mono">"Quem pode acessar: Qualquer pessoa"</span><br/>
          4. Copia a URL que termina em <span className="mono">/exec</span> e cola acima
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => { setConfig(local); onClose(); onConectar(local); }}>Conectar e Carregar</button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SELETOR DE DATAS
   ═══════════════════════════════════════════════════════════════ */
const SeletorDatas = ({ rangeAtivo, setRangeAtivo, customRange, setCustomRange }) => {
  const [customAberto, setCustomAberto] = useState(false);
  const presets = [
    { id: "60d", label: "60d" },
    { id: "30d", label: "30d" },
    { id: "14d", label: "14d" },
    { id: "7d",  label: "7d"  },
  ];
  return (
    <div style={{ display: "flex", gap: 0, alignItems: "center", position: "relative" }}>
      {presets.map((p) => (
        <button key={p.id} className={`filter-btn ${rangeAtivo === p.id ? "active" : ""}`}
          onClick={() => { setRangeAtivo(p.id); setCustomAberto(false); }}
          style={rangeAtivo === p.id ? { background: C.gold, color: C.bg, borderColor: C.gold } : {}}>
          {p.label}
        </button>
      ))}

      {customAberto && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, background: C.panel, border: `1px solid ${C.gold}`, padding: 16, minWidth: 280, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
          <div className="mono" style={{ fontSize: 9, color: C.gold, letterSpacing: "0.2em", marginBottom: 12 }}>▸ INTERVALO CUSTOMIZADO</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.15em", display: "block", marginBottom: 4 }}>DE</label>
              <input type="date" value={customRange.from || ""} onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                style={{ width: "100%", padding: 8, background: C.panelDeep, border: `1px solid ${C.border}`, color: C.text, fontFamily: "JetBrains Mono", fontSize: 11, outline: "none", colorScheme: "dark" }} />
            </div>
            <div>
              <label className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.15em", display: "block", marginBottom: 4 }}>ATÉ</label>
              <input type="date" value={customRange.to || ""} onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                style={{ width: "100%", padding: 8, background: C.panelDeep, border: `1px solid ${C.border}`, color: C.text, fontFamily: "JetBrains Mono", fontSize: 11, outline: "none", colorScheme: "dark" }} />
            </div>
            <button className="btn btn-primary" onClick={() => { if (customRange.from && customRange.to) { setRangeAtivo("custom"); setCustomAberto(false); } }}>Aplicar</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BANNER NÃO CLASSIFICADAS
   ═══════════════════════════════════════════════════════════════ */
const BannerNaoClassificadas = ({ campanhas }) => {
  if (!campanhas || campanhas.length === 0) return null;
  return (
    <div style={{ background: `linear-gradient(90deg, ${C.warn}15 0%, ${C.panelDeep} 100%)`, border: `1px solid ${C.warn}`, borderLeft: `4px solid ${C.warn}`, padding: 18, marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <AlertTriangle size={22} color={C.warn} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 9, color: C.warn, letterSpacing: "0.2em", fontWeight: 700, marginBottom: 4 }}>▸ ATENÇÃO · CAMPANHAS NÃO CLASSIFICADAS</div>
          <h3 className="display" style={{ fontSize: 15, margin: 0, marginBottom: 8 }}>{campanhas.length} {campanhas.length === 1 ? "campanha não foi reconhecida" : "campanhas não foram reconhecidas"} pelo classificador automático</h3>
          <div style={{ background: C.panelDeep, border: `1px solid ${C.border}`, padding: 10, fontFamily: "JetBrains Mono", fontSize: 11, maxHeight: 140, overflow: "auto" }}>
            {campanhas.map((c, i) => (
              <div key={i} style={{ padding: "4px 0", color: C.text, borderBottom: i < campanhas.length - 1 ? `1px dashed ${C.border}` : "none" }}>
                <span style={{ color: C.warn }}>▸</span> {c.nome}<span style={{ color: C.textMute, marginLeft: 8 }}>· {fmtBRL(c.investido)}</span>
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
  const [config, setConfig] = useState({ endpointUrl: "https://script.google.com/macros/s/AKfycbz-y7hebXLxw4O5HluXT9XAJG92FndqqhhsIhrfnPQywaTj9LVHBFkFmIstmv7mj23wqQ/exec" });
  const [configOpen, setConfigOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState("mock");
  const [agencyLogo, setAgencyLogo] = useState(null);
  const [naoClassificadas, setNaoClassificadas] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rangeAtivo, setRangeAtivo] = useState("60d");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [linhasBrutas, setLinhasBrutas] = useState([]);

  const periodoEfetivo = useMemo(() => {
    const to = hojeISO();
    if (rangeAtivo === "all") return { from: "1970-01-01", to };
    if (rangeAtivo === "custom") return { from: customRange.from || diasAtras(30), to: customRange.to || to };
    const map = { "7d": 7, "14d": 14, "30d": 30, "60d": 60, "90d": 90 };
    return { from: diasAtras(map[rangeAtivo] || 30), to };
  }, [rangeAtivo, customRange]);

  const handleAgencyLogoUpload = (fileOrSrc) => {
    if (!fileOrSrc) return;
    if (typeof fileOrSrc === "string") { setAgencyLogo(fileOrSrc); return; }
    const reader = new FileReader();
    reader.onload = (e) => setAgencyLogo(e.target.result);
    reader.readAsDataURL(fileOrSrc);
  };

  const conectarSheets = async (cfg) => {
    if (!cfg?.endpointUrl) { setConfigOpen(true); return; }
    try {
      setApiStatus("loading"); setErrorMsg(null);
      const linhas = await sheetsClient.fetchJSON(cfg.endpointUrl);
      if (!linhas || linhas.length === 0) throw new Error("Endpoint retornou vazio");
      const parseadas = linhas.map(parsearLinha);
      setLinhasBrutas(parseadas);
      setApiStatus("live");
    } catch (e) {
      console.error("Erro ao conectar:", e);
      setErrorMsg(e.message);
      setApiStatus("offline");
    }
  };

  useEffect(() => {
    if (linhasBrutas.length === 0) return;
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
        id: c.id, nome: c.nome, vertente: c.vertente, objetivo: c.objetivo || "—",
        investido: c.investido, impressoes: c.impressoes, cliques: c.cliques,
        compras: c.compras || undefined, conversas: c.conversas || undefined,
        leads: c.conversas || undefined, ctr: c.ctr, cpa: c.custoPorCompra, cpl: c.custoPorConversa,
      })),
      ultimaAtualizacao: new Date().toLocaleString("pt-BR"),
    }));
  }, [linhasBrutas, periodoEfetivo]);

  useEffect(() => {
    if (config.endpointUrl) conectarSheets(config);
  }, []); // eslint-disable-line

  // Simula filtro de período no mock multiplicando por fração do período
  const fatorPeriodo = useMemo(() => {
    if (linhasBrutas.length > 0) return 1; // dados reais, não aplica fator
    const map = { "60d": 1, "30d": 0.5, "14d": 0.23, "7d": 0.12 };
    return map[rangeAtivo] || 1;
  }, [rangeAtivo, linhasBrutas]);

  const campanhasFiltradas = useMemo(() => {
    let camp = data.campanhas;
    if (vertenteFiltro !== "TODOS") camp = camp.filter((c) => c.vertente === vertenteFiltro);
    if (fatorPeriodo === 1) return camp;
    // Aplica fator proporcional ao período selecionado
    return camp.map((c) => ({
      ...c,
      investido: c.investido * fatorPeriodo,
      impressoes: Math.round(c.impressoes * fatorPeriodo),
      cliques: Math.round(c.cliques * fatorPeriodo),
      compras: c.compras ? Math.round(c.compras * fatorPeriodo) : undefined,
      conversas: c.conversas ? Math.round(c.conversas * fatorPeriodo) : undefined,
      roas: c.roas, // ROAS não muda com período — é uma taxa
    }));
  }, [vertenteFiltro, data, fatorPeriodo]);

  const kpis = useMemo(() => {
    const arr = campanhasFiltradas;
    const investido = arr.reduce((s, c) => s + (c.investido || 0), 0);
    const cliques = arr.reduce((s, c) => s + (c.cliques || 0), 0);
    const impressoes = arr.reduce((s, c) => s + (c.impressoes || 0), 0);
    const compras = arr.reduce((s, c) => s + (c.compras || 0), 0);
    const conversas = arr.reduce((s, c) => s + (c.conversas || 0), 0);
    const roas = arr.reduce((s, c) => s + (c.roas ? c.roas * c.investido : 0), 0) /
      (arr.filter(c => c.roas).reduce((s, c) => s + c.investido, 0) || 1);
    return { investido, cliques, impressoes, compras, conversas,
      cpa: compras ? investido / compras : 0,
      cpc: conversas ? investido / conversas : 0,
      ctr: impressoes ? (cliques / impressoes) * 100 : 0,
      roas };
  }, [campanhasFiltradas]);

  const handleRefresh = async () => {
    if (!config.endpointUrl) { setConfigOpen(true); return; }
    Object.keys(_cache).forEach((k) => delete _cache[k]);
    await conectarSheets(config);
  };

  return (
    <div className="dash-root">
      <StyleInjector />
      <div className="dash-content scan">
        <Header apiStatus={apiStatus} onRefresh={handleRefresh} onUpload={(f) => f && setFileName(f.name)}
          fileName={fileName} onConfig={() => setConfigOpen(true)} agencyLogo={agencyLogo} onAgencyLogoUpload={handleAgencyLogoUpload} />
        <ConfigModal aberto={configOpen} onClose={() => setConfigOpen(false)} config={config} setConfig={setConfig} onConectar={conectarSheets} />

        <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 36 }}>

          {/* BANNER ERRO */}
          {errorMsg && (
            <div style={{ background: `${C.neg}15`, border: `1px solid ${C.neg}`, padding: 14, display: "flex", gap: 12, alignItems: "center", marginBottom: -16 }}>
              <AlertTriangle size={18} color={C.neg} />
              <div style={{ flex: 1, fontSize: 12, color: C.text }}>
                <strong style={{ color: C.neg }}>Erro ao conectar:</strong> {errorMsg}
                <span style={{ color: C.textMute, marginLeft: 8 }}>· Exibindo dados de demonstração.</span>
              </div>
              <button className="btn" onClick={() => setErrorMsg(null)}>OK</button>
            </div>
          )}

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
                <p style={{ fontSize: 13, color: C.textMute, margin: 0, marginTop: 8 }}>Capital de Prêmios + Capital Sena · Realizando Sonhos há 9 anos</p>
              </div>
              <button className="btn"><Download size={12}/> EXPORTAR</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 8 }}>▸ PERÍODO</div>
              <SeletorDatas rangeAtivo={rangeAtivo} setRangeAtivo={setRangeAtivo} customRange={customRange} setCustomRange={setCustomRange} />
            </div>
            <div>
              <div className="mono" style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.2em", marginBottom: 8 }}>▸ VERTENTE</div>
              <VerticalFilter ativo={vertenteFiltro} setAtivo={setVertenteFiltro} />
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            <KPI label="Investido" valor={fmtBRL(kpis.investido)} sub={`${campanhasFiltradas.length} campanhas`} delta={12.4} icon={DollarSign} accent={C.gold} />
            <KPI label="Compras" valor={fmtNum(kpis.compras)} sub={kpis.compras ? `CPA ${fmtBRL(kpis.cpa)}` : "—"} delta={8.7} icon={ShoppingCart} accent={C.cs} />
            <KPI label="Conversas Geradas" valor={fmtNum(kpis.conversas)} sub={kpis.conversas ? `Custo/Conv ${fmtBRL(kpis.cpc)}` : "—"} delta={14.2} icon={UserPlus} accent={C.rev} />
            <KPI label="Cliques" valor={fmtNum(kpis.cliques)} sub={`CTR ${kpis.ctr.toFixed(2)}%`} delta={-2.1} icon={Target} accent={C.royal} />
            <KPI label="Alcance" valor={fmtNum(kpis.impressoes)} sub="impressões totais" delta={18.2} icon={Activity} accent={C.cg} />
            <KPI label="ROAS" valor={kpis.roas > 0 ? `${kpis.roas.toFixed(2)}x` : "—"} sub="retorno sobre invest." icon={TrendingUp} accent={C.pos} />
          </div>



          {/* 02 · SORTEIO DA SEMANA */}
          <div>
            <SectionTitle codigo="01 ▸ SORTEIO DA SEMANA" titulo="Performance por sorteio" sub="navegue pelos sorteios passados, atuais e futuros" />
            <VisaoSemanal sorteios={data.sorteios} evolucaoDiaria={data.evolucaoDiaria} campanhas={campanhasFiltradas} />
          </div>

          {/* 03 · ALOCAÇÃO */}
          <div>
            <SectionTitle codigo="02 ▸ ALOCAÇÃO" titulo="Onde o dinheiro está" sub="distribuição por vertente e objetivo" />
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
              <InvestimentoPorObjetivo campanhas={campanhasFiltradas} />
              <CompararVertentes campanhas={campanhasFiltradas} />
            </div>
          </div>

          {/* 04 · TRAJETÓRIA */}
          <div>
            <SectionTitle codigo="03 ▸ TRAJETÓRIA" titulo="Evolução temporal e conversão" />
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
              <EvolucaoTemporal data={data.evolucaoDiaria} fator={fatorPeriodo} />
              <FunilConversao data={data.funil.map(e => ({ ...e, valor: Math.round(e.valor * fatorPeriodo) }))} />
            </div>
          </div>

          {/* 05 · HORÁRIOS DE OURO */}
          <div>
            <SectionTitle codigo="04 ▸ TIMING" titulo="Horários de ouro" />
            <HorariosDeOuro data={data.heatmap} />
          </div>

          {/* 06 · PÚBLICO */}
          <div>
            <SectionTitle codigo="05 ▸ PÚBLICO" titulo="Quem está clicando e comprando" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 14 }}>
              <Genero data={data.porGenero} />
              <Demografia data={data.porIdade} />
            </div>
          </div>



          {/* FOOTER */}
          <div style={{ paddingTop: 24, marginTop: 20, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: C.textMute }}>
            <span className="mono">CAPITAL · MEDIA OPS v2.1 · {data.periodo}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <>
                  <span className="mono" style={{ fontSize: 9, color: C.textMute, letterSpacing: "0.18em" }}>DESENVOLVIDO POR</span>
                  <img src={agencyLogo || AGENCY_LOGOS[1].src} alt="Agência" style={{ height: 22, maxWidth: 100, objectFit: "contain", opacity: 0.8 }} />
                  <span style={{ width: 1, height: 18, background: C.border }} />
                </>
              <span className="mono">▸ END OF FEED ▪</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
