"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useApi from "@/api/useApi";

const Home = () => {
  const router = useRouter();
  const { data, loading, error, fetchData, deleteData } = useApi();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchData("https://hr-todo.sahda.ir", "GET");
  }, []);

  useEffect(() => {
    if (data && data.uncompleted) {
      setTasks(data.uncompleted);
    }
  }, [data]);

  const handleNewButtonClick = () => {
    // Navigate to the new page
    router.push("/form");
  };

  const handleEditButtonClick = (taskId) => {
    // Save taskId to local storage
    localStorage.setItem('taskId', taskId);
  
    // Navigate to the form page with the task ID for editing
    router.push(`/form`);
  };

  const handleDeleteButtonClick = async (taskId) => {
    try {
      // Make a DELETE request to delete the task by taskId
      await deleteData(`https://hr-todo.sahda.ir/delete.php`, { id: taskId });

      // Refetch data after deletion
      fetchData("https://hr-todo.sahda.ir", "GET");
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId}:`, error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="w-[45vw] mr-auto ml-auto">
      <div className="flex flex-row items-center justify-between ">
        <h1>To Do App</h1>
        <button onClick={handleNewButtonClick} className="bg-slate-600 text-white">
          New Task
        </button>
      </div>
      <div className="w-[30vw] mr-auto ml-auto">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {tasks.length > 0 ? (
          <div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Task</th>
                  <th>Done</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.item}</td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <button onClick={() => handleEditButtonClick(task.id)}>Edit</button>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteButtonClick(task.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No uncompleted tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
