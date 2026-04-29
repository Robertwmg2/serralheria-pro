import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, formatBRL } from "@/lib/store";
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const FinanceiroPage = () => {
  const { lancamentos, addLancamento, removeLancamento } = useStore();
  const [form, setForm] = useState({ data: format(new Date(), "yyyy-MM-dd"), descricao: "", categoria: "Geral", tipo: "entrada" as const, valor: 0 });

  function add() {
    if (!form.descricao.trim() || !form.valor) { toast.error("Preencha descrição e valor"); return; }
    addLancamento(form);
    setForm({ ...form, descricao: "", valor: 0 });
    toast.success("Lançamento adicionado");
  }

  const entradas = lancamentos.filter((l) => l.tipo === "entrada").reduce((s, l) => s + l.valor, 0);
  const saidas = lancamentos.filter((l) => l.tipo === "saida").reduce((s, l) => s + l.valor, 0);
  const saldo = entradas - saidas;

  return (
    <AppLayout title="Controle Financeiro">
      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="panel p-5"><div className="text-xs uppercase tracking-wider text-success flex items-center gap-1"><TrendingUp className="h-3 w-3" />Entradas</div><div className="text-2xl font-display font-bold mt-1 text-success">{formatBRL(entradas)}</div></Card>
          <Card className="panel p-5"><div className="text-xs uppercase tracking-wider text-destructive flex items-center gap-1"><TrendingDown className="h-3 w-3" />Saídas</div><div className="text-2xl font-display font-bold mt-1 text-destructive">{formatBRL(saidas)}</div></Card>
          <Card className="panel p-5 border-primary/30"><div className="text-xs uppercase tracking-wider text-primary flex items-center gap-1"><Wallet className="h-3 w-3" />Saldo</div><div className={`text-2xl font-display font-bold mt-1 ${saldo >= 0 ? "text-foreground" : "text-destructive"}`}>{formatBRL(saldo)}</div></Card>
        </div>

        <Card className="panel p-4">
          <h3 className="font-display font-semibold mb-3">Novo lançamento</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            <Input className="col-span-2" placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            <Input placeholder="Categoria" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
            <Select value={form.tipo} onValueChange={(v: any) => setForm({ ...form, tipo: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="entrada">Entrada</SelectItem><SelectItem value="saida">Saída</SelectItem></SelectContent>
            </Select>
            <div className="flex gap-1">
              <Input type="number" placeholder="R$" value={form.valor || ""} onChange={(e) => setForm({ ...form, valor: +e.target.value })} />
              <Button size="icon" onClick={add} className="bg-ember shrink-0"><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>

        <Card className="panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase">
              <tr><th className="text-left p-3">Data</th><th className="text-left p-3">Descrição</th><th className="text-left p-3">Categoria</th><th className="text-right p-3">Valor</th><th></th></tr>
            </thead>
            <tbody>
              {lancamentos.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted-foreground p-8">Sem lançamentos.</td></tr>
              ) : lancamentos.map((l) => (
                <tr key={l.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="p-3 text-muted-foreground">{new Date(l.data).toLocaleDateString("pt-BR")}</td>
                  <td className="p-3">{l.descricao}</td>
                  <td className="p-3 text-muted-foreground">{l.categoria}</td>
                  <td className={`p-3 text-right font-mono font-semibold ${l.tipo === "entrada" ? "text-success" : "text-destructive"}`}>
                    {l.tipo === "entrada" ? "+" : "−"} {formatBRL(l.valor)}
                  </td>
                  <td className="p-3"><Button size="icon" variant="ghost" onClick={() => removeLancamento(l.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AppLayout>
  );
};

export default FinanceiroPage;
