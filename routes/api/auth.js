const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');

const User = require('./../../model/User');
const { signJWT, setCookie, setCookies } = require('../../helper/authHelper');
const RESPONSE_STATUS = require('./../../common/status');
const authMiddleware = require('./../../middleware/auth');

/**
 * @route       POST api/auth
 * @description Authenticate user & get token
 * @access      Public
 */
router.post(
  '/',
  [
    check('email', 'Email is required.').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR)
        .json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(RESPONSE_STATUS.BAD_REQUEST)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(RESPONSE_STATUS.BAD_REQUEST)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = await signJWT(payload, config.get('jwtSecret'), {
        expiresIn: 36000,
      });

      setCookies(res, [{ secret: config.get('cookieToken'), value: token }]);

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(error.message);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error!!');
    }
  }
);

/**
 * @route       POST api/auth/logout
 * @description Clear cookie and logout user
 * @access      Private
 */
router.post('/logout', authMiddleware, (req, res) => {
  res.clearCookie(config.get('cookieToken'));
  return res.status(RESPONSE_STATUS.OK).json({ msg: 'User is logged out.' });
});

module.exports = router;
