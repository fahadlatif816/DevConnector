const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const authMiddleware = require('./../../middleware/auth');
const Post = require('./../../model/Post');
const User = require('./../../model/User');
const RESPONSE_STATUS = require('./../../common/status');

/**
 * @route       GET api/posts
 * @description Get all posts
 * @access      Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

/**
 * @route       POST api/posts
 * @description Create post
 * @access      Private
 */
router.post(
  '/',
  [authMiddleware, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(RESPONSE_STATUS.BAD_REQUEST)
        .json({ errors: errors.array() });

    try {
      const user = await User.findById({ _id: req.user.id }).select(
        '-password'
      );
      if (!user)
        return res
          .status(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'User not found...' });

      const postObj = {
        user: user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      const post = new Post(postObj);
      await post.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
);

/**
 * @route       GET api/posts/:id
 * @description Get post by ID
 * @access      Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    if (!post)
      return res
        .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR)
        .json({ msg: 'Post not found...' });
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res.status(RESPONSE_STATUS.NOT_FOUND).send('Post not found...');
    console.error(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error...');
  }
});

/**
 * @route       DELETE api/posts/:id
 * @description Delete a post by ID
 * @access      Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    if (!post)
      return res
        .status(RESPONSE_STATUS.NOT_FOUND)
        .json({ msg: 'Post not found...' });
    if (post.user.toString() !== req.user.id)
      return res
        .status(RESPONSE_STATUS.NOT_AUTHENTICATED)
        .json({ msg: 'User not Authorized...' });
    await post.remove();
    res.send('Post successfully deleted...');
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res.status(RESPONSE_STATUS.NOT_FOUND).send('Post not found...');
    console.error(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error...');
  }
});

/**
 * @route       POST api/post/like/:post_id
 * @description Like a post
 * @access      Private
 */
router.post('/like/:post_id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.post_id });
    if (!post)
      return res
        .status(RESPONSE_STATUS.NOT_FOUND)
        .json({ msg: 'Post Not Found...' });

    const isPostAlreadyLikedByCurrentUser =
      post.likes.filter((elem) => elem.user.toString() === req.user.id).length >
      0;

    if (isPostAlreadyLikedByCurrentUser)
      return res
        .status(RESPONSE_STATUS.BAD_REQUEST)
        .json({ msg: 'Post already liked by user...' });

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res
        .status(RESPONSE_STATUS.NOT_FOUND)
        .json({ msg: 'Post Not Found...' });
    console.error(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

/**
 * @route       POST api/post/dislike/:post_id
 * @description Dislike a post
 * @access      Private
 */
router.post('/dislike/:post_id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.post_id });
    if (!post)
      return res
        .status(RESPONSE_STATUS.NOT_FOUND)
        .json({ msg: 'Post Not Found...' });
    const removeIndex = post.likes
      .map((elem) => elem.user)
      .indexOf(req.user.id);

    if (removeIndex < 0) {
      return res
        .status(RESPONSE_STATUS.NOT_FOUND)
        .send('Post Like not found...');
    }
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res
        .status(RESPONSE_STATUS.NOT_FOUND)
        .json({ msg: 'Post Not Found...' });
    console.error(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

/**
 * @route       POST api/post/comment/:post_id
 * @description Add comment to a post
 * @access      Private
 */
router.post(
  '/comment/:post_id',
  [authMiddleware, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR)
          .json({ errors: errors.array() });

      const user = await User.findById({ _id: req.user.id }).select(
        '-password'
      );
      const post = await Post.findById({ _id: req.params.post_id });

      if (!user)
        return res
          .status(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'User not found...' });
      if (!post)
        return res
          .status(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'Post not found...' });

      const commentObj = {
        user: user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      post.comments.unshift(commentObj);
      await post.save();

      res.json(post);
    } catch (error) {
      if (error.kind === 'ObjectId')
        return res
          .status(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'Post not found...' });
      console.error(error.message);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error...');
    }
  }
);

/**
 * @route       DELETE api/post/comment/:post_id/:comment_id
 * @description Deleting a comment
 * @access      Private
 */
router.delete(
  '/comment/:post_id/:comment_id',
  authMiddleware,
  async (req, res) => {
    try {
      const post = await Post.findById({ _id: req.params.post_id });
      if (!post)
        return res
          .status(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'Post not found...' });

      const comment = post.comments.find(
        (elem) => elem.id.toString() === req.params.comment_id
      );

      if (!comment)
        return res
          .status(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'Comment not found...' });

      if (comment.user.toString() !== req.user.id)
        return res
          .status(RESPONSE_STATUS.NOT_AUTHENTICATED)
          .json({ msg: 'Unauthorized user...' });

      const removeIndex = post.comments
        .map((elem) => elem.id)
        .indexOf(comment.id);

      if (removeIndex > 0)
        return res
          .status(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'Comment id not found...' });

      post.comments.splice(removeIndex, 1);
      await post.save();
      res.json(post);
    } catch (error) {
      if (error.kind)
        return res
          .status(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'Post not found...' });
      console.error(error.message);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error...');
    }
  }
);

/**
 * @route       PUT api/post/comment/:post_id/:comment_id
 * @description Updating a comment
 * @access      Private
 */
router.put(
  '/comment/:post_id/:comment_id',
  [authMiddleware, [check('text', 'Text is required.').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR)
        .json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById({ _id: req.params.post_id });
      if (!post)
        return res
          .send(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'Post not found...' });

      const comment = post.comments.find(
        (elem) => elem.id.toString() === req.params.comment_id
      );

      if (!comment)
        return res
          .send(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'Comment not found...' });
      if (comment.user.toString() !== req.user.id)
        return res
          .send(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'Unauthorized user...' });

      const commentIndex = post.comments
        .map((elem) => elem.id)
        .indexOf(comment.id);

      post.comments[commentIndex].text = req.body.text;

      await post.save();
      res.json(post);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res
          .send(RESPONSE_STATUS.INTERNAL_SERVER_ERROR)
          .json({ msg: 'Post not found...' });
      }
      console.error(error.message);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error...');
    }
  }
);

module.exports = router;
