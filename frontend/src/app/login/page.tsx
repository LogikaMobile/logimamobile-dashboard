import { signIn, auth } from "../../../auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Logo from "../../../public/Logo.svg";
import ComputerLogo from "../../../public/computerLogo.svg";
import LMaaSLogo from "../../../public/LMaaSLogo.svg";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const errorParam = resolvedSearchParams.error;
  const isAccessDenied = errorParam ? String(errorParam).includes('AccessDenied') : false;

  const session = await auth();
  if (session && session.user?.role) {
    const role = session.user.role;
    if (role === 'ENGINEER') {
      redirect('/apps/board');
    }
    redirect('/apps/projects/dashboard');
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-mono relative overflow-hidden">
      {/* Brand Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7B2CBF]/20 via-black to-[#FF7A00]/20 pointer-events-none"></div>

      {/* Brutalist background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-2%] text-[150px] font-black tracking-tighter text-transparent [-webkit-text-stroke:2px_#6CD3D3] select-none opacity-30">
          LogikaMobile
        </div>
        <div className="absolute bottom-[-5%] right-[-2%] text-[150px] font-black tracking-tighter text-transparent [-webkit-text-stroke:2px_#6CD3D3] select-none opacity-30">
          Dashboard
        </div>
        
        {/* Floating Logos */}
        <div className="absolute top-8 right-8 opacity-50">
          <Image src={ComputerLogo} alt="Computer Logo" width={400} height={400} />
        </div>
        <div className="absolute bottom-8 left-8 opacity-50">
          <Image src={LMaaSLogo} alt="LMaaS Logo" width={400} height={400} />
        </div>
      </div>

      <div className="bg-[#111111] border-2 border-white/20 p-10 w-full max-w-md shadow-[12px_12px_0px_rgba(123,44,191,0.2)] relative z-10">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="flex justify-center items-center mb-6">
            <Image src={Logo} alt="LogikaMobile Logo" width={220} height={220} className="drop-shadow-[0_0_20px_rgba(108,211,211,0.4)]" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-center mb-1">
            <span className="text-[#7B2CBF]">Logika</span>
            <span className="text-[#FF7A00]">Mobile</span>
            <span className="text-[#6CD3D3]">.</span>
          </h1>
          <p className="text-gray-400 text-sm font-bold tracking-[0.2em] uppercase mt-2">
            Dashboard Corp.
          </p>
        </div>
        <div className="w-full h-px bg-white/20 mb-8 relative"></div>

        {isAccessDenied && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 mb-8 text-xs font-bold uppercase tracking-wider text-center shadow-[4px_4px_0px_rgba(239,68,68,0.2)]">
            [!] ERR_ACCESS_DENIED
            <br />
            <span className="font-normal text-red-500/80 mt-1 block">Account not found in HR Database.</span>
          </div>
        )}

        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/apps/projects/dashboard" })
          }}
          className="flex flex-col gap-4"
        >
          <button
            type="submit"
            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            LOGIN_WITH_GOOGLE
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-[#333333] text-[10px] uppercase font-bold tracking-widest">
            STRICT INVITE-ONLY ACCESS
          </p>
        </div>
      </div>
    </div>
  );
}
