import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { message, notification as antdNotification, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import socketService from "../services/socketService";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const fetchNotificationCountUnread = useCallback(async () => {
    try {
      const res = await fetch(
        process.env.REACT_APP_BASE_BE_URL + "/notifications/count/unread",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
    }
  }, []);

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    fetchNotificationCountUnread();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const userInfo = localStorage.getItem("doctor");
    const userId = JSON.parse(userInfo)?._id;
    if (userId) {
      // Connect to socket
      socketService.connect(userId);

      // Listen for connection events
      socketService.on("connect", () => {
        setIsConnected(true);
        message.success("Kết nối thông báo realtime thành công");
      });

      socketService.on("disconnect", () => {
        setIsConnected(false);
        message.warning("Mất kết nối thông báo realtime");
      });

      socketService.on("reconnect", () => {
        setIsConnected(true);
        message.success("Đã kết nối lại thông báo realtime");
      });

      // Listen for new notifications
      socketService.on("new-notification", handleNewNotification);
    }

    // Cleanup on unmount
    return () => {
      socketService.off("connect", () => setIsConnected(true));
      socketService.off("disconnect", () => setIsConnected(false));
      socketService.off("reconnect", () => setIsConnected(true));
      socketService.off("new-notification", handleNewNotification);
    };
  }, []);

  const handleNewNotification = useCallback((notification) => {
    console.log("🔔 Processing new notification:", notification);

    // Add to notifications list
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Show antd notification
    antdNotification.open({
      message: getNotificationTitle(notification.type),
      description: notification.message,
      icon: <BellOutlined style={{ color: "#1890ff" }} />,
      duration: 0,
      placement: "topRight",
      btn: (
        <Button
          type="link"
          onClick={() =>
            navigate(`/admin/appointment/${notification.appointmentId}`)
          }
        >
          Xem chi tiết
        </Button>
      ),
    });

    // Show browser notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const browserNotif = new Notification(
          getNotificationTitle(notification.type),
          {
            body: notification.message,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: notification._id,
            requireInteraction: false,
          }
        );

        // Auto close after 5 seconds
        setTimeout(() => browserNotif.close(), 5000);
        // Handle notification click
        browserNotif.onclick = () => {
          window.focus();
          browserNotif.close();
        };
      } catch (error) {
        console.error("Error showing browser notification:", error);
      }
    }

    // Play notification sound (optional)
    playNotificationSound();
  }, []);

  // minus notification unread count when mark as read
  const minusUnreadCount = useCallback(
    (value) => {
      if (unreadCount - value < 0) {
        setUnreadCount(0);
        return;
      }
      setUnreadCount((prev) => prev - value);
    },
    [unreadCount]
  );

  const getNotificationTitle = (type) => {
    switch (type) {
      case "appointment_created":
        return "🎉 Lịch hẹn mới";
      case "appointment_updated":
        return "📝 Cập nhật lịch hẹn";
      case "appointment_cancelled":
        return "❌ Hủy lịch hẹn";
      default:
        return "🔔 Thông báo";
    }
  };

  const playNotificationSound = () => {
    try {
      // Create audio element for notification sound
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRA0PVanr8LRiHAU9k9n0yXkrBSh+zPLaizsIGGS56+mjUBELTKXh8bllHgU2jdXzzn0vBSh+zPLaizsIGGS56+mjUBELTKXh8bllHgU2jdXzzn0vBSh+zPLaizsIGGS56+mjUBELTKXh8bllHgU2jdXzzn0vBSh+zPLaizsIGGS56+mjUBELTKXh8bllHgU2jdXzzn0vBSh+zPLaizsIGGS56+mjUBELTKXh8bllHgU2jdXzzn0vBSh+zPLaizsIGGS56+mjUBELTKXh8bllHgU2jdXzzn0vBQ=="
      );
      audio.volume = 0.3;
      audio.play().catch((err) => console.log("Cannot play sound:", err));
    } catch (error) {
      console.log("Error playing notification sound:", error);
    }
  };

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const value = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    minusUnreadCount,
    socketService,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationContext;
