import { EmailsTabs } from "./EmailsTabs";

export default function EmailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <EmailsTabs />
      <div>{children}</div>
    </div>
  );
}
