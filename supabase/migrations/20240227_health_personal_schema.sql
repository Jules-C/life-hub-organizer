-- Create cycle_tracking table
CREATE TABLE cycle_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  flow_intensity INTEGER CHECK (flow_intensity BETWEEN 1 AND 5),
  symptoms JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_private BOOLEAN DEFAULT true
);

-- Create personal_events table
CREATE TABLE personal_events (
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
  event_type TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'busy', 'details', 'full'))
);

-- Create event_sharing table
CREATE TABLE event_sharing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES personal_events(id) ON DELETE CASCADE,
  shared_with UUID NOT NULL REFERENCES auth.users(id),
  permission TEXT NOT NULL DEFAULT 'view' CHECK (permission IN ('view', 'edit', 'admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, shared_with)
);

-- Create user preferences table for feature toggles
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  features JSONB DEFAULT '{"healthTracking": true, "healthPrivacy": false, "personalEvents": true, "workSchedule": true}',
  notifications JSONB DEFAULT '{"email": true, "browser": true, "documents": true, "calendar": true, "tasks": true, "quietHoursStart": "22:00", "quietHoursEnd": "08:00"}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE cycle_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for cycle tracking
CREATE POLICY "Users can only view their own cycle tracking data"
  ON cycle_tracking FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can only insert their own cycle tracking data"
  ON cycle_tracking FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can only update their own cycle tracking data"
  ON cycle_tracking FOR UPDATE
  USING (user_id = auth.uid());

-- Add RLS policies for personal events
CREATE POLICY "Users can view their own personal events"
  ON personal_events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view family events with family visibility"
  ON personal_events FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
    AND visibility IN ('family', 'full')
  );

CREATE POLICY "Users can view events shared with them"
  ON personal_events FOR SELECT
  USING (
    id IN (
      SELECT event_id FROM event_sharing 
      WHERE shared_with = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "Users can insert their own personal events"
  ON personal_events FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own personal events"
  ON personal_events FOR UPDATE
  USING (user_id = auth.uid());

-- Add RLS policies for event sharing
CREATE POLICY "Users can view sharing for their own events"
  ON event_sharing FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM personal_events WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view sharing where they are the recipient"
  ON event_sharing FOR SELECT
  USING (shared_with = auth.uid());

CREATE POLICY "Users can insert sharing for their own events"
  ON event_sharing FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM personal_events WHERE user_id = auth.uid()
    )
  );

-- Add RLS policies for user preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at automatically
CREATE TRIGGER update_cycle_tracking_modtime
BEFORE UPDATE ON cycle_tracking
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_personal_events_modtime
BEFORE UPDATE ON personal_events
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_event_sharing_modtime
BEFORE UPDATE ON event_sharing
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_user_preferences_modtime
BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
