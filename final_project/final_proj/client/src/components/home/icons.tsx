// ไอคอนเส้น (stroke) แบบ inline SVG ใช้ในหน้าแรก ไม่ต้องเพิ่ม library
type P = { className?: string };

function Svg({ className = "h-6 w-6", children }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20h14V9.5" />
    <path d="M10 20v-5h4v5" />
  </Svg>
);
export const BoxIcon = (p: P) => (
  <Svg {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </Svg>
);
export const CheckCircleIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.5 2.5L16 9.5" />
  </Svg>
);
export const WrenchIcon = (p: P) => (
  <Svg {...p}>
    <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 1-5-5L13 2.4" />
    <path d="M14.5 4.5 17 2l5 5-2.5 2.5" />
    <path d="M10 18 4 12" />
  </Svg>
);
export const HammerIcon = (p: P) => (
  <Svg {...p}>
    <path d="m15 12-8.4 8.4a2 2 0 0 1-2.8-2.8L12.2 9" />
    <path d="M17.6 15 22 10.6 13.4 2 9 6.4l2.8 2.8L13 8l3.6 3.6-1.2 1.2Z" />
  </Svg>
);
export const CalendarIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <path d="m9 15 2 2 4-4" />
  </Svg>
);
export const HeartHandIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.3-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.7 12 20 12 20Z" />
  </Svg>
);
export const SearchIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Svg>
);
export const PlusCircleIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </Svg>
);
export const ArrowRightIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const ChevronRightIcon = (p: P) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);
export const LeafIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15Z" />
    <path d="M5 19c3-4 6-7 10-9" />
  </Svg>
);
export const RecycleIcon = (p: P) => (
  <Svg {...p}>
    <path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L5.5 12" />
    <path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7l-1.5-2.6" />
    <path d="m14 16-3 3 3 3" />
    <path d="M8.3 6.5 9.6 4.3a1.8 1.8 0 0 1 3.1 0l4.2 7.2" />
    <path d="m13.8 12 3.1-.5.5-3.1" />
    <path d="m4.4 9.3 1.1 2.7 2.9-.4" />
  </Svg>
);
export const UsersIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M16 14.2c2.9-.4 5 1.8 5 4.8" />
  </Svg>
);
export const PinIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);
export const MenuIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const CloseIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

// โลโก้: บ้าน + อิฐ
export function LogoMark({ className = "h-9 w-9" }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#dcbc98" />
      <path d="M8 19.5 20 9.5l12 10" fill="none" stroke="#2a3723" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 18v12.5h17V18" fill="none" stroke="#2a3723" strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="15" y="22" width="4.5" height="3.2" rx=".6" fill="#2a3723" />
      <rect x="20.5" y="22" width="4.5" height="3.2" rx=".6" fill="#2a3723" />
      <rect x="17.7" y="26.2" width="4.6" height="3.2" rx=".6" fill="#2a3723" />
    </svg>
  );
}
