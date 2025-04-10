export const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const localDate = new Date(year, month - 1, day); // year, 0-indexed month, day
  
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(localDate);
  };
  
  export function calculateTripDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    // Difference in milliseconds
    const diff = endDate.getTime() - startDate.getTime();
  
    // Convert to days and add 1 for inclusive count
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  export const normalizeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };