
import React, { useState } from 'react';
import { Check, Trash2, ChevronDown, Plus, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: number;
  task: string;
  poolType: string;
  date: string;
  priority: 'Alta' | 'Média' | 'Baixa';
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    task: '',
    poolType: '',
    date: '',
    priority: 'Média'
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Média':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTaskComplete = (id: number) => {
    console.log('Tarefa marcada como concluída');
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleTaskDelete = (id: number) => {
    console.log('Tarefa excluída com sucesso');
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handlePriorityChange = (id: number, priority: Task['priority']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
    console.log(`Prioridade alterada para "${priority}"`);
  };

  const handleAddTask = () => {
    if (!newTask.task || !newTask.poolType || !newTask.date) {
      console.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const taskToAdd: Task = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      task: newTask.task,
      poolType: newTask.poolType,
      date: newTask.date,
      priority: newTask.priority as Task['priority'] || 'Média'
    };

    setTasks([...tasks, taskToAdd]);
    setNewTask({
      task: '',
      poolType: '',
      date: '',
      priority: 'Média'
    });
    setShowAddTask(false);
    console.log('Nova tarefa adicionada com sucesso');
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Tarefas Pendentes</h2>
        </div>
        <Button 
          onClick={() => setShowAddTask(!showAddTask)}
          className="bg-green-500 hover:bg-green-600 text-white transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Tarefa
        </Button>
      </div>

      {showAddTask && (
        <div className="p-4 bg-muted/20 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tarefa</label>
              <input
                type="text"
                value={newTask.task}
                onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrição da tarefa"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tipo de Piscina</label>
              <select
                value={newTask.poolType}
                onChange={(e) => setNewTask({...newTask, poolType: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecionar tipo</option>
                <option value="Piscina Pequena">Piscina Pequena</option>
                <option value="Piscina Média">Piscina Média</option>
                <option value="Piscina Grande">Piscina Grande</option>
                <option value="Piscina Olímpica">Piscina Olímpica</option>
                <option value="Spa/Jacuzzi">Spa/Jacuzzi</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Data</label>
              <input
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Prioridade</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task['priority']})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={() => setShowAddTask(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTask}>
              Adicionar
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">TAREFA</TableHead>
              <TableHead className="w-[20%]">TIPO DE PISCINA</TableHead>
              <TableHead className="w-[15%]">DATA</TableHead>
              <TableHead className="w-[15%]">PRIORIDADE</TableHead>
              <TableHead className="w-[10%]">AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center space-y-2">
                    <Calendar className="h-12 w-12 text-gray-300" />
                    <p>Nenhuma tarefa cadastrada</p>
                    <p className="text-sm">Adicione uma nova tarefa para começar</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium">{task.task}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 mr-1.5 text-blue-600" />
                      {task.poolType}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(task.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge className={`cursor-pointer ${getPriorityStyle(task.priority)}`}>
                          {task.priority} <ChevronDown className="ml-1 h-3 w-3 inline" />
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'Alta')}>
                          Alta
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'Média')}>
                          Média
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'Baixa')}>
                          Baixa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleTaskComplete(task.id)}
                        className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                        title="Marcar como concluída"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTaskDelete(task.id)}
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskList;
