const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('./../../model/User');
const authMiddleware = require('./../../middleware/auth');
const { signJWT, setCookies } = require('../../helper/authHelper');
const { cipher } = require('../../helper/cryptoHelper');
const RESPONSE_STATUS = require('./../../common/status');

/**
 * @route       GET api/users
 * @description Test route
 * @access      Public
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error!!');
  }
});

/**
 * @route       POST api/users
 * @description Register User Route
 * @access      Public
 */
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter valid email address').isEmail(),
    check(
      'password',
      'Password must contains atleast between 6 to 10 characters.'
    ).isLength({
      min: 6,
      max: 10,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR)
        .json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(RESPONSE_STATUS.FORBIDDEN)
          .json({ errors: [{ msg: 'User already exists.' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = await signJWT(payload, config.get('jwtSecret'), {
        expiresIn: 36000,
      });

      setCookies(res, [{ secret: config.get('cookieToken'), value: token }], {
        httpOnly: true,
        sameSite: true,
      });

      res.json({ success: true });
    } catch (error) {
      console.error(error.message);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server error...');
    }
  }
);

module.exports = router;
