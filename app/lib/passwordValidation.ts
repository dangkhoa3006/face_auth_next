/**
 * Utility functions cho password validation
 */

/**
 * Validate password theo yêu cầu:
 * - Tối thiểu 8 ký tự
 * - 1 chữ hoa
 * - 1 chữ thường
 * - 1 ký tự đặc biệt
 * - 1 số
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Mật khẩu phải có tối thiểu 8 ký tự");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 chữ hoa");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 chữ thường");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 số");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 ký tự đặc biệt");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
