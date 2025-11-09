import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, hashPassword, comparePassword } from "./auth";
import { z } from "zod";
import { 
  insertProfileSchema, 
  insertCategorySchema,
  insertSubcategorySchema,
  insertMessageSchema,
  insertReviewSchema,
  registerSchema,
  loginSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Register route
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Bu email adresi zaten kullanılıyor" });
      }

      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.upsertUser({
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName || null,
      });

      req.session.userId = user.id;
      
      res.status(201).json({
        message: "Kayıt başarılı",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error: any) {
      console.error("Error registering user:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Geçersiz giriş verileri", errors: error.errors });
      }
      res.status(500).json({ message: "Kayıt sırasında hata oluştu" });
    }
  });

  // Login route
  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Email veya şifre hatalı" });
      }

      const isPasswordValid = await comparePassword(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email veya şifre hatalı" });
      }

      req.session.userId = user.id;
      
      res.json({
        message: "Giriş başarılı",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error: any) {
      console.error("Error logging in:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Geçersiz giriş verileri", errors: error.errors });
      }
      res.status(500).json({ message: "Giriş sırasında hata oluştu" });
    }
  });

  // Logout route
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Çıkış sırasında hata oluştu" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Çıkış başarılı" });
    });
  });

  // Get current user
  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
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

  // User routes
  app.get('/api/users/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.post('/api/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const validatedData = insertProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.createProfile(validatedData);
      res.json(profile);
    } catch (error: any) {
      console.error("Error creating profile:", error);
      res.status(400).json({ message: error.message || "Failed to create profile" });
    }
  });

  app.patch('/api/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      // Validate the update data - prevent userId changes and ensure valid fields
      const updateSchema = insertProfileSchema.partial().omit({ userId: true });
      const validatedData = updateSchema.parse(req.body);
      
      // Ensure at least one field is being updated
      if (Object.keys(validatedData).length === 0) {
        return res.status(400).json({ message: "At least one field must be provided for update" });
      }
      
      const profile = await storage.updateProfile(userId, validatedData);
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
  app.get('/api/messages', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/messages/:otherUserId', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const messages = await storage.getConversation(userId, req.params.otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req, res) => {
    try {
      const senderId = req.user!.id;
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

  app.post('/api/reviews', isAuthenticated, async (req, res) => {
    try {
      const customerId = req.user!.id;
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
