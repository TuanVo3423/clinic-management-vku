import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnected = false;
  }

  connect(userId = null) {
    if (this.socket && this.isConnected) {
      console.log("Socket already connected");
      return this.socket;
    }

    const socketUrl = process.env.REACT_APP_BASE_BE_URL || "http://localhost:3000";
    console.log("connect to socket");
    this.socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection success event
    this.socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      this.isConnected = true;

      // Register userId if provided
      if (userId) {
        this.register(userId);
      }

      // Trigger connect listeners
      this.triggerListeners("connect");
    });

    // Disconnect event
    this.socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from Socket.IO server:", reason);
      this.isConnected = false;
      this.triggerListeners("disconnect", reason);
    });

    // Reconnection attempt
    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`);
    });

    // Reconnection success
    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;

      // Re-register userId after reconnection
      const storedUserId =
        localStorage.getItem("userId") || localStorage.getItem("doctorId");
      if (storedUserId) {
        this.register(storedUserId);
      }

      this.triggerListeners("reconnect", attemptNumber);
    });

    // Connection error
    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      this.triggerListeners("connect_error", error);
    });

    // Listen for new notifications
    this.socket.on("new-notification", (notification) => {
      console.log("🔔 New notification received:", notification);
      this.triggerListeners("new-notification", notification);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      console.log("Socket disconnected manually");
    }
  }

  register(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("register", userId);
      console.log(`📝 Registered userId: ${userId}`);
      localStorage.setItem("socketUserId", userId);
    } else {
      console.warn("Cannot register: Socket not connected");
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Trigger all listeners for an event
  triggerListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error);
        }
      });
    }
  }

  // Send custom event
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}: Socket not connected`);
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
