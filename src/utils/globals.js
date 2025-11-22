export const apiurl = "http://localhost:3000/api/v1"
export const hostUrl = "https://mitaller.sanocarstaller.com"
export function formatNumber(numStr) {
    var part1 = numStr.substring(0, 3);
    var part2 = numStr.substring(3, 7);
    var part3 = numStr.substring(7);
    return part1 + '-' + part2 + '-' + part3;
}