"use strict";

var fbRef = new Firebase("https://fiery-inferno-3847.firebaseio.com/");
var fbPosts = fbRef.child("posts");

var Blog = React.createClass({
  displayName: "Blog",

  getInitialState: function getInitialState() {
    return { posts: [] };
  },
  componentDidMount: function componentDidMount() {
    fbPosts.on("value", (function(snapshot) {
	console.log("Got posts", snapshot.val());
	this.setState({ posts: snapshot.val() })
    }).bind(this));
  },
  render: function render() {
    console.log("Rendering, this is state:" ,this.state);
    var posts = this.state.posts;
    return React.createElement(
      "div",
      { className: "blog-posts col-sm-12" },
      Object.keys(posts).map(function(key) {
        let post = posts[key];
        return React.createElement(BlogPost, { key: post._id, post: post });
      }),
      React.createElement(BlogEntry, null)
    );
  }
});

var BlogPost = React.createClass({
  displayName: "BlogPost",

  render: function render() {
    var post = this.props.post;
    return React.createElement(
      "div",
      { className: "blog-post panel panel-default" },
      React.createElement(
        "div",
        { className: "panel-heading" },
        post.title
      ),
      React.createElement(
        "div",
        { className: "panel-body" },
        post.text
      )
    );
  }
});

var BlogEntry = React.createClass({
  displayName: "BlogEntry",

  handleSubmit: function handleSubmit(e) {
    e.preventDefault(); // TODO Wat
    var title = React.findDOMNode(this.refs.title).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!title || !text) {
      return;
    }
    fbPosts.push({
        title: title, text: text
    });
    console.log(title, text);

    React.findDOMNode(this.refs.title).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function render() {
    return React.createElement(
      "form",
      { className: "blog-entry panel panel-default", onSubmit: this.handleSubmit },
      React.createElement("input", { type: "text", placeholder: "Title", ref: "title" }),
      React.createElement("br", null),
      React.createElement("input", { type: "text", placeholder: "Text", ref: "text" }),
      React.createElement("br", null),
      React.createElement("input", { type: "submit", value: "Post" })
    );
  }
});

React.render(React.createElement(Blog, { posts: [], className: "container" }), document.getElementById('blogPosts'));
