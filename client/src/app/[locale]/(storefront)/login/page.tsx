import AuthComponent from '@/components/auth/AuthComponent';

export default function Login() {
  return (
    <div className="min-h-[85vh] bg-[#04060f] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2de2ff]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ff3fa4]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        <AuthComponent />
      </div>
    </div>
  );
}
