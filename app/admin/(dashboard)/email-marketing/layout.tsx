import { EmailMarketingSidebar } from "@/components/email-marketing/EmailMarketingSidebar";

export default function EmailMarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)] w-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <EmailMarketingSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30 overflow-y-auto p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
