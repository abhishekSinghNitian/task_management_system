import clsx from 'clsx';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'PENDING' | 'COMPLETED';
}

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
    return (
        <div className={clsx(
            "rounded-lg border p-4 shadow-sm transition-all hover:shadow-md",
            task.status === 'COMPLETED' ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
        )}>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className={clsx("text-lg font-semibold", task.status === 'COMPLETED' && "line-through text-gray-500")}>
                        {task.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                    <span className={clsx(
                        "mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium",
                        task.status === 'COMPLETED' ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                    )}>
                        {task.status}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => onToggle(task.id)} className="text-sm text-blue-600 hover:underline">
                        {task.status === 'PENDING' ? 'Complete' : 'Undo'}
                    </button>
                    <button onClick={() => onEdit(task)} className="text-sm text-gray-600 hover:underline">
                        Edit
                    </button>
                    <button onClick={() => onDelete(task.id)} className="text-sm text-red-600 hover:underline">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
