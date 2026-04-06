import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    if (this.socket?.connected) {
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('🔌 Connected to server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Show connection toast only after reconnection
      if (this.reconnectAttempts > 0) {
        toast.success('Reconnected to server');
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from server:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected the client, manual reconnection needed
        toast.error('Connection lost. Please refresh the page.');
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      this.isConnected = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Unable to connect to server. Please check your connection.');
      }
    });

    // Authentication events
    this.socket.on('auth_error', (error) => {
      console.error('🔐 Authentication error:', error);
      toast.error('Authentication failed. Please login again.');
      this.disconnect();
    });

    // Real-time events
    this.socket.on('user_online', (data) => {
      console.log('👤 User came online:', data.user.name);
      // You can dispatch this to a global state or show notifications
    });

    this.socket.on('user_offline', (data) => {
      console.log('👤 User went offline:', data.userId);
    });

    this.socket.on('user_registered', (data) => {
      toast.success(`Welcome ${data.user.name}! 🎉`);
    });

    this.socket.on('project_created', (data) => {
      toast.success(`New project "${data.project.name}" created!`);
    });

    this.socket.on('project_updated', (data) => {
      console.log('📋 Project updated:', data.project.name);
      // You can update local state here
    });

    this.socket.on('project_deleted', (data) => {
      toast.info(`Project "${data.projectName}" was deleted`);
    });

    this.socket.on('project_invitation', (data) => {
      toast.success(`You've been invited to "${data.project.name}" by ${data.invitedBy.name}!`);
    });

    this.socket.on('team_member_added', (data) => {
      toast.info(`${data.newMember.name} joined "${data.project.name}"`);
    });

    this.socket.on('user_joined_project', (data) => {
      console.log('👥 User joined project:', data.user.name);
    });

    this.socket.on('user_left_project', (data) => {
      console.log('👥 User left project:', data.user.name);
    });

    this.socket.on('user_typing', (data) => {
      console.log('⌨️ User typing:', data.user.name, data.typing);
      // You can show typing indicators here
    });

    this.socket.on('user_role_changed', (data) => {
      toast.info('User role has been updated');
    });

    this.socket.on('user_status_changed', (data) => {
      toast.info('User status has been updated');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Project-related methods
  joinProject(projectId) {
    if (this.socket?.connected) {
      this.socket.emit('join_project', projectId);
    }
  }

  leaveProject(projectId) {
    if (this.socket?.connected) {
      this.socket.emit('leave_project', projectId);
    }
  }

  // Typing indicators
  startTyping(projectId, taskId) {
    if (this.socket?.connected) {
      this.socket.emit('typing_start', { projectId, taskId });
    }
  }

  stopTyping(projectId, taskId) {
    if (this.socket?.connected) {
      this.socket.emit('typing_stop', { projectId, taskId });
    }
  }

  // Generic event listeners
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  // Connection status
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;