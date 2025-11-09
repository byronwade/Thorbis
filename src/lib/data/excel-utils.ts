/**
 * Excel Utilities
 *
 * Helper functions for Excel file generation and parsing
 * Uses the xlsx library for Excel operations
 */

import * as XLSX from "xlsx";

export interface ExcelTemplate {
  dataType: string;
  headers: string[];
  validations: Record<string, string[]>;
  examples: Record<string, unknown>[];
  instructions: string;
}

/**
 * Generate Excel template for import
 */
export function generateTemplate(dataType: string): ExcelTemplate {
  const templates: Record<string, ExcelTemplate> = {
    customers: {
      dataType: "customers",
      headers: [
        "Name",
        "Email",
        "Phone",
        "Address",
        "City",
        "State",
        "ZIP",
        "Notes",
      ],
      validations: {
        Name: ["Required", "Max 200 characters"],
        Email: ["Optional", "Valid email format"],
        Phone: ["Optional", "Valid phone format"],
      },
      examples: [
        {
          Name: "John Doe",
          Email: "john@example.com",
          Phone: "(555) 123-4567",
          Address: "123 Main St",
          City: "Springfield",
          State: "IL",
          ZIP: "62701",
          Notes: "VIP customer",
        },
        {
          Name: "Jane Smith",
          Email: "jane@example.com",
          Phone: "(555) 234-5678",
          Address: "456 Oak Ave",
          City: "Springfield",
          State: "IL",
          ZIP: "62701",
          Notes: "",
        },
      ],
      instructions:
        "Fill in customer information. Name is required, other fields are optional.",
    },
    jobs: {
      dataType: "jobs",
      headers: [
        "Title",
        "Customer Name",
        "Description",
        "Status",
        "Priority",
        "Scheduled Date",
        "Address",
        "Notes",
      ],
      validations: {
        Title: ["Required", "Max 200 characters"],
        "Customer Name": ["Required"],
        Status: ["pending, scheduled, in_progress, completed, cancelled"],
        Priority: ["low, medium, high, urgent"],
      },
      examples: [
        {
          Title: "HVAC Maintenance",
          "Customer Name": "John Doe",
          Description: "Annual HVAC system maintenance",
          Status: "scheduled",
          Priority: "medium",
          "Scheduled Date": "2024-01-15 10:00:00",
          Address: "123 Main St, Springfield, IL",
          Notes: "Customer prefers morning appointments",
        },
      ],
      instructions:
        "Create jobs with customer information and scheduling details.",
    },
    invoices: {
      dataType: "invoices",
      headers: [
        "Invoice Number",
        "Customer Name",
        "Date",
        "Due Date",
        "Amount",
        "Tax",
        "Status",
        "Notes",
      ],
      validations: {
        "Invoice Number": ["Required", "Unique"],
        "Customer Name": ["Required"],
        Date: ["Required", "ISO 8601 format"],
        "Due Date": ["Required", "ISO 8601 format"],
        Amount: ["Required", "Positive number"],
        Status: ["draft, sent, paid, overdue, cancelled"],
      },
      examples: [
        {
          "Invoice Number": "INV-2024-001",
          "Customer Name": "John Doe",
          Date: "2024-01-01 00:00:00",
          "Due Date": "2024-01-31 00:00:00",
          Amount: 500.0,
          Tax: 40.0,
          Status: "sent",
          Notes: "Payment terms: Net 30",
        },
      ],
      instructions: "Import invoices with customer and payment details.",
    },
  };

  return templates[dataType] || templates.customers;
}

/**
 * Parse Excel file
 */
export async function parseExcelFile(file: File): Promise<unknown[]> {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Parse workbook
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error("No sheets found in Excel file");
    }

    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON (array of objects)
    const data = XLSX.utils.sheet_to_json(worksheet, {
      raw: false, // Return formatted strings
      defval: "", // Default value for empty cells
    });

    return data;
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw new Error("Failed to parse Excel file");
  }
}

/**
 * Create Excel file from data
 */
export function createExcelFile(data: unknown[], headers?: string[]): Blob {
  try {
    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers,
    });

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error("Error creating Excel file:", error);
    throw new Error("Failed to create Excel file");
  }
}

/**
 * Create CSV file from data
 */
export function createCSVFile(data: unknown[]): Blob {
  if (data.length === 0) {
    return new Blob([""], { type: "text/csv" });
  }

  // Get headers from first object
  const headers = Object.keys(data[0] as Record<string, unknown>);

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = (row as Record<string, unknown>)[header];
          // Escape commas and quotes
          const stringValue = String(value ?? "");
          return stringValue.includes(",") || stringValue.includes('"')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        })
        .join(",")
    ),
  ].join("\n");

  return new Blob([csvContent], { type: "text/csv" });
}
