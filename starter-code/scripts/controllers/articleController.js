'use strict';

(function(module) {
  var articleController = {};

  Article.createTable();

  articleController.index = function(ctx, next) {
    if(ctx.articles.length) {
      articleView.index(ctx.articles);
    } else{
      page('/');
    }
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This method loads the rest of the text of an article when the user
  // clicks on 'read more'. It calls the Article.findWhere method which
  // finds the text based on the id (primary key) of the article. It uses
  // page to set a url for the article at '/article/:id'

  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This method retrieves all the articles of an individual author when
  // the user selects an author from the author menu. It displays all of
  // the author's articles at '/author/:authorName'; It works like loadById,
  // calling Article.findWhere using the author name and putting the author's
  // articles in the ctx object.
  articleController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere(
      'author', ctx.params.authorName.replace('+', ' '), authorData
    );
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This method retrieves all the articles in a certain category which the
  // user chooses. It works like loadByAuthor, except the url is
  // '/category/:categoryName'

  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This method loads all the articles (assigns them as a property of the
  // CTX object from the array of articles in the Article object). If fhere
  // is nothing in the Article.allArticles array, it calls Article.fetchAll in
  // article.js, which retrieves the articles from the database (creating it first if it
  // does not exist using the middleware webDB.js and html5sql.js).
  // articleController.loadAll itself is called in routes.js via an event listener
  // that calls it if the user navigates to the root or index. 

  articleController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.allArticles;
      next();
    };

    if (Article.allArticles.length) {
      ctx.articles = Article.allArticles;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };

  module.articleController = articleController;
})(window);
