const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');




describe('Assocations', () => {
  let joe, blogPost, comment;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'Rory is great', content: 'It is a fact' })
    comment = new Comment({ content:'I disagree! He is the worst!' })
    comment2 = new Comment({ content:'I disagree! He is the best afterall!' })

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    blogPost.comments.push(comment2);
    comment.user = joe;
    comment2.user = joe;

    Promise.all([joe.save(), blogPost.save(), comment.save(), comment2.save()])
      .then(() => done());
  });

  it('saves a relation between a user and a blogpost', (done) => {
    User.findOne({ name: 'Joe'})
      .populate('blogPosts')
      .then((user) => {
        assert(user.blogPosts[0].title === 'Rory is great')
        done();
      })
  });

  it('saves a full relation tree', (done) => {
    User.findOne({ name: 'Joe' })
    .populate({
      path: 'blogPosts',
      populate: {
        path: 'comments',
        model: 'comment',
        populate: {
          path: 'user',
          model: 'user'
        }
      }
    })
    .then((user) => {

      var inspections = [user.name, user.blogPosts[0].title, user.blogPosts[0].comments[0].content, user.blogPosts[0].comments[0].user.name]
      var [username, blogpostTitle, blogpostComment, blogpostCommentUsername] = inspections

      assert(username === 'Joe');
      assert(blogpostTitle === 'Rory is great');
      assert(blogpostComment === 'I disagree! He is the worst!');
      assert(blogpostCommentUsername === 'Joe')

      done()
    })
  })

})
