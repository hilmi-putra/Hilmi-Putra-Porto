# Supabase Backend Configuration

This folder contains the database configuration and migrations for Hilmi Abdurrafi Putra Setiawan's portfolio website.

## Database Tables

The database schema is configured under the `supabase/migrations/01_schema.sql` file. It includes:
1. `projects`: Stores information about featured works and portfolio projects.
   - Fields: `id` (UUID), `title`, `description`, `category`, `image_url`, `project_url`, `github_url`, `created_at`.
2. `messages`: Stores incoming contact form submissions from clients.
   - Fields: `id` (UUID), `name`, `email`, `message`, `created_at`.

## Database Security (Row Level Security - RLS)

Row Level Security is enabled on both tables to ensure data integrity and security:
- **`projects`**:
  - Anyone (public) can read projects so they load on the portfolio home page.
  - Only authenticated administrators (via Supabase Auth) can create, update, or delete projects.
- **`messages`**:
  - Anyone (public) can submit a message (contact form submission).
  - Only authenticated administrators can view, manage, or delete submitted messages.

## Supabase Deployment Instructions

To integrate this backend with your live portfolio:

1. **Create a Supabase Project**:
   - Go to [Supabase](https://supabase.com) and sign in.
   - Create a new project, and note down your **Project URL** and **API Anon Key**.

2. **Run Migrations**:
   - In your Supabase dashboard, go to the **SQL Editor**.
   - Copy the contents of `supabase/migrations/01_schema.sql` and run it to create tables and RLS policies.

3. **Configure Authentication**:
   - Go to **Authentication > Providers** and ensure Email/Password provider is enabled.
   - Go to **Authentication > Users** and click **Add User > Create User** to create an Admin account using your email and password. Use this email and password to log in through the `/admin/login` page on the frontend dashboard.

4. **Frontend Configuration**:
   - Copy the Project URL and API Anon Key into your frontend `.env` file:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
