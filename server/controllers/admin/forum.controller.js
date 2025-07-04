import forumModel from "../../models/forumModel.js";

export const getAllForumPosts = async (req, res) => {
  try {
    const posts = await forumModel
      .find()
      .populate("subject", "subjectName")
      .populate("faculty", "name username")
      .populate("batch", "batchName")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addForumPost = async (req, res) => {
  const { title, description, subject, batch, faculty } = req.body;

  try {
    const newPost = new forumModel({
      title,
      description,
      subject,
      batch,
      faculty,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Forum post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getForumPostById = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await forumModel
      .findById(postId)
      .populate("subject", "faculty batch subjectName subjectCode")
      .populate("faculty", "name")
      .populate("batch", "batchName")
      .populate("messages.createdBy", "anonymId")
      .populate("messages.replies.createdBy", "anonymId");
    if (!post) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateForumPost = async (req, res) => {
  const postId = req.params.id;
  const { title, description } = req.body;

  try {
    const updatedPost = await forumModel
      .findByIdAndUpdate(postId, { title, description }, { new: true })
      .populate("subject", "faculty batch")
      .populate("faculty", "name")
      .populate("batch", "name");

    if (!updatedPost) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    res
      .status(200)
      .json({ message: "Forum post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteForumPost = async (req, res) => {
  const postId = req.params.id;

  try {
    const deletedPost = await forumModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    res.status(200).json({ message: "Forum post deleted successfully" });
  } catch (error) {
    console.error("Error deleting forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMessagesForForumPost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await forumModel
      .findById(postId)
      .populate("messages.createdBy", "username name");
    if (!post) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    res.status(200).json(post.messages);
  } catch (error) {
    console.error("Error fetching messages for forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const addMessageToForumPost = async (req, res) => {
  const postId = req.params.id;
  const { message, createdBy } = req.body;

  try {
    const post = await forumModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Forum post not found" });
    }

    post.messages.push({ message, createdBy });
    await post.save();

    res.status(201).json({ message: "Message added successfully", post });
  } catch (error) {
    console.error("Error adding message to forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteMessageFromForumPost = async (req, res) => {
  const postId = req.params.id;
  const { messageId } = req.body;

  try {
    const post = await forumModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    post.messages = post.messages.filter(
      (msg) => msg._id.toString() !== messageId
    );
    await post.save();
    res.status(200).json({ message: "Message deleted successfully", post });
  } catch (error) {
    console.error("Error deleting message from forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getForumPostsByUser = async (req, res) => {
  const batchId = req.params.batch;

  try {
    const posts = await forumModel
      .find({ batch: batchId })
      .populate("subject", "faculty batch subjectName subjectCode")
      .populate("faculty", "name username")
      .populate("batch", "batchName")
      .populate("messages.createdBy", "anonymId")
      .populate("messages.replies.createdBy", "anonymId")
      .sort({ createdAt: -1 });
    console.log("Posts fetched for batch:", batchId, posts);

    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No forum posts found for this user" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching forum posts by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getForumsByFaculty = async (req, res) => {
  const facultyId = req.params.id;

  try {
    const posts = await forumModel
      .find({ faculty: facultyId })
      .populate("subject", "faculty batch")
      .populate("faculty", "name")
      .populate("batch", "batchName")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No forum posts found for this faculty" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching forums by faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addMessageToForumPostByStudent = async (req, res) => {
  const postId = req.params.id;
  const { message, createdBy } = req.body;

  try {
    const post = await forumModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Forum post not found" });
    }

    post.messages.push({ message, createdBy });
    await post.save();

    res.status(201).json({ message: "Message added successfully", post });
  } catch (error) {
    console.error("Error adding message to forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMessageFromForumPostByStudent = async (req, res) => {
  const postId = req.params.id;
  const { messageId } = req.body;

  try {
    const post = await forumModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    post.messages = post.messages.filter(
      (msg) => msg._id.toString() !== messageId
    );
    await post.save();
    res.status(200).json({ message: "Message deleted successfully", post });
  } catch (error) {
    console.error("Error deleting message from forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const likeForumPost = async (req, res) => {
  const postId = req.params.id;
  const { userId, msgId } = req.body;

  try {
    const post = await forumModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Forum post not found" });
    }

    const message = post.messages.id(msgId);
    if (!message) {
      return res
        .status(404)
        .json({ message: "Message not found in this post" });
    }

    // Ensure 'like' array exists
    if (!Array.isArray(message.like)) {
      message.like = [];
    }

    const likeIndex = message.like.findIndex(
      (likeEntry) => likeEntry.student.toString() === userId
    );

    if (likeIndex !== -1) {
      // User already liked — remove the like
      message.like.splice(likeIndex, 1);
      await post.save();
      return res.status(200).json({
        message: "Post unliked successfully",
        likeCount: message.like.length,
      });
    } else {
      // User has not liked yet — add the like
      message.like.push({ student: userId });
      await post.save();
      return res.status(200).json({
        message: "Post liked successfully",
        likeCount: message.like.length,
      });
    }
  } catch (error) {
    console.error("Error liking forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const dislikeForumPost = async (req, res) => {
  const postId = req.params.id;
  const { userId, msgId } = req.body;

  try {
    const post = await forumModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    const message = post.messages.id(msgId);
    if (!message) {
      return res
        .status(404)
        .json({ message: "Message not found in this post" });
    }
    // Ensure 'dislike' array exists
    if (!Array.isArray(message.dislike)) {
      message.dislike = [];
    }

    const disLikeIndex = message.dislike.findIndex(
      (dislikeEntry) => dislikeEntry.student.toString() === userId
    );
    if (disLikeIndex !== -1) {
      // User already liked — remove the like
      message.dislike.splice(disLikeIndex, 1);
      await post.save();
      return res.status(200).json({
        message: "Post unliked successfully",
        likeCount: message.like.length,
      });
    } else {
      // User has not liked yet — add the like
      message.dislike.push({ student: userId });
      await post.save();
      return res.status(200).json({
        message: "Post liked successfully",
        likeCount: message.like.length,
      });
    }
  } catch (error) {
    console.error("Error disliking forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addReplyToMessage = async (req, res) => {
  const postId = req.params.id;
  const { messageId, reply, createdBy } = req.body;

  try {
    const post = await forumModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Forum post not found" });
    }

    const message = post.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.replies.push({ reply, createdBy });
    await post.save();

    res.status(201).json({ message: "Reply added successfully", post });
  } catch (error) {
    console.error("Error adding reply to message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReplyFromMessage = async (req, res) => {
  const postId = req.params.id;
  const { messageId, replyId } = req.body;

  try {
    const post = await forumModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Forum post not found" });
    }

    const message = post.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.replies = message.replies.filter(
      (reply) => reply._id.toString() !== replyId
    );
    await post.save();

    res.status(200).json({ message: "Reply deleted successfully", post });
  } catch (error) {
    console.error("Error deleting reply from message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const approveForumPost = async (req, res) => {
  const messageId = req.params.id;
  const { approval } = req.body;

  try {
    // const updatedPost = await forumModel.findByIdAndUpdate(
    //   postId,
    //   approval
    // );
    // The structure of the approval is forumModel.messages.approval
    const updatedPost = await forumModel.findOneAndUpdate(
      { "messages._id": messageId },
      { $set: { "messages.$.approval": approval } },
      { new: true }
    );
    // Check if the post was found and updated
    if (!updatedPost) {
      return res.status(404).json({ message: "Forum post not found" });
    }

    res
      .status(200)
      .json({ message: "Forum post approved successfully", post: updatedPost });
  } catch (error) {
    console.error("Error approving forum post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
