import { getEventDateAction } from "@/lib/actions";
import RegistrationForm from "@/components/RegistrationForm";
import Image from "next/image";

export default async function Home() {
  const eventDate = await getEventDateAction();

  return (
    <main className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/50 blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/50 blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header / Logos */}
        <div className="grid grid-cols-2 gap-y-6 justify-items-center md:flex md:flex-row md:justify-center items-center md:gap-12 mb-12 animate-fade-in-up">
          <div className="flex flex-col items-center gap-2 order-1 md:order-none">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-200 shadow-sm">
              <Image src="/uniben.jpg" alt="UNIBEN Logo" width={80} height={80} className="object-contain" />
            </div>
            <span className="text-xs font-semibold text-white">UNIBEN</span>
          </div>
          
          <div className="hidden md:block h-10 w-px bg-slate-700 order-none"></div>
          
          <div className="flex flex-col items-center text-center col-span-2 order-3 md:order-none mt-2 md:mt-0">
            <span className="text-sm font-bold text-white uppercase tracking-wider mb-1">Department of Statistics</span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest border-t border-slate-700 pt-1">From the office of the D.P.R.O</span>
          </div>
          
          <div className="hidden md:block h-10 w-px bg-slate-700 order-none"></div>
          
          <div className="flex flex-col items-center gap-2 order-2 md:order-none">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-200 shadow-sm">
              <Image src="/nasson.jpg" alt="NASSON Logo" width={80} height={80} className="object-contain" />
            </div>
            <span className="text-xs font-semibold text-white">NASSON</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm font-bold tracking-[0.3em] text-accent uppercase mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Presents</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 drop-shadow-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            LEVEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">UP</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            A premier skill-up orientation designed to equip you with the high-income skills needed for the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {[
            { title: "Videography & Content Creation", icon: "🎥", desc: "Smartphone filming, lighting, audio, editing with CapCut, and storytelling for social media." },
            { title: "Graphic Designing", icon: "🎨", desc: "Flyers, logos, social media posts, and brand identity using Canva and basic Photoshop techniques." },
            { title: "Entrepreneurship", icon: "💼", desc: "Business ideation, customer discovery, branding, and basic financial management." },
            { title: "Leadership", icon: "🚀", desc: "Team communication, decision-making, conflict resolution, and emotional intelligence." },
            { title: "AI Automation", icon: "🤖", desc: "Prompt engineering, AI for research and content writing, animation, and automating repetitive tasks." },
            { title: "Forex Trading", icon: "📈", desc: "Learn the fundamentals of the foreign exchange market, risk management, and trading strategies." }
          ].map((skill, i) => (
            <div key={i} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-2 flex flex-col gap-3 group">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {skill.icon}
              </div>
              <h3 className="font-bold text-xl text-white mt-2">{skill.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{skill.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Details Card */}
          <div className="bg-primary text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/30 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl -ml-10 -mb-10"></div>
            
            <h3 className="text-2xl font-bold mb-8 relative z-10">Event Details</h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-white/70 font-medium uppercase tracking-wider">Date</p>
                  <p className="text-lg font-bold">{eventDate}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-white/70 font-medium uppercase tracking-wider">Time</p>
                  <p className="text-lg font-bold">9:00 AM Prompt</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-white/70 font-medium uppercase tracking-wider">Venue</p>
                  <p className="text-lg font-bold">P2 Statistics Building, UNIBEN</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/20 relative z-10 flex justify-between items-center">
              <div>
                <p className="text-sm text-white/70 font-medium uppercase tracking-wider">Entry</p>
                <p className="text-2xl font-black text-green-400">FREE</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">*Registration Required</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center md:text-left mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Reserve Your Seat</h2>
              <p className="text-slate-300">Spaces are limited. Fill the form below to register.</p>
            </div>
            <RegistrationForm />
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-24 pt-12 border-t border-slate-800 text-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <p className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">In Partnership With</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md">
              <Image src="/partner1.jpg" alt="Partner 1" width={96} height={96} className="object-cover" />
            </div>
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md">
              <Image src="/partner2.jpg" alt="Partner 2" width={96} height={96} className="object-cover" />
            </div>
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md">
              <Image src="/partner3.jpg" alt="Partner 3" width={96} height={96} className="object-cover" />
            </div>
            
            {/* Indicator for additional partners */}
            <div className="flex items-center ml-2 md:ml-4">
              <span className="text-lg md:text-xl font-bold text-slate-400 italic tracking-wide">...and many more!</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
