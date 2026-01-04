import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const taskId = pathParts[pathParts.length - 1];
    const isSpecificTask = taskId && taskId !== 'tasks' && !taskId.includes('?');

    console.log(`[Tasks API] ${req.method} request received`);
    console.log(`[Tasks API] Path: ${url.pathname}, Task ID: ${isSpecificTask ? taskId : 'none'}`);

    // POST /api/tasks - Create a new task
    if (req.method === 'POST') {
      const body = await req.json();
      console.log('[Tasks API] Creating task:', body);

      if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
        return new Response(
          JSON.stringify({ error: 'Title is required and must be a non-empty string' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (body.status && !validStatuses.includes(body.status)) {
        return new Response(
          JSON.stringify({ error: `Status must be one of: ${validStatuses.join(', ')}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: body.title.trim(),
          description: body.description?.trim() || null,
          status: body.status || 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('[Tasks API] Error creating task:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('[Tasks API] Task created:', data);
      return new Response(
        JSON.stringify(data),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /api/tasks - Get all tasks (with optional status filter)
    if (req.method === 'GET' && !isSpecificTask) {
      const status = url.searchParams.get('status');
      console.log('[Tasks API] Fetching tasks, status filter:', status);

      let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

      if (status) {
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!validStatuses.includes(status)) {
          return new Response(
            JSON.stringify({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[Tasks API] Error fetching tasks:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[Tasks API] Found ${data?.length || 0} tasks`);
      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PATCH /api/tasks/:id - Update task status
    if (req.method === 'PATCH' && isSpecificTask) {
      const body = await req.json();
      console.log('[Tasks API] Updating task:', taskId, body);

      const updateData: Record<string, unknown> = {};

      if (body.title !== undefined) {
        if (typeof body.title !== 'string' || body.title.trim() === '') {
          return new Response(
            JSON.stringify({ error: 'Title must be a non-empty string' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        updateData.title = body.title.trim();
      }

      if (body.description !== undefined) {
        updateData.description = body.description?.trim() || null;
      }

      if (body.status !== undefined) {
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!validStatuses.includes(body.status)) {
          return new Response(
            JSON.stringify({ error: `Status must be one of: ${validStatuses.join(', ')}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        updateData.status = body.status;
      }

      if (Object.keys(updateData).length === 0) {
        return new Response(
          JSON.stringify({ error: 'No valid fields to update' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('[Tasks API] Error updating task:', error);
        if (error.code === 'PGRST116') {
          return new Response(
            JSON.stringify({ error: 'Task not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('[Tasks API] Task updated:', data);
      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE /api/tasks/:id - Delete a task
    if (req.method === 'DELETE' && isSpecificTask) {
      console.log('[Tasks API] Deleting task:', taskId);

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('[Tasks API] Error deleting task:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('[Tasks API] Task deleted');
      return new Response(
        JSON.stringify({ message: 'Task deleted successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Tasks API] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
