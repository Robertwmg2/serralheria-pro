import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { Plus, Trash2, Wrench, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { addDays, differenceInDays, format } from "date-fns";

const FerramentasPage = () => {
  const { ferramentas, addFerramenta, updateFerramenta, removeFerramenta } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", intervaloDias: 90, ultimaManutencao: format(new Date(), "yyyy-MM-dd"), obs: "" });

  function salvar() {
    if (!form.nome.trim()) { toast.error("Informe o nome"); return; }
    const proxima = format(addDays(new Date(form.ultimaManutencao), form.intervaloDias), "yyyy-MM-dd");
    addFerramenta({ nome: form.nome, intervaloDias: form.intervaloDias, ultimaManutencao: form.ultimaManutencao, proximaManutencao: proxima, obs: form.obs });
    toast.success("Ferramenta cadastrada");
    setForm({ nome: "", intervaloDias: 90, ultimaManutencao: format(new Date(), "yyyy-MM-dd"), obs: "" });
    setOpen(false);
  }
  function fazerManutencao(id: string, intervalo: number) {
    const hoje = format(new Date(), "yyyy-MM-dd");
    updateFerramenta(id, { ultimaManutencao: hoje, proximaManutencao: format(addDays(new Date(), intervalo), "yyyy-MM-dd") });
    toast.success("Manutenção registrada");
  }

  return (
    <AppLayout title="Ferramentas & Manutenção">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{ferramentas.length} ferramenta(s)</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-ember shadow-ember"><Plus className="h-4 w-4 mr-1" />Ferramenta</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nova ferramenta</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Furadeira Bosch" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Última manutenção</Label><Input type="date" value={form.ultimaManutencao} onChange={(e) => setForm({ ...form, ultimaManutencao: e.target.value })} /></div>
                  <div><Label>Intervalo (dias)</Label><Input type="number" value={form.intervaloDias} onChange={(e) => setForm({ ...form, intervaloDias: +e.target.value })} /></div>
                </div>
                <div><Label>Observações</Label><Input value={form.obs} onChange={(e) => setForm({ ...form, obs: e.target.value })} /></div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={salvar} className="bg-ember">Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {ferramentas.length === 0 ? (
          <Card className="panel p-12 text-center text-muted-foreground"><Wrench className="h-10 w-10 mx-auto mb-2 opacity-40" />Nenhuma ferramenta cadastrada.</Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {ferramentas.map((f) => {
              const dias = differenceInDays(new Date(f.proximaManutencao), new Date());
              const alerta = dias <= 7;
              const vencida = dias < 0;
              return (
                <Card key={f.id} className="panel p-4 hover:border-primary/40 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold flex items-center gap-2"><Wrench className="h-4 w-4 text-primary" />{f.nome}</h3>
                      <div className="mt-2 text-sm space-y-1">
                        <div className="text-muted-foreground">Última: {f.ultimaManutencao ? new Date(f.ultimaManutencao).toLocaleDateString("pt-BR") : "—"}</div>
                        <div className="flex items-center gap-2">Próxima: <strong>{new Date(f.proximaManutencao).toLocaleDateString("pt-BR")}</strong>
                          {vencida ? <Badge className="bg-destructive/20 text-destructive"><AlertTriangle className="h-3 w-3 mr-1" />Vencida</Badge>
                            : alerta ? <Badge className="bg-warning/20 text-warning">{dias}d</Badge>
                            : <Badge className="bg-success/20 text-success">{dias}d</Badge>}
                        </div>
                        {f.obs && <div className="text-xs text-muted-foreground">{f.obs}</div>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="outline" onClick={() => fazerManutencao(f.id, f.intervaloDias)}><CheckCircle2 className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => removeFerramenta(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
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

export default FerramentasPage;
