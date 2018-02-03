const mongoose = require('mongoose');
const asser = require('assert');
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
        console.log(user);
        done();
      })
  });

})
