import React from "react";
import { useState } from "react";
import api from "../services/api";

interface TaskFormData{
    text: string;
    priority: "High" | "Medium" | "Low";
    dueDate?: string;
}

interface AddTaskModalProps{
    onClose: () => void;
    onTaskAdded: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onTaskAdded }) => {
    const [formData, setFormData] = useState<TaskFormData>({
        text: "",
        priority: "Medium",
        dueDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'dueDate' && value === "" ? undefined: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await api.post("/tasks", {
                ...formData,
                doneFlag: false,
            });

            onTaskAdded();
            setFormData({ text: "", priority: "Medium", dueDate: ""});
            onClose();
        }catch(error){
            console.error("Error adding task", error);
            alert("There was an error trying to add a task");
        }
    };

    return(
        <div className="modal">
            <div className="modal-content">
                <h3>Add New Task</h3>
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

                    <label>Priority</label>
                    <select name = "priority" value = {formData.priority} onChange = {handleChange} required>
                        <option value = "High">High</option>
                        <option value = "Medium">Medium</option>
                        <option value = "Low">Low</option>
                    </select>

                    <label>Due Date:</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />

                    <button type="submit">Add Task</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};
export default AddTaskModal;
