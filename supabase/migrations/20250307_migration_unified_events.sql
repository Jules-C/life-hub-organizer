-- Create unified events table with a clean design optimized for family organization
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_all_day BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  event_type TEXT NOT NULL, -- 'personal', 'work', 'family', 'health'
  color TEXT,
  visibility TEXT NOT NULL DEFAULT 'private', -- 'private', 'family', 'public'
  metadata JSONB, -- For type-specific properties
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_family_id ON events(family_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_visibility ON events(visibility);

-- Add row-level security policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Core policy: Users can always view, edit and delete their own events
CREATE POLICY "Users can view their own events" 
  ON events FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own events" 
  ON events FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own events" 
  ON events FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own events" 
  ON events FOR DELETE 
  USING (user_id = auth.uid());

-- Family sharing policy: Users can view events shared within their family
-- This complements (doesn't replace) the user's own events policy
CREATE POLICY "Users can view family shared events" 
  ON events FOR SELECT 
  USING (
    visibility IN ('family', 'public') AND
    family_id IN (
      SELECT family_id FROM family_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger to set default visibility based on event_type
CREATE OR REPLACE FUNCTION set_event_defaults()
RETURNS TRIGGER AS $$
BEGIN
  -- Set default visibility based on event type if not explicitly set
  IF NEW.visibility IS NULL OR NEW.visibility = 'private' THEN
    CASE NEW.event_type
      WHEN 'family' THEN NEW.visibility := 'family';
      WHEN 'work' THEN 
        -- Work events can default to family visibility to share work schedules
        -- or keep private based on your app's needs
        NEW.visibility := 'private'; 
      WHEN 'health' THEN NEW.visibility := 'private'; -- Health data is private by default
      WHEN 'personal' THEN NEW.visibility := 'private';
      ELSE NEW.visibility := 'private';
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_defaults_trigger
BEFORE INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION set_event_defaults();