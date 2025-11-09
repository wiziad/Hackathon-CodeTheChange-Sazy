import { create } from 'zustand';
import { Thread, ChatMessage } from '@/types';

interface MessageState {
  unreadCount: number;
  threads: Thread[];
  activeThread: Thread | null;
  messages: Record<string, ChatMessage[]>; // threadId -> messages
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  setThreads: (threads: Thread[]) => void;
  setActiveThread: (thread: Thread | null) => void;
  setMessages: (threadId: string, messages: ChatMessage[]) => void;
  addMessage: (threadId: string, message: ChatMessage) => void;
  updateThread: (thread: Thread) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  unreadCount: 0,
  threads: [],
  activeThread: null,
  messages: {},
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  resetUnreadCount: () => set({ unreadCount: 0 }),
  setThreads: (threads) => set({ threads }),
  setActiveThread: (thread) => set({ activeThread: thread }),
  setMessages: (threadId, messages) => set((state) => ({
    messages: { ...state.messages, [threadId]: messages }
  })),
  addMessage: (threadId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [threadId]: [...(state.messages[threadId] || []), message]
    }
  })),
  updateThread: (thread) => set((state) => ({
    threads: state.threads.map((t) => t.id === thread.id ? thread : t)
  })),
}));