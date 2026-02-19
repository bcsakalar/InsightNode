// ============================================================================
// Export Utilities — PNG, CSV, JSON export for charts and data
// ============================================================================

/**
 * Export chart data as CSV file with BOM for Excel UTF-8 compatibility.
 */
export function exportDataAsCSV(
    data: Record<string, unknown>[],
    filename: string
): void {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(","),
        ...data.map((row) =>
            headers
                .map((h) => {
                    const val = row[h];
                    const str = val === null || val === undefined ? "" : String(val);
                    // Escape quotes and wrap in quotes if contains comma, quote, or newline
                    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                        return `"${str.replace(/"/g, '""')}"`;
                    }
                    return str;
                })
                .join(",")
        ),
    ];

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
    });
    downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export data as JSON file.
 */
export function exportDataAsJSON(
    data: Record<string, unknown>[],
    filename: string
): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json;charset=utf-8;",
    });
    downloadBlob(blob, `${filename}.json`);
}

/**
 * Export a DOM element as PNG image using Canvas API.
 * Falls back gracefully if the element is not found.
 */
export async function exportChartAsPNG(
    elementId: string,
    title: string
): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element #${elementId} not found`);
        return;
    }

    try {
        // Use html2canvas dynamically
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(element, {
            backgroundColor: "#09090b",
            scale: 2,
            logging: false,
            useCORS: true,
        });

        canvas.toBlob((blob) => {
            if (blob) {
                downloadBlob(blob, `${title}.png`);
            }
        }, "image/png");
    } catch (error) {
        console.error("Failed to export chart as PNG:", error);
        // Fallback: use SVG serialization if available
        const svgElement = element.querySelector("svg");
        if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            downloadBlob(blob, `${title}.svg`);
        }
    }
}

/** Helper to trigger a download from a Blob */
function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
