import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";
import { t, getLocaleLabel } from "@/lib/i18n";

const ConfigPage = () => {
  const { locale, empresa, setEmpresa, setLocale } = useStore();
  const [form, setForm] = useState(empresa);

  function salvar() {
    setEmpresa(form);
    toast.success(t(locale, "settings.saved"));
  }

  return (
    <AppLayout title={t(locale, "settings.title")}>
      <div className="max-w-2xl">
        <Card className="panel p-6 space-y-5">
          <div>
            <h3 className="font-display font-semibold">{t(locale, "settings.companyData")}</h3>
            <p className="text-sm text-muted-foreground">{t(locale, "settings.companyHint")}</p>
          </div>

          <div className="space-y-2">
            <Label>{t(locale, "settings.language")}</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={locale}
              onChange={(e) => setLocale(e.target.value as "pt-BR" | "en")}
            >
              <option value="pt-BR">{getLocaleLabel("pt-BR")}</option>
              <option value="en">{getLocaleLabel("en")}</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>{t(locale, "settings.name")}</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t(locale, "settings.cnpj")}</Label>
              <Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t(locale, "settings.phone")}</Label>
              <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t(locale, "settings.address")}</Label>
            <Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
          </div>

          <Button onClick={salvar} className="bg-ember shadow-ember">
            {t(locale, "settings.save")}
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ConfigPage;
