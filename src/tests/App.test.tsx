jest.mock("axios", () => {
  return {
    create: () => ({
      get: jest.fn((url) => {
        if (url === "/tasks/paginated") {
          return Promise.resolve({ data: { tasks: [], total: 0 } });
        }
        if (url === "/tasks/metrics") {
          return Promise.resolve({ data: {
            averageCompletionTime: 0,
            averageTimeByPriority: { High: 0, Medium: 0, Low: 0 }
          } });
        }
        return Promise.resolve({ data: [] });
      }),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    }),
  };
});

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

describe("App Component", () => {
  test("renders the To-Do App title", () => {
    render(<App />);
    const titleElement = screen.getByText(/To-Do App/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders the tasks table", () => {
    render(<App />);
    const tableElement = screen.getByRole("table");
    expect(tableElement).toBeInTheDocument();
  });

  test("renders the 'New Task' button", () => {
    render(<App />);
    const buttonElement = screen.getByText(/New Task/i);
    expect(buttonElement).toBeInTheDocument();
  });
});