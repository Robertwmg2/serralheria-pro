import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useStore, formatBRL } from "@/lib/store";
import { Plus, Trash2, Boxes, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

const empty = { nome: "", tipo: "metal" as const, unidade: "kg", estoque: 0, precoUnit: 0, duracaoDias: 0, validade: "", fornecedor: "" };

const MateriaisPage = () => {
  const { materiais, addMaterial, removeMaterial } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(empty);

  function salvar() {
    if (!form.nome.trim()) { toast.error("Informe o nome"); return; }
    addMaterial({ ...form, validade: form.validade || undefined, duracaoDias: form.duracaoDias || undefined });
    toast.success("Material cadastrado");
    setForm(empty); setOpen(false);
  }

  return (
    <AppLayout title="Materiais & Consumíveis">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{materiais.length} item(ns) no estoque</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-ember shadow-ember"><Plus className="h-4 w-4 mr-1" />Material</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo material</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Tubo metalon 30x30" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Tipo</Label>
                    <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metal">Metal</SelectItem>
                        <SelectItem value="madeira">Madeira</SelectItem>
                        <SelectItem value="consumivel">Consumível</SelectItem>
                        <SelectItem value="tinta">Tinta</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Unidade</Label><Input value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })} placeholder="kg, m, un, L" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Estoque</Label><Input type="number" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: +e.target.value })} /></div>
                  <div><Label>Preço unit. (R$)</Label><Input type="number" value={form.precoUnit} onChange={(e) => setForm({ ...form, precoUnit: +e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Duração (dias)</Label><Input type="number" value={form.duracaoDias} onChange={(e) => setForm({ ...form, duracaoDias: +e.target.value })} /></div>
                  <div><Label>Validade</Label><Input type="date" value={form.validade} onChange={(e) => setForm({ ...form, validade: e.target.value })} /></div>
                </div>
                <div><Label>Fornecedor</Label><Input value={form.fornecedor} onChange={(e) => setForm({ ...form, fornecedor: e.target.value })} /></div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={salvar} className="bg-ember">Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {materiais.length === 0 ? (
          <Card className="panel p-12 text-center text-muted-foreground"><Boxes className="h-10 w-10 mx-auto mb-2 opacity-40" />Nenhum material cadastrado.</Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {materiais.map((m) => {
              const venc = m.validade && differenceInDays(new Date(m.validade), new Date()) <= 30;
              return (
                <Card key={m.id} className="panel p-4 hover:border-primary/40 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2"><Badge variant="outline" className="capitalize">{m.tipo}</Badge>{venc && <Badge className="bg-warning/20 text-warning"><AlertTriangle className="h-3 w-3 mr-1" />Vence</Badge>}</div>
                      <h3 className="font-display font-semibold mt-2 truncate">{m.nome}</h3>
                      <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        <div>Estoque: <strong className="text-foreground">{m.estoque} {m.unidade}</strong></div>
                        <div>Preço: <strong className="text-foreground">{formatBRL(m.precoUnit)}/{m.unidade}</strong></div>
                        {m.duracaoDias ? <div>Dura ~{m.duracaoDias} dias</div> : null}
                        {m.validade && <div>Validade: {new Date(m.validade).toLocaleDateString("pt-BR")}</div>}
                        {m.fornecedor && <div>Forn.: {m.fornecedor}</div>}
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeMaterial(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MateriaisPage;
