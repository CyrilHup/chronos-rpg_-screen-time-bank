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
