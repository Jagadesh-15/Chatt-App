// import { create } from "zustand";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios";

// export const useChatStore = create((set) => ({
//   messages: [],
//   users: [],
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,

//   setSelectedUser: (user) => set({ selectedUser: user }),
//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       set({ users: res.data });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to fetch users");
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessages: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to fetch users");
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },
//   sendMessages: async(messageData) =>{
//     const {selectedUser, messages} = get()
//     try {
//       const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
//       set({ messages:[...messages,res.data]})
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to fetch users");
//     }
//   },

//   sendMessage: async (messageData) => {
//     const { selectedUser, messages } = get();
//     try {
//       const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
//       set({ messages: [...messages, res.data] });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   },
// }));
// src/store/useChatStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  setSelectedUser: (user) => set({ selectedUser: user }),

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`, // Match backend endpoint
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },
  
}));
