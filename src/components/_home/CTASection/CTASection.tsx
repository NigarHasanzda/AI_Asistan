'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const CTASection = () => {
  const router = useRouter();

  return (
    <section className="w-full py-20 px-4 bg-[#F9FAFB]">
      <div className="max-w-[90%] mx-auto">

        <div className="bg-[#1D4ED8] rounded-[40px] py-16 px-6 md:px-12 text-center shadow-xl">

          <h2 className="text-white text-[32px] md:text-[42px] font-bold mb-6 tracking-tight">
            Ready to scale your future?
          </h2>

          <p className="text-blue-100 text-[16px] md:text-[18px] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Whether you're a student looking for your first break or an employer seeking elite talent, Kord AI is your platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            {/* Login */}
            <button
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#1D4ED8] font-bold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg"
            >
              Login
            </button>

            {/* Register */}
            <button
              onClick={() => router.push('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Register
            </button>

          </div>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
