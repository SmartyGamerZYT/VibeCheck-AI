'use client';

import React, { useState } from 'react';
import { AuditLogEntry } from '@/lib/types';
import { ShieldCheck, Search, Filter, Clock, Lock } from 'lucide-react';

interface AuditLogsProps {
  logs: AuditLogEntry[];
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = logs.filter((log) => {
    const matchesCat = filterCategory === 'all' || log.category === filterCategory;
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'security':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'workflow':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'guideline':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'review':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-sand-200 text-sand-800 border-sand-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sand-100 to-sand-50 border border-sand-300">
        <div>
          <h2 className="text-xl font-serif font-bold text-sand-900">
            Immutable Governance Audit Ledger
          </h2>
          <p className="text-xs text-sand-600">
            Full compliance trail recording all AI reviews, guideline modifications, and cryptographic approval signatures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-sand-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter ledger events..."
              className="pl-8 pr-3 py-1.5 text-xs text-sand-900 bg-white border border-sand-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sand-500 shadow-2xs w-48 sm:w-60"
            />
          </div>

          <select
            aria-label="Filter events by category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-semibold text-sand-800 bg-white border border-sand-300 rounded-lg py-1.5 px-3 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-sand-500"
          >
            <option value="all">All Categories</option>
            <option value="review">AI Review</option>
            <option value="workflow">Workflow & Sign-Off</option>
            <option value="guideline">Policy Updates</option>
            <option value="asset">Asset Management</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-sand-300 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-sand-50 border-b border-sand-200 text-sand-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">User & Role</th>
              <th className="py-3 px-4">Event Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-sand-50/50 transition-colors">
                <td className="py-3 px-4 text-sand-500 font-mono whitespace-nowrap text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-sand-400" />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${getCategoryBadge(
                      log.category
                    )}`}
                  >
                    {log.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-sand-900 whitespace-nowrap">
                  {log.action}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-semibold text-sand-800">{log.userName}</div>
                  <div className="text-[10px] uppercase font-bold text-sand-500">
                    {log.userRole}
                  </div>
                </td>
                <td className="py-3 px-4 text-sand-700 leading-relaxed max-w-md">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

