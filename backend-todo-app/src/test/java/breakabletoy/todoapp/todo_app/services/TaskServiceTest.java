package breakabletoy.todoapp.todo_app.services;

import breakabletoy.todoapp.todo_app.Priority;
import breakabletoy.todoapp.todo_app.dto.TaskMetricsDTO;
import breakabletoy.todoapp.todo_app.task.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TaskServiceTest {

    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskService = new TaskService();
    }

    @Test
    void testAddTask() {
        Task task = new Task();
        task.setText("Test Task");
        task.setPriority(Priority.High);
        task.setDoneFlag(false);

        taskService.addTask(task);

        List<Task> tasks = taskService.getTasks(null, null);
        assertEquals(1, tasks.size());
        assertEquals("Test Task", tasks.get(0).getText());
    }

    @Test
    void testFilterTasks() {
        Task task1 = new Task();
        task1.setText("Learn Spring Boot");
        task1.setPriority(Priority.High);
        task1.setDoneFlag(false);
        taskService.addTask(task1);

        Task task2 = new Task();
        task2.setText("Learn React");
        task2.setPriority(Priority.Medium);
        task2.setDoneFlag(true);
        taskService.addTask(task2);

        List<Task> filteredByName = taskService.filterTasks("Buy", null, null);
        assertEquals(1, filteredByName.size());
        assertEquals("Learn Spring Boot", filteredByName.get(0).getText());

        List<Task> filteredByPriority = taskService.filterTasks(null, Priority.Medium, null);
        assertEquals(1, filteredByPriority.size());
        assertEquals("Learn React", filteredByPriority.get(0).getText());
    }

    @Test
    void testSortedTasks() {
        Task task1 = new Task();
        task1.setText("Task 1");
        task1.setPriority(Priority.Low);
        task1.setDueDate(LocalDate.of(2025, 3, 10));
        taskService.addTask(task1);

        Task task2 = new Task();
        task2.setText("Task 2");
        task2.setPriority(Priority.High);
        task2.setDueDate(LocalDate.of(2025, 3, 1));
        taskService.addTask(task2);

        List<Task> sortedByPriority = taskService.sortedTasks(taskService.getTasks(null, null), "priority", "asc");
        assertEquals(Priority.High, sortedByPriority.get(0).getPriority());

        List<Task> sortedByDueDate = taskService.sortedTasks(taskService.getTasks(null, null), "dueDate", "asc");
        assertEquals(LocalDate.of(2025, 3, 1), sortedByDueDate.get(0).getDueDate());
    }

    @Test
    void testGetPaginatedTasks() {
        for (int i = 1; i <= 15; i++) {
            Task task = new Task();
            task.setText("Task " + i);
            task.setPriority(Priority.Low);
            taskService.addTask(task);
        }

        List<Task> firstPage = taskService.getPaginatedTasks(taskService.getTasks(null, null), 1, 10);
        assertEquals(10, firstPage.size());

        List<Task> secondPage = taskService.getPaginatedTasks(taskService.getTasks(null, null), 2, 10);
        assertEquals(5, secondPage.size());

        List<Task> thirdPage = taskService.getPaginatedTasks(taskService.getTasks(null, null), 3, 10);
        assertEquals(0, thirdPage.size());
    }

    @Test
    void testEditTask() {
        Task task = new Task();
        task.setText("Original Task");
        task.setPriority(Priority.Low);
        task.setDoneFlag(false);
        task.setCreationDate(LocalDate.now());
        taskService.addTask(task);

        Task updatedTask = new Task();
        updatedTask.setText("Updated Task");
        updatedTask.setPriority(Priority.High);
        updatedTask.setDoneFlag(true);
        updatedTask.setDueDate(LocalDate.now().plusDays(5));

        taskService.editTask(task.getId(), updatedTask);

        Task modifiedTask = taskService.getTasks(null, null).get(0);
        assertEquals("Updated Task", modifiedTask.getText());
        assertEquals(Priority.High, modifiedTask.getPriority());
        assertTrue(modifiedTask.getDoneFlag());
        assertEquals(LocalDate.now().plusDays(5), modifiedTask.getDueDate());
    }

    @Test
    void testDeleteTask() {
        Task task = new Task();
        task.setText("Delete Me");
        task.setPriority(Priority.Low);
        task.setDoneFlag(false);
        taskService.addTask(task);

        Long taskId = task.getId();
        taskService.deleteTask(taskId);

        assertEquals(0, taskService.getTasks(null, null).size());
    }

    @Test
    void testMarkTaskAsDone() {
        Task task = new Task();
        task.setText("Complete Task");
        task.setPriority(Priority.Medium);
        task.setDoneFlag(false);
        taskService.addTask(task);

        Long taskId = task.getId();
        taskService.markAsDone(taskId);

        Task updatedTask = taskService.getTasks(null, null).get(0);
        assertTrue(updatedTask.getDoneFlag());
        assertNotNull(updatedTask.getDoneDate());
    }

    @Test
    void testCalculateMetrics() {
        Task task1 = new Task();
        task1.setText("Task 1");
        task1.setPriority(Priority.High);
        task1.setCreationDate(LocalDate.of(2025, 2, 1));
        task1.setDoneDate(LocalDate.of(2025, 2, 5));
        task1.setDoneFlag(true);
        taskService.addTask(task1);

        TaskMetricsDTO metrics = taskService.calculateMetrics();
        assertEquals(4.0, metrics.getAverageCompletionTime(), 0.01);
    }
}