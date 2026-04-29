import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";

const ConfigPage = () => {
  const { empresa, setEmpresa } = useStore();
  const [form, setForm] = useState(empresa);

  function salvar() { setEmpresa(form); toast.success("Dados salvos"); }

  return (
    <AppLayout title="Configurações">
      <div className="max-w-2xl">
        <Card className="panel p-6 space-y-4">
          <h3 className="font-display font-semibold">Dados da empresa</h3>
          <p className="text-sm text-muted-foreground">Aparecem no cabeçalho dos PDFs de orçamento.</p>
          <div><Label>Nome / Razão social</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>CNPJ</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} /></div>
            <div><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
          </div>
          <div><Label>Endereço</Label><Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} /></div>
          <Button onClick={salvar} className="bg-ember shadow-ember">Salvar</Button>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ConfigPage;
