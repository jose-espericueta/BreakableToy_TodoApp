import { useState } from "react";
import React from "react";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import api from "../services/api";

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

interface TaskListProps{
    tasks: Task[];
    markTaskAsDone: (id: number) => void;
    onTaskAdded: (page?: number) => void;
    onTaskUpdated: () => void;
    onTaskDeleted: () => void;
    fetchTasks: (page?: number) => void;
    metrics: TaskMetrics | null;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    markTaskAsDone,
    onTaskAdded,
    onTaskUpdated,
    onTaskDeleted,
    fetchTasks,
    metrics,
    currentPage,
    onPageChange
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const [filterText, setFilterText] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterDone, setFilterDone] = useState("");

    const [sortBy, setSortBy] = useState<string | null>(null);
    const[sortOrder, setSortOrder] = useState<string>("asc");

    const fetchFilteredTasks = async () => {
        try{
            const response = await api.get("/tasks/filter", {
                params: {
                    filterByText: filterText || undefined,
                    filterByPriority: filterPriority || undefined,
                    filterByDoneFlag: filterDone === "" ? undefined : filterDone === "true",
                    sortBy: sortOrder || undefined,
                    sortOrder: sortOrder || undefined,
                },
            });

            fetchTasks();

        }catch(error) {
            console.error("Error fetching filtered tasks", error);
        }
    };

    const handleSort = async (field: "priority" | "dueDate") => {

        let newSortBy = sortBy ? sortBy.split(",") : [];
        let newSortOrder = sortOrder ? sortOrder.split(",") : [];

        const index = newSortBy.indexOf(field);

        if(index !== -1){
            newSortOrder[index] = newSortOrder[index] === "asc" ? "desc" : "asc";
        }else{
            newSortBy.push(field);
            newSortOrder.push("asc");
        }

        const updatedSortBy = newSortBy.join(",");
        const updatedSortOrder = newSortOrder.join(",");

        console.log(`Sorting by: ${updatedSortBy}, Order: ${updatedSortOrder}`);

        setSortBy(updatedSortBy);
        setSortOrder(updatedSortOrder);

        fetchTasks(1, 10);

//         if(newSortBy.length > newSortOrder.length){
//             newSortOrder.push("asc");
//         }else if(newSortBy.length < newSortOrder.length){
//             newSortOrder.pop();
//         }
//
//         const updatedSortBy = newSortBy.join(",");
//         const updatedSortOrder = newSortOrder.join(",");
//
//         setSortBy(updatedSortBy);
//         setSortOrder(updatedSortOrder);
//
//         try{
//             const response = await api.get("/tasks", {
//                 params: { sortBy: updatedSortBy, sortOrder: updatedSortOrder },
//             });
//
//             fetchTasks();
//
//         }catch(error){
//             console.error("Error fetching sorted tasks: ", error);
//         }
    };

    const deleteTask = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if(!confirmDelete) return;

        try{
            await api.delete(`/tasks/${id}`);
            onTaskDeleted();
        }catch(error) {
            console.error("Error deleting task: ", error);
            alert("There was an error deleting the task");
        }
    };

    return(
        <div>
            <button onClick={() => setShowAddModal(true)}>New Task</button>

            {showAddModal && (
                <AddTaskModal onClose={() => setShowAddModal(false)} onTaskAdded={() => onTaskAdded(currentPage)} />
            )}

            {taskToEdit && (
                <EditTaskModal
                    task = {taskToEdit}
                    onClose = {() => setTaskToEdit(null)}
                    onTaskUpdated = {onTaskUpdated}
                />
            )}

            <h2>Task List</h2>

            <div>
                <input
                    type = "text"
                    placeholder = "Search by name..."
                    value = {filterText}
                    onChange = {(e) => setFilterText(e.target.value)}
                />
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <select value={filterDone} onChange={(e) => setFilterDone(e.target.value)}>
                    <option value="">All</option>
                    <option value="true">Done</option>
                    <option value="false">undone</option>
                </select>

                <button onClick={fetchFilteredTasks}>Apply Filters</button>
            </div>

            <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Done</th>
                        <th>Task</th>
                        <th>
                            Priority
                            <button onClick={() => handleSort("priority")}>
                                {sortBy === "priority" ? (sortOrder === "asc" ? " ↑" : " ↓") : " ↕"}
                            </button>
                        </th>
                        <th>
                            Due Date
                            <button onClick={() => handleSort("dueDate")}>
                                {sortBy === "dueDate" ? (sortOrder === "asc" ? " ↑" : " ↓") : " ↕"}
                            </button>
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length === 0 ? (
                        <tr>
                            <td colSpan={5}>No available tasks!</td>
                        </tr>
                    ) : (
                        tasks.map((task) => (
                            <tr key={task.id}>
                                <td>
                                    <input
                                        type = "checkbox"
                                        checked = {task.doneFlag}
                                        onChange = {() => markTaskAsDone(task.id)}
                                    />
                                </td>
                                <td>
                                    <strong style = {{ textDecoration: task.doneFlag ? "line-through" : "none" }}>
                                        {task.text}
                                    </strong>
                                </td>
                                <td>{task.priority}</td>
                                <td>{task.dueDate ? task.dueDate : "No due date"}</td>
                                <td>
                                    <button onClick={() => setTaskToEdit(task)}>Edit</button>
                                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div>
                <button onClick = {() => onPageChange(currentPage - 1)} disabled = {currentPage === 1}>
                    Previous
                </button>

                <span> Page {currentPage} </span>

                <button onClick = {() => onPageChange(currentPage + 1)}>Next</button>
            </div>


            {metrics && (
                <div>
                    <h2>Metrics</h2>
                    <p>
                        <strong>Average Completion Time: </strong> {metrics.averageCompletionTime.toFixed(2)} days
                    </p>
                    <h3>Average Completion time by Priority: </h3>
                    <ul>
                        <li><strong>High: </strong> {(metrics.averageTimeByPriority.High ?? 0).toFixed(2)} days</li>
                        <li><strong>Medium: </strong> {(metrics.averageTimeByPriority.Medium ?? 0).toFixed(2)} days</li>
                        <li><strong>Low: </strong> {(metrics.averageTimeByPriority.Low ?? 0).toFixed(2)} days</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TaskList;