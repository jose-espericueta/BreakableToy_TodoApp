import React, { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import api from "./services/api";

interface Task{
    id: number;
    text: string;
    priority: "High" | "Medium" | "Low";
    doneFlag: boolean;
    dueDate?: string;
    creationDate: string;
}

interface TaskMetrics{
    averageCompletionTime: number;
    averageTimeByPriority: Record<"High" | "Medium" | "Low", number>;
}

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [metrics, setMetrics] = useState<TaskMetrics | null>(null);
    const [sortBy, setSortBy] = useState<String | null>(null);
    const [sortOrder, setSortOrder] = useState<String | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchTasks = async (page: number = 1, size: number = 10) => {
        try{
            const response = await api.get<Task[]>("/tasks/paginated", {
                params: {
                    page,
                    size,
                    sortBy: sortBy || undefined,
                    sortOrder: sortOrder || undefined
                },
            });

            console.log("API Response: ", response.data);
            setTasks(response.data);
        }catch(error){
            console.error("Error getting tasks", error);
        }
    };

    const fetchMetrics = async () => {
        try{
            const response = await api.get<TaskMetrics>("/tasks/metrics");
            setMetrics(response.data);
        }catch(error){
            console.error("Error getting metrics", error);
        }
    };

    useEffect(() => {
        fetchTasks(currentPage, pageSize);
        fetchMetrics();
    }, [currentPage, sortBy, sortOrder]);

    const markTaskAsDone = async (id: number) => {

        try{
            const taskToUpdate = tasks.find((task) => task.id === id);
            if(!taskToUpdate) return;

            if(taskToUpdate.doneFlag){
                await api.put(`/tasks/${id}/undone`);
            }else{
                await api.post(`/tasks/${id}/done`);
            }

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id ? { ...task, doneFlag: !task.doneFlag } : task
                )
            );

            fetchMetrics();

        }catch(error){
            console.error("Error marking task as done", error);
        }
    };

    return (
        <div>
            <h1>To-Do App</h1>
            <TaskList
                tasks = {tasks}
                markTaskAsDone = {markTaskAsDone}
                onTaskAdded = {() => fetchTasks(currentPage, pageSize)}
                onTaskUpdated = {() => fetchTasks(currentPage, pageSize)}
                onTaskDeleted = {() => fetchTasks(currentPage, pageSize)}
                sortBy = {sortBy}
                setSortBy = {setSortBy}
                sortOrder = {sortOrder}
                setSortOrder = {setSortOrder}
                fetchTasks = {fetchTasks}
                metrics = {metrics}
                currentPage = {currentPage}
                onPageChange = {fetchTasks}
            />
        </div>
    );
};

export default App;