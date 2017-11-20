package model;

public class Task {

    private int id;
    private int userid;
    private String task;
    private String dueDate;
    private String category;
    public String priority;

    public Task(int id, String task, String dueDate, String category, int userid, String priority) {
        this.id = id;
        this.task = task;
        this.dueDate = dueDate;
        this.category = category;
        this.userid = userid;
        this.priority = priority;

        System.out.println(this.dueDate);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getUserid() {
        return userid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
