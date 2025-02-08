    package breakabletoy.todoapp.todo_app.task;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/tasks")
    public class TaskController {

        private final TaskService taskService;

        @Autowired
        public TaskController(TaskService taskService) {
            this.taskService = taskService;
        }

        @GetMapping
        public List<Task> getTasks(){
            return taskService.getTasks();
        }

        @PostMapping
        public void addTask(@RequestBody Task task){
            taskService.addTask(task);
        }

        @PutMapping("/{id}")
        public void editTask(@PathVariable Long id, @RequestBody Task updatedTask){
            taskService.editTask(id, updatedTask);
        }

        @DeleteMapping("{id}")
        public void deleteTask(@PathVariable Long id){
            taskService.deleteTask(id);
        }
    }
