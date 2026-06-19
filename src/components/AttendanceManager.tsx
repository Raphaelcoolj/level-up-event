"use client";

import { useState, useEffect, useTransition } from "react";
import { toggleAttendanceAction } from "@/lib/actions";
import { toast } from "sonner";

interface RegistrationData {
  _id: string;
  name: string;
  email: string;
  jobTitle: string;
  isPresent?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AttendanceManagerProps {
  initialRegistrations: RegistrationData[];
}

export default function AttendanceManager({ initialRegistrations }: AttendanceManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [localRegistrations, setLocalRegistrations] = useState<RegistrationData[]>(initialRegistrations);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Keep local registrations in sync if prop changes
  useEffect(() => {
    setLocalRegistrations(initialRegistrations);
  }, [initialRegistrations]);

  const handleToggleAttendance = (id: string, newStatus: boolean) => {
    setLoadingId(id);
    startTransition(async () => {
      // Optimistic update
      setLocalRegistrations(prev =>
        prev.map(reg => reg._id === id ? { ...reg, isPresent: newStatus } : reg)
      );

      try {
        const res = await toggleAttendanceAction(id, newStatus);
        if (res?.success) {
          toast.success(newStatus ? "Marked as present!" : "Attendance unmarked.");
        } else {
          toast.error(res?.message || "Failed to update attendance.");
          // Revert optimistic update
          setLocalRegistrations(prev =>
            prev.map(reg => reg._id === id ? { ...reg, isPresent: !newStatus } : reg)
          );
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        // Revert optimistic update
        setLocalRegistrations(prev =>
          prev.map(reg => reg._id === id ? { ...reg, isPresent: !newStatus } : reg)
        );
      } finally {
        setLoadingId(null);
      }
    });
  };

  const totalCount = localRegistrations.length;
  const presentCount = localRegistrations.filter(r => r.isPresent).length;
  const absentCount = totalCount - presentCount;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // Split registrations into categories
  const absentList = localRegistrations.filter(r => !r.isPresent);
  const presentList = localRegistrations.filter(r => r.isPresent);

  // Apply search query
  const searchFilter = (r: RegistrationData) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      r.name.toLowerCase().includes(query) ||
      r.email.toLowerCase().includes(query) ||
      r.jobTitle.toLowerCase().includes(query)
    );
  };

  const filteredAbsent = absentList.filter(searchFilter);
  const filteredPresent = presentList.filter(searchFilter);

  return (
    <div className="space-y-6">
      {/* Search and Quick Stats Panel */}
      <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm shadow-sm space-y-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-slate-900/40 border border-slate-700/80 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <span className="text-slate-300">
                Registered: <span className="text-white bg-slate-700/50 px-2 py-0.5 rounded-md">{totalCount}</span>
              </span>
              <span className="text-emerald-400">
                Present: <span className="text-white bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-md">{presentCount}</span>
              </span>
              <span className="text-indigo-300">
                Absent: <span className="text-white bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">{absentCount}</span>
              </span>
            </div>
            <div className="text-emerald-400 font-bold text-sm tracking-wide">
              Attendance Rate: {attendancePercentage}%
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-900/60 rounded-full h-3 border border-slate-800 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Column 1: Registered (Not Checked In) */}
        <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Registered Attendees ({filteredAbsent.length})
            </span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Not Checked In</span>
          </h3>

          {filteredAbsent.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/10">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-3 border border-indigo-500/20">
                {absentList.length === 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              <p className="text-slate-300 font-medium">
                {absentList.length === 0 ? "Everyone has arrived! 🎉" : "No matches found"}
              </p>
              <p className="text-slate-500 text-xs mt-1 max-w-[250px] mx-auto">
                {absentList.length === 0 
                  ? "All registered attendees have been checked in successfully." 
                  : "Try checking the spelling or search by email instead."}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredAbsent.map((reg) => (
                <div 
                  key={reg._id} 
                  className="bg-slate-900/30 border border-slate-700/50 p-4 rounded-2xl hover:border-slate-600/70 transition-all flex flex-col justify-between gap-3 group shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-white text-md truncate pr-2" title={reg.name}>{reg.name}</div>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md whitespace-nowrap">
                        {new Date(reg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs truncate">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="truncate" title={reg.email}>{reg.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs truncate">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                      <span className="truncate" title={reg.jobTitle}>{reg.jobTitle}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleToggleAttendance(reg._id, true)}
                    disabled={loadingId === reg._id}
                    className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 py-2 rounded-xl transition-all font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {loadingId === reg._id ? (
                      <span className="animate-spin border-2 border-emerald-400 border-t-transparent w-3 h-3 rounded-full"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Mark Present
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Attended (People Who Came) */}
        <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              People Who Came ({filteredPresent.length})
            </span>
            <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Present</span>
          </h3>

          {filteredPresent.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/10">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 border border-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-slate-300 font-medium">
                {presentList.length === 0 ? "No attendees yet" : "No matches found"}
              </p>
              <p className="text-slate-500 text-xs mt-1 max-w-[250px] mx-auto">
                {presentList.length === 0 
                  ? "Mark registered attendees as present to add them to this list." 
                  : "Try checking the spelling or search by email instead."}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredPresent.map((reg) => (
                <div 
                  key={reg._id} 
                  className="bg-emerald-950/10 border border-emerald-950/20 hover:border-emerald-800/40 p-4 rounded-2xl transition-all flex flex-col justify-between gap-3 shadow-sm bg-gradient-to-b from-slate-900/20 to-slate-900/40"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-white text-md truncate pr-2 flex items-center gap-1.5" title={reg.name}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{reg.name}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-900/20 border border-emerald-900/30 text-emerald-300 px-2 py-0.5 rounded-md whitespace-nowrap">
                        Arrived
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs truncate">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="truncate" title={reg.email}>{reg.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs truncate">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                      <span className="truncate" title={reg.jobTitle}>{reg.jobTitle}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleToggleAttendance(reg._id, false)}
                    disabled={loadingId === reg._id}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 py-2 rounded-xl transition-all font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {loadingId === reg._id ? (
                      <span className="animate-spin border-2 border-red-400 border-t-transparent w-3 h-3 rounded-full"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    )}
                    Undo (Mark Absent)
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
