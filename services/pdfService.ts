
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/**
 * Programmatically generates a PDF dossier from a DOM element.
 * Optimizes for dark-mode capture and professional forensic aesthetic.
 */
export async function generateForensicPDF(element: HTMLElement, fileName: string): Promise<void> {
  try {
    // 1. Prepare for high-quality capture
    // We use a higher scale for retina-like quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#020617", // Force dark theme background
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure all interactive elements are visible in the PDF
        const clonedElement = clonedDoc.getElementById(element.id);
        if (clonedElement) {
          clonedElement.style.padding = "40px";
          clonedElement.style.height = "auto";
          clonedElement.style.overflow = "visible";
        }
      }
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });

    // Add the forensic report image
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

    // Save with the project-specific filename
    pdf.save(`NEXUS_DOSSIER_${fileName.toUpperCase().replace(/\s+/g, "_")}.pdf`);
  } catch (error) {
    console.error("PDF Generation Failure:", error);
    throw new Error("Forensic Dossier export failed during manifest compilation.");
  }
}
