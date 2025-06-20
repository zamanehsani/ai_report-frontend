import { jsPDF } from "jspdf";

/**
 * Generates a PDF report and returns it as a File object.
 * @param {File} imageFile - The image file to attach.
 * @param {Object} user - The user object, must have a 'name' property.
 * @param {Object} site - The site object, must have a 'name' property.
 * @param {string} text - The body of the report.
 * @returns {Promise<File>} - Resolves to a File object containing the PDF.
 */
export async function generateReportPDF({ imageFile, user, text }: any) {
  console.log("inside the pdf process...");
  const doc = new jsPDF();
  if (!user) {
    console.log("no user");
    return;
  }

  if (!text) {
    console.log("no text");
    return;
  }
  if (!imageFile) {
    console.log("no file");
    return;
  }
  console.log("basic options done..");
  doc.setFontSize(12);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const maxWidth = pageWidth - margin * 2;
  const startY = 12;
  const lineHeight = 7;

  const textLines = doc.splitTextToSize(text, maxWidth);

  let y = startY;
  for (let i = 0; i < textLines.length; i++) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(textLines[i], margin, y);
    y += lineHeight;
  }
  console.log("done with the text and doing the image...");
  // Add image after the text, preserving aspect ratio
  if (imageFile) {
    const imgData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    // Load image to get natural dimensions
    const image = await new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imgData;
    });

    doc.text("Image Taken:", margin, y);
    y += 6;

    // Calculate dimensions to fit maxWidth, preserving aspect ratio
    let displayWidth = Math.min(image.width, maxWidth);
    let displayHeight = (image.height * displayWidth) / image.width;

    // Optional: limit max height (e.g., 100)
    const maxHeight = 100;
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = (image.width * displayHeight) / image.height;
    }

    doc.addImage(imgData, "JPEG", margin, y, displayWidth, displayHeight);
  }
  console.log("done with the image as well...");
  // Get PDF as Blob
  const pdfBlob = doc.output("blob");
  // Optionally, wrap as File for easier handling
  console.log("sending back the file ....");
  return new File([pdfBlob], "report.pdf", { type: "application/pdf" });
}
