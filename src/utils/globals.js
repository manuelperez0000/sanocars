// Read values from Vite env variables (must start with VITE_)
// Falls back to localhost defaults when env vars are not set.
export const apiurl = import.meta.env.VITE_API_URL 
export const topurl = import.meta.env.VITE_TOP_URL 
/* export const apiurl = "https://api.sanocar.com" */

export function formatNumber(numStr) {
    var part1 = numStr.substring(0, 3);
    var part2 = numStr.substring(3, 7);
    var part3 = numStr.substring(7);
    return part1 + '-' + part2 + '-' + part3;
}