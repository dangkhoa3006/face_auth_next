"use client";

import Link from "next/link";

export default function RegisterFooter() {
  return (
    <>
      <div className="mt-10 text-center">
        <p className="text-[#67837f] text-sm">
          Đã có tài khoản?{" "}
          <Link className="text-primary font-bold hover:underline ml-1" href="/">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
      {/* Legal/Utility links */}
      <div className="mt-16 pt-8 border-t border-[#dde4e3] dark:border-gray-800 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest font-bold text-[#67837f]/60">
        <Link className="hover:text-primary transition-colors" href="#">
          Privacy Policy
        </Link>
        <Link className="hover:text-primary transition-colors" href="#">
          Terms of Service
        </Link>
        <Link className="hover:text-primary transition-colors" href="#">
          Help Center
        </Link>
      </div>
    </>
  );
}
