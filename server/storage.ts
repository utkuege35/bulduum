import { db } from "./db";
import { 
  users, 
  profiles, 
  categories, 
  subcategories, 
  messages, 
  reviews,
  listings,
  type User,
  type UpsertUser,
  type Profile,
  type InsertProfile,
  type Category,
  type InsertCategory,
  type Subcategory,
  type InsertSubcategory,
  type Message,
  type InsertMessage,
  type Review,
  type InsertReview,
  type Listing,
  type InsertListing,
} from "@shared/schema";
import { eq, and, or, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Profile methods
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile | undefined>;
  getProviders(categoryId?: string, subcategoryId?: string): Promise<(Profile & { user: User; category?: Category; subcategory?: Subcategory })[]>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Subcategory methods
  getSubcategories(categoryId?: string): Promise<Subcategory[]>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  
  // Message methods
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  getUserConversations(userId: string): Promise<{ otherUser: User; lastMessage: Message; unreadCount: number }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: string): Promise<void>;
  
  // Review methods
  getProviderReviews(providerId: string): Promise<(Review & { customer: User })[]>;
  getProviderRating(providerId: string): Promise<{ average: number; count: number }>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Listing methods
  getListings(filters: { listingType?: string; categoryId?: string; city?: string; district?: string }): Promise<(Listing & { user: User; category: Category; subcategory?: Subcategory })[]>;
  getListing(id: string): Promise<(Listing & { user: User; category: Category; subcategory?: Subcategory }) | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  getUserListings(userId: string): Promise<(Listing & { category: Category; subcategory?: Subcategory })[]>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [profile] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  }

  async getProviders(categoryId?: string, subcategoryId?: string): Promise<(Profile & { user: User; category?: Category; subcategory?: Subcategory })[]> {
    let query = db
      .select({
        profile: profiles,
        user: users,
        category: categories,
        subcategory: subcategories,
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .leftJoin(categories, eq(profiles.categoryId, categories.id))
      .leftJoin(subcategories, eq(profiles.subcategoryId, subcategories.id))
      .where(eq(profiles.userType, 'provider'))
      .$dynamic();

    if (categoryId) {
      query = query.where(eq(profiles.categoryId, categoryId));
    }
    if (subcategoryId) {
      query = query.where(eq(profiles.subcategoryId, subcategoryId));
    }

    const results = await query;
    return results.map((r: any) => ({ ...r.profile, user: r.user, category: r.category || undefined, subcategory: r.subcategory || undefined }));
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async getSubcategories(categoryId?: string): Promise<Subcategory[]> {
    if (categoryId) {
      return db.select().from(subcategories).where(eq(subcategories.categoryId, categoryId));
    }
    return db.select().from(subcategories);
  }

  async createSubcategory(insertSubcategory: InsertSubcategory): Promise<Subcategory> {
    const [subcategory] = await db.insert(subcategories).values(insertSubcategory).returning();
    return subcategory;
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(asc(messages.createdAt));
  }

  async getUserConversations(userId: string): Promise<{ otherUser: User; lastMessage: Message; unreadCount: number }[]> {
    const allMessages = await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    const conversationMap = new Map<string, { lastMessage: Message; unreadCount: number }>();
    
    for (const message of allMessages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      if (!conversationMap.has(otherUserId)) {
        const unreadCount = message.receiverId === userId && !message.isRead ? 1 : 0;
        conversationMap.set(otherUserId, { lastMessage: message, unreadCount });
      } else if (message.receiverId === userId && !message.isRead) {
        const conv = conversationMap.get(otherUserId)!;
        conv.unreadCount++;
      }
    }

    const results: { otherUser: User; lastMessage: Message; unreadCount: number }[] = [];
    for (const [otherUserId, { lastMessage, unreadCount }] of Array.from(conversationMap.entries())) {
      const otherUser = await this.getUser(otherUserId);
      if (otherUser) {
        results.push({ otherUser, lastMessage, unreadCount });
      }
    }

    return results;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await db.update(messages).set({ isRead: true }).where(eq(messages.id, messageId));
  }

  async getProviderReviews(providerId: string): Promise<(Review & { customer: User })[]> {
    const results = await db
      .select({
        review: reviews,
        customer: users,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.customerId, users.id))
      .where(eq(reviews.providerId, providerId))
      .orderBy(desc(reviews.createdAt));

    return results.map((r: any) => ({ ...r.review, customer: r.customer }));
  }

  async getProviderRating(providerId: string): Promise<{ average: number; count: number }> {
    const result = await db
      .select({
        average: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.providerId, providerId));

    return {
      average: Number(result[0].average),
      count: Number(result[0].count),
    };
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async getListings(filters: { listingType?: string; categoryId?: string; city?: string; district?: string }): Promise<(Listing & { user: User; category: Category; subcategory?: Subcategory })[]> {
    let query = db
      .select({
        listing: listings,
        user: users,
        category: categories,
        subcategory: subcategories,
      })
      .from(listings)
      .innerJoin(users, eq(listings.userId, users.id))
      .innerJoin(categories, eq(listings.categoryId, categories.id))
      .leftJoin(subcategories, eq(listings.subcategoryId, subcategories.id))
      .orderBy(desc(listings.createdAt))
      .$dynamic();

    const conditions = [];
    if (filters.listingType) {
      conditions.push(eq(listings.listingType, filters.listingType as "provider" | "seeker"));
    }
    if (filters.categoryId) {
      conditions.push(eq(listings.categoryId, filters.categoryId));
    }
    if (filters.city) {
      conditions.push(eq(listings.city, filters.city));
    }
    if (filters.district) {
      conditions.push(eq(listings.district, filters.district));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;
    return results.map((r: any) => ({ ...r.listing, user: r.user, category: r.category, subcategory: r.subcategory || undefined }));
  }

  async getListing(id: string): Promise<(Listing & { user: User; category: Category; subcategory?: Subcategory }) | undefined> {
    const results = await db
      .select({
        listing: listings,
        user: users,
        category: categories,
        subcategory: subcategories,
      })
      .from(listings)
      .innerJoin(users, eq(listings.userId, users.id))
      .innerJoin(categories, eq(listings.categoryId, categories.id))
      .leftJoin(subcategories, eq(listings.subcategoryId, subcategories.id))
      .where(eq(listings.id, id));

    if (results.length === 0) return undefined;
    const r = results[0];
    return { ...r.listing, user: r.user, category: r.category, subcategory: r.subcategory || undefined };
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const [listing] = await db.insert(listings).values(insertListing).returning();
    return listing;
  }

  async getUserListings(userId: string): Promise<(Listing & { category: Category; subcategory?: Subcategory })[]> {
    const results = await db
      .select({
        listing: listings,
        category: categories,
        subcategory: subcategories,
      })
      .from(listings)
      .innerJoin(categories, eq(listings.categoryId, categories.id))
      .leftJoin(subcategories, eq(listings.subcategoryId, subcategories.id))
      .where(eq(listings.userId, userId))
      .orderBy(desc(listings.createdAt));

    return results.map((r: any) => ({ ...r.listing, category: r.category, subcategory: r.subcategory || undefined }));
  }
}

export const storage = new DbStorage();
