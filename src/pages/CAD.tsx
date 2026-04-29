import { useRef, useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Square, Minus, Trash2, Download, MousePointer } from "lucide-react";
import { toast } from "sonner";

type Shape =
  | { id: string; type: "rect"; x: number; y: number; w: number; h: number }
  | { id: string; type: "line"; x1: number; y1: number; x2: number; y2: number };

const CADPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<"select" | "rect" | "line">("rect");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [drawing, setDrawing] = useState<Shape | null>(null);
  const [escala, setEscala] = useState(1); // 1 px = 1 cm

  function redraw() {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    // grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < c.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke(); }
    for (let y = 0; y < c.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke(); }
    // axes
    ctx.strokeStyle = "rgba(232,93,58,0.2)";
    ctx.beginPath(); ctx.moveTo(0, c.height / 2); ctx.lineTo(c.width, c.height / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(c.width / 2, 0); ctx.lineTo(c.width / 2, c.height); ctx.stroke();

    const all = drawing ? [...shapes, drawing] : shapes;
    all.forEach((s) => {
      ctx.strokeStyle = "hsl(16, 88%, 54%)";
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(232,93,58,0.08)";
      if (s.type === "rect") {
        ctx.fillRect(s.x, s.y, s.w, s.h);
        ctx.strokeRect(s.x, s.y, s.w, s.h);
        ctx.fillStyle = "hsl(30, 15%, 92%)";
        ctx.font = "11px Inter";
        ctx.fillText(`${Math.abs(Math.round(s.w / escala))}cm`, s.x + s.w / 2 - 12, s.y - 4);
        ctx.save(); ctx.translate(s.x - 6, s.y + s.h / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${Math.abs(Math.round(s.h / escala))}cm`, -10, 0); ctx.restore();
      } else if (s.type === "line") {
        ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke();
        const len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
        ctx.fillStyle = "hsl(30, 15%, 92%)"; ctx.font = "11px Inter";
        ctx.fillText(`${Math.round(len / escala)}cm`, (s.x1 + s.x2) / 2 + 5, (s.y1 + s.y2) / 2 - 5);
      }
    });
  }
  useEffect(redraw, [shapes, drawing, escala]);

  function getPos(e: React.MouseEvent) {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function onDown(e: React.MouseEvent) {
    if (tool === "select") return;
    const { x, y } = getPos(e);
    const id = Math.random().toString(36).slice(2);
    if (tool === "rect") setDrawing({ id, type: "rect", x, y, w: 0, h: 0 });
    else setDrawing({ id, type: "line", x1: x, y1: y, x2: x, y2: y });
  }
  function onMove(e: React.MouseEvent) {
    if (!drawing) return;
    const { x, y } = getPos(e);
    if (drawing.type === "rect") setDrawing({ ...drawing, w: x - drawing.x, h: y - drawing.y });
    else setDrawing({ ...drawing, x2: x, y2: y });
  }
  function onUp() {
    if (drawing) { setShapes([...shapes, drawing]); setDrawing(null); }
  }
  function exportar() {
    const url = canvasRef.current!.toDataURL("image/png");
    const a = document.createElement("a"); a.href = url; a.download = "croqui.png"; a.click();
    toast.success("Croqui exportado");
  }

  return (
    <AppLayout title="Croqui CAD">
      <div className="grid lg:grid-cols-[200px_1fr] gap-4">
        <Card className="panel p-3 space-y-2">
          <h3 className="text-sm font-semibold mb-2">Ferramentas</h3>
          <Button variant={tool === "select" ? "default" : "outline"} className="w-full justify-start" onClick={() => setTool("select")}><MousePointer className="h-4 w-4 mr-2" />Selecionar</Button>
          <Button variant={tool === "rect" ? "default" : "outline"} className="w-full justify-start" onClick={() => setTool("rect")}><Square className="h-4 w-4 mr-2" />Retângulo</Button>
          <Button variant={tool === "line" ? "default" : "outline"} className="w-full justify-start" onClick={() => setTool("line")}><Minus className="h-4 w-4 mr-2" />Linha</Button>
          <div className="border-t border-border pt-2 mt-3 space-y-2">
            <div><Label className="text-xs">Escala (px = 1 cm)</Label><Input type="number" value={escala} onChange={(e) => setEscala(+e.target.value || 1)} /></div>
            <Button variant="outline" className="w-full" onClick={() => setShapes([])}><Trash2 className="h-4 w-4 mr-2" />Limpar</Button>
            <Button className="w-full bg-ember" onClick={exportar}><Download className="h-4 w-4 mr-2" />Exportar</Button>
          </div>
          <p className="text-xs text-muted-foreground pt-2">{shapes.length} forma(s)</p>
        </Card>

        <Card className="panel p-2 overflow-auto">
          <canvas ref={canvasRef} width={800} height={500} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} className="bg-secondary rounded-md cursor-crosshair w-full" />
        </Card>
      </div>
    </AppLayout>
  );
};

export default CADPage;
