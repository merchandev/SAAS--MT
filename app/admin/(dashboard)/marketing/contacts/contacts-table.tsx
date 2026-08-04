"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ContactsTable({ contacts, total, currentPage }: { contacts: any[]; total: number; currentPage: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/marketing/contacts?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by email or name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
            Search
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Contact</th>
              <th className="px-6 py-3 font-medium">Phone / Country</th>
              <th className="px-6 py-3 font-medium">Customer Link</th>
              <th className="px-6 py-3 font-medium">Tags</th>
              <th className="px-6 py-3 font-medium">Consent</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No contacts found.
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</div>
                    <div className="text-gray-500">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{contact.phone || "-"}</div>
                    <div className="text-xs text-gray-400">{contact.country || "-"}</div>
                  </td>
                  <td className="px-6 py-4">
                    {contact.customer ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Linked
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Standalone
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((ct: any) => (
                        <span key={ct.tag.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {ct.tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {contact.hasConsent ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination basic UI */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
        <div>
          Showing {contacts.length} of {total} contacts
        </div>
        <div className="flex space-x-2">
          {currentPage > 1 && (
            <Link href={`/admin/marketing/contacts?page=${currentPage - 1}&search=${encodeURIComponent(search)}`} className="px-3 py-1 border rounded hover:bg-gray-50">
              Previous
            </Link>
          )}
          {contacts.length === 50 && (
            <Link href={`/admin/marketing/contacts?page=${currentPage + 1}&search=${encodeURIComponent(search)}`} className="px-3 py-1 border rounded hover:bg-gray-50">
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
