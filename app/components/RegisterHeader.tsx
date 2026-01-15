export default function RegisterHeader() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-primary p-2 rounded-lg">
          <span className="material-symbols-outlined text-white">
            person_add
          </span>
        </div>
        <span className="text-xl font-extrabold tracking-tight">
          CRYPTO<span className="text-primary">VAULT</span>
        </span>
      </div>
      <h1 className="text-3xl font-black leading-tight text-[#121716] dark:text-white sm:text-4xl">
        Tạo Tài Khoản
      </h1>
      <p className="text-[#67837f] dark:text-gray-400 mt-2">
        Đăng ký khuôn mặt để bảo mật tài khoản của bạn.
      </p>
    </div>
  );
}
