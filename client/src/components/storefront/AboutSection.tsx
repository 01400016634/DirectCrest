import { Info, Target, Eye, Cpu, Factory, DollarSign, PenTool, TrendingUp } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="w-full py-24 bg-black/40 backdrop-blur-md border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-6 flex items-center justify-center gap-4">
            <Info className="h-10 w-10 text-red-500" /> About DirectCrest
          </h2>
          <p className="text-gray-300 max-w-4xl mx-auto text-lg leading-relaxed font-medium">
            DirectCrest is a premium cross-border sourcing and dropshipping platform designed to bridge the gap between China’s manufacturing hubs and global retail markets. We recognize that in global supply chains, friction rarely comes from strategy alone—it arises from opaque pricing, unverified intermediaries, and disconnected logistics. DirectCrest eliminates these barriers by providing a technologically advanced, immersive wholesale environment. By integrating interactive 3D product visualization with a seamless, end-to-end logistics pipeline, we empower businesses to source factory-direct products with total confidence. From initial discovery to final delivery, we provide the infrastructure necessary to scale your inventory efficiently, securely, and transparently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] backdrop-blur-md shadow-2xl hover:border-red-500/30 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-950/50 rounded-xl group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Our Mission</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              To empower businesses to build reliable, scalable supply chains by providing structured, factory-direct sourcing with absolute price transparency. We are committed to stripping away the complexity of cross-border trade, replacing fragmented purchasing processes with a unified platform that delivers clear oversight, consistent execution, and immersive product validation.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] backdrop-blur-md shadow-2xl hover:border-red-500/30 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-950/50 rounded-xl group-hover:scale-110 transition-transform">
                <Eye className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Our Vision</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              To set a new global standard for B2B e-commerce and wholesale sourcing. We envision a supply chain ecosystem where international borders no longer dictate procurement limits, and where buyers can experience, quote, and track their inventory through a highly intuitive, visually interactive digital environment that drives long-term commercial growth.
            </p>
          </div>
        </div>

        <div className="mb-12 relative">
          <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-6 text-center">
            Why DirectCrest is Different
          </h2>
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-16 text-lg">
            While traditional B2B marketplaces act merely as bulletin boards for resellers, DirectCrest operates as an integrated, technology-driven supply chain partner.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-red-500/50 hover:bg-white/5 transition-all group shadow-xl">
              <Cpu className="h-10 w-10 text-red-500 mb-6 group-hover:-translate-y-2 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-4">Interactive 3D Discovery</h4>
              <p className="text-sm text-gray-400 leading-relaxed">We replace flat, heavily edited supplier photos with a photorealistic, WebGL-powered 3D viewing experience. Buyers can rotate, inspect, and configure product variants in real-time before committing to a bulk order, drastically reducing the risk of quality misalignment.</p>
            </div>
            
            <div className="bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-red-500/50 hover:bg-white/5 transition-all group shadow-xl">
              <Factory className="h-10 w-10 text-red-500 mb-6 group-hover:-translate-y-2 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-4">True Factory-Direct</h4>
              <p className="text-sm text-gray-400 leading-relaxed">We bypass trading companies and intermediaries to connect you directly with verified manufacturers. This ensures you secure authentic wholesale margins and have the leverage to negotiate favorable terms on volume orders.</p>
            </div>
            
            <div className="bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-red-500/50 hover:bg-white/5 transition-all group shadow-xl">
              <DollarSign className="h-10 w-10 text-red-500 mb-6 group-hover:-translate-y-2 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-4">Transparent Landed Costs</h4>
              <p className="text-sm text-gray-400 leading-relaxed">We eliminate hidden export fees. Our platform automatically calculates the total landed cost upfront—factoring in factory price, dynamic air or sea freight logistics, and local delivery—so you can accurately forecast your retail margins.</p>
            </div>
            
            <div className="bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-red-500/50 hover:bg-white/5 transition-all group shadow-xl lg:col-span-1">
              <PenTool className="h-10 w-10 text-red-500 mb-6 group-hover:-translate-y-2 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-4">Custom Sourcing Engine</h4>
              <p className="text-sm text-gray-400 leading-relaxed">If a product is not in our active catalog, our dedicated sourcing pipeline allows you to submit exact specifications, reference images, and target prices. Our agents negotiate on the ground in China to secure a custom quote tailored to your exact needs.</p>
            </div>
            
            <div className="bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-red-500/50 hover:bg-white/5 transition-all group shadow-xl lg:col-span-2">
              <TrendingUp className="h-10 w-10 text-red-500 mb-6 group-hover:-translate-y-2 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-4">Automated Logistics Pipeline</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Our bespoke backend manages the entire journey from the factory floor to your warehouse. With a fully integrated order management dashboard, you maintain live visibility over fulfillment statuses, tracking numbers, and international transit updates.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
