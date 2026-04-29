import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { Image as ImageIcon } from "lucide-react";

const PortfolioPage = () => {
  const { projetos } = useStore();
  const fotos = projetos.flatMap((p) => p.fotos.map((f) => ({ src: f, projeto: p.nome })));

  return (
    <AppLayout title="Portfólio">
      {fotos.length === 0 ? (
        <Card className="panel p-12 text-center text-muted-foreground">
          <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
          Adicione fotos aos seus projetos para montar o portfólio.
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {fotos.map((f, i) => (
            <Card key={i} className="panel overflow-hidden group cursor-pointer hover:border-primary/40 transition-all">
              <div className="aspect-square overflow-hidden bg-secondary">
                <img src={f.src} alt={f.projeto} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-2 text-xs text-muted-foreground truncate">{f.projeto}</div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default PortfolioPage;
