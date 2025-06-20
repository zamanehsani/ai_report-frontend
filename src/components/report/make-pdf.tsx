import jsPDF from "jspdf";

export async function generateReportPDF({ imageFile, user, text }: any) {
  console.log("inside the pdf process...");

  if (!user || !text || !imageFile) {
    console.log("Missing user, text, or image file");
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 8;
  let y = margin;

  doc.setFont("helvetica");
  doc.setFontSize(12);

  const lines = text.split("\n").filter((line: any) => line.trim() !== "");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // === Headings ===
    if (line.startsWith("## ")) {
      const heading = line.replace(/^##\s*/, "");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(heading, margin, y);
      y += lineHeight + 4;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      continue;
    }

    if (line.startsWith("### ")) {
      const subheading = line.replace(/^###\s*/, "");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(subheading, margin, y);
      y += lineHeight + 2;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      continue;
    }

    if (line.startsWith("#### ")) {
      const minorHeading = line.replace(/^####\s*/, "");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(minorHeading, margin, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");
      continue;
    }

    // === Horizontal Line ===
    if (line === "---") {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.setDrawColor(150);
      doc.line(margin, y, pageWidth - margin, y);
      y += 4;
      continue;
    }

    // === List Item ===
    if (line.startsWith("- ")) {
      const itemText = line.replace(/^- /, "");
      const wrapped = doc.splitTextToSize(itemText, maxWidth - 6);
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.circle(margin + 1.5, y - 1.5, 0.7, "F"); // bullet point
      doc.text(wrapped, margin + 6, y);
      y += wrapped.length * lineHeight + 2;
      continue;
    }

    // === Bold Field With Optional Italic ===
    const boldMatch = line.match(/^\*\*(.+?)\*\*(.*)/);
    if (boldMatch) {
      const [_, boldTitle, restText] = boldMatch;
      doc.setFont("helvetica", "bold");
      doc.text(boldTitle, margin, y);
      const boldWidth = doc.getTextWidth(boldTitle);
      doc.setFont("helvetica", "normal");

      const segments = restText.split(/(\*[^*]+\*)/g);
      let x = margin + boldWidth + 2;

      for (let seg of segments) {
        if (/^\*[^*]+\*$/.test(seg)) {
          doc.setFont("helvetica", "italic");
          seg = seg.slice(1, -1);
        } else {
          doc.setFont("helvetica", "normal");
        }
        doc.text(seg, x, y);
        x += doc.getTextWidth(seg);
      }
      y += lineHeight + 2;
      continue;
    }

    // === Normal Text with Inline Italic ===
    const segments = line.split(/(\*[^*]+\*)/g);
    let x = margin;
    for (let seg of segments) {
      if (/^\*[^*]+\*$/.test(seg)) {
        doc.setFont("helvetica", "italic");
        seg = seg.slice(1, -1);
      } else {
        doc.setFont("helvetica", "normal");
      }

      const wrapped = doc.splitTextToSize(seg, maxWidth);
      for (const wrapLine of wrapped) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(wrapLine, x, y);
        y += lineHeight;
      }
      x = margin;
    }
    y += 2;
  }

  // === Add Image ===
  console.log("done with the text and doing the image...");
  const imgData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imgData;
  });

  if (y > pageHeight - 100) {
    doc.addPage();
    y = margin;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Image Taken:", margin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");

  let displayWidth = Math.min(image.width, maxWidth);
  let displayHeight = (image.height * displayWidth) / image.width;

  const maxHeight = 100;
  if (displayHeight > maxHeight) {
    displayHeight = maxHeight;
    displayWidth = (image.width * displayHeight) / image.height;
  }

  doc.addImage(imgData, "JPEG", margin, y, displayWidth, displayHeight);

  const pdfBlob = doc.output("blob");
  console.log("sending back the file ....");
  return new File([pdfBlob], "report.pdf", { type: "application/pdf" });
}
