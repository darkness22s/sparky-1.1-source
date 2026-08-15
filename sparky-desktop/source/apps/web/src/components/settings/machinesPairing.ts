import { setPairingTokenOnUrl } from "../../pairingUrl";

export function makeSparkyPairingUrl(host: string, credential: string): string {
  const trimmedHost = host.trim();
  if (!trimmedHost) {
    throw new Error("Enter an address that the other machine can reach.");
  }

  const address = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmedHost)
    ? trimmedHost
    : `http://${trimmedHost}`;
  const url = new URL(address);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("The machine address must use http:// or https://.");
  }

  url.pathname = "/";
  url.search = "";
  return setPairingTokenOnUrl(url, credential).toString();
}
