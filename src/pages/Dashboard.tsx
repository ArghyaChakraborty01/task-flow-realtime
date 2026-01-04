import { useState } from 'react';
import { useTasks, TaskStatus, Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: <AlertCircle className="h-4 w-4" /> },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: <Clock className="h-4 w-4" /> },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle className="h-4 w-4" /> },
};

export default function Dashboard() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await createTask(newTitle, newDescription);
    setNewTitle('');
    setNewDescription('');
    setIsCreateOpen(false);
  };

  const handleUpdate = async () => {
    if (!editingTask || !newTitle.trim()) return;
    await updateTask(editingTask.id, { title: newTitle, description: newDescription });
    setEditingTask(null);
    setNewTitle('');
    setNewDescription('');
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await updateTask(taskId, { status });
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description || '');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-foreground">
            TaskFlow
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Real-time Connected
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title and Create Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Task Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your tasks with real-time updates</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to your list. It will appear in real-time.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Task title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Task description (optional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!newTitle.trim()}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as TaskStatus | 'all')} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({tasks.filter(t => t.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({tasks.filter(t => t.status === 'in-progress').length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({tasks.filter(t => t.status === 'completed').length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-muted p-4 mb-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' ? 'Create your first task to get started' : `No ${filter} tasks`}
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className={statusConfig[task.status].color}>
                      {statusConfig[task.status].icon}
                      <span className="ml-1">{statusConfig[task.status].label}</span>
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{task.title}</CardTitle>
                  {task.description && (
                    <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                    <Select value={task.status} onValueChange={(v) => handleStatusChange(task.id, v as TaskStatus)}>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Make changes to your task.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Task title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Textarea
                placeholder="Task description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={!newTitle.trim()}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
