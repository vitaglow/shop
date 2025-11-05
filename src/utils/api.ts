// Caesar cipher decoder for API endpoints
// NOTE: This is obfuscation, not security. The API endpoints are public-facing
// and intended for client-side use. Sensitive operations should use server-side authentication.
const shiftAmount = 3;

function dgi(encoded: string): string {
  let decoded = '';
  for (let i = 0; i < encoded.length; i++) {
    let char = encoded[i];
    let charCode = char.charCodeAt(0) - shiftAmount;
    
    if (char >= 'a' && char <= 'z') {
      if (charCode < 97) charCode += 26;
    } else if (char >= 'A' && char <= 'Z') {
      if (charCode < 65) charCode += 26;
    }
    
    decoded += String.fromCharCode(charCode);
  }
  return decoded;
}

// API endpoints
export const API_ENDPOINTS = {
  dgistart: dgi('kwwsv=22grfv1jrrjoh1frp2vsuhdgvkhhwv2g'),
  dgif: dgi('kwwsv=22grfv1jrrjoh1frp2irupv2g2h'),
  strct: dgi('kwwsv=22vfulsw1jrrjoh1frp2pdfurv2v'),
};

export const API_KEYS = {
  sstt: 'AKfycbxqPXQQpg_eSuqTFPTfrbH6M_rebqLNRUwfapZEowKuuvJXQwykcDNzAfweXVQDD4snIQ',
  dgfie: dgi('irupUhvsrqvh'),
  dgih: dgi('kwpoylhz'),
  shaha: 'exec',
};

export const SPREADSHEET_IDS = {
  products: '1FjHzDs4LSpAoMLfO3NvMirLL5bogN2bgfbsCstZ6BWA',
  coupons: '1gC6Lp85Tn0KYq7Y8tqu6ijB1RUj6b2s7kyHySVje6gA',
  orders: '1_swkKr2v0lKZ4dAKq24bTcz6w1CXxbWs7xyCWwW2Cbo',
};
