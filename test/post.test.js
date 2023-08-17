process.env.NODE_ENV = "test";
const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const app = require("../app");
const mongoose = require("mongoose");
const Post = require("../models/post");
JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const dummyUsers = require("../dummydata/dummyUsers");
chai.use(chaiHttp);

let postId;
let nonexpodt = "64dce7771151a49e74096d38";
let dummy_User;

describe("POST /api/posts", () => {

  it("Post successful creation check", async () => {
    const dummyUser = {
      email: "user1@example.com",
      password: "password1",
    };
    dummy_User = dummyUser;
    const token = jwt.sign(dummyUser, JWT_SECRET);
    const newPostData = {
      title: "Test Post",
      description: "This is a test post.",
    };

    const res = await chai
      .request(app)
      .post("/api/posts")
      .set("Authorization", `${token}`)
      .send(newPostData);
    postId = res.body.postId;
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("postId");
    expect(res.body).to.have.property("title", newPostData.title);
    expect(res.body).to.have.property("description", newPostData.description);
    expect(res.body).to.have.property("createdAt");
  });

  it("Post creation with Title field missing", async () => {
    const dummyUser = {
      email: "user1@example.com",
      password: "password1",
    };
    dummy_User = dummyUser;
    const token = jwt.sign(dummyUser, JWT_SECRET);
    const newPostData = {
      description: "This is a test post.",
    };

    const res = await chai
      .request(app)
      .post("/api/posts")
      .set("Authorization", `${token}`)
      .send(newPostData);
    expect(res).to.have.status(400);
  });

  it("should return 401 if not authenticated", async () => {
    const newPostData = {
      title: "Test Post",
      description: "This is a test post.",
    };
    const res = await chai.request(app).post("/api/posts").send(newPostData);
    expect(res).to.have.status(401);
  });
});

describe("POST /api/like/:id", () => {
  it("Post successful like check", async () => {
    const token = jwt.sign(dummy_User, JWT_SECRET);
    const postToLike = "64dce9841151a49e74096d44";
    const res = await chai
      .request(app)
      .post(`/api/like/${postId}`)
      .set("Authorization", token);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Post liked successfully");
  });

  it("should return 401 if not authenticated", async () => {
    const postToLike = "64dce9841151a49e74096d44";
    const res = await chai.request(app).post(`/api/like/${postToLike}`);
    expect(res).to.have.status(401);
  });

  it("should return 404 if the post is not found", async () => {
    const token = jwt.sign(dummy_User, JWT_SECRET);
    const res = await chai
      .request(app)
      .post(`/api/like/${nonexpodt}`)
      .set("Authorization", token);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "Post not found");
  });

  it("Already liked post check", async () => {
    const likedId = "64dce90a1151a49e74096d3e"; // Replace with a post ID that's already liked
    const token = jwt.sign(dummy_User, JWT_SECRET);
    const postToLike = "64dce9841151a49e74096d44";
    const res = await chai
      .request(app)
      .post(`/api/like/${postId}`)
      .set("Authorization", token);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property(
      "message",
      "Post is already liked by the user"
    );
  });
});

describe("POST /api/unlike/:id", () => {
  it("Authenticated user post unlike", async () => {
    const token = jwt.sign(dummy_User, JWT_SECRET);
    const postToUnlike = "64dce9841151a49e74096d44";
    const res = await chai
      .request(app)
      .post(`/api/unlike/${postToUnlike}`)
      .set("Authorization", `${token}`);

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal("Post unliked successfully");
  });

  it("Not authenticated user post unlike", async () => {
    const res = await chai.request(app).post(`/api/unlike/${postId}`);
    expect(res).to.have.status(401);
  });

  it("Post not found", async () => {
    const token = jwt.sign(dummy_User, JWT_SECRET);
    const res = await chai
      .request(app)
      .post(`/api/unlike/${nonexpodt}`)
      .set("Authorization", `${token}`);

    expect(res).to.have.status(404);
    expect(res.body.message).to.equal("Post not found");
  });
});

describe("POST /api/comment/:id", () => {
  let authToken;
  before(async () => {
    // Create a JWT token for testing purposes
    const user = dummyUsers[0];
    authToken = jwt.sign(dummy_User, JWT_SECRET);
  });

  it("Comment on Post", async () => {
    const commentText = "Test comment";
    const res = await chai
      .request(app)
      .post(`/api/comment/${postId}`)
      .set("Authorization", `${authToken}`)
      .send({ comment: commentText });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("commentId");
  });

  it("Post not found", async () => {
    const commentText = "Test comment";
    const res = await chai
      .request(app)
      .post(`/api/comment/${nonexpodt}`)
      .set("Authorization", `${authToken}`)
      .send({ comment: commentText });

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "Post not found");
  });
});

describe("GET /api/all_posts", async () => {
  it("Unauthenticated user retrieving collection of Posts", async () => {
    const res = await chai.request(app).get("/api/all_posts");
    expect(res).to.have.status(401);
  });

  it("should return 403 if token verification fails", async () => {
    const invalidToken = jwt.sign(dummy_User, "invalid-secret");
    const res = await chai
      .request(app)
      .get("/api/all_posts")
      .set("Authorization", `${invalidToken}`);
    expect(res).to.have.status(403);
  });
  it("Successfully retrieving Posts", async () => {
    const validToken = jwt.sign(dummy_User, JWT_SECRET);
    const res = await chai
      .request(app)
      .get("/api/all_posts")
      .set("Authorization", `${validToken}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });
});

describe("GET /api/posts/:id", async () => {
  it("Return a single post with likes and comments", (done) => {
    chai
      .request(app)
      .get(`/api/posts/${postId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("description");
        expect(res.body).to.have.property("author");
        expect(res.body).to.have.property("likes");
        expect(res.body).to.have.property("comments");
        expect(res.body.likes).to.be.a("number");
        expect(res.body.comments).to.be.a("number");
        done();
      });
  });
  it("P is not found", (done) => {
    chai
      .request(app)
      .get(`/api/posts/${nonexpodt}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "Post not found");
        done();
      });
  });
});

describe("DELETE /api/posts/:id", async () => {
  it("should delete a post when authenticated user owns the post", async () => {
    const token = jwt.sign(dummy_User, JWT_SECRET);
    const res = await chai
      .request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Post deleted successfully");
  });

  it("Unauthorised deletion of Post", async () => {
    const token = jwt.sign(dummy_User, JWT_SECRET);
    const postIDunauth = '64dce9701151a49e74096d42';
    const res = await chai
      .request(app)
      .delete(`/api/posts/${postIDunauth}`)
      .set("Authorization", `${token}`);

    expect(res).to.have.status(404);
  });

});
