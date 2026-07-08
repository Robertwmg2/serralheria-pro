import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatBRL } from "@/lib/store";
import { TrendingUp, Percent } from "lucide-react";
import { t } from "@/lib/i18n";
import { useStore } from "@/lib/store";

const SimuladorPage = () => {
  const { locale } = useStore();
  const [custo, setCusto] = useState(1000);
  const [margem, setMargem] = useState(40);
  const [desconto, setDesconto] = useState(0);

  const comLucro = custo * (1 + margem / 100);
  const final = comLucro * (1 - desconto / 100);
  const lucro = final - custo;
  const lucroPct = custo > 0 ? (lucro / custo) * 100 : 0;

  return (
    <AppLayout title={t(locale, "simulator.title")}>
      <div className="grid lg:grid-cols-2 gap-4 max-w-5xl">
        <Card className="panel p-6 space-y-5">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            {t(locale, "simulator.parameters")}
          </h3>

          <div>
            <Label>{t(locale, "simulator.totalCost")}</Label>
            <Input type="number" value={custo} onChange={(e) => setCusto(+e.target.value)} className="mt-1" />
          </div>

          <div>
            <div className="flex justify-between">
              <Label>{t(locale, "simulator.margin")}</Label>
              <span className="text-primary font-semibold">{margem}%</span>
            </div>
            <Slider value={[margem]} onValueChange={([v]) => setMargem(v)} min={0} max={200} step={1} className="mt-2" />
          </div>

          <div>
            <div className="flex justify-between">
              <Label>{t(locale, "simulator.discount")}</Label>
              <span className="text-warning font-semibold">{desconto}%</span>
            </div>
            <Slider value={[desconto]} onValueChange={([v]) => setDesconto(v)} min={0} max={50} step={1} className="mt-2" />
          </div>
        </Card>

        <Card className="panel p-6 bg-[var(--gradient-glow)] border-primary/30 space-y-3">
          <h3 className="font-display font-semibold">{t(locale, "simulator.result")}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">{t(locale, "simulator.cost")}</span>
              <span className="font-mono">{formatBRL(custo)}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">+ {t(locale, "simulator.margin")} ({margem}%)</span>
              <span className="font-mono text-success">{formatBRL(comLucro - custo)}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">{t(locale, "simulator.gross")}</span>
              <span className="font-mono">{formatBRL(comLucro)}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">- {t(locale, "simulator.discount")} ({desconto}%)</span>
              <span className="font-mono text-warning">-{formatBRL(comLucro - final)}</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-primary/30">
            <div className="text-xs uppercase text-muted-foreground">{t(locale, "simulator.final")}</div>
            <div className="font-display text-4xl font-bold text-ember">{formatBRL(final)}</div>
          </div>
          <div className="pt-2">
            <div className="text-xs text-muted-foreground">{t(locale, "simulator.realProfit")}</div>
            <div className="font-display text-2xl font-bold text-success flex items-center gap-2">
              {formatBRL(lucro)} <Percent className="h-4 w-4" />
              <span className="text-sm">{lucroPct.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SimuladorPage;
