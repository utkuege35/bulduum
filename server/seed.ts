import { db } from "./db";
import { categories, subcategories } from "../shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Create categories
  const [education] = await db.insert(categories).values({
    name: "Eğitim",
    slug: "egitim",
    description: "Matematik, İngilizce, Müzik ve daha fazlası",
  }).returning();

  const [homeServices] = await db.insert(categories).values({
    name: "Ev Hizmetleri",
    slug: "ev-hizmetleri",
    description: "Temizlik, Tadilat, Elektrik, Tesisat",
  }).returning();

  const [careServices] = await db.insert(categories).values({
    name: "Bakım Hizmetleri",
    slug: "bakim",
    description: "Çocuk, Yaşlı ve Hasta Bakımı",
  }).returning();

  const [handmade] = await db.insert(categories).values({
    name: "El Yapımı Ürünler",
    slug: "el-yapimi",
    description: "Pasta, Börek, El İşi Ürünler",
  }).returning();

  console.log("Created categories");

  // Create subcategories for Education
  await db.insert(subcategories).values([
    { categoryId: education.id, name: "Matematik", slug: "matematik" },
    { categoryId: education.id, name: "İngilizce", slug: "ingilizce" },
    { categoryId: education.id, name: "Piyano", slug: "piyano" },
    { categoryId: education.id, name: "Gitar", slug: "gitar" },
    { categoryId: education.id, name: "Fen Bilimleri", slug: "fen-bilimleri" },
  ]);

  // Create subcategories for Home Services
  await db.insert(subcategories).values([
    { categoryId: homeServices.id, name: "Temizlik", slug: "temizlik" },
    { categoryId: homeServices.id, name: "Elektrik", slug: "elektrik" },
    { categoryId: homeServices.id, name: "Tesisat", slug: "tesisat" },
    { categoryId: homeServices.id, name: "Tadiلات", slug: "tadilat" },
    { categoryId: homeServices.id, name: "Bahçıvanlık", slug: "bahcivanlik" },
  ]);

  // Create subcategories for Care Services
  await db.insert(subcategories).values([
    { categoryId: careServices.id, name: "Çocuk Bakımı", slug: "cocuk-bakimi" },
    { categoryId: careServices.id, name: "Yaşlı Bakımı", slug: "yasli-bakimi" },
    { categoryId: careServices.id, name: "Hasta Bakımı", slug: "hasta-bakimi" },
  ]);

  // Create subcategories for Handmade
  await db.insert(subcategories).values([
    { categoryId: handmade.id, name: "Pasta & Tatlılar", slug: "pasta-tatlilar" },
    { categoryId: handmade.id, name: "Börek & Hamur İşleri", slug: "borek-hamur-isleri" },
    { categoryId: handmade.id, name: "El İşi Ürünler", slug: "el-isi-urunler" },
    { categoryId: handmade.id, name: "Örgü & Nakış", slug: "orgu-nakis" },
  ]);

  console.log("Created subcategories");
  console.log("Seeding complete!");
}

seed().catch(console.error);
