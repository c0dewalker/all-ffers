const express = require('express');
const User = require('../models/user');
const Project = require('../models/project');
const authenticationMiddleware = require('../middleware/authenticationMiddleware')
const router = express.Router();

router.patch('/favourite', authenticationMiddleware(), async (req, res) => {
  const { userId, offerId } = req.body
  const user = await User.findOne({ _id: userId });
  if (user.favourites.includes(offerId)) {
    user.favourites = user.favourites.filter(offer => offer != offerId)
  }
  else user.favourites.push(offerId)
  user.save()
  res.json(user)
});

router.post('/start', authenticationMiddleware(), async (req, res) => {
  const { _id, title, currency, description, tags, hasProjectBudget, hasHourlyRate, budget, publishedAt, publishedAtTS, url, from, user, startedAt, comment } = req.body;
  const newProject = new Project({ offerId: _id, title, description, currency, tags, hasProjectBudget, hasHourlyRate, budget, publishedAt, publishedAtTS, url, from, user, startedAt, startedAtTS: Date.parse(startedAt), comment });
  newProject.save();
  const currentUser = await User.findOne({ _id: user });
  currentUser.startedProjects.push(newProject);
  currentUser.favourites = currentUser.favourites.filter(offer => offer != _id);
  currentUser.save();
  res.json(newProject);
});


router.post('/finish',  authenticationMiddleware(), async (req, res) => {
  const { _id, budget, user, comment, finishedAt } = req.body
  const finishedProject = await Project.findOne({ _id })
  finishedProject.comment = comment;
  finishedProject.budget = budget;
  finishedProject.finishedAt = finishedAt;
  finishedProject.finishedAtTS = Date.parse(finishedAt);
  finishedProject.save();
  const currentUser = await User.findOne({ _id: user });
  currentUser.finishedProjects.push(finishedProject);
  currentUser.startedProjects = currentUser.startedProjects.filter(offer => offer._id != _id);
  currentUser.save();
  res.json(finishedProject);
});

module.exports = router;
