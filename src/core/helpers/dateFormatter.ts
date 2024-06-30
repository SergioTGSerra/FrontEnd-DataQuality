function formatDateString(dateString: string): string {
    const date = new Date(dateString);
  
    const padZero = (num: number): string => (num < 10 ? '0' + num : num.toString());
  
    const hours = padZero(date.getUTCHours());
    const minutes = padZero(date.getUTCMinutes());
    const seconds = padZero(date.getUTCSeconds());
  
    const day = padZero(date.getUTCDate());
    const month = padZero(date.getUTCMonth() + 1); // Months are zero-based in JavaScript
    const year = date.getUTCFullYear();
  
    return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
};

export { formatDateString };