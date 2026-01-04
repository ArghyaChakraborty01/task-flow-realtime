-- Create enum type for task status
CREATE TYPE task_status AS ENUM ('pending', 'in-progress', 'completed');

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since no auth yet)
CREATE POLICY "Allow public read access"
ON public.tasks
FOR SELECT
USING (true);

-- Create policy for public insert access
CREATE POLICY "Allow public insert access"
ON public.tasks
FOR INSERT
WITH CHECK (true);

-- Create policy for public update access
CREATE POLICY "Allow public update access"
ON public.tasks
FOR UPDATE
USING (true);

-- Create policy for public delete access
CREATE POLICY "Allow public delete access"
ON public.tasks
FOR DELETE
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;