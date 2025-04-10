import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import { MessageInput } from './MessageInput';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSkeleton } from './skeletons/MessageSkeleton';

const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Fetch messages and subscribe when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser?._id, getMessages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-base-100">
        {messages.map((message) => {
          const senderId =
            typeof message.senderId === 'string'
              ? message.senderId
              : message.senderId?._id;

          const isMine = senderId === authUser._id;

          const userName = isMine
            ? authUser.fullName || 'You'
            : selectedUser?.fullName || 'User';
          const userPic = isMine
            ? authUser.profilePic || '/avatar.png'
            : selectedUser?.profilePic || '/avatar.png';

          return (
            <div
              key={message._id}
              className={`chat ${isMine ? 'chat-end' : 'chat-start'}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src={userPic} alt="User avatar" />
                </div>
              </div>

              <div className="flex flex-col gap-1 max-w-[80%]">
                <div className="chat-bubble bg-base-200 text-base-content">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text}
                </div>

                {/* ✅ Time below bubble */}
                <div className="flex justify-end">
                  <time className="text-[10px] text-zinc-400">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>

                {/* ✅ Delivered/Seen */}
                <div className="chat-footer opacity-50 text-xs">
                  {isMine ? 'Delivered' : 'Seen'}
                </div>
              </div>
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={messageEndRef}></div>
      </div>

      <MessageInput />
    </div>
  );
};
