-- Add missing RLS DELETE policy for profiles table
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Ensure storage policies exist for avatar cleanup during account deletion
-- Create policy for users to delete their own avatars
CREATE POLICY "Users can delete their own avatars" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);