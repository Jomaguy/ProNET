-- Create the contacts table with proper structure and relationships
create table if not exists public.contacts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    full_name text not null,
    email text,
    phone_number text,
    job_title text,
    company text,
    linkedin text,
    notes text,
    tags text[],
    last_contacted timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create an RLS policy to ensure users can only access their own contacts
alter table public.contacts enable row level security;

create policy "Users can view their own contacts"
    on contacts for select
    using (auth.uid() = user_id);

create policy "Users can insert their own contacts"
    on contacts for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own contacts"
    on contacts for update
    using (auth.uid() = user_id);

create policy "Users can delete their own contacts"
    on contacts for delete
    using (auth.uid() = user_id);

-- Create an index on user_id for better query performance
create index contacts_user_id_idx on contacts(user_id);

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger to call the update function
create trigger update_contacts_updated_at
    before update on contacts
    for each row
    execute function update_updated_at_column(); 