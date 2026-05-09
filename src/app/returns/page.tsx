import React from 'react';
import { Package, Truck, RefreshCcw } from 'lucide-react';

export const metadata = {
  title: 'Logistics & Returns | Scale Artistry',
  description: 'Our white-glove delivery and return protocols.',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen pt-40 pb-32 px-6 md:px-12 selection:bg-black selection:text-white bg-luxury-bg">
      <div className="max-w-[800px] mx-auto">
        
        <div className="mb-20 pb-12 border-b border-luxury-border flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-luxury-muted font-bold mb-4 flex items-center gap-2">
              <Package size={12} /> Operational Guidelines
            </p>
            <h1 className="font-light text-5xl md:text-6xl uppercase tracking-tighter text-black">
              Logistics & <span className="font-medium">Returns.</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted">
            Protocol v2.1
          </p>
        </div>

        <article className="prose prose-neutral max-w-none text-black leading-[2] tracking-wide text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
            <div className="p-8 bg-white border border-luxury-border rounded-[24px]">
              <Truck size={24} className="mb-6 text-black" strokeWidth={1.5} />
              <h3 className="font-medium text-sm tracking-tight mb-2">Global Deployment</h3>
              <p className="text-[11px] text-luxury-muted leading-relaxed">Secure, insured transit to major global hubs within 7-14 operational cycles.</p>
            </div>
            <div className="p-8 bg-white border border-luxury-border rounded-[24px]">
              <RefreshCcw size={24} className="mb-6 text-black" strokeWidth={1.5} />
              <h3 className="font-medium text-sm tracking-tight mb-2">Asset Recovery</h3>
              <p className="text-[11px] text-luxury-muted leading-relaxed">14-day window for initiating return protocols on unsealed assets.</p>
            </div>
          </div>

          <h2 className="text-xl font-medium tracking-tight mt-16 mb-6">1. White-Glove Transit Protocol</h2>
          <p>
            Every artifact procured through our registry undergoes rigorous authentication and packaging procedures. We utilize impact-resistant cryptographic sealing to ensure your scale model arrives in pristine, factory condition. Deployment typically commences within 48 hours of authorization.
          </p>

          <h2 className="text-xl font-medium tracking-tight mt-16 mb-6">2. International Logistics</h2>
          <p>
            Scale Artistry coordinates with elite courier networks globally. Please note that customs declarations and import duties are the sole responsibility of the receiving collector. We declare all assets at their accurate cryptographic value to ensure full insurance coverage during transit.
          </p>

          <h2 className="text-xl font-medium tracking-tight mt-16 mb-6">3. Return Authorization (RA)</h2>
          <p>
            Due to the delicate nature of scale mastery, returns are heavily scrutinized. We accept returns strictly under the following conditions:
          </p>
          <ul className="list-disc pl-6 space-y-2 my-6 text-luxury-muted">
            <li>The artifact remains sealed within its primary acrylic/cardboard casing.</li>
            <li>The RA is requested within 14 operational cycles (days) of verified delivery.</li>
            <li>A structural defect occurred prior to deployment (photographic evidence required).</li>
          </ul>

          <h2 className="text-xl font-medium tracking-tight mt-16 mb-6">4. Execution of Return</h2>
          <p>
            To initiate an RA, access your Registry Dashboard, locate the specific order manifest, and submit a recovery request. Once authorized, you will receive a secure transit label. Financial reimbursement will be routed to your original payment vector within 72 hours of asset reception and inspection at our facility.
          </p>

        </article>

      </div>
    </div>
  );
}
