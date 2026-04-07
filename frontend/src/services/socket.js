import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.connectionPromise = null;
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log('🔌 Socket already connected');
      return Promise.resolve();
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        console.log('🔌 Connecting to socket:', socketUrl, 'with token:', token ? 'present' : 'missing');
        
        // Disconnect existing socket if any
        if (this.socket) {
          this.socket.disconnect();
        }
        
        this.socket = io(socketUrl, {
          auth: {
            token: token
          },
          transports: ['websocket', 'polling'],
          timeout: 20000,
          forceNew: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        this.setupEventListeners(resolve, reject);
      } catch (error) {
        console.error('🔌 Socket connection error:', error);
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  setupEventListeners(resolve, reject) {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('🔌 Connected to server successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.connectionPromise = null;
      
      // Show connection toast only after reconnection
      if (this.reconnectAttempts > 0) {
        toast.success('Reconnected to server');
      }
      
      if (resolve) {
        resolve();
        resolve = null; // Prevent multiple calls
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from server:', reason);
      this.isConnected = false;
      this.connectionPromise = null;
      
      if (reason === 'io server disconnect') {
        // Server disconnected the client, manual reconnection needed
        toast.error('Connection lost. Please refresh the page.');
      } else if (reason === 'transport close' || reason === 'transport error') {
        console.log('🔄 Attempting to reconnect...');
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error.message);
      this.isConnected = false;
      this.reconnectAttempts++;
      this.connectionPromise = null;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Unable to connect to server. Please check your connection.');
        if (reject) {
          reject(error);
          reject = null;
        }
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      toast.success('Connection restored!');
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('🔄 Reconnection error:', error.message);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('🔄 Reconnection failed');
      toast.error('Failed to reconnect. Please refresh the page.');
    });

    // Authentication events
    this.socket.on('auth_error', (error) => {
      console.error('🔐 Authentication error:', error);
      toast.error('Authentication failed. Please login again.');
      this.disconnect();
      if (reject) {
        reject(new Error('Authentication failed'));
        reject = null;
      }
    });

    // Real-time events with better logging
    this.socket.on('user_online', (data) => {
      console.log('👤 User came online:', data.user?.name);
    });

    this.socket.on('user_offline', (data) => {
      console.log('👤 User went offline:', data.userId);
    });

    this.socket.on('user_registered', (data) => {
      console.log('👤 User registered:', data.user?.name);
      toast.success(`Welcome ${data.user?.name}! 🎉`);
    });

    // Project events with detailed logging
    this.socket.on('project_created', (data) => {
      console.log('📊 Project created event received:', data.project?.name);
      toast.success(`New project "${data.project?.name}" created!`);
    });

    this.socket.on('project_updated', (data) => {
      console.log('📊 Project updated event received:', data.project?.name);
    });

    this.socket.on('project_deleted', (data) => {
      console.log('📊 Project deleted event received:', data.projectName);
      toast.info(`Project "${data.projectName}" was deleted`);
    });

    // Task events with detailed logging
    this.socket.on('task_created', (data) => {
      console.log('📋 Task created event received:', data.task?.title);
    });

    this.socket.on('task_updated', (data) => {
      console.log('📋 Task updated event received:', data.task?.title);
    });

    this.socket.on('task_deleted', (data) => {
      console.log('📋 Task deleted event received:', data.taskId);
    });

    this.socket.on('tasks_reordered', (data) => {
      console.log('📋 Tasks reordered event received:', data.tasks?.length, 'tasks');
    });

    // Team events
    this.socket.on('team_member_added', (data) => {
      console.log('👥 Team member added:', data.newMember?.name, 'to', data.project?.name);
      toast.info(`${data.newMember?.name} joined "${data.project?.name}"`);
    });

    this.socket.on('team_member_removed', (data) => {
      console.log('👥 Team member removed:', data.removedMember?.name, 'from', data.project?.name);
      toast.info(`${data.removedMember?.name} left "${data.project?.name}"`);
    });

    this.socket.on('team_member_updated', (data) => {
      console.log('👥 Team member updated:', data.updatedMember?.name, 'in', data.project?.name);
    });

    // Project link events
    this.socket.on('project_link_added', (data) => {
      console.log('🔗 Project link added:', data.link?.title);
    });

    this.socket.on('project_link_updated', (data) => {
      console.log('🔗 Project link updated:', data.linkId);
    });

    this.socket.on('project_link_removed', (data) => {
      console.log('🔗 Project link removed:', data.linkId);
    });

    // Other events
    this.socket.on('user_joined_project', (data) => {
      console.log('👥 User joined project:', data.user?.name);
    });

    this.socket.on('user_left_project', (data) => {
      console.log('👥 User left project:', data.user?.name);
    });

    this.socket.on('user_typing', (data) => {
      console.log('⌨️ User typing:', data.user?.name, data.typing);
    });

    this.socket.on('user_role_changed', (data) => {
      console.log('👤 User role changed');
      toast.info('User role has been updated');
    });

    this.socket.on('user_status_changed', (data) => {
      console.log('👤 User status changed');
      toast.info('User status has been updated');
    });

    // Test event for debugging
    this.socket.on('test_event', (data) => {
      console.log('🧪 Test event received:', data);
      toast.success('Test event received!');
    });
  }

  disconnect() {
    console.log('🔌 Disconnecting socket...');
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.connectionPromise = null;
    }
  }

  // Project-related methods
  joinProject(projectId) {
    if (this.socket?.connected) {
      console.log('🏠 Joining project:', projectId);
      this.socket.emit('join_project', projectId);
    } else {
      console.warn('🏠 Cannot join project - socket not connected');
    }
  }

  leaveProject(projectId) {
    if (this.socket?.connected) {
      console.log('🚪 Leaving project:', projectId);
      this.socket.emit('leave_project', projectId);
    } else {
      console.warn('🚪 Cannot leave project - socket not connected');
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

  // Test connection
  testConnection() {
    if (this.socket?.connected) {
      console.log('🧪 Testing socket connection...');
      this.socket.emit('test_connection', { 
        message: 'Testing connection', 
        timestamp: new Date().toISOString() 
      });
      return true;
    } else {
      console.warn('🧪 Cannot test connection - socket not connected');
      return false;
    }
  }

  // Generic event listeners
  on(event, callback) {
    if (this.socket) {
      console.log('🎧 Registering listener for:', event);
      this.socket.on(event, callback);
    } else {
      console.warn('🎧 Cannot register listener - socket not initialized');
    }
  }

  off(event, callback) {
    if (this.socket) {
      console.log('🎧 Removing listener for:', event);
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      console.log('📤 Emitting event:', event, data);
      this.socket.emit(event, data);
      return true;
    } else {
      console.warn('📤 Cannot emit event - socket not connected:', event);
      return false;
    }
  }

  // Connection status
  isSocketConnected() {
    const connected = this.isConnected && this.socket?.connected;
    console.log('🔍 Socket connection status:', connected);
    return connected;
  }

  // Get connection info
  getConnectionInfo() {
    return {
      isConnected: this.isConnected,
      socketConnected: this.socket?.connected || false,
      socketId: this.socket?.id || null,
      reconnectAttempts: this.reconnectAttempts,
      transport: this.socket?.io?.engine?.transport?.name || null
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.socketService = socketService;
}

export default socketService;