import { ReturnDocument } from "mongodb";
import Post from "../models/postModel.js";

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed getting posts!" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await Post.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    );

    if (!doc) {
      return res.status(404).json({ message: "Post not found!" });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed getting a post!" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await Post.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete post!" });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create post!" });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await Post.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update post!" });
  }
};
