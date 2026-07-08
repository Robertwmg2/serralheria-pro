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
import { useStore, Orcamento, ItemOrcamento, calcularOrcamento, formatBRL } from "@/lib/store";
import { Plus, Trash2, FileText, MessageCircle, Download, Pencil } from "lucide-react";
import { toast } from "sonner";
import { gerarPDFOrcamento, enviarWhatsApp } from "@/lib/pdf";
import { t } from "@/lib/i18n";

const novoItem = (): ItemOrcamento => ({
  id: Math.random().toString(36).slice(2),
  descricao: "",
  largura: 100,
  altura: 100,
  quantidade: 1,
  custoMaterial: 150,
  maoDeObra: 80,
});

const statusColors: Record<Orcamento["status"], string> = {
  rascunho: "bg-muted text-muted-foreground",
  enviado: "bg-accent/20 text-accent",
  aprovado: "bg-success/20 text-success",
  recusado: "bg-destructive/20 text-destructive",
};

const OrcamentosPage = () => {
  const { locale, orcamentos, clientes, empresa, addOrcamento, updateOrcamento, removeOrcamento } = useStore();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Orcamento, "id" | "numero" | "criadoEm">>({
    clienteId: "",
    titulo: "",
    itens: [novoItem()],
    margemLucro: 30,
    desconto: 0,
    observacoes: "",
    status: "rascunho",
  });

  function abrirNovo() {
    setEditId(null);
    setForm({ clienteId: "", titulo: "", itens: [novoItem()], margemLucro: 30, desconto: 0, observacoes: "", status: "rascunho" });
    setOpen(true);
  }

  function abrirEditar(o: Orcamento) {
    setEditId(o.id);
    setForm({ clienteId: o.clienteId, titulo: o.titulo, itens: o.itens, margemLucro: o.margemLucro, desconto: o.desconto, observacoes: o.observacoes, status: o.status });
    setOpen(true);
  }

  function salvar() {
    if (!form.titulo.trim()) {
      toast.error(t(locale, "quotes.mandatoryTitle"));
      return;
    }
    if (editId) {
      updateOrcamento(editId, form);
      toast.success(t(locale, "quotes.updated"));
    } else {
      addOrcamento(form);
      toast.success(t(locale, "quotes.created"));
    }
    setOpen(false);
  }

  function updateItem(id: string, patch: Partial<ItemOrcamento>) {
    setForm({ ...form, itens: form.itens.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  }

  function removerItem(id: string) {
    setForm({ ...form, itens: form.itens.filter((i) => i.id !== id) });
  }

  function previaTotal() {
    return calcularOrcamento({ ...form, id: "", numero: 0, criadoEm: "" } as Orcamento).total;
  }

  function exportar(o: Orcamento) {
    const cliente = clientes.find((c) => c.id === o.clienteId);
    gerarPDFOrcamento(o, cliente, empresa, locale);
    toast.success(t(locale, "quotes.pdfReady"));
  }

  function whats(o: Orcamento) {
    const cliente = clientes.find((c) => c.id === o.clienteId);
    if (!cliente) {
      toast.error(t(locale, "quotes.selectClient"));
      return;
    }
    const total = calcularOrcamento(o).total;
    const msg = `${t(locale, "quotes.whatsappHello")} ${cliente.nome}, ${t(locale, "quotes.whatsappHereIs")} Nº ${String(o.numero).padStart(4, "0")} - ${o.titulo}\n${t(locale, "quotes.whatsappTotal")}: ${formatBRL(total)}\n\n${empresa.nome}`;
    enviarWhatsApp(cliente.telefone, msg);
  }

  return (
    <AppLayout title={t(locale, "quotes.title")}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {orcamentos.length} {t(locale, "quotes.count")}
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={abrirNovo} className="bg-ember shadow-ember">
                <Plus className="h-4 w-4 mr-1" /> {t(locale, "quotes.new")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editId ? t(locale, "quotes.edit") : t(locale, "quotes.create")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>{t(locale, "quotes.client")}</Label>
                    <Select value={form.clienteId} onValueChange={(v) => setForm({ ...form, clienteId: v })}>
                      <SelectTrigger><SelectValue placeholder={t(locale, "quotes.select")} /></SelectTrigger>
                      <SelectContent>
                        {clientes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t(locale, "quotes.titleField")}</Label>
                    <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder={t(locale, "quotes.placeholder")} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>{t(locale, "quotes.items")}</Label>
                    <Button size="sm" variant="outline" onClick={() => setForm({ ...form, itens: [...form.itens, novoItem()] })}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> {t(locale, "quotes.item")}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {form.itens.map((it) => (
                      <Card key={it.id} className="panel p-3 space-y-2">
                        <div className="flex gap-2">
                          <Input className="flex-1" placeholder={t(locale, "quotes.description")} value={it.descricao} onChange={(e) => updateItem(it.id, { descricao: e.target.value })} />
                          <Button size="icon" variant="ghost" onClick={() => removerItem(it.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                          <div><Label className="text-xs">{t(locale, "quotes.width")}</Label><Input type="number" value={it.largura} onChange={(e) => updateItem(it.id, { largura: +e.target.value })} /></div>
                          <div><Label className="text-xs">{t(locale, "quotes.height")}</Label><Input type="number" value={it.altura} onChange={(e) => updateItem(it.id, { altura: +e.target.value })} /></div>
                          <div><Label className="text-xs">{t(locale, "quotes.qty")}</Label><Input type="number" value={it.quantidade} onChange={(e) => updateItem(it.id, { quantidade: +e.target.value })} /></div>
                          <div><Label className="text-xs">{t(locale, "quotes.materialCost")}</Label><Input type="number" value={it.custoMaterial} onChange={(e) => updateItem(it.id, { custoMaterial: +e.target.value })} /></div>
                          <div><Label className="text-xs">{t(locale, "quotes.labor")}</Label><Input type="number" value={it.maoDeObra} onChange={(e) => updateItem(it.id, { maoDeObra: +e.target.value })} /></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div><Label>{t(locale, "quotes.margin")}</Label><Input type="number" value={form.margemLucro} onChange={(e) => setForm({ ...form, margemLucro: +e.target.value })} /></div>
                  <div><Label>{t(locale, "quotes.discount")}</Label><Input type="number" value={form.desconto} onChange={(e) => setForm({ ...form, desconto: +e.target.value })} /></div>
                  <div>
                    <Label>{t(locale, "quotes.status")}</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Orcamento["status"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rascunho">{t(locale, "quotes.statusOptions.rascunho")}</SelectItem>
                        <SelectItem value="enviado">{t(locale, "quotes.statusOptions.enviado")}</SelectItem>
                        <SelectItem value="aprovado">{t(locale, "quotes.statusOptions.aprovado")}</SelectItem>
                        <SelectItem value="recusado">{t(locale, "quotes.statusOptions.recusado")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>{t(locale, "quotes.notes")}</Label>
                  <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} rows={3} />
                </div>

                <Card className="panel p-4 bg-ember/10 border-primary/30">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t(locale, "quotes.estimatedTotal")}</span>
                    <span className="font-display text-2xl font-bold text-ember">{formatBRL(previaTotal())}</span>
                  </div>
                </Card>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t(locale, "quotes.cancel")}</Button>
                <Button onClick={salvar} className="bg-ember">{t(locale, "quotes.save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {orcamentos.length === 0 ? (
          <Card className="panel p-12 text-center text-muted-foreground">{t(locale, "quotes.empty")}</Card>
        ) : (
          <div className="grid gap-3">
            {orcamentos.map((o) => {
              const cliente = clientes.find((c) => c.id === o.clienteId);
              const total = calcularOrcamento(o).total;
              return (
                <Card key={o.id} className="panel p-4 hover:border-primary/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-mono text-sm text-muted-foreground">Nº {String(o.numero).padStart(4, "0")}</span>
                        <Badge className={statusColors[o.status]}>{t(locale, `quotes.statusOptions.${o.status}`)}</Badge>
                      </div>
                      <h3 className="font-display font-semibold text-lg mt-1 truncate">{o.titulo}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cliente?.nome || t(locale, "quotes.noClient")} • {new Date(o.criadoEm).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-ember">{formatBRL(total)}</div>
                      <div className="text-xs text-muted-foreground">{o.itens.length} {t(locale, "quotes.itemCount")}</div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => exportar(o)} title="PDF"><Download className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => whats(o)} title="WhatsApp"><MessageCircle className="h-4 w-4 text-success" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => abrirEditar(o)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => { removeOrcamento(o.id); toast.success(t(locale, "common.removed")); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default OrcamentosPage;
