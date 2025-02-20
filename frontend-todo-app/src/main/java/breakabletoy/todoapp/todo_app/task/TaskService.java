package breakabletoy.todoapp.todo_app.task;

import breakabletoy.todoapp.todo_app.Priority;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@Service
public class TaskService {

    @GetMapping
    public List<Task> getTasks(){
        return List.of(
                new Task(
                        1L,
                        "First task created",
                        LocalDate.of(2025, Month.FEBRUARY, 20),
                        Boolean.TRUE,
                        LocalDate.of(2025, Month.FEBRUARY, 15),
                        Priority.High,
                        LocalDate.of(2025, Month.FEBRUARY, 6)
                )
        );
    }
}