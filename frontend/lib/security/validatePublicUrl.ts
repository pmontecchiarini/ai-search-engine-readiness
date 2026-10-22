import { lookup } from 'node:dns/promises';

const PRIVATE_IPV4_RANGES: Array<{ base: number[]; bits: number }> = [
  { base: [127, 0, 0, 0], bits: 8 }, // loopback
  { base: [10, 0, 0, 0], bits: 8 }, // private
  { base: [172, 16, 0, 0], bits: 12 }, // private
  { base: [192, 168, 0, 0], bits: 16 }, // private
  { base: [169, 254, 0, 0], bits: 16 }, // link-local
  { base: [0, 0, 0, 0], bits: 8 }, // "this network"
];

function parseIPv4(ip: string): number[] | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  const octets = parts.map(Number);
  if (octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)) return null;
  return octets;
}

function ipv4InRange(octets: number[], range: { base: number[]; bits: number }): boolean {
  const fullBytes = Math.floor(range.bits / 8);
  const remainderBits = range.bits % 8;
  for (let i = 0; i < fullBytes; i++) {
    if (octets[i] !== range.base[i]) return false;
  }
  if (remainderBits > 0) {
    const shift = 8 - remainderBits;
    if (octets[fullBytes] >> shift !== range.base[fullBytes] >> shift) return false;
  }
  return true;
}

function isPrivateIPv4(ip: string): boolean {
  const octets = parseIPv4(ip);
  if (!octets) return false;
  return PRIVATE_IPV4_RANGES.some((range) => ipv4InRange(octets, range));
}

function firstHextet(ip: string): number | null {
  const segment = ip.split(':')[0];
  if (segment === '') return 0; // address starts with "::"
  const value = parseInt(segment, 16);
  return Number.isNaN(value) ? null : value;
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1') return true;

  const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIPv4(mapped[1]);

  const hextet = firstHextet(normalized);
  if (hextet === null) return false;

  const topByte = (hextet >> 8) & 0xff;
  if ((topByte & 0xfe) === 0xfc) return true; // fc00::/7 unique local
  if (topByte === 0xfe && (hextet & 0xff) >> 6 === 0b10) return true; // fe80::/10 link-local

  return false;
}

function isPrivateAddress(address: string): boolean {
  return address.includes(':') ? isPrivateIPv6(address) : isPrivateIPv4(address);
}

/**
 * Rejects URLs whose hostname resolves to a private, loopback, or link-local
 * address, to stop this server from being used to probe internal infrastructure.
 */
export async function validatePublicUrl(rawUrl: string): Promise<boolean> {
  let hostname: string;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    hostname = parsed.hostname;
  } catch {
    return false;
  }
  if (!hostname) return false;

  try {
    const addresses = await lookup(hostname, { all: true });
    if (addresses.length === 0) return false;
    return addresses.every((entry) => !isPrivateAddress(entry.address));
  } catch {
    return false;
  }
}
