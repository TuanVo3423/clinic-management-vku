# 🤖 Hướng Dẫn Cài Đặt Admin Chatbot

## 📦 Cài Đặt Thư Viện

Để sử dụng tính năng chatbot với đầy đủ chức năng export file, bạn cần cài đặt các thư viện sau:

```bash
npm install xlsx jspdf jspdf-autotable
```

### Chi tiết thư viện:

- **xlsx**: Export file Excel (.xlsx)
- **jspdf**: Export file PDF
- **jspdf-autotable**: Plugin tạo bảng trong PDF

## 🚀 Cách Sử dụng

### 1. Truy cập Chatbot

- Đăng nhập vào trang Admin
- Chọn tab **"AI Assistant"** (icon robot)
- Giao diện chatbot sẽ hiển thị

### 2. Các Tính Năng Chính

#### 📊 Xem Lịch Hẹn

**Ví dụ câu hỏi:**

- "Cho tôi xem lịch hẹn hôm nay"
- "Lịch hẹn tuần này"
- "Hiển thị lịch hẹn pending"
- "Lịch hẹn đã hoàn thành tháng 12"

**Kết quả:** Hiển thị bảng danh sách lịch hẹn với thống kê

---

#### 💰 Thống Kê Doanh Thu

**Ví dụ câu hỏi:**

- "Doanh thu tháng này là bao nhiêu?"
- "Tính doanh thu tuần trước"
- "Doanh thu từ ngày 1/12 đến 10/12"

**Kết quả:** Hiển thị tổng doanh thu, doanh thu trung bình, bảng chi tiết theo ngày

---

#### 📥 Xuất File

**Ví dụ câu hỏi:**

- "Xuất file Excel lịch hẹn tháng 12"
- "Export PDF lịch hẹn đã xác nhận"
- "Tải file CSV tất cả lịch hẹn tuần này"

**Kết quả:** File sẽ được tải xuống tự động vào thư mục Downloads

**Định dạng hỗ trợ:**

- ✅ Excel (.xlsx)
- ✅ PDF (.pdf)
- ✅ CSV (.csv)

---

#### 🔍 Tìm Kiếm

**Ví dụ câu hỏi:**

- "Tìm lịch hẹn của bệnh nhân Nguyễn Văn A"
- "Tìm theo số điện thoại 0912345678"
- "Tìm lịch hẹn của bác sĩ Trần Thị B"

**Kết quả:** Danh sách lịch hẹn phù hợp với từ khóa

---

### 3. Tips Sử dụng

- ✨ Sử dụng các **câu hỏi gợi ý** để nhanh chóng
- 🎯 Có thể hỏi bằng ngôn ngữ tự nhiên
- ⏎ Nhấn **Enter** để gửi, **Shift+Enter** để xuống dòng
- 📊 Kết quả hiển thị dưới dạng bảng và biểu đồ trực quan
- 💾 File export tự động tải xuống, kiểm tra thư mục Downloads

---

## 🔧 Cấu Hình Backend

Đảm bảo backend đang chạy tại: `http://localhost:3000`

API endpoint: `POST /admin-chatbot/query`

---

## ⚡ Tính Năng Nổi Bật

1. **AI-Powered**: Sử dụng Google Gemini AI hiểu ngôn ngữ tự nhiên
2. **Smart Export**: Tự động nhận diện định dạng file cần xuất (Excel/PDF/CSV)
3. **Real-time**: Hiển thị kết quả ngay lập tức
4. **Responsive**: Giao diện tối ưu cho mọi kích thước màn hình
5. **User-Friendly**: Câu hỏi gợi ý giúp người dùng dễ sử dụng

---

## 🐛 Xử Lý Lỗi

Nếu gặp lỗi khi export file:

1. **Lỗi "Module not found"**: Chạy lại lệnh cài đặt thư viện

   ```bash
   npm install xlsx jspdf jspdf-autotable
   ```

2. **File không tải xuống**: Kiểm tra quyền trình duyệt cho phép download

3. **Lỗi kết nối**: Đảm bảo backend đang chạy tại `http://localhost:3000`

4. **Lỗi CORS**: Thêm CORS configuration trong backend

---

## 📸 Screenshots

### Giao diện chính

![Chatbot Interface](./docs/images/chatbot-main.png)

### Hiển thị lịch hẹn

![Appointments View](./docs/images/chatbot-appointments.png)

### Thống kê doanh thu

![Revenue Stats](./docs/images/chatbot-revenue.png)

---

## 🎨 Tùy Chỉnh

### Thay đổi màu sắc

Chỉnh sửa file `AdminChatbot.css`:

```css
/* Gradient chính */
.chatbot-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Màu message người dùng */
.user-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Màu nút gửi */
.send-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Thay đổi câu hỏi gợi ý

Chỉnh sửa trong `AdminChatbot.jsx`:

```javascript
const quickSuggestions = [
  {
    text: "Câu hỏi của bạn",
    icon: <IconComponent />,
  },
  // Thêm các câu hỏi khác...
];
```

---

## 📝 Development Notes

- Component sử dụng **React Hooks** (useState, useEffect, useRef)
- UI framework: **Ant Design**
- Icon library: **@ant-design/icons**
- HTTP client: **axios**

---

## 🔒 Security

- ⚠️ Thêm authentication token vào API request
- ⚠️ Validate input trước khi gửi
- ⚠️ Rate limiting để tránh spam
- ⚠️ Sanitize response data

---

## 📞 Support

Nếu cần hỗ trợ, liên hệ:

- Email: support@clinic.com
- Slack: #chatbot-support

---

**Version**: 1.0.0  
**Last Updated**: December 13, 2025
