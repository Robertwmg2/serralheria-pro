import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/lib/store";
import { Plus, Trash2, ListChecks, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const ProjetosPage = () => {
  const { projetos, clientes, tarefas, addProjeto, updateProjeto, removeProjeto, addFotoProjeto, addTarefa, toggleTarefa, removeTarefa } = useStore();
  const [open, setOpen] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ nome: "", clienteId: "", descricao: "", prazo: "", status: "planejamento" as const });

  function salvar() {
    if (!form.nome.trim()) { toast.error("Informe o nome"); return; }
    addProjeto(form);
    toast.success("Projeto criado");
    setForm({ nome: "", clienteId: "", descricao: "", prazo: "", status: "planejamento" });
    setOpen(false);
  }
  function uploadFoto(projetoId: string, file: File) {
    const reader = new FileReader();
    reader.onload = () => addFotoProjeto(projetoId, reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <AppLayout title="Projetos & Tarefas">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{projetos.length} projeto(s)</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-ember shadow-ember"><Plus className="h-4 w-4 mr-1" />Projeto</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo projeto</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
                <div>
                  <Label>Cliente</Label>
                  <Select value={form.clienteId} onValueChange={(v) => setForm({ ...form, clienteId: v })}>
                    <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                    <SelectContent>{clientes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Prazo</Label><Input type="date" value={form.prazo} onChange={(e) => setForm({ ...form, prazo: e.target.value })} /></div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => setForm({ ...form, status: v as "planejamento" | "em-andamento" | "pausado" | "concluido" })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planejamento">Planejamento</SelectItem>
                        <SelectItem value="em-andamento">Em andamento</SelectItem>
                        <SelectItem value="pausado">Pausado</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={salvar} className="bg-ember">Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {projetos.length === 0 ? (
          <Card className="panel p-12 text-center text-muted-foreground"><ListChecks className="h-10 w-10 mx-auto mb-2 opacity-40" />Nenhum projeto criado.</Card>
        ) : (
          <div className="space-y-3">
            {projetos.map((p) => {
              const cliente = clientes.find((c) => c.id === p.clienteId);
              const tasks = tarefas.filter((t) => t.projetoId === p.id);
              const feitas = tasks.filter((t) => t.feita).length;
              return (
                <Card key={p.id} className="panel p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-semibold text-lg">{p.nome}</h3>
                        <Badge variant="outline">{p.status}</Badge>
                      </div>
                      {cliente && <p className="text-sm text-muted-foreground">Cliente: {cliente.nome}</p>}
                      {p.descricao && <p className="text-sm mt-1">{p.descricao}</p>}
                      {p.prazo && <p className="text-xs text-muted-foreground mt-1">Prazo: {new Date(p.prazo).toLocaleDateString("pt-BR")}</p>}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => removeProjeto(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>

                  {/* Tarefas */}
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold">Tarefas ({feitas}/{tasks.length})</h4>
                    </div>
                    <div className="space-y-1.5">
                      {tasks.map((t) => (
                        <div key={t.id} className="flex items-center gap-2 group">
                          <Checkbox checked={t.feita} onCheckedChange={() => toggleTarefa(t.id)} />
                          <span className={`flex-1 text-sm ${t.feita ? "line-through text-muted-foreground" : ""}`}>{t.titulo}</span>
                          <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 h-6 w-6" onClick={() => removeTarefa(t.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <Input placeholder="Adicionar tarefa..." value={novaTarefa[p.id] || ""} onChange={(e) => setNovaTarefa({ ...novaTarefa, [p.id]: e.target.value })} onKeyDown={(e) => {
                          if (e.key === "Enter" && novaTarefa[p.id]?.trim()) {
                            addTarefa({ projetoId: p.id, titulo: novaTarefa[p.id], feita: false });
                            setNovaTarefa({ ...novaTarefa, [p.id]: "" });
                          }
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* Fotos */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5" />Fotos ({p.fotos.length})</h4>
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && uploadFoto(p.id, e.target.files[0])} />
                        <span className="text-xs text-primary hover:underline">+ Adicionar</span>
                      </label>
                    </div>
                    {p.fotos.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {p.fotos.map((f, i) => <img key={i} src={f} alt="" className="aspect-square object-cover rounded-md border border-border" />)}
                      </div>
                    )}
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

export default ProjetosPage;
