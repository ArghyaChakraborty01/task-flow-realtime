import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export function useTasks(statusFilter?: TaskStatus) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Cast the data to handle the enum type properly
      const typedTasks = (data || []).map(task => ({
        ...task,
        status: task.status as TaskStatus
      }));

      setTasks(typedTasks);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, toast]);

  // Create a new task (optimistic update)
  const createTask = useCallback(async (title: string, description?: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTask: Task = {
      id: tempId,
      title,
      description: description || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic update
    setTasks(prev => [optimisticTask, ...prev]);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ title, description: description || null })
        .select()
        .single();

      if (error) throw error;

      // Replace optimistic task with real one
      setTasks(prev => prev.map(t => 
        t.id === tempId ? { ...data, status: data.status as TaskStatus } : t
      ));

      toast({ title: 'Success', description: 'Task created successfully' });
      return data;
    } catch (err) {
      // Revert optimistic update
      setTasks(prev => prev.filter(t => t.id !== tempId));
      const message = err instanceof Error ? err.message : 'Failed to create task';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      throw err;
    }
  }, [toast]);

  // Update task (optimistic update)
  const updateTask = useCallback(async (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'status'>>) => {
    const previousTasks = tasks;

    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
    ));

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(t => 
        t.id === id ? { ...data, status: data.status as TaskStatus } : t
      ));

      toast({ title: 'Success', description: 'Task updated successfully' });
      return data;
    } catch (err) {
      // Revert optimistic update
      setTasks(previousTasks);
      const message = err instanceof Error ? err.message : 'Failed to update task';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      throw err;
    }
  }, [tasks, toast]);

  // Delete task (optimistic update)
  const deleteTask = useCallback(async (id: string) => {
    const previousTasks = tasks;

    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Task deleted successfully' });
    } catch (err) {
      // Revert optimistic update
      setTasks(previousTasks);
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      throw err;
    }
  }, [tasks, toast]);

  // Set up realtime subscription
  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          console.log('[Realtime] Task change:', payload);

          if (payload.eventType === 'INSERT') {
            const newTask = { ...payload.new, status: payload.new.status as TaskStatus } as Task;
            setTasks(prev => {
              // Avoid duplicates from optimistic updates
              if (prev.some(t => t.id === newTask.id)) return prev;
              return [newTask, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = { ...payload.new, status: payload.new.status as TaskStatus } as Task;
            setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id as string;
            setTasks(prev => prev.filter(t => t.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
