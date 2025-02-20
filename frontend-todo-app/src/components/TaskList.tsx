import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import api from "../services/api";

jest.mock("../services/api");

const mockTasks = [
    { id: 1, text: "Task 1", priority: "High", doneFlag: false, dueDate: "2025-02-28", creationDate: "2025-02-10" },
    { id: 2, text: "Task 2", priority: "Medium", doneFlag: false, dueDate: "2025-03-10", creationDate: "2025-02-15" },
    { id: 3, text: "Task 3", priority: "Low", doneFlag: true, dueDate: "2025-04-01", creationDate: "2025-02-20" }
];

const mockMetrics = {
    averageCompletionTime: 5.2,
    averageTimeByPriority: {
        High: 3.1,
        Medium: 5.5,
        Low: 7.2
    }
};

(api.get as jest.Mock).mockImplementation((url) => {
    if (url === "/tasks") {
        return Promise.resolve({ data: mockTasks });
    } else if (url === "/tasks/paginated") {
        return Promise.resolve({ data: mockTasks });
    } else if (url === "/tasks/metrics") {
        return Promise.resolve({ data: mockMetrics });
    }
    return Promise.reject(new Error("Not found"));
});

describe("App Component", () => {
    test("renders the To-Do App title", async () => {
        render(<App />);
        expect(screen.getByText("To-Do App")).toBeInTheDocument();
    });

    test("renders the tasks table", async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText("Task 1")).toBeInTheDocument();
            expect(screen.getByText("Task 2")).toBeInTheDocument();
            expect(screen.getByText("Task 3")).toBeInTheDocument();
        });
    });

    test("renders the 'New Task' button", async () => {
        render(<App />);
        expect(screen.getByText("New Task")).toBeInTheDocument();
    });

    test("can filter tasks by priority", async () => {
        render(<App />);
        const select = screen.getByRole("combobox", { name: /all priorities/i });

        fireEvent.change(select, { target: { value: "High" } });

        const applyButton = screen.getByText("Apply Filters");
        fireEvent.click(applyButton);

        await waitFor(() => {
            expect(screen.getByText("Task 1")).toBeInTheDocument();
            expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
            expect(screen.queryByText("Task 3")).not.toBeInTheDocument();
        });
    });

    test("displays pagination controls", async () => {
        render(<App />);
        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
    });
});




