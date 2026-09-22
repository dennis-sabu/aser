import React from 'react';

interface HeroVideoSectionProps {
  activeTab: string;
}

export const HeroVideoSection = ({ activeTab }: HeroVideoSectionProps) => {
  return (
    <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[500px] max-w-6xl mx-auto px-4 sm:px-6">
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-3 sm:p-0">
        <div className="animate-fade-in-overlay w-full h-full flex items-center justify-center">

          {/* Resources Overlay */}
          {activeTab === 'resources' && (
            <div className="animate-slide-up-overlay absolute bg-white p-5 sm:p-6 rounded-2xl shadow-2xl w-[calc(100%-1.5rem)] max-w-xs sm:w-80 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Available Nearby</h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">3 new</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'ESP32 DevKit', owner: 'Rahul K.', tag: 'Borrow · Free', dot: 'bg-green-500' },
                  { name: 'Calculus Textbook', owner: 'Ananya M.', tag: 'Sell · ₹120', dot: 'bg-blue-500' },
                  { name: 'DSLR Camera', owner: 'Joel P.', tag: 'Rent · ₹200/day', dot: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.dot} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.owner} · {item.tag}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* I Need Overlay */}
          {activeTab === 'needs' && (
            <div className="animate-slide-up-overlay absolute bg-white p-5 sm:p-6 rounded-2xl shadow-2xl w-[calc(100%-1.5rem)] max-w-xs sm:w-80 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Active Request</h3>
              <p className="text-xs text-gray-400 mb-4">Posted 5 min ago · 2 responses</p>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 mb-1">I need: ESP32</p>
                <p className="text-xs text-gray-500">Required by tomorrow · Duration: 3 days · Budget: ₹0–100</p>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-black h-full w-2/5" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Matching in progress...</p>
            </div>
          )}

          {/* Rides Overlay */}
          {activeTab === 'rides' && (
            <div className="animate-slide-up-overlay absolute bg-white p-5 sm:p-6 rounded-2xl shadow-2xl w-[calc(100%-1.5rem)] max-w-xs sm:w-80 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">
                  AJ
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Ride to Ernakulam</h3>
                  <p className="text-xs text-gray-500">Arun J. · ★ 4.9</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Campus Gate → Ernakulam Jn.
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Today · 6:30 PM · 2 seats left
                </div>
              </div>
              <button className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Request Seat
              </button>
            </div>
          )}

          {/* Skills Overlay */}
          {activeTab === 'skills' && (
            <div className="animate-slide-up-overlay absolute bg-white p-5 sm:p-6 rounded-2xl shadow-2xl w-[calc(100%-1.5rem)] max-w-xs sm:w-80 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Students With Skills</h3>
              <div className="space-y-3">
                {[
                  { name: 'Priya S.', skill: 'Flutter Dev', avail: 'Free · Available weekends', dept: 'CS' },
                  { name: 'Mohammed R.', skill: 'PCB Design', avail: 'Exchange · Flexible', dept: 'ECE' },
                  { name: 'Sneha T.', skill: 'UI/UX Design', avail: 'Paid · ₹200/hr', dept: 'Design' },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0">
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{s.name} <span className="text-xs text-gray-400">· {s.dept}</span></p>
                      <p className="text-xs text-gray-500">{s.skill} · {s.avail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
