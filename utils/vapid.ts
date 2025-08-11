// VAPID Keys Generated on 2025-08-11T04:10:13.858Z
// Public Key (for frontend): BCjLRdYi3EapfKAjZlIONNWb7PgUGnSo9-HDedbcd02o0zwriW-93jZ35Ufqu_C4jFtcKuHCdsGA_3TYyAHXqxs
// Private Key (for backend, KEEP SECRET): LjC3sekYvWtxxtN6R4qEEUunAI592EcpK8bc1Ggy8tU

export const VAPID_PUBLIC_KEY = "BCjLRdYi3EapfKAjZlIONNWb7PgUGnSo9-HDedbcd02o0zwriW-93jZ35Ufqu_C4jFtcKuHCdsGA_3TYyAHXqxs";

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function getVapidKey(): Uint8Array {
  return urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
}