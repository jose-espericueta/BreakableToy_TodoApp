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

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import api from "../services/api"
jest.mock("../services/api");

describe("App Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Renders the To-Do App title", async () => {
        render(<App />);
        expect(screen.getByText("To-Do App")).toBeInTheDocument();
    });

    test("renders the 'New Task' button", () => {
        render(<App />);
        const buttonElement = screen.getByText(/New Task/i);
        expect(buttonElement).toBeInTheDocument();
    });

    test("displays pagination controls", async () => {
        render(<App />);
        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
    });
});