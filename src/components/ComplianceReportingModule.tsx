import React from 'react';
import { FileCheck, Download, Search, AlertCircle, Building2, Calendar, FileText, Gavel, Scale } from 'lucide-react';

interface ComplianceReport {
  id: string;
  entity: string;
  date: string;
  type: string;
  status: 'Compliant' | 'Violation Found' | 'Under Review';
  fineEstimate: string | null;
}

const MOCK_REPORTS: ComplianceReport[] = [
  { id: 'REG-9092', entity: 'Apex Industrial Chemicals', date: '2026-05-01', type: 'Effluent Discharge', status: 'Violation Found', fineEstimate: '$125,000' },
  { id: 'REG-9091', entity: 'NovaTech Manufacturing', date: '2026-04-28', type: 'Thermal Outflow Limits', status: 'Under Review', fineEstimate: 'TBD' },
  { id: 'REG-9090', entity: 'City Treatment Plant', date: '2026-04-15', type: 'Routine Audit', status: 'Compliant', fineEstimate: null },
  { id: 'REG-9089', entity: 'Vertex Synthetics', date: '2026-04-02', type: 'Heavy Metal Traces', status: 'Violation Found', fineEstimate: '$45,000' },
];

export const ComplianceReportingModule: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-6 border-b border-brand-line/20 pb-4 shrink-0">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5" />
            Regulatory & Compliance Hub
          </h2>
          <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Automated Evidentiary Chain & Reporting</p>
        </div>
        
        <button className="px-4 py-2 border border-brand-ink bg-brand-ink text-brand-bg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
          <FileText className="w-4 h-4" /> Assemble New Dossier
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Column - Stats */}
        <div className="w-1/4 flex flex-col gap-6">
          <div className="p-6 border border-brand-line bg-brand-bg shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <p className="text-[10px] font-mono uppercase opacity-50 mb-2">YTD Violations Issued</p>
            <h3 className="text-4xl font-display font-black">24</h3>
            <div className="mt-4 pt-4 border-t border-brand-line/10 flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase opacity-50">Trend</span>
              <span className="text-xs font-bold text-red-500">+12%</span>
            </div>
          </div>
          
          <div className="p-6 border border-brand-line bg-brand-bg">
            <p className="text-[10px] font-mono uppercase opacity-50 mb-2">Total Fines Levied</p>
            <h3 className="text-3xl font-display font-black text-brand-ink">$1.2M</h3>
            <p className="text-[10px] font-mono opacity-50 mt-2">Recovered for remediation fund</p>
          </div>

          <div className="p-4 border border-brand-line/40 bg-brand-line/5 text-sm font-mono opacity-80 border-l-4 border-l-brand-ink">
            "TraceSource forensic data is legally admissible under EPA Rule 40 CFR Part 136 due to persistent cryptographic signing."
          </div>
        </div>

        {/* Right Column - Reports */}
        <div className="flex-1 flex flex-col border border-brand-line bg-brand-bg shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] overflow-hidden">
          <div className="p-4 border-b border-brand-line/20 bg-brand-line/5 flex items-center justify-between shrink-0">
             <div className="flex gap-4 items-center">
               <Search className="w-4 h-4 opacity-50" />
               <input type="text" placeholder="Search entity, case ID, or date..." className="bg-transparent border-none outline-none text-xs font-mono w-64" />
             </div>
             <div className="flex items-center gap-2 text-[10px] font-mono uppercase opacity-50">
               <Calendar className="w-3 h-3" /> Last 30 Days
             </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-brand-line/5 text-[10px] font-mono uppercase opacity-60">
                <tr>
                  <th className="px-6 py-4 font-normal">Case ID</th>
                  <th className="px-6 py-4 font-normal">Subject Entity</th>
                  <th className="px-6 py-4 font-normal">Audit Type</th>
                  <th className="px-6 py-4 font-normal">Date</th>
                  <th className="px-6 py-4 font-normal">Status</th>
                  <th className="px-6 py-4 font-normal">Fines</th>
                  <th className="px-6 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-mono">
                {MOCK_REPORTS.map((report, idx) => (
                  <tr key={report.id} className={`border-b border-brand-line/10 hover:bg-brand-line/5 transition-colors ${idx % 2 === 0 ? '' : 'bg-brand-line/5'}`}>
                    <td className="px-6 py-4 font-bold">{report.id}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Building2 className="w-3 h-3 opacity-50" /> {report.entity}
                    </td>
                    <td className="px-6 py-4 opacity-80">{report.type}</td>
                    <td className="px-6 py-4 opacity-80">{report.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 uppercase text-[9px] font-bold border ${report.status === 'Violation Found' ? 'bg-red-500/10 border-red-500/30 text-red-600' : report.status === 'Compliant' ? 'bg-green-500/10 border-green-500/30 text-green-600' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 opacity-80">{report.fineEstimate || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-brand-ink hover:text-brand-bg border border-transparent hover:border-brand-ink transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
