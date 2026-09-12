create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject varchar(120) not null,
  status varchar(20) not null default 'aberto' check (status in ('aberto', 'respondido', 'fechado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_role varchar(20) not null check (author_role in ('usuario', 'admin')),
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;

create table if not exists public.registros (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  numero text not null,
  tipo text not null default 'telefone' check (tipo in ('telefone', 'e-mail', 'site')),
  data_ocorrencia date,
  categoria text not null,
  plataforma text,
  relato text not null,
  geolocalizacao jsonb,
  ip_origem inet,
  created_at timestamptz not null default now()
);

alter table public.registros add column if not exists usuario_id uuid references auth.users(id) on delete cascade;
alter table public.registros add column if not exists tipo text not null default 'telefone';

create index if not exists registros_numero_idx on public.registros (numero);
create index if not exists registros_tipo_idx on public.registros (tipo);
alter table public.registros enable row level security;

create table if not exists public.noticias (
  id uuid primary key default gen_random_uuid(),
  titulo varchar(180) not null,
  resumo text not null,
  conteudo text not null,
  fonte varchar(240),
  categoria varchar(80),
  imagem_path text,
  publicada boolean not null default false,
  autor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.noticias enable row level security;

create policy "noticias publicadas podem ser lidas"
  on public.noticias for select
  using (publicada = true);

create policy "usuario pode criar o proprio registro"
  on public.registros for insert
  with check (auth.uid() = usuario_id);

create policy "usuario pode consultar registros"
  on public.registros for select
  using (true);

create table if not exists public.fontes_externas (
  id uuid primary key default gen_random_uuid(),
  nome varchar(120) not null,
  url text not null,
  tipo varchar(40) not null,
  ativa boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ocorrencias_externas (
  id uuid primary key default gen_random_uuid(),
  fonte_id uuid not null references public.fontes_externas(id) on delete restrict,
  identificador_externo text not null,
  indicador text not null,
  tipo varchar(20) not null check (tipo in ('telefone', 'e-mail', 'site')),
  categoria text,
  data_fonte timestamptz,
  importado_em timestamptz not null default now(),
  unique (fonte_id, identificador_externo)
);

create index if not exists ocorrencias_externas_indicador_idx on public.ocorrencias_externas (indicador);
alter table public.fontes_externas enable row level security;
alter table public.ocorrencias_externas enable row level security;

create policy "fontes externas ativas podem ser lidas"
  on public.fontes_externas for select
  using (ativa = true);

create policy "ocorrencias externas podem ser lidas"
  on public.ocorrencias_externas for select
  using (true);