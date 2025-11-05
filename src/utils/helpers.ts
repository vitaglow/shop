export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  const lines = csvText.trim().split('\n');
  
  for (const line of lines) {
    const row: string[] = [];
    let field = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const prevChar = i > 0 ? line[i - 1] : '';
      
      if (char === '"' && prevChar !== '\\') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(field.replace(/""/g, '"').trim());
        field = '';
      } else {
        field += char;
      }
    }
    
    row.push(field.replace(/""/g, '"').trim());
    rows.push(row);
  }
  
  return rows;
}

export function parseCSVReverse(csvText: string): string[][] {
  const rows: string[][] = [];
  const lines = csvText.trim().split('\n');
  
  for (const line of lines) {
    const row: string[] = [];
    let field = '';
    let inQuotes = false;
    
    for (let i = line.length - 1; i >= 0; i--) {
      const char = line[i];
      const nextChar = i < line.length - 1 ? line[i + 1] : '';
      
      if (char === '"' && nextChar !== '\\') {
        inQuotes = !inQuotes;
        continue;
      }
      
      if (char === ',' && !inQuotes) {
        row.unshift(field.trim());
        field = '';
      } else {
        field = char + field;
      }
    }
    
    if (field) row.unshift(field.trim());
    rows.push(row);
  }
  
  return rows;
}

export function formatDateTo12Hour(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(' ');
  const [month, day, year] = datePart.split('/');
  const [hours, minutes, seconds] = timePart.split(':');
  
  let hour = parseInt(hours) % 12 || 12;
  const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
  
  return `${month}/${day}/${year} ${hour}:${minutes}:${seconds} ${period}`;
}
