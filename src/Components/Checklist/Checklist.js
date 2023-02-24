import React, { useState } from 'react';
import "./Checklist.css"

function Checklist() {
  const [tasks, setTasks] = useState([]); //defines a variable tasks and a function setTask that updates using 'useState'
  const [numberOfTasks, setNumberOfTasks] = useState(0); //used to incrament the number of tasks that have been created.
  const [completedTasks, setCompleteTasks] = useState(0);
  const [isTextBoxActive, setTextBoxActive] = useState(false);

  const addTask = () => {   //adds a new task to the 'task' array and uses setTasks to update the 'task'
    //TODO #1: check if the current task value is not empty
    //TODO #2: not show the 'Add task' button until 'save' button is clicked
    setTasks([...tasks, '']);
  };

  function incramentTasks () {
    if (isTextBoxActive) {
      setNumberOfTasks(numberOfTasks + 1);
    }
  }

  const updateTask = (index, value) => { //takes in an index and value and creates a new array by copying the current 'task' array. Then newTasks is updated and set with the new index and value.
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const removeTask = (index) => { //remove tasks by copying the 'tasks' array into newTasks then using the .splice function the item from the list based on the index is removed. 'tasks' is updated
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    if (numberOfTasks !== 0) {
      setNumberOfTasks(numberOfTasks - 1); 
    }
    setTasks(newTasks);
  };    

  const handleSubmit = (event) => { //This is the 'Add Task' button's functionality.
    event.preventDefault();
    addTask();
  };

  const crossOutTask = (index) => { //using the 'task' array go to the index and mark the task as 'true'
    const newTasks = [...tasks];
    if (!newTasks[index].isCompleted) { //by default is completed is false
      newTasks[index] = {...tasks[index], isCompleted: true};
      setCompleteTasks(completedTasks + 1)
    } else {
      newTasks[index] = {...tasks[index], isCompleted: false};
      setCompleteTasks(completedTasks - 1)
    }
    setTasks(newTasks);
  };
  
  return (
    <div className="checklist">
      {tasks.map((task, index) => (
        <div key={index} className={`checklistTask ${task.isCompleted ? 'completed' : ''}`}> {/* 'completed' is a special case for strikthrough */}
          <button className="deleteButton" onClick={() => removeTask(index)}>X</button>
          <input
            type="text"
            value={task.text}
            onChange={(event) => updateTask(index, {text: event.target.value, isCompleted: false})}
            onFocus={() => setTextBoxActive(true)}
          />
          {task.isCompleted ? (
          <button className="checkButton" onClick={() => crossOutTask(index)}>&#10003;</button>
          ) : (
          <button className="emptyButton" onClick={() => crossOutTask(index)}>&shy;</button>
          )}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <button className="newTask" type="submit">Add Task</button>
        {isTextBoxActive && (
        <button className="saveButton" onClick={() => {
          setTextBoxActive(false)
          incramentTasks();
          }}>Save</button>)}
      </form>
      <div>
    <p>Number of tasks: {numberOfTasks} Number of completed tasks: {completedTasks}</p>
  </div>
    </div>
  );
}

export default Checklist;


/*Add a save button 
  -when text box is clicked, add a new button next to 'Add Task' DONE
  -Only save and update number of tasks counter when 'save' button is clicked DONE
*/
//Be able to un-check box DONE
//add a task counter DONE

/*ISSUES
-Should not be able to click "Add Task" if the 'save' button has not been clicked AND the text box must be filled with something
-When a completed task is removed, decrease "completedTask" counter
-Cannot click check box if task is empty
-If text box is empty, clicking save should NOT updated "numberOfTasks"
-If you already have a task in text box and you have clicked 'Save' updating the "numberOfTasks" counter, editing it and clicking save should NOT increase counter.
*/
