
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle, CircleCheck, CircleEllipsis, Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { BadgeGlow } from '../ui/badge-glow';

type Task = {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  isCompleted: boolean;
};

type TaskAssignmentProps = {
  eventId: string;
  members: string[];
};

const TaskAssignment: React.FC<TaskAssignmentProps> = ({ eventId, members = ['Me', 'John', 'Sarah'] }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      description: 'Book accommodation',
      assignedTo: 'Me',
      dueDate: '2025-04-08',
      isCompleted: true
    },
    {
      id: '2',
      description: 'Buy event tickets',
      assignedTo: 'Sarah',
      dueDate: '2025-04-10',
      isCompleted: false
    },
    {
      id: '3',
      description: 'Arrange transport',
      assignedTo: 'John',
      dueDate: '2025-04-09',
      isCompleted: false
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'isCompleted'>>({
    description: '',
    assignedTo: 'Me',
    dueDate: ''
  });
  
  const handleAddTask = () => {
    if (!newTask.description || !newTask.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      isCompleted: false
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      description: '',
      assignedTo: 'Me',
      dueDate: ''
    });
    setShowAddModal(false);
    toast.success('Task added successfully');
  };
  
  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const completed = !task.isCompleted;
        
        // Show achievement notification when completing a task
        if (completed) {
          toast.success('Task completed! +5 points', {
            description: "You're making great progress!",
            action: {
              label: "View Achievements",
              onClick: () => {}
            },
          });
        }
        
        return { ...task, isCompleted: completed };
      }
      return task;
    }));
  };
  
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task removed');
  };
  
  const calculateCompletion = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.isCompleted).length;
    return (completed / tasks.length) * 100;
  };
  
  const completionPercentage = calculateCompletion();
  const memberCompletionRate: Record<string, number> = {};
  
  members.forEach(member => {
    const memberTasks = tasks.filter(task => task.assignedTo === member);
    const completedTasks = memberTasks.filter(task => task.isCompleted).length;
    memberCompletionRate[member] = memberTasks.length ? (completedTasks / memberTasks.length) * 100 : 0;
  });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Task Assignment</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs flex items-center gap-1 bg-theme-pink/10 text-theme-pink py-1 px-2 rounded-md"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={14} />
          Add Task
        </motion.button>
      </div>
      
      {/* Progress overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</span>
          <span className="text-sm font-medium">{completionPercentage.toFixed(0)}% Complete</span>
        </div>
        
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            className="h-full bg-gradient-to-r from-theme-pink to-theme-indigo"
          />
        </div>
        
        {/* Member progress */}
        <div className="mt-4 space-y-3">
          {members.map(member => {
            const completion = memberCompletionRate[member] || 0;
            const memberTasks = tasks.filter(task => task.assignedTo === member);
            const completedTasks = memberTasks.filter(task => task.isCompleted).length;
            
            return (
              <div key={member} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-theme-indigo to-theme-pink flex items-center justify-center text-white font-semibold text-sm">
                  {member.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span>{member}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {completedTasks}/{memberTasks.length} tasks
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Task list */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border-l-4 ${
              task.isCompleted 
                ? 'border-green-500' 
                : new Date(task.dueDate) < new Date() 
                  ? 'border-red-500' 
                  : 'border-blue-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => handleToggleComplete(task.id)}
                  className="mt-1"
                >
                  {task.isCompleted ? (
                    <BadgeGlow glowColor="rgba(34, 197, 94, 0.6)">
                      <CheckCircle className="text-green-500" size={18} />
                    </BadgeGlow>
                  ) : (
                    <CircleEllipsis className="text-gray-400" size={18} />
                  )}
                </button>
                <div>
                  <div className={`font-medium ${task.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                    {task.description}
                  </div>
                  <div className="flex flex-wrap gap-x-3 mt-1 text-xs">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Users size={12} className="mr-1" />
                      {task.assignedTo}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No tasks assigned yet. Start by adding your first task!
          </div>
        )}
      </div>
      
      {/* Add task modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="text-xl font-semibold">Add New Task</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task Description</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="e.g., Book accommodation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                <select
                  className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  {members.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="p-4 flex space-x-2 justify-end border-t dark:border-gray-700">
              <button 
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-3 py-1.5 bg-theme-pink text-white rounded-md"
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskAssignment;
