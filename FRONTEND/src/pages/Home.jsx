import React from 'react';
import { useHealth } from '../hooks/useHealth';
import { SCHEMES, APP_CONFIG } from '../utils/constants';

export const Home = () => {
  const { health, loading, error, refetch } = useHealth();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Official Welcome Notice Banner */}
      <section className="bg-white border border-slate-300 rounded p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="inline-block bg-[#113f67] text-white text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded mb-2">
              National Scholarship & Fellowship Portal
            </span>
            <h2 className="text-xl font-bold text-[#0c2340]">
              {APP_CONFIG.PORTAL_NAME_HI}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Empowering Scheduled Tribe (ST) students across India through streamlined fellowship administration, transparent verification, and Direct Benefit Transfer (DBT).
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={refetch}
              disabled={loading}
              className="bg-[#113f67] hover:bg-[#0c2340] text-white text-xs font-semibold px-4 py-2 rounded transition cursor-pointer border border-[#0c2340] disabled:opacity-50"
            >
              {loading ? 'Checking Health...' : 'Check API Status'}
            </button>
          </div>
        </div>

        {/* Phase 1 Verification / Health Check Status Panel */}
        <div className="mt-5 bg-slate-50 border border-slate-200 rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${health?.status === 'UP' ? 'bg-emerald-600' : error ? 'bg-red-600' : 'bg-amber-500 animate-pulse'}`}></span>
              Backend System Health & Diagnostics (GET /api/health)
            </h3>
            <span className="text-[11px] text-slate-500">Target: Node/Express + MongoDB</span>
          </div>

          {loading && (
            <p className="text-xs text-slate-500 italic py-2">Pinging backend health check endpoint...</p>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-red-800 text-xs">
              <p className="font-semibold">Backend Unreachable or Disconnected:</p>
              <p className="font-mono mt-1 text-[11px]">{error}</p>
              <p className="mt-1 text-slate-600">Ensure the Express server is running on port 5000.</p>
            </div>
          )}

          {health && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white border border-slate-200 p-2.5 rounded">
                <span className="text-slate-500 block text-[11px]">API Status</span>
                <span className="font-bold text-emerald-700 text-sm">{health.status}</span>
              </div>
              <div className="bg-white border border-slate-200 p-2.5 rounded">
                <span className="text-slate-500 block text-[11px]">MongoDB State</span>
                <span className={`font-bold text-sm ${health.database?.connected ? 'text-emerald-700' : 'text-amber-600'}`}>
                  {health.database?.status || 'Active'}
                </span>
              </div>
              <div className="bg-white border border-slate-200 p-2.5 rounded">
                <span className="text-slate-500 block text-[11px]">Server Uptime</span>
                <span className="font-mono font-semibold text-slate-800">{health.uptimeSeconds}s</span>
              </div>
              <div className="bg-white border border-slate-200 p-2.5 rounded">
                <span className="text-slate-500 block text-[11px]">Timestamp</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {new Date(health.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MoTA Key Schemes Reference Table */}
      <section className="bg-white border border-slate-300 rounded p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#0c2340] uppercase tracking-wide mb-3 border-b border-slate-200 pb-2">
          Schemes Managed by Ministry of Tribal Affairs (MoTA)
        </h3>
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Scheme Code</th>
                <th>Scheme Title (English / Hindi)</th>
                <th style={{ width: '180px' }}>Target Qualification</th>
                <th style={{ width: '120px' }}>Annual Quota</th>
                <th style={{ width: '100px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {SCHEMES.map((scheme) => (
                <tr key={scheme.code}>
                  <td className="font-bold text-[#113f67] font-mono">{scheme.code}</td>
                  <td>
                    <div className="font-medium text-slate-800">{scheme.name}</div>
                    <div className="text-xs text-slate-500">{scheme.hindiName}</div>
                  </td>
                  <td>{scheme.level}</td>
                  <td className="font-semibold text-slate-700">{scheme.annualSlots}</td>
                  <td>
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Phase 1 Verification Checklist */}
      <section className="bg-white border border-slate-300 rounded p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#0c2340] uppercase tracking-wide mb-3 border-b border-slate-200 pb-2">
          Phase 1: Architecture & Technical Scaffolding Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="border border-slate-200 p-3 rounded bg-slate-50 space-y-1.5">
            <h4 className="font-bold text-slate-800">Frontend Environment</h4>
            <p>✓ React 19 + Vite</p>
            <p>✓ Tailwind CSS with official government visual guidelines</p>
            <p>✓ React Router DOM configured with route layout structure</p>
            <p>✓ Axios client service with centralized response interception</p>
            <p>✓ Clean module directories: components, pages, services, context, hooks, utils, routes</p>
          </div>
          <div className="border border-slate-200 p-3 rounded bg-slate-50 space-y-1.5">
            <h4 className="font-bold text-slate-800">Backend Environment</h4>
            <p>✓ Express.js with ES Modules (type: module)</p>
            <p>✓ Mongoose + MongoDB connection configuration</p>
            <p>✓ Centralized error middleware & standardized API response envelope</p>
            <p>✓ Modular directory structure (controllers, models, routes, middleware, validators, utils, db, config)</p>
            <p>✓ Diagnostics endpoint operational at <code className="font-mono text-[11px] bg-slate-200 px-1 rounded">/api/health</code></p>
          </div>
        </div>
      </section>
    </main>
  );
};
