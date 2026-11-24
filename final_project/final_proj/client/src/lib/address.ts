// รวมที่อยู่เป็นข้อความเดียว กรุงเทพฯ ใช้ "แขวง/เขต" จังหวัดอื่นใช้ "ตำบล/อำเภอ"
type Addr = { province: string; district: string; subdistrict: string; postalCode?: string; addressDetail?: string };

export const isBangkok = (province: string) => /^(กรุงเทพ|กทม)/.test(province.trim());

export function formatArea({ province, district, subdistrict }: Addr, short = false): string {
  const bkk = isBangkok(province);
  const parts = [
    subdistrict && `${bkk ? "แขวง" : short ? "ต." : "ตำบล"}${subdistrict}`,
    district && `${bkk ? "เขต" : short ? "อ." : "อำเภอ"}${district}`,
    province && (bkk ? province : `${short ? "จ." : "จังหวัด"}${province}`),
  ];
  return parts.filter(Boolean).join(" ");
}

export function formatFullAddress(a: Addr): string {
  return [a.addressDetail?.trim(), formatArea(a), a.postalCode?.trim()].filter(Boolean).join(" ");
}

export const mapSearchUrl = (a: Addr) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatFullAddress(a))}`;
