import { useState } from "react";
import api from "../services/api";

interface Task {
    id: number;
    text: string;
    priority: "High" | "Medium" | "Low";
    doneFlag: boolean;
    dueDate?: string;
    creationDate: string;
}

interface EditTaskModalProps{
    task: Task;
    onClose: () => void;
    onTaskUpdated: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onTaskUpdated }) => {
    const [formData, setFormData] = useState<Task> ({
        ...task
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "dueDate" && value === "" ? null : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await api.put(`/tasks/${task.id}`, formData);
            onTaskUpdated();
            onClose();
        }catch(error){
            console.error("Error updating task", error);
            alert("There was an error updating the task");
        }
    };

    return(
        <div className="modal">
            <div className="modal-content">
                <h3>Edit Task</h3>
                <form onSubmit={handleSubmit}>
                    <label>Task Name:</label>
                    <input
                        type = "text"
                        name = "text"
                        value = {formData.text}
                        onChange = {handleChange}
                        required
                        maxLength = {120}
                    />

                    <label>Priority:</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} required>
                        <option value = "High">High</option>
                        <option value = "Medium">Medium</option>
                        <option value = "Low">Low</option>
                    </select>

                    <label>Due Date:</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate || ""}
                        onChange={handleChange}
                    />

                    <div className="modal-actions">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;