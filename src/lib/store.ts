import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "./i18n";

export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
  obs?: string;
  criadoEm: string;
};

export type ItemOrcamento = {
  id: string;
  descricao: string;
  largura: number; // cm
  altura: number; // cm
  quantidade: number;
  custoMaterial: number; // R$ por m²
  maoDeObra: number; // R$ fixo por unidade
};

export type Orcamento = {
  id: string;
  numero: number;
  clienteId: string;
  titulo: string;
  itens: ItemOrcamento[];
  margemLucro: number; // %
  desconto: number; // %
  observacoes?: string;
  criadoEm: string;
  status: "rascunho" | "enviado" | "aprovado" | "recusado";
};

export type Material = {
  id: string;
  nome: string;
  tipo: "metal" | "madeira" | "consumivel" | "tinta" | "outro";
  unidade: string; // kg, m, un, L
  estoque: number;
  precoUnit: number;
  duracaoDias?: number; // tempo de uso estimado
  validade?: string; // ISO date
  fornecedor?: string;
};

export type Ferramenta = {
  id: string;
  nome: string;
  ultimaManutencao?: string;
  intervaloDias: number;
  proximaManutencao: string;
  obs?: string;
};

export type Servico = {
  id: string;
  titulo: string;
  clienteId?: string;
  data: string; // ISO
  hora?: string;
  local?: string;
  status: "agendado" | "em-andamento" | "concluido" | "cancelado";
  obs?: string;
};

export type Tarefa = {
  id: string;
  projetoId: string;
  titulo: string;
  feita: boolean;
};

export type Projeto = {
  id: string;
  nome: string;
  clienteId?: string;
  descricao?: string;
  prazo?: string;
  status: "planejamento" | "em-andamento" | "pausado" | "concluido";
  fotos: string[]; // data URLs
  criadoEm: string;
};

export type Lancamento = {
  id: string;
  data: string;
  descricao: string;
  categoria: string;
  tipo: "entrada" | "saida";
  valor: number;
};

type State = {
  locale: Locale;
  empresa: { nome: string; cnpj: string; telefone: string; endereco: string; logo?: string };
  clientes: Cliente[];
  orcamentos: Orcamento[];
  materiais: Material[];
  ferramentas: Ferramenta[];
  servicos: Servico[];
  tarefas: Tarefa[];
  projetos: Projeto[];
  lancamentos: Lancamento[];
  proxNumOrc: number;

  setEmpresa: (e: State["empresa"]) => void;
  setLocale: (locale: Locale) => void;
  addCliente: (c: Omit<Cliente, "id" | "criadoEm">) => Cliente;
  updateCliente: (id: string, c: Partial<Cliente>) => void;
  removeCliente: (id: string) => void;

  addOrcamento: (o: Omit<Orcamento, "id" | "numero" | "criadoEm">) => Orcamento;
  updateOrcamento: (id: string, o: Partial<Orcamento>) => void;
  removeOrcamento: (id: string) => void;

  addMaterial: (m: Omit<Material, "id">) => void;
  updateMaterial: (id: string, m: Partial<Material>) => void;
  removeMaterial: (id: string) => void;

  addFerramenta: (f: Omit<Ferramenta, "id">) => void;
  updateFerramenta: (id: string, f: Partial<Ferramenta>) => void;
  removeFerramenta: (id: string) => void;

  addServico: (s: Omit<Servico, "id">) => void;
  updateServico: (id: string, s: Partial<Servico>) => void;
  removeServico: (id: string) => void;

  addProjeto: (p: Omit<Projeto, "id" | "criadoEm" | "fotos">) => Projeto;
  updateProjeto: (id: string, p: Partial<Projeto>) => void;
  removeProjeto: (id: string) => void;
  addFotoProjeto: (id: string, dataUrl: string) => void;

  addTarefa: (t: Omit<Tarefa, "id">) => void;
  toggleTarefa: (id: string) => void;
  removeTarefa: (id: string) => void;

  addLancamento: (l: Omit<Lancamento, "id">) => void;
  removeLancamento: (id: string) => void;
};

