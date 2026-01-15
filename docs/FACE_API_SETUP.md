# 🎯 Hướng dẫn sử dụng face-api.js (Miễn phí, không cần đăng ký)

## ✅ Ưu điểm

- ✅ **Hoàn toàn miễn phí** - Không cần đăng ký dịch vụ nào
- ✅ **Mã nguồn mở** - Chạy hoàn toàn trên browser
- ✅ **Không cần API key** - Không phụ thuộc dịch vụ bên ngoài
- ✅ **Privacy** - Dữ liệu không rời khỏi máy của bạn

## 📦 Đã cài đặt

Package `face-api.js` đã được cài đặt sẵn trong project.

## 🔧 Models Files

face-api.js cần các model files để hoạt động. Có 2 cách:

### Cách 1: Sử dụng CDN (Đơn giản nhất - Đã cấu hình sẵn)

Models sẽ tự động tải từ CDN khi chạy. Không cần làm gì thêm!

### Cách 2: Tải models về local (Nhanh hơn, ổn định hơn)

1. Tải models từ: https://github.com/justadudewhohacks/face-api.js-models
2. Tạo thư mục `public/models` trong project
3. Copy các file models vào `public/models`:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`

Sau đó cập nhật `app/lib/faceRecognition.ts` để dùng local models:

```typescript
const MODEL_URL = "/models"; // Đã cấu hình sẵn
```

## 🚀 Sử dụng

1. Chạy dev server:
   ```bash
   npm run dev
   ```

2. Mở http://localhost:3000

3. Nhấn nút **"Login with Face ID"**

4. Cho phép truy cập camera

5. Đợi models tải (lần đầu tiên có thể mất vài giây)

6. Camera sẽ mở, nhấn **"Xác nhận"** để chụp và nhận diện

## 📝 Lưu ý

- **Lần đầu tiên**: Models sẽ tải từ CDN, có thể mất 10-30 giây
- **Camera**: Cần cấp quyền truy cập camera
- **Ánh sáng**: Đảm bảo đủ ánh sáng để nhận diện tốt
- **Khuôn mặt**: Phải nhìn thẳng vào camera, khuôn mặt rõ ràng

## 🔄 Migration từ FaceIO

Nếu bạn đã dùng FaceIO trước đó, dữ liệu vẫn tương thích:
- Users đã đăng ký với FaceIO vẫn hoạt động
- Có thể đăng ký thêm users mới với face-api.js
- Hệ thống hỗ trợ cả 2 phương thức

## 🆘 Gặp vấn đề?

1. **Models không tải được**: 
   - Kiểm tra kết nối internet
   - Thử tải models về local (Cách 2 ở trên)

2. **Camera không mở**:
   - Kiểm tra quyền truy cập camera trong browser
   - Đảm bảo đang dùng HTTPS hoặc localhost

3. **Không nhận diện được**:
   - Đảm bảo đủ ánh sáng
   - Khuôn mặt phải rõ ràng, nhìn thẳng camera
   - Thử lại nhiều lần
