"use client";
import BackButton from "@/components/auth/back-button";
import { Card, CardContent } from "@/components/ui/card";
import API from "@/services/API";
import {
  GraduationCap,
  MessageCircleQuestion,
  ThumbsDown,
  ThumbsUp,
  Send,
} from "lucide-react";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import moment from "moment";

export default function StudentForumPage() {
  const { forum } = useParams<{ forum: string }>();
  const [messages, setMessages] = useState<any>({});
  const [newMessage, setNewMessage] = useState("");
  const [replies, setReplies] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchMessages();
  }, [forum]);
  const [studentDetails, setStudentDetails] = useState<any>({});
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("student");
      if (stored) {
        setStudentDetails(JSON.parse(stored));
        console.log("Student Details:", JSON.parse(stored));
      }
    }
  }, []);
  const fetchMessages = async () => {
    try {
      const response = await API.get(`/forum/getForumById/${forum}`);
      if (response.status === 200) {
        setMessages(response.data);
        console.log("Fetched messages:", response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;
    if (!studentDetails?.id) {
      console.error("Student ID is not available");
      return;
    }
    try {
      await API.post(`/forum/addMessage/${forum}`, {
        message: newMessage,
        createdBy: studentDetails?.id,
      });
      setNewMessage("");
      fetchMessages(); // refresh
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const handlePostReply = async (postId: string, msgId: string) => {
    if (!replies[msgId]?.trim()) return;
    try {
      await API.post(`/forum/addReply/${postId}`, {
        messageId: msgId,
        reply: replies[msgId],
        createdBy: studentDetails?.id, // include this if your backend expects it
      });
      setReplies({ ...replies, [msgId]: "" });
      fetchMessages();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleLike = async (forum: string, msgId: string) => {
    try {
      // Check if the user has disliked the message before liking
      const hasDisliked = messages.messages.find((msg: any) =>
        msg._id === msgId &&
        msg.dislike.some((d: any) => d.student === studentDetails?.id)
      );
      if (hasDisliked) {
        // If the user has disliked, remove the dislike first
        await API.patch(`/forum/dislikeMessage/${forum}`, {
          userId: studentDetails?.id,
          msgId: msgId, // include this if your backend expects it
        });
      }
      // Now like the message
      await API.patch(`/forum/likeMessage/${forum}`, {
        userId: studentDetails?.id,
        msgId: msgId,
      });
      fetchMessages();
    } catch (err) {
      console.error("Error liking message:", err);
    }
  };

  const handleDislike = async (forum: string, msgId: string) => {
    // Check if the user has liked the message before disliking
    const hasLiked = messages.messages.find((msg: any) =>
      msg._id === msgId &&
      msg.like.some((l: any) => l.student === studentDetails?.id)
    );
    if (hasLiked) {
      // If the user has liked, remove the like first 
      try {
        await API.patch(`/forum/likeMessage/${forum}`, {
          userId: studentDetails?.id,
          msgId: msgId, // include this if your backend expects it
        });
      } catch (err) {
        console.error("Error removing like:", err);
      }
    }
    // Now dislike the message
    try {
      await API.patch(`/forum/dislikeMessage/${forum}`, {
        userId: studentDetails?.id,
        msgId: msgId, // include this if your backend expects it
      });
      fetchMessages();
    } catch (err) {
      console.error("Error disliking message:", err);
    }
  };
  console.log("Messages:", messages);

  return (
    <>
      <BackButton userType="student" />
      <div className="flex flex-col h-screen p-4 bg-gray-100 items-center">
        <div className="grid grid-cols-12 w-full gap-4">
          {/* Main Forum */}
          <Card className="col-span-8 mb-4 p-4 bg-white shadow-md">
            <CardContent className="flex-1 overflow-y-auto space-y-6">
              {/* New Feedback Form */}
              <div className="flex gap-3 mb-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-3 border rounded-md"
                  placeholder="Write your anonymous feedback..."
                />
                <button
                  onClick={handlePostMessage}
                  className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                >
                  <Send />
                </button>
              </div>

              {/* Messages List */}
              {messages?.messages?.length > 0 ? (
                messages.messages.map((msg) => (
                  <div key={msg._id} className="space-y-2">
                    <div className="flex gap-3">
                      <MessageCircleQuestion size={40} />
                      <div className={msg.approval === "APPROVED" ? "bg-green-200 p-3 rounded-lg w-full" : msg.approval === "REJECTED" ? "bg-red-200 p-3 rounded-lg w-full" : "bg-gray-200 p-3 rounded-lg w-full"}>
                        <div className="flex justify-between text-sm text-gray-700 font-semibold">
                          <span>{msg.createdBy?.anonymId}</span>
                          <span>
                            {/* {new Date(msg.createdAt).toLocaleString()} */}
                            {/* Show like x mins ago, x hrs ago, if more than 1 day show */}
                            {moment(msg.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{msg.message}</p>
                        <div className="mt-2 text-xs text-gray-500 flex gap-4 items-center">
                            <button
                            onClick={() => handleLike(forum, msg._id)}
                            className="flex items-center gap-1"
                            >
                            <ThumbsUp
                              fill={
                              msg.like.some(
                                (l: { student: any; }) => l.student === studentDetails?.id
                              )
                                ? "blue"
                                : "gray"
                              }
                              color={
                              msg.like.some(
                                (l: { student: any; }) => l.student === studentDetails?.id
                              )
                                ? "blue"
                                : "gray"
                              }
                              size={16}
                            />
                            {msg.like.length || 0}
                            </button>
                          <button
                            onClick={() => handleDislike(forum, msg._id)}
                            className="flex items-center gap-1"
                          >
                            <ThumbsDown
                              fill={
                                msg.dislike.some(
                                  (l: { student: any; }) => l.student === studentDetails?.id
                                )
                                  ? "red"
                                  : "gray"
                              }
                              color={
                                msg.dislike.some(
                                  (l: { student: any; }) => l.student === studentDetails?.id
                                )
                                  ? "red"
                                  : "gray"
                              }
                              size={16}
                            />
                            {msg.dislike.length || 0}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {msg.replies?.map((rep) => (
                      <div
                        key={rep._id}
                        className="ml-12 flex gap-2 items-start text-sm"
                      >
                        <div className="bg-gray-100 p-2 rounded w-full">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{rep.createdBy?.anonymId}</span>
                            <span>{moment(rep.createdAt).fromNow()}</span>
                          </div>
                          <p>{rep.reply}</p>
                        </div>
                      </div>
                    ))}

                    {/* Reply Input */}
                    <div className="ml-12 mt-2 flex gap-2 items-center">
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Reply..."
                        value={replies[msg._id] || ""}
                        onChange={(e) =>
                          setReplies({ ...replies, [msg._id]: e.target.value })
                        }
                      />
                      <button
                        onClick={() => handlePostReply(forum, msg._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No messages found in this forum.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <Card className="col-span-4 mb-4 p-4 bg-white shadow-md">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={32} />
                <div>
                  <h2 className="text-xl font-semibold">Forum: {forum}</h2>
                  <p className="text-sm font-semibold text-gray-900">
                    {messages.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {messages.description}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Subject:{" "}
                  <span className="text-gray-500">
                    {messages?.subject?.subjectName} (
                    {messages?.subject?.subjectCode})
                  </span>
                </p>
                <p className="text-sm font-medium">
                  Batch:{" "}
                  <span className="text-gray-500">
                    {messages?.batch?.batchName}
                  </span>
                </p>
                <p className="text-sm font-medium">
                  Feedbacks:{" "}
                  <span className="text-gray-500">
                    {messages?.messages?.length} feedbacks
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
