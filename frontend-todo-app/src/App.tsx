import React, { useState, useEffect, useCallback } from "react";
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
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [filterText, setFilterText] = useState<string>("");
    const [filterPriority, setFilterPriority] = useState<string>("");
    const [filterDone, setFilterDone] = useState<string>("");
    const [totalTasks, setTotalTasks] = useState<number>(0);

    const fetchTasks = useCallback(async (page: number = 1, size: number = 10) => {
        try{
            const allTaskResponse = await api.get<Task[]>("/tasks");
            setTotalTasks(allTaskResponse.data.length);

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
        }catch(error){
            console.error("Error getting tasks", error);
        }
    }, [filterText, filterPriority, filterDone, sortBy, sortOrder]);

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
            console.error("Error applying filters", error);
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

    const handlePageChange = (newPage: number) => {
        if(newPage < 1) return;
        setCurrentPage(newPage);
    };

    useEffect(() => {
        fetchTasks(currentPage, pageSize);
    }, [currentPage, fetchTasks]);

    useEffect(() => {
        fetchMetrics();
    }, []);

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
                applyFilters = {applyFilters}
                metrics = {metrics}
                currentPage = {currentPage}
                onPageChange = {handlePageChange}
                filterText = {filterText}
                setFilterText = {setFilterText}
                filterPriority = {filterPriority}
                setFilterPriority = {setFilterPriority}
                filterDone = {filterDone}
                setFilterDone = {setFilterDone}
                totalTasks = {totalTasks}
                pageSize = {pageSize}
            />
        </div>
    );
};

export default App;