import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useStore, type Servico } from "@/lib/store";
import { Plus, Trash2, Calendar, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { t } from "@/lib/i18n";

const statusColors: Record<string, string> = {
  agendado: "bg-accent/20 text-accent",
  "em-andamento": "bg-primary/20 text-primary",
  concluido: "bg-success/20 text-success",
  cancelado: "bg-destructive/20 text-destructive",
};

const AgendaPage = () => {
  const { locale, servicos, clientes, addServico, updateServico, removeServico } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    clienteId: "",
    data: format(new Date(), "yyyy-MM-dd"),
    hora: "09:00",
    local: "",
    status: "agendado" as const,
    obs: "",
  });

  function salvar() {
    if (!form.titulo.trim()) {
      toast.error(t(locale, "agenda.errorTitle"));
      return;
    }
    addServico(form);
    toast.success(t(locale, "agenda.success"));
    setOpen(false);
  }

  const ordenados = [...servicos].sort((a, b) => +new Date(a.data) - +new Date(b.data));

  return (
    <AppLayout title={t(locale, "agenda.title")}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {servicos.length} {t(locale, "agenda.count")}
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-ember shadow-ember">
                <Plus className="h-4 w-4 mr-1" />
                {t(locale, "agenda.add")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t(locale, "agenda.new")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>{t(locale, "agenda.titleField")}</Label>
                  <Input
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    placeholder={t(locale, "agenda.placeholder")}
                  />
                </div>
                <div>
                  <Label>{t(locale, "agenda.client")}</Label>
                  <Select value={form.clienteId} onValueChange={(v) => setForm({ ...form, clienteId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t(locale, "common.select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{t(locale, "agenda.date")}</Label>
                    <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t(locale, "agenda.time")}</Label>
                    <Input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>{t(locale, "agenda.location")}</Label>
                  <Input value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} />
                </div>
                <div>
                  <Label>{t(locale, "agenda.notes")}</Label>
                  <Textarea value={form.obs} onChange={(e) => setForm({ ...form, obs: e.target.value })} rows={2} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t(locale, "agenda.cancel")}
                </Button>
                <Button onClick={salvar} className="bg-ember">
                  {t(locale, "agenda.save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {ordenados.length === 0 ? (
          <Card className="panel p-12 text-center text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-2 opacity-40" />
            {t(locale, "agenda.empty")}
          </Card>
        ) : (
          <div className="space-y-2">
            {ordenados.map((s) => {
              const cliente = clientes.find((c) => c.id === s.clienteId);
              return (
                <Card key={s.id} className="panel p-4 flex items-center gap-4 hover:border-primary/40 transition-all">
                  <div className="flex flex-col items-center justify-center bg-secondary rounded-md p-3 min-w-[70px] border border-border">
                    <div className="font-display font-bold text-2xl text-primary">{format(new Date(s.data), "dd")}</div>
                    <div className="text-xs uppercase text-muted-foreground">{format(new Date(s.data), "MMM")}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{s.titulo}</h3>
                      <Badge className={statusColors[s.status]}>{t(locale, `agenda.status.${s.status}`)}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-3 flex-wrap mt-1">
                      {cliente && <span>{cliente.nome}</span>}
                      {s.hora && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {s.hora}
                        </span>
                      )}
                      {s.local && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {s.local}
                        </span>
                      )}
                    </div>
                  </div>
                  <Select value={s.status} onValueChange={(v) => updateServico(s.id, { status: v as Servico["status"] })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendado">{t(locale, "agenda.status.agendado")}</SelectItem>
                      <SelectItem value="em-andamento">{t(locale, "agenda.status.em-andamento")}</SelectItem>
                      <SelectItem value="concluido">{t(locale, "agenda.status.concluido")}</SelectItem>
                      <SelectItem value="cancelado">{t(locale, "agenda.status.cancelado")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="ghost" onClick={() => removeServico(s.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AgendaPage;
