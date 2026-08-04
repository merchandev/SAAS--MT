import { prisma } from "@/lib/prisma";
import { requireRolePage } from "@/modules/auth/permissions";
import { Filter } from "lucide-react";

export default async function MarketingSegmentsPage() {
  await requireRolePage(["ADMIN", "SUPER_ADMIN"]);

  const segments = await prisma.marketingSegment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Marketing Segments</h1>
          <p className="text-sm text-gray-500">
            Create dynamic lists of contacts based on rules. Total: {segments.length}
          </p>
        </div>
        <div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
            <Filter className="w-4 h-4" />
            <span>Create Segment</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {segments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No segments found. Create your first segment to target specific contacts.
                </td>
              </tr>
            ) : (
              segments.map((segment) => (
                <tr key={segment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {segment.name}
                  </td>
                  <td className="px-6 py-4">
                    {segment.description || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {segment.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    <button className="text-gray-600 hover:text-gray-800 font-medium">View Contacts</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
