import { prisma } from "@/lib/prisma";
import { requireRolePage } from "@/modules/auth/permissions";
import Link from "next/link";
import { ArrowLeft, Users, Mail, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CampaignReportsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRolePage(["ADMIN", "SUPER_ADMIN"]);
  const { id } = await params;

  const campaign = await prisma.emailCampaign.findUnique({
    where: { id },
  });

  if (!campaign) {
    notFound();
  }

  const recipients = await prisma.campaignRecipient.findMany({
    where: { campaignId: id },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  const total = campaign.totalCount || 1;
  const deliveredPercent = ((campaign.deliveredCount / total) * 100).toFixed(1);
  const bouncedPercent = ((campaign.bouncedCount / total) * 100).toFixed(1);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaign Report: {campaign.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Status: <span className="font-semibold text-gray-700">{campaign.status}</span></p>
        </div>
        <Link href="/admin/emails/campaigns">
          <button className="flex items-center text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-md">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center text-gray-500 mb-2">
            <Users className="w-4 h-4 mr-2" /> <span>Total Enqueued</span>
          </div>
          <div className="text-3xl font-bold">{campaign.totalCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center text-green-600 mb-2">
            <Mail className="w-4 h-4 mr-2" /> <span>Delivered</span>
          </div>
          <div className="text-3xl font-bold text-green-700">{campaign.deliveredCount}</div>
          <div className="text-xs text-gray-500">{deliveredPercent}% of total</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center text-red-500 mb-2">
            <XCircle className="w-4 h-4 mr-2" /> <span>Bounced</span>
          </div>
          <div className="text-3xl font-bold text-red-600">{campaign.bouncedCount}</div>
          <div className="text-xs text-gray-500">{bouncedPercent}% of total</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center text-yellow-500 mb-2">
            <RefreshCw className="w-4 h-4 mr-2" /> <span>Deferred</span>
          </div>
          <div className="text-3xl font-bold text-yellow-600">{campaign.deferredCount}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Recent Recipients (Last 50)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-500 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Last Update</th>
                <th className="px-6 py-3 font-medium">Diagnostic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {recipients.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-6 text-gray-400">No recipients processed yet.</td></tr>
              ) : recipients.map(r => (
                <tr key={r.id}>
                  <td className="px-6 py-3 font-medium text-gray-900">{r.email}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                      ${r.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                        r.status === 'BOUNCED' ? 'bg-red-100 text-red-800' : 
                        r.status === 'DEFERRED' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs">{r.updatedAt.toLocaleString()}</td>
                  <td className="px-6 py-3 text-xs max-w-xs truncate" title={r.lastError || "-"}>
                    {r.lastError || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
