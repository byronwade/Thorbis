/**
 * Excel Template Generator
 *
 * Generates downloadable Excel templates with examples, validation, and instructions
 */

import * as XLSX from "xlsx";
import { generateTemplate } from "./excel-utils";

/**
 * Generate an Excel template file with multiple sheets
 */
export function generateExcelTemplate(dataType: string): Blob {
  const template = generateTemplate(dataType);

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Template with headers
  const templateSheet = XLSX.utils.json_to_sheet([], {
    header: template.headers,
  });

  // Add header row
  XLSX.utils.sheet_add_aoa(templateSheet, [template.headers], { origin: "A1" });

  // Add example rows
  XLSX.utils.sheet_add_json(templateSheet, template.examples, {
    skipHeader: true,
    origin: "A2",
  });

  // Set column widths
  const columnWidths = template.headers.map((header) => ({
    wch: Math.max(header.length, 15),
  }));
  templateSheet["!cols"] = columnWidths;

  // Add template sheet
  XLSX.utils.book_append_sheet(workbook, templateSheet, "Import Template");

  // Sheet 2: Instructions
  const instructions = [
    ["Import Instructions"],
    [""],
    ["1. Do not modify the header row (first row)"],
    ["2. Fill in your data starting from row 2"],
    ["3. Follow the validation rules for each field"],
    ["4. Remove the example rows before importing"],
    ["5. Save the file and upload it to the import page"],
    [""],
    ["Field Validations:"],
    [""],
    ...Object.entries(template.validations).map(([field, rules]) => [
      field,
      rules.join(", "),
    ]),
  ];

  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions);
  instructionsSheet["!cols"] = [{ wch: 30 }, { wch: 50 }];

  // Style the title
  if (instructionsSheet.A1) {
    instructionsSheet.A1.s = {
      font: { bold: true, sz: 14 },
    };
  }

  XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/**
 * Trigger download of Excel template
 */
export function downloadExcelTemplate(dataType: string) {
  const blob = generateExcelTemplate(dataType);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${dataType}_import_template.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
