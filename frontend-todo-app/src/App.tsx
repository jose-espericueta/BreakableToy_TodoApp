import React, { useState, useEffect, useCallback } from "react";
import TaskList from "./components/TaskList";
import api from "./services/api";
import "./App.css"

// Define the structure of a Task object
interface Task {
    id: number;
    text: string;
    priority: "High" | "Medium" | "Low";
    doneFlag: boolean;
    dueDate?: string;
    creationDate: string;
}

// Define the shape of task-related metrics
interface TaskMetrics {
    averageCompletionTime: number;
    averageTimeByPriority: Record<"High" | "Medium" | "Low", number>;
}

const App: React.FC = () => {
    // State to store all tasks
    const [tasks, setTasks] = useState<Task[]>([]);

    // State to store calculated task metrics
    const [metrics, setMetrics] = useState<TaskMetrics | null>(null);

    // Sorting state
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Filter states
    const [filterText, setFilterText] = useState<string>("");
    const [filterPriority, setFilterPriority] = useState<string>("");
    const [filterDone, setFilterDone] = useState<string>("");

    // Track total number of tasks
    const [totalTasks, setTotalTasks] = useState<number>(0);

    // Fetch tasks from the backend (all + paginated view)
    const fetchTasks = useCallback(async (page: number = 1, size: number = 10) => {
        try {
            // Get all tasks to determine total count
            const allTaskResponse = await api.get<Task[]>("/tasks");
            setTotalTasks(allTaskResponse.data.length);

            // Get paginated tasks based on filters and sorting
            const paginatedResponse = await api.get<Task[]>("/tasks/paginated", {
                params: {
                    page,
                    size,
                    filterByText: filterText || undefined,
                    filterByPriority: filterPriority || undefined,
                    filterByDoneFlag: filterDone === "" ? undefined : filterDone === "true",
                    sortBy: sortBy || undefined,
                    sortOrder: sortOrder || undefined
                },
            });

            console.log("API Response: ", paginatedResponse.data);
            setTasks(paginatedResponse.data);
        } catch (error) {
            // Handle error silently (optional: show UI feedback)
//             console.error("Error getting tasks", error);
        }
    }, [filterText, filterPriority, filterDone, sortBy, sortOrder]);

    // Apply current filters to fetch filtered tasks
    const applyFilters = async () => {
        try {
            const response = await api.get<Task[]>("/tasks/paginated", {
                params: {
                    page: 1,
                    size: pageSize,
                    filterByText: filterText || undefined,
                    filterByPriority: filterPriority || undefined,
                    filterByDoneFlag: filterDone === "" ? undefined : filterDone === "true",
                    sortBy: sortBy || undefined,
                    sortOrder: sortOrder || undefined
                }
            });

            console.log("Filtered Tasks Response: ", response.data);
            setTasks(response.data);
        } catch (error) {
            // Handle error silently (optional: show UI feedback)
//             console.error("Error applying filters", error);
        }
    };

    // Fetch task performance metrics from backend
    const fetchMetrics = async () => {
        try {
            const response = await api.get<TaskMetrics>("/tasks/metrics");
            setMetrics(response.data);
        } catch (error) {
            // Handle error silently
//             console.error("Error getting metrics", error);
        }
    };

    // Handle pagination button clicks
    const handlePageChange = (newPage: number) => {
        if (newPage < 1) return;
        setCurrentPage(newPage);
    };

    // Fetch tasks whenever current page or filters change
    useEffect(() => {
        fetchTasks(currentPage, pageSize);
    }, [currentPage, fetchTasks]);

    // Load metrics once when the component mounts
    useEffect(() => {
        fetchMetrics();
    }, []);

    // Toggle task completion status
    const markTaskAsDone = async (id: number) => {
        try {
            const taskToUpdate = tasks.find((task) => task.id === id);
            if (!taskToUpdate) return;

            // Send API request to update task done flag
            if (taskToUpdate.doneFlag) {
                await api.put(`/tasks/${id}/undone`);
            } else {
                await api.post(`/tasks/${id}/done`);
            }

            // Update local task list with new doneFlag
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id ? { ...task, doneFlag: !task.doneFlag } : task
                )
            );

            // Refresh metrics after update
            fetchMetrics();
        } catch (error) {
            console.error("Error marking task as done", error);
        }
    };

    return (
        <div className="container">
            <h1>To-Do App</h1>

            {/* Render the task list and pass down props */}
            <TaskList
                tasks={tasks}
                markTaskAsDone={markTaskAsDone}
                onTaskAdded={() => fetchTasks(currentPage, pageSize)}
                onTaskUpdated={() => fetchTasks(currentPage, pageSize)}
                onTaskDeleted={() => fetchTasks(currentPage, pageSize)}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                fetchTasks={fetchTasks}
                applyFilters={applyFilters}
                metrics={metrics}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                filterText={filterText}
                setFilterText={setFilterText}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                filterDone={filterDone}
                setFilterDone={setFilterDone}
                totalTasks={totalTasks}
                pageSize={pageSize}
            />
        </div>
    );
};

export default App;
