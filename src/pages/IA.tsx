import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Wrench, Hammer, Calculator, Lock } from "lucide-react";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";

const IAPage = () => {
  const { locale } = useStore();

  const cards = [
    { icon: Wrench, title: t(locale, "ia.technicalSolutions"), desc: t(locale, "ia.technicalSolutionsDesc") },
    { icon: Hammer, title: t(locale, "ia.fabricationMethods"), desc: t(locale, "ia.fabricationMethodsDesc") },
    { icon: Calculator, title: t(locale, "ia.quotePricing"), desc: t(locale, "ia.quotePricingDesc") },
    { icon: Sparkles, title: t(locale, "ia.businessManagement"), desc: t(locale, "ia.businessManagementDesc") },
  ];

  return (
    <AppLayout title={t(locale, "ia.title")}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="panel p-8 text-center bg-[var(--gradient-glow)] border-primary/30">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-ember shadow-ember mb-4">
            <Sparkles className="h-8 w-8 text-primary-foreground animate-spark" />
          </div>
          <h2 className="font-display text-2xl font-bold">{t(locale, "ia.workshopMaster")}</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{t(locale, "ia.assistantIntro")}</p>
        </Card>

        <div className="grid sm:grid-cols-2 gap-3">
          {cards.map((c) => (
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
              <h3 className="font-semibold">{t(locale, "ia.activateTitle")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t(locale, "ia.activateBody")}</p>
              <Button className="mt-3 bg-ember shadow-ember" onClick={() => alert(t(locale, "common.activateAiPrompt"))}>
                {t(locale, "ia.activateButton")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default IAPage;
