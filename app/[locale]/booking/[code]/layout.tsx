import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingCodeAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
