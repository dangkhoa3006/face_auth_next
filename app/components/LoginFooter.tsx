"use client";

import Link from "next/link";

export default function LoginFooter() {
  return (
    <>
      <div className="mt-10 text-center">
        <p className="text-[#67837f] text-sm">
          Don&apos;t have an account?{" "}
          <Link className="text-primary font-bold hover:underline ml-1" href="/register">
            Create an account
          </Link>
        </p>
      </div>
      {/* Legal/Utility links */}
      <div className="mt-16 pt-8 border-t border-[#dde4e3] dark:border-gray-800 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest font-bold text-[#67837f]/60">
        <a className="hover:text-primary transition-colors" href="#">
          Privacy Policy
        </a>
        <a className="hover:text-primary transition-colors" href="#">
          Terms of Service
        </a>
        <a className="hover:text-primary transition-colors" href="#">
          Help Center
        </a>
      </div>
    </>
  );
}
