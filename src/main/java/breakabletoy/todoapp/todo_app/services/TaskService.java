package breakabletoy.todoapp.todo_app.services;

import breakabletoy.todoapp.todo_app.Priority;
//import breakabletoy.todoapp.todo_app.repository.TaskRepository;
import breakabletoy.todoapp.todo_app.dto.TaskMetricsDTO;
import breakabletoy.todoapp.todo_app.task.Task;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class TaskService {

//    @Getter
//    private final TaskRepository taskRepository;
    @Getter
    private final List<Task> tasks = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

//    public TaskService(TaskRepository taskRepository){
//        this.taskRepository = taskRepository;
//    }

    public List<Task> getTasks(String sortBy, String sortOrder){
        List<Task> sortedTasks = new ArrayList<>(tasks);

        List<String> sortFields = sortBy != null ? Arrays.asList(sortBy.split(",")) : Collections.emptyList();
        List<String> sortOrders = sortOrder != null ? Arrays.asList(sortOrder.split(",")) : Collections.emptyList();

        Comparator<Task> comparator = null;

        for (int i = 0; i < sortFields.size(); i++) {
            String field = sortFields.get(i);
            boolean descending = i < sortOrders.size() && "desc".equalsIgnoreCase(sortOrders.get(i));

            Comparator<Task> newComparator = null;
            if ("priority".equalsIgnoreCase(field)) {
                newComparator = Comparator.comparing(Task::getPriority);
            } else if ("dueDate".equalsIgnoreCase(field)) {
                newComparator = Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()));
            }

            if (newComparator != null) {
                if (descending) newComparator = newComparator.reversed();
                comparator = comparator == null ? newComparator : comparator.thenComparing(newComparator);
            }
        }

        if (comparator != null){
            sortedTasks.sort(comparator);
        }

        return sortedTasks;
    }

    public void addTask(Task task){
    task.setId(idGenerator.getAndIncrement());

    int daysAgo = (int) (Math.random() * 7) + 1;
    task.setCreationDate(LocalDate.now().minusDays(daysAgo));

    tasks.add(task);

//    if (task.getCreationDate() == null){
//        task.setCreationDate(LocalDate.now());
//    }
//    tasks.add(task);
    }

    public void editTask(Long id, Task updatedTask){
        Task task = tasks.stream().filter(existingTask -> existingTask.getId().equals(id)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException(("Task not found")));

        if(updatedTask.getText() == null || updatedTask.getText().trim().isEmpty()){
            throw new IllegalArgumentException("Text cannot be empty");
        }

        if(updatedTask.getDueDate() != null && updatedTask.getDueDate().isBefore(updatedTask.getCreationDate())){
            throw new IllegalArgumentException("Due date cannot be earlier than the creation date");
        }

        task.setText(updatedTask.getText());
        task.setDueDate(updatedTask.getDueDate());
        task.setDoneFlag(updatedTask.getDoneFlag());
        task.setPriority(updatedTask.getPriority());

        if(updatedTask.getDoneFlag() && task.getDoneDate() == null){
            task.setDoneDate(LocalDate.now());
        }
        if (!updatedTask.getDoneFlag()){
            task.setDoneDate(null);
        }
    }

    public void deleteTask(Long id){
        boolean removed = tasks.removeIf(task -> task.getId().equals(id));
        if(!removed){
            throw new IllegalArgumentException("Task with id: " + id + " not found");
        }
    }

    public List<Task> getPaginatedTasks(int page, int size){
        if (page < 1 || size < 1){
            throw new IllegalArgumentException("Page and size must be greater than 0");
        }
        int startIndex = (page - 1) * size;

        if(startIndex >= tasks.size()){
            return Collections.emptyList();
        }

        int endIndex = Math.min(tasks.size(), startIndex + size);

        return tasks.subList(startIndex, endIndex);
    }

    public List<Task> filterTasks(String filterByText, Priority filterByPriority, Boolean filterByDoneFlag) {
        return tasks.stream()
                .filter(task -> filterByText == null || task.getText().contains(filterByText))
                .filter(task -> (filterByPriority == null || task.getPriority().equals(filterByPriority)))
                .filter(task -> filterByDoneFlag == null || task.getDoneFlag().equals(filterByDoneFlag))
                .collect(Collectors.toList());
    }

    public List<Task> sortedTasks(List<Task> tasks, String sortedBy, String sortOrder){

        if (sortedBy == null){
            return tasks;
        }

        String[] sortFields = sortedBy.split(",");
        Comparator<Task> comparator = null;

        for (String field : sortFields){
            Comparator<Task> newComparator = null;

            if (field.equals("priority")){
                newComparator = Comparator.comparing((Task::getPriority));
            } else if (field.equals("dueDate")) {
                newComparator = Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()));
            }

            if (newComparator != null){
                comparator = (comparator == null) ? newComparator : comparator.thenComparing(newComparator);
            }
        }

        if (comparator != null && sortOrder.equals("desc")){
            comparator = comparator.reversed();
        }

        if (comparator != null){
            tasks.sort(comparator);
        }

        return tasks;
    }

    public void markAsDone(Long id){
        Task task = tasks.stream().filter(existingTask -> existingTask.getId().equals(id)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (task.getDoneFlag()){
            return;
        }

        task.setDoneFlag(true);

        int daysAfter = (int) (Math.random() * 3) + 1;
        task.setDoneDate(task.getCreationDate().plusDays(daysAfter));

//        if (!task.getDoneFlag()){
//            task.setDoneFlag(true);
//            task.setDoneDate(LocalDate.now());
//        }
    }

    public void markAsUndone(Long id){
        Task task = tasks.stream().filter(existingTask -> existingTask.getId().equals(id)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if(task.getDoneFlag()){
            task.setDoneFlag(false);
            task.setDoneDate(null);
        }
    }

    public TaskMetricsDTO calculateMetrics(){
        double averageTimeGeneral =
                tasks.stream()
                        .filter(Task::getDoneFlag)
                        .mapToLong(task -> ChronoUnit.DAYS.between(task.getCreationDate(),
                                task.getDoneDate()))
                        .average()
                        .orElse(0.0);

        Map<Priority, Double> averageTimeGrouped =
                tasks.stream()
                        .filter(Task::getDoneFlag)
                        .collect(Collectors.groupingBy(
                                Task::getPriority,
                                Collectors.averagingLong(task ->
                                        ChronoUnit.DAYS.between(task.getCreationDate(), task.getDoneDate()))
                        ));

        return new TaskMetricsDTO(averageTimeGeneral, averageTimeGrouped);
    }
}