"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import useApi from "@/api/useApi";

// Import other necessary modules

const TaskForm = () => {
    const savedTaskId = localStorage.getItem('taskId');
    const { id } = useParams();
    const router = useRouter();
    const [task, setTask] = useState("");
    const { fetchData } = useApi();
  
    // Define taskId for conditional rendering of the title
    const taskId = id || savedTaskId;
  
    useEffect(() => {
      // Check if taskId is available in the query parameters
      if (taskId) {
        // Fetch the details of the task with taskId and populate the form
        fetchTaskDetails(taskId);
      }
    }, [taskId]);
  
    const fetchTaskDetails = async (taskId) => {
      try {
        // Make a GET request to fetch task details by taskId
        const response = await fetchData(`https://hr-todo.sahda.ir/task/${taskId}`, "GET");
  
        // Populate the form with the task details
        setTask(response.task.item);
      } catch (error) {
        console.error("Error fetching task details:", error);
        // Handle error (e.g., show an error message to the user)
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Check if the task is not empty
      if (task.trim() === "") {
        alert("Please enter a task before submitting.");
        return;
      }
  
      try {
        if (taskId) {
          await fetchData(`https://hr-todo.sahda.ir/update/task/${taskId}`, "PUT", {
            item: task,
          });
        } else {
          await fetchData("https://hr-todo.sahda.ir/create/task/", "POST", {
            item: task,
          });
        }
  
        // Clear taskId from local storage
        localStorage.removeItem('taskId');
  
        // Redirect to the home page after successful submission
        router.push("/");
      } catch (error) {
        console.error("Error submitting task:", error);
        // Handle error (e.g., show an error message to the user)
      }
    };
  
    return (
      <div>
        {/* Use taskId instead of undefined variable taskId */}
        <h1>{taskId ? "Edit Task" : "New Task Form"}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="task"
            placeholder="Enter your new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  };
  
  export default TaskForm;
  
