'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
}

export default function TaskModal({ isOpen, onClose, onSubmit, initialData }: TaskModalProps) {
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if (initialData) {
            setValue('title', initialData.title);
            setValue('description', initialData.description);
            setValue('status', initialData.status);
        } else {
            reset({ title: '', description: '', status: 'PENDING' });
        }
    }, [initialData, setValue, reset, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">{initialData ? 'Edit Task' : 'New Task'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            {...register('title', { required: true })}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register('description')}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                    {initialData && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select {...register('status')} className="mt-1 block w-full rounded-md border border-gray-300 p-2">
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100">
                            Cancel
                        </button>
                        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
