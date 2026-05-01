const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = "test-secret-key";
  process.env.REDIS_URL = "redis://localhost:6379";
  process.env.NODE_ENV = "test";

  app = require("../../src/index");

  await new Promise((resolve) => setTimeout(resolve, 2000));
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  if (mongoose.connection.readyState !== 1) return;
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("Auth API", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Test User", email: "test@example.com", password: "password123" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe("test@example.com");
    });

    it("should fail with duplicate email", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "User One", email: "dup@example.com", password: "password123" });

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "User Two", email: "dup@example.com", password: "password456" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail with missing fields", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Test" });

      expect(res.status).toBe(400);
    });

    it("should fail with short password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Test", email: "short@pw.com", password: "123" });

      expect(res.status).toBe(400);
    });

    it("should fail with invalid email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Test", email: "notanemail", password: "password123" });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Login User", email: "login@example.com", password: "password123" });
    });

    it("should login successfully", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "login@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it("should fail with wrong password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "login@example.com", password: "wrongpass" });

      expect(res.status).toBe(401);
    });

    it("should fail with non-existent email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "noone@example.com", password: "password123" });

      expect(res.status).toBe(401);
    });

    it("should fail with missing fields", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "login@example.com" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/auth/me", () => {
    let token;

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Me User", email: "me@example.com", password: "password123" });
      token = res.body.data.token;
    });

    it("should return user profile", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe("me@example.com");
    });

    it("should fail without token", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    });

    it("should fail with invalid token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer invalidtoken123");

      expect(res.status).toBe(401);
    });
  });
});

describe("Product API", () => {
  let userToken;
  let adminToken;
  let productId;

  beforeEach(async () => {
    const userRes = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Product User", email: "produser@example.com", password: "password123" });
    userToken = userRes.body.data.token;

    const adminRes = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Admin", email: "admin@example.com", password: "password123", role: "admin" });
    adminToken = adminRes.body.data.token;
  });

  describe("POST /api/v1/products", () => {
    it("should create a product", async () => {
      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Laptop",
          description: "A powerful laptop",
          price: 999.99,
          category: "Electronics",
          stock: 50,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Laptop");
      productId = res.body.data._id;
    });

    it("should fail without auth", async () => {
      const res = await request(app)
        .post("/api/v1/products")
        .send({ name: "Laptop", description: "desc", price: 100, category: "Electronics" });

      expect(res.status).toBe(401);
    });

    it("should fail with missing fields", async () => {
      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Laptop" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/products", () => {
    beforeEach(async () => {
      for (let i = 1; i <= 5; i++) {
        await request(app)
          .post("/api/v1/products")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: `Product ${i}`,
            description: `Description ${i}`,
            price: 10 * i,
            category: "Test",
            stock: i * 10,
          });
      }
    });

    it("should get paginated products", async () => {
      const res = await request(app)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(5);
      expect(res.body.pagination.total).toBe(5);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/v1/products?page=1&limit=2")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.pages).toBe(3);
    });

    it("should support category filter", async () => {
      await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Book", description: "A book", price: 15, category: "Books", stock: 5 });

      const res = await request(app)
        .get("/api/v1/products?category=Books")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((p) => p.category === "Books")).toBe(true);
    });

    it("should fail without auth", async () => {
      const res = await request(app).get("/api/v1/products");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/v1/products/:id", () => {
    let createdId;

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Single Product",
          description: "Single desc",
          price: 50,
          category: "Test",
          stock: 10,
        });
      createdId = res.body.data._id;
    });

    it("should get a single product", async () => {
      const res = await request(app)
        .get(`/api/v1/products/${createdId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Single Product");
    });

    it("should return 404 for non-existent product", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/v1/products/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /api/v1/products/:id", () => {
    let createdId;

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Update Me",
          description: "Old desc",
          price: 100,
          category: "Test",
          stock: 20,
        });
      createdId = res.body.data._id;
    });

    it("should update own product", async () => {
      const res = await request(app)
        .patch(`/api/v1/products/${createdId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Updated Name", price: 150 });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Updated Name");
      expect(res.body.data.price).toBe(150);
    });

    it("should fail to update other user's product", async () => {
      const otherRes = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Other", email: "other@example.com", password: "password123" });
      const otherToken = otherRes.body.data.token;

      const res = await request(app)
        .patch(`/api/v1/products/${createdId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ name: "Hacked" });

      expect(res.status).toBe(403);
    });

    it("admin should update any product", async () => {
      const res = await request(app)
        .patch(`/api/v1/products/${createdId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Admin Updated" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Admin Updated");
    });
  });

  describe("DELETE /api/v1/products/:id", () => {
    let createdId;

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Delete Me",
          description: "To be deleted",
          price: 50,
          category: "Test",
          stock: 5,
        });
      createdId = res.body.data._id;
    });

    it("should delete product as admin", async () => {
      const res = await request(app)
        .delete(`/api/v1/products/${createdId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const getRes = await request(app)
        .get(`/api/v1/products/${createdId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(getRes.status).toBe(404);
    });

    it("should fail to delete as non-admin", async () => {
      const res = await request(app)
        .delete(`/api/v1/products/${createdId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});
