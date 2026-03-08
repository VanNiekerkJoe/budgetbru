

# Couples Finance Page — Full Plan

## Overview
Create a new `/couples` page with full database backing where partners can link accounts and jointly manage finances. The page will include: partner linking/invitations, shared budgets, shared expenses, shared savings goals, wishlists, date night planning, and a couples dashboard.

## Database Changes (Migration)

Create these tables:

1. **`couple_links`** — Stores the pairing between two users
   - `id`, `user_id_1`, `user_id_2`, `status` (pending/active/declined), `created_at`, `updated_at`
   - RLS: Users can see/manage links where they are either user_id_1 or user_id_2

2. **`couple_shared_expenses`** — Joint expense tracking
   - `id`, `couple_link_id`, `added_by`, `description`, `amount`, `category`, `split_type` (50/50, custom), `split_percentage`, `date`, `created_at`
   - RLS: Users can access if they belong to the couple_link

3. **`couple_shared_goals`** — Shared savings goals
   - `id`, `couple_link_id`, `title`, `target_amount`, `current_amount`, `deadline`, `icon`, `created_at`, `updated_at`
   - RLS: Same couple-based access

4. **`couple_wishlists`** — Shared wishlist items
   - `id`, `couple_link_id`, `added_by`, `title`, `estimated_cost`, `priority` (low/medium/high), `is_purchased`, `url`, `created_at`

5. **`couple_messages`** — Simple love notes / money chat
   - `id`, `couple_link_id`, `sender_id`, `message`, `created_at`

A security definer function `is_couple_member(_user_id uuid, _couple_link_id uuid)` to use in RLS policies.

## Frontend — New Page: `src/pages/CouplesPage.tsx`

Tabbed interface with these sections:

### Tab 1: Dashboard
- Partner status (linked / invite pending)
- Invite partner by email flow
- Combined spending summary, shared goals progress
- Recent shared activity

### Tab 2: Shared Expenses
- Add shared expenses with split options (50/50, custom %)
- List of shared expenses with who-paid indicator
- Monthly totals and balance (who owes whom)

### Tab 3: Shared Goals
- Create joint savings goals (e.g., vacation, home deposit)
- Progress bars, contribute button
- Celebrate milestones together

### Tab 4: Wishlist
- Add items with cost estimates, priority, and optional URL
- Mark as purchased
- Filter by priority

### Tab 5: Love Notes
- Simple message board between partners
- Money-related check-ins and notes

## Navigation
- Add a `Heart` icon entry to both Sidebar (`SOCIAL_ITEMS`) and MobileNavbar menus pointing to `/couples`
- Add route in `App.tsx` as a protected route

## Technical Details
- Use `is_couple_member` security definer function in all RLS policies to avoid recursion
- Edge function not needed — all logic via client SDK
- Invite flow: user enters partner's email → lookup profile by email not possible (no email in profiles), so use an invite code system: generate a unique code, partner enters it to link
- Enable realtime on `couple_messages` for live chat

## Files to Create/Edit
- **Create**: `supabase/migrations/..._couples.sql` (all tables + function + RLS)
- **Create**: `src/pages/CouplesPage.tsx`
- **Edit**: `src/App.tsx` — add route
- **Edit**: `src/components/layout/Sidebar.tsx` — add nav item
- **Edit**: `src/components/layout/MobileNavbar.tsx` — add nav item

