begin;

alter table public.messages
  add column if not exists ip_hash text;

alter table public.messages
  alter column is_hidden set default false;

alter table public.messages
  add constraint messages_body_length check (
    char_length(message) between 1 and 300
  );

alter table public.messages
  add constraint messages_name_length check (
    name is null
    or (
      char_length(split_part(name, '::', 1)) <= 40
      and char_length(split_part(coalesce(name, ''), '::', 2)) <= 40
    )
  );

comment on column public.messages.ip_hash is 'SHA-256 hash of submitter IP';

create index if not exists messages_created_at_idx
  on public.messages (created_at desc);

revoke update, delete on table public.messages from anon;
revoke update, delete on table public.messages from authenticated;
grant select, insert on table public.messages to anon;

drop policy if exists "anon_select_visible" on public.messages;
create policy "anon_select_visible"
  on public.messages
  for select
  using (is_hidden = false);

drop policy if exists "anon_insert_messages" on public.messages;
create policy "anon_insert_messages"
  on public.messages
  for insert
  with check (coalesce(is_hidden, false) = false);

commit;
