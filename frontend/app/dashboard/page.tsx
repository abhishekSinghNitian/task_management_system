'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'PENDING' | 'COMPLETED';
}

export default function DashboardPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/tasks', {
                params: { page, search: appliedSearch, status: statusFilter || undefined },
            });
            setTasks(response.data.tasks);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }, [page, appliedSearch, statusFilter]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSearch = () => {
        setPage(1);
        setAppliedSearch(search);
        setSearch('');
    };

    const handleClearFilters = () => {
        setSearch('');
        setAppliedSearch('');
        setStatusFilter('');
        setPage(1);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/auth/login');
    };

    const handleCreateTask = () => {
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleToggleTask = async (id: string) => {
        try {
            await api.patch(`/tasks/${id}/toggle`);
            fetchTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const handleModalSubmit = async (data: any) => {
        try {
            if (editingTask) {
                await api.patch(`/tasks/${editingTask.id}`, data);
            } else {
                await api.post('/tasks', data);
            }
            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
                    <div className="space-x-4">
                        <button
                            onClick={handleCreateTask}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            New Task
                        </button>
                        <button
                            onClick={handleLogout}
                            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                    <div className="flex flex-1 gap-2">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1 rounded-md border border-gray-300 p-2"
                        />
                        <button
                            onClick={handleSearch}
                            className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
                        >
                            Search
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-md border border-gray-300 p-2"
                        >
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        {(appliedSearch || statusFilter) && (
                            <button
                                onClick={handleClearFilters}
                                className="rounded-md bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="grid gap-4">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                onToggle={handleToggleTask}
                            />
                        ))}
                        {tasks.length === 0 && (
                            <div className="text-center text-gray-500">No tasks found.</div>
                        )}
                    </div>
                )}

                <div className="mt-6 flex justify-center space-x-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-md bg-gray-200 px-3 py-1 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="self-center text-gray-600">
                        Page {page} of {totalPages || 1}
                    </span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-md bg-gray-200 px-3 py-1 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingTask}
            />
        </div>
    );
}
