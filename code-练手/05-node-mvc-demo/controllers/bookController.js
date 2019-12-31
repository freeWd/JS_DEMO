const Router = require("koa-router");
const BookModel = require("../models");
const book = new Router();

// 首页IndexController
class BookController {
  constructor() {}

  homePage() {
    return async (ctx, next) => {
      const bookList = await new BookModel().getBookList();
      ctx.body = await ctx.render("home", {
        bookList: bookList.data
      });
    };
  }

  addPage() {
    return async (ctx, next) => {
      ctx.body = await ctx.render("add");
    };
  }

  addBook() {
    return async (ctx, next) => {
      const result = await new BookModel().addBookItem(ctx.request.body);
      console.log(result);
      ctx.response.type = "json";
      ctx.response.body = { data: ctx.request.body };
    };
  }
}

const bookController = new BookController();

book
  .get("/home", bookController.homePage())
  .get("/add", bookController.addPage())
  .post("/add", bookController.addBook());

module.exports = book;
