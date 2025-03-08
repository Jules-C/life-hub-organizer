-- Create invitations table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  token UUID NOT NULL DEFAULT uuid_generate_v4(),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create index for faster lookups
CREATE INDEX invitations_email_idx ON invitations (email);
CREATE INDEX invitations_token_idx ON invitations (token);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view invitations they created"
  ON invitations FOR SELECT
  USING (invited_by = auth.uid());

CREATE POLICY "Users can insert invitations for families they are admins of"
  ON invitations FOR INSERT
  WITH CHECK (family_id IN (
    SELECT family_id FROM family_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Add database function for accepting invitations
CREATE OR REPLACE FUNCTION accept_invitation(token_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invitation RECORD;
  v_family_id UUID;
  v_role TEXT;
  v_user_id UUID;
BEGIN
  -- Get the current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to accept an invitation';
  END IF;
  
  -- Find the invitation
  SELECT i.family_id, i.role INTO v_family_id, v_role
  FROM invitations i
  WHERE i.token = token_param
    AND i.status = 'pending'
    AND i.expires_at > NOW();
  
  IF v_family_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;
  
  -- Check if the user is already a member of this family
  IF EXISTS (
    SELECT 1 FROM family_members 
    WHERE family_id = v_family_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'User is already a member of this family';
  END IF;
  
  -- Add the user as a family member
  INSERT INTO family_members (family_id, user_id, role)
  VALUES (v_family_id, v_user_id, v_role);
  
  -- Update the invitation status
  UPDATE invitations
  SET status = 'accepted'
  WHERE token = token_param;
  
  -- Return success info
  RETURN jsonb_build_object(
    'success', true,
    'family_id', v_family_id,
    'role', v_role
  );
END;
$$;