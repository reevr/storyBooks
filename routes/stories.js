const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Story = mongoose.model('stories');

router.get('/', (req, res) => {
    Story.find({status: 'public'})
    .populate('user')
    .then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    });
});

// Add form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Add form process
router.post('/', (req, res) => {
    let allowComments;
    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }
    
    const newStory =  {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user._id
    };

    new Story(newStory)
    .save()
    .then(story => {
        res.redirect(`/stories/show/${story._id}`)
    });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({_id : req.params.id})
    .then(story => {
        res.render('stories/edit', {
            story: story
        });
    });
});

router.put('/:id', (req, res) => {
    let allowComments;
        if (req.body.allowComments) {
            allowComments = true;
        } else {
            allowComments = false;
        }
    Story.findOneAndUpdate({
        _id: req.params.id,
        user: req.user.id
    },{
        title : req.body.title,
        body : req.body.body,
        allowComments : allowComments,
        status : req.body.status,
    })
    .then(story => {
        res.redirect('/dashboard');
    });
});

//  List stories from user

router.get('/user/:userId', (req, res) => {
    Story.find({
        user:req.params.userId,
        status:'public'
    })
    .populate('user')
    .then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    });
});

// Logged in user stories
router.get('/my',ensureAuthenticated ,(req, res) => {
    Story.find({
        user:req.user.id,
    })
    .populate('user')
    .then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    });
});

router.get('/show/:id', (req, res) => {
    Story.findOne({_id : req.params.id})
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
        if (story.status == 'public') {
            res.render('stories/show', {
                story: story
            });
        } else {
            if (req.user) {
                if (req.user.id == story.user._id) {
                    res.render('stories/show', {
                        story: story
                    });
                } else {
                    res.redirect('/stories');    
                }
            } else {
                res.redirect('/stories');
            }
        }
    });
});

router.delete('/:id', (req, res) => {
            Story.findOneAndRemove({
                _id: req.params.id,
                user:req.user.id
            })
            .then(_ => {
                res.redirect('/dashboard');
            });    
});

// Comments 
router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        };
        story.comments.unshift(newComment);
        story.save()
        .then(story => {
            console.log(story);
            res.redirect(`/stories/show/${story.id}`);
        });
    });
});
module.exports = router;