import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Scissors, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";

type Corte = { id: string; tamanho: number; qtd: number };

const CortesPage = () => {
  const { locale } = useStore();
  const [barra, setBarra] = useState(600);
  const [perda, setPerda] = useState(0.3);
  const [cortes, setCortes] = useState<Corte[]>([
    { id: "1", tamanho: 200, qtd: 3 },
    { id: "2", tamanho: 150, qtd: 4 },
    { id: "3", tamanho: 80, qtd: 6 },
  ]);
  const [novo, setNovo] = useState({ tamanho: 100, qtd: 1 });

  function calcular() {
    const lista: number[] = [];
    cortes.forEach((c) => {
      for (let i = 0; i < c.qtd; i++) lista.push(c.tamanho);
    });
    lista.sort((a, b) => b - a);

    const barras: number[][] = [];
    for (const t of lista) {
      let alocado = false;
      for (const b of barras) {
        const usado = b.reduce((s, x) => s + x, 0) + b.length * perda;
        if (usado + perda + t <= barra) {
          b.push(t);
          alocado = true;
          break;
        }
      }
      if (!alocado) barras.push([t]);
    }
    return barras;
  }

  const barras = calcular();
  const totalCortes = cortes.reduce((s, c) => s + c.qtd, 0);
  const totalUsado = cortes.reduce((s, c) => s + c.tamanho * c.qtd, 0);
  const totalDisp = barras.length * barra;
  const sobra = totalDisp - totalUsado - barras.reduce((s, b) => s + b.length * perda, 0);
  const aproveitamento = totalDisp > 0 ? (totalUsado / totalDisp) * 100 : 0;

  return (
    <AppLayout title={t(locale, "cuts.title")}>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="panel p-5 space-y-4">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <Scissors className="h-4 w-4 text-primary" />
            {t(locale, "cuts.settings")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t(locale, "cuts.barLength")}</Label>
              <Input type="number" value={barra} onChange={(e) => setBarra(+e.target.value)} />
            </div>
            <div>
              <Label>{t(locale, "cuts.cutLoss")}</Label>
              <Input type="number" step="0.1" value={perda} onChange={(e) => setPerda(+e.target.value)} />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <h4 className="text-sm font-semibold mb-2">{t(locale, "cuts.pieces")}</h4>
            <div className="space-y-2">
              {cortes.map((c) => (
                <div key={c.id} className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={c.tamanho}
                    onChange={(e) => setCortes(cortes.map((x) => (x.id === c.id ? { ...x, tamanho: +e.target.value } : x)))}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground text-sm">cm x</span>
                  <Input
                    type="number"
                    value={c.qtd}
                    onChange={(e) => setCortes(cortes.map((x) => (x.id === c.id ? { ...x, qtd: +e.target.value } : x)))}
                    className="w-20"
                  />
                  <Button size="icon" variant="ghost" onClick={() => setCortes(cortes.filter((x) => x.id !== c.id))}>
                    x
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 items-center pt-2 border-t border-border">
                <Input type="number" value={novo.tamanho} onChange={(e) => setNovo({ ...novo, tamanho: +e.target.value })} className="flex-1" placeholder="cm" />
                <Input type="number" value={novo.qtd} onChange={(e) => setNovo({ ...novo, qtd: +e.target.value })} className="w-20" />
                <Button
                  size="sm"
                  onClick={() => {
                    setCortes([...cortes, { id: Math.random().toString(36).slice(2), ...novo }]);
                    setNovo({ tamanho: 100, qtd: 1 });
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="panel p-5 space-y-4">
          <h3 className="font-display font-semibold">{t(locale, "cuts.result")}</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-secondary rounded-md p-3">
              <div className="text-2xl font-display font-bold text-primary">{barras.length}</div>
              <div className="text-xs text-muted-foreground">{t(locale, "cuts.bars")}</div>
            </div>
            <div className="bg-secondary rounded-md p-3">
              <div className="text-2xl font-display font-bold">{totalCortes}</div>
              <div className="text-xs text-muted-foreground">{t(locale, "cuts.piecesCount")}</div>
            </div>
            <div className="bg-secondary rounded-md p-3">
              <div className="text-2xl font-display font-bold text-success">{aproveitamento.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">{t(locale, "cuts.use")}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {t(locale, "cuts.totalLeftover")} <strong className="text-foreground">{sobra.toFixed(1)} cm</strong>
          </div>

          <div className="space-y-2 mt-3">
            {barras.map((b, i) => {
              const usado = b.reduce((s, x) => s + x, 0);
              const total = barra;
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{t(locale, "cuts.bar")} {i + 1}</span>
                    <span>{usado}/{total} cm</span>
                  </div>
                  <div className="flex h-7 bg-secondary rounded-md overflow-hidden border border-border">
                    {b.map((t, j) => (
                      <div key={j} className="bg-ember border-r border-background flex items-center justify-center text-[10px] text-primary-foreground font-semibold" style={{ width: `${(t / total) * 100}%` }}>
                        {t}
                      </div>
                    ))}
                    <div className="flex-1 bg-muted/50" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CortesPage;
