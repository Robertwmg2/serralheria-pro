import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Wrench, Hammer, Calculator, Lock } from "lucide-react";

const IAPage = () => {
  return (
    <AppLayout title="Mestre IA">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="panel p-8 text-center bg-[var(--gradient-glow)] border-primary/30">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-ember shadow-ember mb-4">
            <Sparkles className="h-8 w-8 text-primary-foreground animate-spark" />
          </div>
          <h2 className="font-display text-2xl font-bold">Mestre IA da Oficina</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Um assistente especialista em <strong className="text-foreground">solda, serralheria, caldeiraria, marcenaria, tapeçaria, finanças e administração</strong> — pronto pra tirar suas dúvidas técnicas e te ajudar a gerir o negócio.
          </p>
        </Card>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: Wrench, title: "Soluções técnicas", desc: "Tipos de solda, ligas, eletrodos, espessuras, acabamentos" },
            { icon: Hammer, title: "Métodos de fabricação", desc: "Cortes, dobras, furação, montagem e instalação" },
            { icon: Calculator, title: "Orçamento & precificação", desc: "Margens, custos indiretos, BDI, formação de preço" },
            { icon: Sparkles, title: "Gestão da empresa", desc: "Fluxo de caixa, impostos, atendimento, documentos" },
          ].map((c) => (
            <Card key={c.title} className="panel p-4 hover:border-primary/40 transition-all">
              <c.icon className="h-5 w-5 text-primary mb-2" />
              <h4 className="font-display font-semibold">{c.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            </Card>
          ))}
        </div>

        <Card className="panel p-6 border-dashed">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold">Para ativar o assistente IA</h3>
              <p className="text-sm text-muted-foreground mt-1">
                A IA precisa de um servidor (Lovable Cloud) para conversar de forma segura. Posso ativar agora — é gratuito para começar.
              </p>
              <Button className="mt-3 bg-ember shadow-ember" onClick={() => alert("Diga 'ativar IA' no chat e eu ligo o backend para você 🔥")}>
                Ativar Mestre IA
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default IAPage;
