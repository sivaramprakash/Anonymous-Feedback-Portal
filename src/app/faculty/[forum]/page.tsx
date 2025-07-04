"use client";
import BackButton from "@/components/auth/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import API from "@/services/API";
import {
  GraduationCap,
  MessageCircleQuestion,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import moment from "moment";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForumPage() {
  const { forum } = useParams<{ forum: string }>();

  interface ForumMessage {
    dislike: any[];
    like: any[];
    approval: string;
    _id: string;
    createdBy?: {
      anonymId?: string;
    };
    createdAt?: string;
    message?: string;
    replies?: {
      _id: string;
      createdBy?: {
        anonymId?: string;
      };
      createdAt?: string;
      reply?: string;
    }[];
  }

  interface ForumData {
    title?: string;
    description?: string;
    subject?: {
      subjectName?: string;
      subjectCode?: string;
    };
    batch?: {
      batchName?: string;
    };
    messages?: ForumMessage[];
  }

  const [forumData, setForumData] = useState<ForumData>({});
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await API.get(`/forum/getForumById/${forum}`);
      if (response.status === 200) {
        setForumData(response.data);
      } else {
        throw new Error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [forum]);

  const handleApprovalChange = async (
    message: ForumMessage,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      const newStatus = message.approval === status ? "PENDING" : status;
      await API.patch(`/forum/approval/${message._id}`, {
        approval: newStatus,
      });
      fetchMessages(); // Refresh data after change
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
    }
  };

  return (
    <>
      <BackButton userType="faculty" />
      <div className="flex flex-col h-screen p-4 bg-gray-100 items-center">
        <div className="grid grid-cols-12 w-full gap-4">
          {/* Left - Messages */}
          <Card className="col-span-8 mb-4 p-4 bg-white shadow-md flex flex-row">
            <CardContent className="flex-1 overflow-y-auto space-y-6">
              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : forumData.messages?.length ? (
                forumData.messages.map((msg) => (
                  <div key={msg._id} className="space-y-2">
                    <div className="flex gap-3">
                      <MessageCircleQuestion size={40} />
                      <div className="bg-gray-200 p-3 rounded-lg w-full">
                        <div className="flex justify-between text-sm text-gray-700 font-semibold">
                          <span>{msg.createdBy?.anonymId ?? "Anonymous"}</span>
                          <span>{moment(msg.createdAt).fromNow()}</span>
                        </div>
                        <p className="text-sm mt-1">{msg.message}</p>
                        <div className="mt-2 text-xs text-gray-500 flex gap-2 items-center">
                          <span className="flex items-center gap-1">
                            <ThumbsUp />
                            {msg.like?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown />
                            {msg.dislike?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="flex p-4 gap-4">
                      <Button
                        onClick={() => handleApprovalChange(msg, "APPROVED")}
                        className={
                          msg.approval === "APPROVED"
                            ? "bg-green-500"
                            : "bg-zinc-500"
                        }
                      >
                        {msg.approval === "APPROVED" ? "Approved" : "Approve"}
                      </Button>
                      <Button
                        onClick={() => handleApprovalChange(msg, "REJECTED")}
                        className={
                          msg.approval === "REJECTED"
                            ? "bg-red-500"
                            : "bg-zinc-500"
                        }
                      >
                        {msg.approval === "REJECTED" ? "Rejected" : "Reject"}
                      </Button>
                    </CardContent>

                    {/* Replies */}
                    {msg.replies?.map((rep) => (
                      <div
                        key={rep._id}
                        className="ml-12 flex gap-2 items-start text-sm"
                      >
                        <div className="bg-gray-100 p-2 rounded w-full">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{rep.createdBy?.anonymId ?? "Anonymous"}</span>
                            <span>{moment(rep.createdAt).fromNow()}</span>
                          </div>
                          <p>{rep.reply}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No messages found in this forum.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right - Info */}
          <Card className="col-span-4 mb-4 p-4 bg-white shadow-md">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={32} />
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold">Forum: {forum}</h2>
                  {forumData.title && (
                    <span className="text-sm text-gray-900 font-semibold">
                      {forumData.title}
                    </span>
                  )}
                  {forumData.description && (
                    <span className="text-sm text-gray-500">
                      {forumData.description}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-2">
                  Subject:{" "}
                  <span className="text-gray-400">
                    {forumData.subject?.subjectName} (
                    {forumData.subject?.subjectCode})
                  </span>
                </h2>
                <h2 className="text-lg font-medium mb-2">
                  Batch:{" "}
                  <span className="text-gray-400">
                    {forumData.batch?.batchName}
                  </span>
                </h2>
                <h2 className="text-lg font-medium mb-2">
                  Feedbacks:{" "}
                  <span className="text-gray-400">
                    {forumData.messages?.length ?? 0}
                  </span>
                </h2>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
