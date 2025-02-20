package breakabletoy.todoapp.todo_app.task;

import breakabletoy.todoapp.todo_app.Priority;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class Task {
    private Long id;
    private String text;
    private LocalDate dueDate;
    private Boolean doneFlag;
    private LocalDate doneDate;
    private Priority priority;
    private LocalDate creationDate;

    public Task() {
    }

    public Task(String text, LocalDate dueDate, Boolean doneFlag, LocalDate doneDate, Priority priority, LocalDate creationDate) {
        this.text = text;
        this.dueDate = dueDate;
        this.doneFlag = doneFlag;
        this.doneDate = doneDate;
        this.priority = priority;
        this.creationDate = creationDate;
    }

    public Task(Long id, String text, LocalDate dueDate, Boolean doneFlag, LocalDate doneDate, Priority priority, LocalDate creationDate) {
        this.id = id;
        this.text = text;
        this.dueDate = dueDate;
        this.doneFlag = doneFlag;
        this.doneDate = doneDate;
        this.priority = priority;
        this.creationDate = creationDate;
    }
}
