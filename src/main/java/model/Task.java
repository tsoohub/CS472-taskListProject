package model;

public class Task {

    private int id;

    private int userid;
    private String username;
    private String task;
    private String requiredBy;
    private String category;
    public String priority;

    public Task(int id, String task, String dueDate, String category, int userid, String username, String priority) {

        this.id = id;
        this.task = task;
        this.requiredBy = dueDate;
        this.category = category;
        this.userid = userid;
        this.priority = priority;
        this.username = username;
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

    public String getRequiredBy() {
        return requiredBy;
    }

    public void setRequiredBy(String dueDate) {
        this.requiredBy = dueDate;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
