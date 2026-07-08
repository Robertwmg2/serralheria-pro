import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useStore, formatBRL, calcularOrcamento, formatDate } from "@/lib/store";
import { Users, FileText, Boxes, Calendar, TrendingUp, Flame, Wrench, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { differenceInDays } from "date-fns";
import { t } from "@/lib/i18n";

const Dashboard = () => {
  const { locale, clientes, orcamentos, materiais, ferramentas, servicos, lancamentos } = useStore();

  const totalOrcado = orcamentos.reduce((acc, o) => acc + calcularOrcamento(o).total, 0);
  const aprovados = orcamentos.filter((o) => o.status === "aprovado");
  const receita = aprovados.reduce((acc, o) => acc + calcularOrcamento(o).total, 0);

  const entradas = lancamentos.filter((l) => l.tipo === "entrada").reduce((a, l) => a + l.valor, 0);
  const saidas = lancamentos.filter((l) => l.tipo === "saida").reduce((a, l) => a + l.valor, 0);

  const hoje = new Date();
  const ferramentasAlerta = ferramentas.filter(
    (f) => differenceInDays(new Date(f.proximaManutencao), hoje) <= 7
  );
  const materiaisVencendo = materiais.filter(
    (m) => m.validade && differenceInDays(new Date(m.validade), hoje) <= 30
  );
  const proxServicos = servicos
    .filter((s) => s.status === "agendado" && new Date(s.data) >= hoje)
    .sort((a, b) => +new Date(a.data) - +new Date(b.data))
    .slice(0, 5);

  const stats = [
    { label: t(locale, "dashboard.clients"), value: clientes.length, icon: Users, link: "/clientes", color: "text-primary" },
    { label: t(locale, "dashboard.budgets"), value: orcamentos.length, icon: FileText, link: "/orcamentos", color: "text-accent" },
    { label: t(locale, "dashboard.materials"), value: materiais.length, icon: Boxes, link: "/materiais", color: "text-success" },
    { label: t(locale, "dashboard.scheduled"), value: proxServicos.length, icon: Calendar, link: "/agenda", color: "text-primary-glow" },
  ];

  return (
    <AppLayout title={t(locale, "app.dashboard")}>
      <div className="space-y-6">
        <Card className="panel relative overflow-hidden p-6 md:p-8 border-primary/30">
          <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="hidden md:flex h-14 w-14 items-center justify-center rounded-lg bg-ember shadow-ember">
              <Flame className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                {t(locale, "dashboard.welcomeLead")} <span className="text-ember">{t(locale, "dashboard.workshop")}</span>
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {t(locale, "dashboard.subtitle")}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link key={s.label} to={s.link}>
              <Card className="panel p-4 hover:border-primary/40 transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                    <div className="text-3xl font-display font-bold mt-1">{s.value}</div>
                  </div>
                  <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="panel p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{t(locale, "dashboard.totalQuoted")}</div>
            <div className="text-2xl font-display font-bold mt-1">{formatBRL(totalOrcado)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {orcamentos.length} {t(locale, "dashboard.budgetsCount")}
            </div>
          </Card>
          <Card className="panel p-5 border-success/30">
            <div className="text-xs uppercase tracking-wider text-success">{t(locale, "dashboard.approved")}</div>
            <div className="text-2xl font-display font-bold mt-1">{formatBRL(receita)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {aprovados.length} {t(locale, "dashboard.approvedCount")}
            </div>
          </Card>
          <Card className="panel p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{t(locale, "dashboard.cash")}</div>
            <div className="text-2xl font-display font-bold mt-1 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {formatBRL(entradas - saidas)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              + {formatBRL(entradas)} / - {formatBRL(saidas)}
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="font-display font-semibold">{t(locale, "dashboard.alerts")}</h3>
            </div>
            {ferramentasAlerta.length === 0 && materiaisVencendo.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t(locale, "dashboard.noAlerts")}</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {ferramentasAlerta.map((f) => (
                  <li key={f.id} className="flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 text-warning" />
                    {t(locale, "dashboard.maintenance")}: <strong>{f.nome}</strong> - {formatDate(f.proximaManutencao, locale)}
                  </li>
                ))}
                {materiaisVencendo.map((m) => (
                  <li key={m.id} className="flex items-center gap-2">
                    <Boxes className="h-3.5 w-3.5 text-warning" />
                    {t(locale, "dashboard.expiry")}: <strong>{m.nome}</strong> - {formatDate(m.validade!, locale)}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold">{t(locale, "dashboard.nextServices")}</h3>
            </div>
            {proxServicos.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t(locale, "dashboard.nothingScheduled")}</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {proxServicos.map((s) => (
                  <li key={s.id} className="flex justify-between border-b border-border/50 pb-1.5">
                    <span>{s.titulo}</span>
                    <span className="text-muted-foreground">
                      {formatDate(s.data, locale)} {s.hora || ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
