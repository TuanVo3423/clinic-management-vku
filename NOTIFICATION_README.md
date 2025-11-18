# 🔔 Realtime Notification System

Hệ thống thông báo realtime sử dụng Socket.IO để nhận và hiển thị thông báo tức thì.

## ✨ Tính năng

- ✅ Nhận thông báo realtime qua Socket.IO
- ✅ Hiển thị danh sách thông báo
- ✅ Badge counter hiển thị số thông báo chưa đọc
- ✅ Browser notification (nếu được cấp quyền)
- ✅ Âm thanh thông báo
- ✅ Trạng thái kết nối realtime
- ✅ Tự động reconnect khi mất kết nối
- ✅ Responsive design

## 📁 Cấu trúc file

```
src/examples/
├── pages/
│   └── Notification/
│       ├── index.jsx           # Trang danh sách thông báo
│       └── notification.css    # Styles cho trang thông báo
├── contexts/
│   └── NotificationContext.jsx # Context quản lý notification state
├── services/
│   └── socketService.js        # Socket.IO service
└── components/
    ├── NotificationBell.jsx    # Component icon thông báo
    └── NotificationBell.css    # Styles cho icon thông báo
```

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install socket.io-client
```

### 2. Cấu hình biến môi trường

Tạo file `.env` trong thư mục root:

```env
REACT_APP_API_URL=http://localhost:8081/api/v1
REACT_APP_SOCKET_URL=http://localhost:8081
```

### 3. Đảm bảo Backend đã cấu hình

Backend phải:

- Hỗ trợ Socket.IO
- Lắng nghe MongoDB Change Streams
- Emit event `new-notification` khi có notification mới

Chi tiết xem file: `guide_socket_noti.md`

## 💻 Sử dụng

### Truy cập trang thông báo

Sau khi đăng nhập, click vào icon chuông 🔔 trên header để xem danh sách thông báo.

URL: `/admin/notifications`

### Sử dụng NotificationContext trong component khác

```jsx
import { useNotification } from "../contexts/NotificationContext";

function MyComponent() {
  const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead } =
    useNotification();

  return (
    <div>
      <p>Unread: {unreadCount}</p>
      <p>Connected: {isConnected ? "Yes" : "No"}</p>
      {notifications.map((notif) => (
        <div key={notif._id}>
          {notif.message}
          <button onClick={() => markAsRead(notif._id)}>Mark as read</button>
        </div>
      ))}
    </div>
  );
}
```

### Sử dụng Socket Service trực tiếp

```jsx
import socketService from "../services/socketService";

// Kết nối
const userId = "USER_ID";
socketService.connect(userId);

// Lắng nghe notification mới
socketService.on("new-notification", (notification) => {
  console.log("New notification:", notification);
});

// Gửi custom event
socketService.emit("custom-event", { data: "test" });

// Ngắt kết nối
socketService.disconnect();
```

## 📊 Notification Data Structure

```typescript
{
  _id: string;
  recipientType: 'patient' | 'doctor';
  recipientId: string;
  type: 'appointment_created' | 'appointment_updated' | 'appointment_cancelled';
  message: string;
  channel: 'sms' | 'email';
  status?: 'sent' | 'failed';
  createdAt: Date;
  read?: boolean; // Frontend only
}
```

## 🎨 UI Components

### NotificationBell Component

Hiển thị icon chuông với:

- Badge số lượng thông báo chưa đọc
- Trạng thái kết nối (wifi icon)
- Animation ring khi hover
- Click để navigate đến trang notifications

### Notification Page

Trang danh sách thông báo với:

- List view các notification
- Icon và màu sắc theo loại notification
- Thời gian hiển thị dạng relative (e.g., "2 phút trước")
- Trạng thái gửi (sent/failed)
- Button tải lại
- Empty state khi chưa có notification

## 🔧 Troubleshooting

### Socket không kết nối được

1. Kiểm tra `REACT_APP_SOCKET_URL` trong `.env`
2. Kiểm tra backend có chạy và hỗ trợ Socket.IO
3. Kiểm tra CORS configuration ở backend
4. Mở Console để xem log

### Không nhận được notification

1. Kiểm tra đã đăng nhập và có `userId` trong localStorage
2. Kiểm tra backend có emit event `new-notification` đúng format
3. Kiểm tra `recipientId` trong notification có khớp với userId
4. Mở Console để debug

### Browser notification không hiện

1. Kiểm tra quyền notification trong browser settings
2. Website phải chạy trên HTTPS (production) hoặc localhost
3. Thử chạy: `Notification.requestPermission()`

## 📝 API Endpoints

### GET /notifications

Lấy danh sách notifications

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "data": [
    {
      "_id": "...",
      "recipientType": "patient",
      "recipientId": "...",
      "type": "appointment_created",
      "message": "...",
      "channel": "sms",
      "status": "sent",
      "createdAt": "2025-11-09T..."
    }
  ]
}
```

## 🎯 Future Enhancements

- [ ] Mark notification as read API integration
- [ ] Delete notification
- [ ] Filter notifications by type
- [ ] Pagination for large notification list
- [ ] Push notifications for mobile
- [ ] Notification preferences/settings
- [ ] Group notifications by date
- [ ] Search notifications

## 📚 Dependencies

- `socket.io-client`: ^4.x - Socket.IO client
- `antd`: ^5.x - UI components
- `dayjs`: ^1.x - Date formatting
- `react-router-dom`: ^7.x - Routing

## 🤝 Contributing

Nếu có bug hoặc feature request, vui lòng tạo issue hoặc pull request.

## 📄 License

MIT
