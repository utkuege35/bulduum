# Bulduum Platform - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from successful marketplace platforms (Airbnb, TaskRabbit, Fiverr) while creating a unique identity centered around trust, accessibility, and community connection.

**Core Principle**: Build trust through clarity, professionalism, and human-centered design that makes finding and connecting with service providers effortless.

---

## Typography System

**Font Family**: 
- Primary: Inter or DM Sans (Google Fonts)
- Headings: Bold (700), semi-bold (600)
- Body: Regular (400), medium (500)

**Type Scale**:
- Hero Headlines: text-5xl md:text-6xl
- Section Headers: text-3xl md:text-4xl
- Card Titles: text-xl font-semibold
- Body Text: text-base
- Small Text/Meta: text-sm
- Micro Text: text-xs

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-8
- Section spacing: py-12 md:py-20
- Card gaps: gap-6 to gap-8
- Grid gaps: gap-4 md:gap-6

**Container Strategy**:
- Max width: max-w-7xl
- Content sections: max-w-6xl
- Forms: max-w-2xl
- Consistent horizontal padding: px-4 md:px-6 lg:px-8

---

## Core Page Structures

### Landing Page (7 sections)

1. **Hero Section** (90vh)
   - Full-width with hero image (people helping others, diverse services)
   - Centered content with Bulduum logo
   - Large headline: "Bulduğun Her Hizmeti, Bir Tıkla Bul"
   - Category quick-search bar (prominent search with category dropdown)
   - Trust indicators below search: "5000+ Hizmet Sağlayıcı • 15.000+ Mutlu Müşteri"

2. **Category Grid** (py-16)
   - 4-column grid (2 on tablet, 1 on mobile)
   - Large iconography with category names
   - Main categories: Eğitim, Ev Hizmetleri, Bakım Hizmetleri, El Yapımı Ürünler
   - Hover effects showing subcategory count

3. **How It Works** (py-20)
   - 3-column timeline layout
   - Icons with numbers: "1. Kayıt Ol → 2. Ara & Bul → 3. İletişime Geç"
   - Simple, visual explanations

4. **Featured Service Providers** (py-20)
   - 3-column card grid showcasing top-rated providers
   - Cards include: profile photo, name, service category, rating stars, brief description

5. **Trust & Safety** (py-16)
   - 2-column split: text + illustration/image
   - Highlight review system, profile verification, messaging safety

6. **Testimonials** (py-20)
   - 3-column testimonial cards
   - Customer photos, ratings, quoted reviews, service type

7. **CTA Section** (py-24)
   - Centered, impactful
   - "Hizmet Sağlayıcı mısınız? Katılın" and "Hizmet Arıyor musunuz? Keşfedin" dual CTAs
   - Background image with blur overlay for buttons

### Service Provider Listing Page

**Layout**: Sidebar + Main Content
- **Sidebar** (w-1/4): 
  - Category tree navigation
  - Filters: rating, location, price range
  - Sticky positioning on scroll
  
- **Main Content** (w-3/4):
  - Search bar at top
  - Results count and sorting options
  - Grid: 3 cards per row (2 on tablet, 1 on mobile)
  - Cards: Square profile image, name, category badge, star rating, truncated bio, "Mesaj Gönder" button

### Service Provider Profile Page

**Single Column Layout** (max-w-4xl):
- Header Section: 
  - Large circular profile photo (left)
  - Name, category badges, rating summary (right)
  - "Mesaj Gönder" primary CTA button
- About Section: Full bio, services offered (bulleted list)
- Gallery: 2-3 column grid showing work examples
- Reviews Section: List view with reviewer photo, rating, comment, date
- Contact Info: Available methods (displayed clearly)

### Messaging Interface

**Split Layout** (desktop):
- Conversation list sidebar (w-1/3): Contact cards with avatar, name, last message preview
- Message thread (w-2/3): Traditional messaging layout with sender/receiver alignment
- Mobile: Single view with back navigation

### User Profiles (Both Types)

**Dashboard Layout**:
- Top stats cards (4-column grid)
- Quick actions panel
- Recent activity feed
- Profile completion progress (for service providers)

---

## Component Library

### Navigation
- Header: Logo left, category links center, "Giriş/Kayıt" right
- Sticky on scroll with subtle shadow
- Mobile: Hamburger menu

### Cards
- Service Provider Cards: 
  - Aspect ratio 3:4 for image
  - Padding: p-4
  - Rounded: rounded-lg
  - Shadow on hover: hover:shadow-lg transition
  
- Review Cards:
  - Horizontal layout: avatar, content, rating
  - Border: border with subtle border color
  
- Category Cards:
  - Large icon (64px)
  - Category name below
  - Subcategory count badge

### Forms
- Input fields: rounded-lg, border, p-3
- Labels: text-sm font-medium, mb-2
- Error states: red border + error text
- Success states: green border + success text
- Form spacing: space-y-4

### Buttons
- Primary: Rounded (rounded-full or rounded-lg), px-6 py-3, font-medium
- Secondary: Outlined variant
- Text buttons for tertiary actions
- All buttons include blur background when on images

### Rating System
- Star icons (filled/outlined)
- Display: inline with review count
- Size: text-lg for prominent, text-sm for compact

### Badges
- Category badges: rounded-full, px-3 py-1, text-xs font-medium
- Status indicators: Small dot + text
- Verification badge: checkmark icon with "Doğrulanmış" text

### Messaging Components
- Message bubbles: Rounded corners (sender: right-aligned, receiver: left-aligned)
- Timestamp: text-xs below each message
- Input area: Fixed bottom, textarea with send button

---

## Images

**Required Images**:

1. **Hero Image**: Wide landscape shot showing diverse people in various service scenarios (tutor teaching, cleaner working, caregiver with elderly person, craftsperson creating). Warm, professional photography. Placed as full-width background in hero section.

2. **Category Illustrations**: Icon-style illustrations or photos for each main category (books for education, house for home services, heart for care services, handmade items for crafts)

3. **How It Works Section**: Simple illustrative icons or small images for each step

4. **Service Provider Photos**: Profile headshots (professional, friendly) for featured providers and example listings

5. **Testimonial Photos**: Customer headshots for review section

6. **Trust Section**: Illustration showing secure messaging or verified profiles

7. **CTA Section Background**: Image of happy customers and service providers interacting, with blur overlay for button clarity

---

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px (single column, stacked navigation)
- Tablet: 768px - 1024px (2-column grids, simplified sidebar)
- Desktop: > 1024px (full multi-column layouts)

**Mobile Priorities**:
- Bottom navigation for key actions
- Collapsible filters
- Swipeable cards where applicable
- Touch-friendly button sizes (min 44px height)

---

## Accessibility

- Minimum text contrast ratios maintained
- Focus states on all interactive elements (ring-2 ring-offset-2)
- Alt text for all images
- Keyboard navigation support
- ARIA labels for icon-only buttons
- Form labels always visible (no placeholder-only inputs)