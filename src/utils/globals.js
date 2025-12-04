export const apiurl = import.meta.env.VITE_API_URL
export const topurl = import.meta.env.VITE_TOP_URL


/* 
export const apiurl = "https://app.sanocars.com/api/v1"
export const topurl = "https://app.sanocars.com" 
*/

export function formatNumber(numStr) {
    var part1 = numStr.substring(0, 3);
    var part2 = numStr.substring(3, 7);
    var part3 = numStr.substring(7);
    return part1 + '-' + part2 + '-' + part3;
}

export const formatCurrency = (n,symbol)=> {
  const formatter = new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 // por si vienen decimales largos
  });
  const num = Number(String(n).replace(',', '.'));
  const newSymbol = symbol ? symbol : ''
  return `${newSymbol}${formatter.format(num)}`;
}