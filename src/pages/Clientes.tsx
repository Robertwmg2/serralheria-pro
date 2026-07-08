import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useStore, Cliente } from "@/lib/store";
import { Plus, Pencil, Trash2, Phone, Mail, MapPin, Search, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { enviarWhatsApp } from "@/lib/pdf";
import { t } from "@/lib/i18n";

const emptyCliente = { nome: "", telefone: "", email: "", endereco: "", obs: "" };

const ClientesPage = () => {
  const { locale, clientes, addCliente, updateCliente, removeCliente } = useStore();
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [form, setForm] = useState(emptyCliente);
  const [busca, setBusca] = useState("");

  const filtered = clientes.filter(
    (c) => c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca)
  );

  function abrirNovo() {
    setEditando(null);
    setForm(emptyCliente);
    setOpen(true);
  }
  function abrirEditar(c: Cliente) {
    setEditando(c);
    setForm({
      nome: c.nome,
      telefone: c.telefone,
      email: c.email || "",
      endereco: c.endereco || "",
      obs: c.obs || "",
    });
    setOpen(true);
  }
  function salvar() {
    if (!form.nome.trim() || !form.telefone.trim()) {
      toast.error(t(locale, "clients.mandatory"));
      return;
    }
    if (editando) {
      updateCliente(editando.id, form);
      toast.success(t(locale, "clients.updated"));
    } else {
      addCliente(form);
      toast.success(t(locale, "clients.created"));
    }
    setOpen(false);
  }

  return (
    <AppLayout title={t(locale, "clients.title")}>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t(locale, "clients.search")}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={abrirNovo} className="bg-ember hover:opacity-90 shadow-ember">
                <Plus className="h-4 w-4 mr-1" /> {t(locale, "clients.new")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editando ? t(locale, "clients.edit") : t(locale, "clients.create")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>{t(locale, "clients.name")}</Label>
                  <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                </div>
                <div>
                  <Label>{t(locale, "clients.phone")}</Label>
                  <Input
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label>{t(locale, "clients.email")}</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label>{t(locale, "clients.address")}</Label>
                  <Input
                    value={form.endereco}
                    onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t(locale, "clients.notes")}</Label>
                  <Textarea value={form.obs} onChange={(e) => setForm({ ...form, obs: e.target.value })} rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t(locale, "clients.cancel")}
                </Button>
                <Button onClick={salvar} className="bg-ember">
                  {t(locale, "clients.save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {filtered.length === 0 ? (
          <Card className="panel p-12 text-center text-muted-foreground">{t(locale, "clients.empty")}</Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <Card key={c.id} className="panel p-4 hover:border-primary/40 transition-all">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold text-lg truncate">{c.nome}</h3>
                    <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        {c.telefone}
                      </div>
                      {c.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          {c.email}
                        </div>
                      )}
                      {c.endereco && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          {c.endereco}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mt-3 pt-3 border-t border-border">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => enviarWhatsApp(c.telefone, `${t(locale, "clients.whatsappHello")} ${c.nome},`)}
                  >
                    <MessageCircle className="h-4 w-4 text-success" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => abrirEditar(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      removeCliente(c.id);
                      toast.success(t(locale, "clients.removed"));
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ClientesPage;
