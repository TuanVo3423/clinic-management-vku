# Trang Admin Quản Lý Lịch Khám - Phòng Khám

## 📋 Tổng quan

Trang admin dành cho **bác sĩ** để quản lý lịch khám bệnh nhân với 3 chế độ xem:

### 1. 📅 **Timeline View** (Timetable)

- Hiển thị lịch khám theo dạng timeline/calendar
- Xem theo ngày, tuần
- Kéo thả để thay đổi thời gian
- Resize để điều chỉnh độ dài cuộc hẹn
- Click vào ô trống để tạo lịch mới
- Click vào lịch hẹn để chỉnh sửa/xóa

### 2. 📝 **List View** (Danh sách)

- Hiển thị tất cả lịch khám dạng bảng
- Tìm kiếm theo tên bệnh nhân
- Lọc theo trạng thái (pending, confirmed, cancelled, completed)
- Sắp xếp theo thời gian
- CRUD đầy đủ: Thêm, Sửa, Xóa lịch khám
- Phân trang tự động

### 3. 📊 **Statistics** (Thống kê)

- **Thống kê tổng quan:**
  - Tổng số lịch khám
  - Số lịch chờ xác nhận
  - Số lịch đã xác nhận
  - Số lịch đã hủy
- **Biểu đồ cột:** Số lượng lịch khám theo từng ngày
- **Bảng thống kê theo giường:** Hiển thị số lượng lịch khám trên mỗi giường
- Có thể chọn khoảng thời gian để xem thống kê

## 🚀 Tính năng chính

### CRUD Operations

- ✅ **Create (Tạo)**: Tạo lịch khám mới từ Timeline hoặc List view
- ✅ **Read (Đọc)**: Xem danh sách và chi tiết lịch khám
- ✅ **Update (Cập nhật)**:
  - Chỉnh sửa thông tin lịch khám
  - Kéo thả trên timeline để thay đổi thời gian/giường
  - Resize để điều chỉnh thời gian bắt đầu/kết thúc
- ✅ **Delete (Xóa)**: Xóa lịch khám (có xác nhận)

### Điều chỉnh giờ khám

- **Cho từng bệnh nhân**: Click vào lịch hẹn để chỉnh sửa
- **Từng ngày**: Sử dụng Timeline view để xem và điều chỉnh theo ngày
- **Nhiều ngày**: Chuyển sang Week view trong Timeline

### Trạng thái lịch khám

- 🟡 **Pending** (Chờ xác nhận): Màu vàng
- 🟢 **Confirmed** (Đã xác nhận): Màu xanh lá
- 🔴 **Cancelled** (Đã hủy): Màu đỏ
- 🔵 **Completed** (Hoàn thành): Màu xanh dương

## 🛠️ Công nghệ sử dụng

- **React**: Framework chính
- **Ant Design**: UI Components
- **@ant-design/plots**: Biểu đồ thống kê
- **react-big-schedule**: Timeline/Scheduler component
- **axios**: HTTP client
- **dayjs**: Xử lý ngày giờ

## 📦 Cấu trúc file

```
src/examples/pages/Admin/
├── index.jsx          # Main component với tabs
├── class-based.jsx    # Timeline view (đã có)
├── ListView.jsx       # List view (mới)
├── Statistics.jsx     # Statistics view (mới)
└── admin.css          # Styles
```

## 🎯 API Endpoints sử dụng

```javascript
// Lấy danh sách giường
GET http://localhost:3000/beds

// Lấy lịch khám theo khoảng thời gian
GET http://localhost:3000/appointments/by-time-range?startDate={start}&endDate={end}

// Tạo lịch khám mới
POST http://localhost:3000/appointments

// Cập nhật lịch khám
PATCH http://localhost:3000/appointments/patient/{id}

// Xóa lịch khám
DELETE http://localhost:3000/appointments/{id}
```

## 💡 Hướng dẫn sử dụng

### Timeline View

1. **Tạo lịch mới**: Click vào ô trống trên timeline
2. **Chỉnh sửa**: Click vào lịch hẹn màu vàng (pending)
3. **Kéo thả**: Giữ và kéo lịch hẹn để thay đổi thời gian/giường
4. **Resize**: Kéo cạnh trái/phải của lịch hẹn để điều chỉnh thời gian

### List View

1. **Tìm kiếm**: Nhập tên bệnh nhân vào ô tìm kiếm
2. **Lọc**: Click vào header "Trạng thái" để lọc
3. **Thêm mới**: Click nút "Thêm lịch khám" góc phải
4. **Sửa**: Click icon bút chì (Edit)
5. **Xóa**: Click icon thùng rác (Delete)

### Statistics

1. **Chọn khoảng thời gian**: Sử dụng RangePicker
2. **Xem biểu đồ**: Quan sát số lượng lịch khám theo ngày
3. **Xem chi tiết**: Cuộn xuống xem bảng thống kê theo giường

## ⚠️ Lưu ý

- Chỉ có thể chỉnh sửa lịch hẹn ở trạng thái **pending**
- Giờ khám phải trong khoảng 16:30 - 19:30
- Dữ liệu được tự động làm mới sau mỗi thao tác
- Backend API phải chạy ở `http://localhost:3000`

## 🔮 Tính năng có thể mở rộng

- [ ] Thêm chức năng export Excel
- [ ] Gửi thông báo cho bệnh nhân
- [ ] Tích hợp với hệ thống thanh toán
- [ ] Thêm lịch sử thay đổi
- [ ] Báo cáo chi tiết hơn
- [ ] Filter nâng cao (theo bác sĩ, theo khoa)
- [ ] Dark mode

## 📞 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.
