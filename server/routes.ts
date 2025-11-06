import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { 
  insertProfileSchema, 
  insertCategorySchema,
  insertSubcategorySchema,
  insertMessageSchema,
  insertReviewSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const profile = await storage.getProfile(userId);
      res.json({ ...user, profile });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.post('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.createProfile(validatedData);
      res.json(profile);
    } catch (error: any) {
      console.error("Error creating profile:", error);
      res.status(400).json({ message: error.message || "Failed to create profile" });
    }
  });

  app.patch('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.updateProfile(userId, req.body);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: error.message || "Failed to update profile" });
    }
  });

  // Provider routes
  app.get('/api/providers', async (req, res) => {
    try {
      const { categoryId, subcategoryId } = req.query;
      const providers = await storage.getProviders(
        categoryId as string | undefined,
        subcategoryId as string | undefined
      );
      res.json(providers);
    } catch (error) {
      console.error("Error fetching providers:", error);
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  app.get('/api/providers/:userId', async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.userId);
      if (!profile || profile.userType !== 'provider') {
        return res.status(404).json({ message: "Provider not found" });
      }
      const user = await storage.getUser(req.params.userId);
      const rating = await storage.getProviderRating(req.params.userId);
      const reviews = await storage.getProviderReviews(req.params.userId);
      res.json({ ...profile, user, rating, reviews });
    } catch (error) {
      console.error("Error fetching provider:", error);
      res.status(500).json({ message: "Failed to fetch provider" });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/categories/:categoryId/subcategories', async (req, res) => {
    try {
      const subcategories = await storage.getSubcategories(req.params.categoryId);
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  // Message routes
  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/messages/:otherUserId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getConversation(userId, req.params.otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.user.claims.sub;
      const validatedData = insertMessageSchema.parse({ ...req.body, senderId });
      const message = await storage.createMessage(validatedData);
      res.json(message);
    } catch (error: any) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: error.message || "Failed to create message" });
    }
  });

  app.patch('/api/messages/:messageId/read', isAuthenticated, async (req, res) => {
    try {
      await storage.markMessageAsRead(req.params.messageId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Review routes
  app.get('/api/reviews/:providerId', async (req, res) => {
    try {
      const reviews = await storage.getProviderReviews(req.params.providerId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = req.user.claims.sub;
      const validatedData = insertReviewSchema.parse({ ...req.body, customerId });
      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error: any) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: error.message || "Failed to create review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
