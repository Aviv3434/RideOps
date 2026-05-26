import { apiClient } from "./apiClient";

export async function exportApprovedTrips(): Promise<void> {
  const response = await apiClient.post("/exports/approved", undefined, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/vnd.ms-excel",
  });

  const contentDisposition = response.headers["content-disposition"];

  let fileName = "rideops-taxi-import.xls";

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);

    if (match?.[1]) {
      fileName = match[1];
    }
  }

  if (!fileName.endsWith(".xls")) {
    fileName = fileName.replace(/\.xlsx$/i, ".xls");
  }

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}