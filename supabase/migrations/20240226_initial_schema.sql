-- Create families table
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Create family_members table
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  preferences JSONB,
  UNIQUE(family_id, user_id)
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  metadata JSONB,
  status TEXT DEFAULT 'active'
);

-- Create tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT,
  category TEXT,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(name, family_id)
);

-- Create document_tags table
CREATE TABLE document_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  UNIQUE(document_id, tag_id)
);

-- Set up RLS (Row Level Security)
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can see their own families"
  ON families FOR SELECT
  USING (created_by = auth.uid() OR id IN (
    SELECT family_id FROM family_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert into families"
  ON families FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can see family members if they belong to the family"
  ON family_members FOR SELECT
  USING (family_id IN (
    SELECT id FROM families WHERE created_by = auth.uid()
    UNION
    SELECT family_id FROM family_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view documents from their families"
  ON documents FOR SELECT
  USING (family_id IN (
    SELECT id FROM families WHERE created_by = auth.uid()
    UNION
    SELECT family_id FROM family_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert documents into their families"
  ON documents FOR INSERT
  WITH CHECK (family_id IN (
    SELECT id FROM families WHERE created_by = auth.uid()
    UNION
    SELECT family_id FROM family_members WHERE user_id = auth.uid()
  ));
