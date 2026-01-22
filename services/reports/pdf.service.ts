
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export async function generateForensicPDF(element: HTMLElement, fileName: string): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#020617",
      logging: false,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`NEXUS_DOSSIER_${fileName.toUpperCase().replace(/\s+/g, "_")}.pdf`);
  } catch (error) {
    console.error("PDF Failure:", error);
    throw new Error("Export failed.");
  }
}
