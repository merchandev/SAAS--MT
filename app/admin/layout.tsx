import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
