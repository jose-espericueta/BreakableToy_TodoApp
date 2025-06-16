package breakabletoy.todoapp.todo_app.controllers;

import breakabletoy.todoapp.todo_app.Priority;
import breakabletoy.todoapp.todo_app.dto.TaskMetricsDTO;
import breakabletoy.todoapp.todo_app.services.TaskService;
import breakabletoy.todoapp.todo_app.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getTasks(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder){
        return taskService.getTasks(sortBy, sortOrder);
    }

    @PostMapping
    public void addTask(@RequestBody Task task){
        taskService.addTask(task);
    }

    @PutMapping("/{id}")
    public void editTask(@PathVariable Long id, @RequestBody Task updatedTask){
        taskService.editTask(id, updatedTask);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id){
        taskService.deleteTask(id);
    }

    @GetMapping("/paginated")
    public List<Task> getPaginatedTasks(@RequestParam(required = false) String sortBy,
                                        @RequestParam(required = false) String sortOrder,
                                        @RequestParam(required = false) String filterByText,
                                        @RequestParam(required = false) Priority filterByPriority,
                                        @RequestParam(required = false) Boolean filterByDoneFlag,
                                        @RequestParam(defaultValue = "1") int page,
                                        @RequestParam(defaultValue = "10") int size){

        if (page < 1 || size < 1) {
            throw new IllegalArgumentException("Page and size must be greater than 0");
        }

        List<Task> filteredTasks = taskService.filterTasks(filterByText, filterByPriority, filterByDoneFlag);

        List<Task> getPaginatedTasks = taskService.getPaginatedTasks(filteredTasks, page, size);

        return taskService.sortedTasks(getPaginatedTasks, sortBy, sortOrder);

    }

    @GetMapping("/filter")
    public List<Task> filterTasks(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(required = false) String filterByText,
            @RequestParam(required = false) Priority filterByPriority,
            @RequestParam(required = false) Boolean filterByDoneFlag) {

        List<Task> tasks = taskService.filterTasks(filterByText, filterByPriority, filterByDoneFlag);
        return taskService.sortedTasks(tasks, sortBy, sortOrder);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/{id}/done")
    public void markAsDone(@PathVariable Long id){
        taskService.markAsDone(id);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/{id}/undone")
    public void markAsUndone(@PathVariable Long id){
        taskService.markAsUndone(id);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/metrics")
    public TaskMetricsDTO calculateMetrics(){
        return taskService.calculateMetrics();
    }

}