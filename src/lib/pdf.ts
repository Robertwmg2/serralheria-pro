import jsPDF from "jspdf";
import type { Locale } from "./i18n";
import { Cliente, Orcamento, calcularOrcamento, formatBRL } from "./store";

export function gerarPDFOrcamento(
  o: Orcamento,
  cliente: Cliente | undefined,
  empresa: { nome: string; cnpj: string; telefone: string; endereco: string },
  locale: Locale = "pt-BR"
) {
  const isEn = locale === "en";
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 18;

  doc.setFillColor(232, 93, 58);
  doc.rect(0, 0, pageW, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(empresa.nome || "Serralheria", margin, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(empresa.telefone || "", pageW - margin, 12, { align: "right" });
  doc.text(empresa.cnpj ? `CNPJ: ${empresa.cnpj}` : "", pageW - margin, 18, { align: "right" });
  doc.text(empresa.endereco || "", pageW - margin, 24, { align: "right" });

  y = 40;
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`${isEn ? "QUOTE NO" : "ORCAMENTO Nº"} ${String(o.numero).padStart(4, "0")}`, margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(new Date(o.criadoEm).toLocaleDateString(isEn ? "en-US" : "pt-BR"), pageW - margin, y, {
    align: "right",
  });

  y += 8;
  doc.setDrawColor(220);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(isEn ? "CLIENT" : "CLIENTE", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  if (cliente) {
    doc.text(`${isEn ? "Name" : "Nome"}: ${cliente.nome}`, margin, y);
    y += 5;
    doc.text(`${isEn ? "Phone" : "Telefone"}: ${cliente.telefone}`, margin, y);
    y += 5;
    if (cliente.endereco) {
      doc.text(`${isEn ? "Address" : "Endereco"}: ${cliente.endereco}`, margin, y);
      y += 5;
    }
  } else {
    doc.text("-", margin, y);
    y += 5;
  }

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(o.titulo || (isEn ? "Quote items" : "Itens do Orcamento"), margin, y);
  y += 6;

  doc.setFillColor(40, 40, 40);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, y, pageW - margin * 2, 8, "F");
  doc.setFontSize(9);
  doc.text(isEn ? "Description" : "Descricao", margin + 2, y + 5.5);
  doc.text(isEn ? "Dim (cm)" : "Med (cm)", margin + 90, y + 5.5);
  doc.text(isEn ? "Qty" : "Qtd", margin + 120, y + 5.5);
  doc.text("Unit", margin + 140, y + 5.5);
  doc.text("Total", pageW - margin - 2, y + 5.5, { align: "right" });
  y += 8;

  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "normal");

  o.itens.forEach((it, i) => {
    const areaM2 = (it.largura * it.altura) / 10000;
    const unit = areaM2 * it.custoMaterial + it.maoDeObra;
    const tot = unit * it.quantidade;
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(margin, y, pageW - margin * 2, 7, "F");
    }
    doc.setFontSize(9);
    doc.text(String(it.descricao).slice(0, 50), margin + 2, y + 5);
    doc.text(`${it.largura}x${it.altura}`, margin + 90, y + 5);
    doc.text(String(it.quantidade), margin + 120, y + 5);
    doc.text(formatBRL(unit), margin + 140, y + 5);
    doc.text(formatBRL(tot), pageW - margin - 2, y + 5, { align: "right" });
    y += 7;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
  });

  const { subtotal, total } = calcularOrcamento(o);
  y += 6;
  doc.setDrawColor(200);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  doc.setFontSize(10);
  doc.text("Subtotal:", pageW - margin - 50, y);
  doc.text(formatBRL(subtotal), pageW - margin, y, { align: "right" });
  y += 5;
  if (o.margemLucro) {
    doc.text(`${isEn ? "Margin" : "Margem"} (${o.margemLucro}%):`, pageW - margin - 50, y);
    doc.text("+", pageW - margin - 18, y, { align: "right" });
    y += 5;
  }
  if (o.desconto) {
    doc.text(`${isEn ? "Discount" : "Desconto"} (${o.desconto}%):`, pageW - margin - 50, y);
    doc.text("-", pageW - margin - 18, y, { align: "right" });
    y += 5;
  }
  y += 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(232, 93, 58);
  doc.text("TOTAL:", pageW - margin - 50, y);
  doc.text(formatBRL(total), pageW - margin, y, { align: "right" });

  if (o.observacoes) {
    y += 12;
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(isEn ? "Notes:" : "Observacoes:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(o.observacoes, pageW - margin * 2);
    doc.text(lines, margin, y);
  }

  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    `${isEn ? "Quote valid for 15 days" : "Orcamento valido por 15 dias"} - ${isEn ? "Generated on" : "Gerado em"} ${new Date().toLocaleString(isEn ? "en-US" : "pt-BR")}`,
    pageW / 2,
    285,
    { align: "center" }
  );

  doc.save(`orcamento-${String(o.numero).padStart(4, "0")}.pdf`);
}

export function enviarWhatsApp(telefone: string, mensagem: string) {
  const tel = telefone.replace(/\D/g, "");
  const url = `https://wa.me/${tel.startsWith("55") ? tel : "55" + tel}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}
