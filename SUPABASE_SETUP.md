# Supabase Setup Guide

To put your Chronos RPG project in production with Supabase, follow these steps:

## 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and sign in.
2. Click "New Project".
3. Give it a name (e.g., "Chronos RPG") and a strong database password.
4. Choose a region close to you.
5. Click "Create new project".

## 2. Get Credentials
1. Once the project is created, go to **Project Settings** (cog icon) -> **API**.
2. Copy the `Project URL`.
3. Copy the `anon` `public` key.
4. Create a file named `.env` in your project root (copy `.env.example`).
5. Paste the values:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## 3. Set up the Database
Go to the **SQL Editor** in your Supabase dashboard and run the following SQL to create the necessary tables and security policies:

```sql
-- Create a table for user profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  game_state jsonb -- Stores the entire UserState object
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, game_state)
  values (
    new.id, 
    new.raw_user_meta_data->>'username', 
    '{}'::jsonb
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 4. Deploying the Frontend
Since this is a Vite React app, you can deploy it to Vercel or Netlify.
1. Push your code to GitHub.
2. Go to Vercel/Netlify and import the repo.
3. Add the Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the deployment settings.
4. Deploy!

## 5. Next Steps (Data Sync)
Currently, the app uses local state. To sync with Supabase:
1. In `App.tsx`, add a `useEffect` to fetch the `game_state` from the `profiles` table when the session loads.
2. Create a function to save the `state` to Supabase whenever it changes (or periodically/on specific actions).
