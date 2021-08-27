const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
const request = require('request');

const authMiddleware = require('./../../middleware/auth');
const Profile = require('./../../model/Profile');
const User = require('./../../model/User');
const RESPONSE_STATUS = require('./../../common/status');

/**
 * @route       GET api/profile/me
 * @description Get Current User's Profile
 * @access      Private
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      res
        .status(RESPONSE_STATUS.NOT_FOUND)
        .json({ msg: 'No profile againts current user found...' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error!!');
  }
});

/**
 * @route       POST api/profile
 * @description Create or Update Profile
 * @access      Private
 */
router.post(
  '/',
  [
    authMiddleware,
    [
      check('skills', 'Skills are required.').not().isEmpty(),
      check('status', 'Status is required.').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(RESPONSE_STATUS.NOT_FOUND).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};

    // Basic Info
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // Skills
    if (skills) {
      profileFields.skills = skills.split(',').map((elem) => elem.trim());
    }

    // Social Profiles
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (youtube) profileFields.social.youtube = youtube;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update Profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create Profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error...');
    }
  }
);

/**
 * @route       GET api/profile
 * @description Get all profiles
 * @access      Public
 */
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error.');
  }
});

/**
 * @route       GET api/profile/user/:user_id
 * @description Get specific user's profiles
 * @access      Public
 */
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.find({ user: req.params.user_id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile.length)
      return res
        .status(RESPONSE_STATUS.BAD_REQUEST)
        .json({ msg: 'There is no profile againts this user.' });

    res.json(profile);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res
        .status(RESPONSE_STATUS.BAD_REQUEST)
        .json({ msg: 'There is no profile againts this user.' });
    }
    console.error(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error.');
  }
});

/**
 * @route       DELETE api/profile
 * @description Delete user, profile & posts.
 * @access      Private
 */
router.delete('/', authMiddleware, async (req, res) => {
  try {
    // Find Posts and Delete
    // Find Profile and Delete
    await Profile.findOneAndRemove({ user: req.user.id });
    // Find User and Delete
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({
      msg: 'User, Profile and Posts Deleted Successfully...',
    });
  } catch (error) {
    console.error(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

/**
 * @router      PUT api/profile/experience
 * @description Add Profile experience
 * @access      Private
 */
router.put(
  '/experience',
  [
    authMiddleware,
    [
      check('title', 'Title is required.').not().isEmpty(),
      check('company', 'Company Name is required.').not().isEmpty(),
      check('from', 'From Date is required.').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR)
        .json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const experienceObj = {};
    if (title) experienceObj.title = title;
    if (company) experienceObj.company = company;
    if (location) experienceObj.location = location;
    if (from) experienceObj.from = from;
    if (to) experienceObj.to = to;
    if (current) experienceObj.current = current;
    if (description) experienceObj.description = description;

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile)
        return res
          .status(RESPONSE_STATUS.BAD_REQUEST)
          .json({ msg: 'Profile Not Found...' });
      profile.experience.unshift(experienceObj);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error...');
    }
  }
);

/**
 * @route       DELETE api/profile/experience/:experience_id
 * @description Delete experience from profile
 * @access      Private
 */
router.delete(
  '/experience/:experience_id',
  authMiddleware,
  async (req, res) => {
    const { experience_id } = req.params;
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((elem) => elem.id)
      .indexOf(experience_id);
    if (removeIndex < 0) {
      return res
        .status(RESPONSE_STATUS.NOT_FOUND)
        .send('Experience not found...');
    }
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  }
);

/**
 * @router      PUT api/profile/education
 * @description Add Profile education
 * @access      Private
 */
router.put(
  '/education',
  [
    authMiddleware,
    [
      check('school', 'School Name is required.').not().isEmpty(),
      check('study', 'Study is required.').not().isEmpty(),
      check('fieldofstudy', 'Field of Study is required.').not().isEmpty(),
      check('from', 'From Date is required.').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR)
        .json({ errors: errors.array() });
    }

    const { school, study, fieldofstudy, from, to, current, description } =
      req.body;

    const educationObj = {};
    if (school) educationObj.school = school;
    if (study) educationObj.study = study;
    if (fieldofstudy) educationObj.fieldofstudy = fieldofstudy;
    if (from) educationObj.from = from;
    if (to) educationObj.to = to;
    if (current) educationObj.current = current;
    if (description) educationObj.description = description;

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile)
        return res
          .status(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'Profile Not Found...' });
      profile.education.unshift(educationObj);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error...');
    }
  }
);

/**
 * @route       DELETE api/profile/education/:education_id
 * @description Delete education from profile
 * @access      Private
 */
router.delete('/education/:education_id', authMiddleware, async (req, res) => {
  const { education_id } = req.params;
  const profile = await Profile.findOne({ user: req.user.id });
  const removeIndex = profile.education
    .map((elem) => elem.id)
    .indexOf(education_id);
  if (removeIndex < 0) {
    return res.status(RESPONSE_STATUS.NOT_FOUND).send('Education not found...');
  }
  profile.education.splice(removeIndex, 1);
  await profile.save();
  res.json(profile);
});

/**
 * @route       GET api/profile/github/:githubusername
 * @description Call GitHub Api to get data from Github.com
 * @access      Public
 */
router.get('/github/:githubusername', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.githubusername
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== RESPONSE_STATUS.OK) {
        return res
          .status(RESPONSE_STATUS.NOT_FOUND)
          .json({ msg: 'No Github profile found...' });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send('Server Error...');
  }
});

module.exports = router;
