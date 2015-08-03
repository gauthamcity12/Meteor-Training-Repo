Router.configure({
	layoutTemplate:'views/application/layout',
	loadingTemplate: 'loading',
	waitOn: function() { return Meteor.subscribe('posts');}
});

Router.route('/', {name: 'views/posts/postsList'});
