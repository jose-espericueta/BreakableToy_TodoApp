package breakabletoy.todoapp.todo_app.task;

import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TaskService {

    @Getter
    private final List<Task> tasks = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public void addTask(Task task){
    task.setId(idGenerator.getAndIncrement());
    tasks.add(task);
    }

    public void editTask(Long id, Task updatedTask){
        Task task = tasks.stream().filter(existingTask -> existingTask.getId().equals(id)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException(("Task not found")));

        if(updatedTask.getText() == null || updatedTask.getText().trim().isEmpty()){
            throw new IllegalArgumentException("Text cannot be empty");
        }

        if(updatedTask.getDueDate().isBefore(updatedTask.getCreationDate())){
            throw new IllegalArgumentException("Due date cannot be earlier than the creation date");
        }

        task.setText(updatedTask.getText());
        task.setDueDate(updatedTask.getDueDate());
        task.setDoneFlag(updatedTask.getDoneFlag());
        task.setPriority(updatedTask.getPriority());

        if(updatedTask.getDoneFlag() && task.getDoneDate() == null){
            task.setDoneDate(LocalDate.now());
        }else if (!updatedTask.getDoneFlag()){
            task.setDoneDate(null);
        }
    }

    public void deleteTask(Long id){
        boolean removed = tasks.removeIf(task -> task.getId().equals(id));
        if(!removed){
            throw new IllegalArgumentException("Task with id: " + id + "not found");
        }
    }
}