const id = () => Math.random().toString(36).slice(2, 10);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      locale: "pt-BR",
      empresa: { nome: "Gerix", cnpj: "", telefone: "", endereco: "" },
      clientes: [],
      orcamentos: [],
      materiais: [],
      ferramentas: [],
      servicos: [],
      tarefas: [],
      projetos: [],
      lancamentos: [],
      proxNumOrc: 1,

      setLocale: (locale) => set({ locale }),
      setEmpresa: (empresa) => set({ empresa }),

      addCliente: (c) => {
        const novo: Cliente = { ...c, id: id(), criadoEm: new Date().toISOString() };
        set({ clientes: [novo, ...get().clientes] });
        return novo;
      },
      updateCliente: (id, c) =>
        set({ clientes: get().clientes.map((x) => (x.id === id ? { ...x, ...c } : x)) }),
      removeCliente: (id) => set({ clientes: get().clientes.filter((x) => x.id !== id) }),

      addOrcamento: (o) => {
        const numero = get().proxNumOrc;
        const novo: Orcamento = { ...o, id: id(), numero, criadoEm: new Date().toISOString() };
        set({ orcamentos: [novo, ...get().orcamentos], proxNumOrc: numero + 1 });
        return novo;
      },
      updateOrcamento: (id, o) =>
        set({ orcamentos: get().orcamentos.map((x) => (x.id === id ? { ...x, ...o } : x)) }),
      removeOrcamento: (id) => set({ orcamentos: get().orcamentos.filter((x) => x.id !== id) }),

      addMaterial: (m) => set({ materiais: [{ ...m, id: id() }, ...get().materiais] }),
      updateMaterial: (id, m) =>
        set({ materiais: get().materiais.map((x) => (x.id === id ? { ...x, ...m } : x)) }),
      removeMaterial: (id) => set({ materiais: get().materiais.filter((x) => x.id !== id) }),

      addFerramenta: (f) => set({ ferramentas: [{ ...f, id: id() }, ...get().ferramentas] }),
      updateFerramenta: (id, f) =>
        set({ ferramentas: get().ferramentas.map((x) => (x.id === id ? { ...x, ...f } : x)) }),
      removeFerramenta: (id) => set({ ferramentas: get().ferramentas.filter((x) => x.id !== id) }),

      addServico: (s) => set({ servicos: [{ ...s, id: id() }, ...get().servicos] }),
      updateServico: (id, s) =>
        set({ servicos: get().servicos.map((x) => (x.id === id ? { ...x, ...s } : x)) }),
      removeServico: (id) => set({ servicos: get().servicos.filter((x) => x.id !== id) }),

      addProjeto: (p) => {
        const novo: Projeto = { ...p, id: id(), criadoEm: new Date().toISOString(), fotos: [] };
        set({ projetos: [novo, ...get().projetos] });
        return novo;
      },
      updateProjeto: (id, p) =>
        set({ projetos: get().projetos.map((x) => (x.id === id ? { ...x, ...p } : x)) }),
      removeProjeto: (id) => set({ projetos: get().projetos.filter((x) => x.id !== id) }),
      addFotoProjeto: (id, dataUrl) =>
        set({
          projetos: get().projetos.map((x) =>
            x.id === id ? { ...x, fotos: [...x.fotos, dataUrl] } : x
          ),
        }),

      addTarefa: (t) => set({ tarefas: [{ ...t, id: id() }, ...get().tarefas] }),
      toggleTarefa: (id) =>
        set({ tarefas: get().tarefas.map((x) => (x.id === id ? { ...x, feita: !x.feita } : x)) }),
      removeTarefa: (id) => set({ tarefas: get().tarefas.filter((x) => x.id !== id) }),

      addLancamento: (l) => set({ lancamentos: [{ ...l, id: id() }, ...get().lancamentos] }),
      removeLancamento: (id) => set({ lancamentos: get().lancamentos.filter((x) => x.id !== id) }),
    }),
    { name: "gerix" }
  )
);

// Helpers
export function calcularOrcamento(o: Orcamento) {
  const subtotal = o.itens.reduce((acc, it) => {
    const areaM2 = (it.largura * it.altura) / 10000; // cm² → m²
    const custo = areaM2 * it.custoMaterial + it.maoDeObra;
    return acc + custo * it.quantidade;
  }, 0);
  const comLucro = subtotal * (1 + (o.margemLucro || 0) / 100);
  const total = comLucro * (1 - (o.desconto || 0) / 100);
  return { subtotal, comLucro, total };
}

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDate = (value: string | number | Date, locale: Locale = "pt-BR") =>
  new Date(value).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR");
