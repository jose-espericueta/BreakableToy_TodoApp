package breakabletoy.todoapp.todo_app.dto;

import breakabletoy.todoapp.todo_app.Priority;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class TaskMetricsDTO {
    private double averageCompletionTime;
    private Map<Priority, Double> averageTimeByPriority;

    public TaskMetricsDTO(double averageCompletionTime, Map<Priority, Double> averageTimeByPriority){
        this.averageCompletionTime = averageCompletionTime;
        this.averageTimeByPriority = averageTimeByPriority;
    }
}
