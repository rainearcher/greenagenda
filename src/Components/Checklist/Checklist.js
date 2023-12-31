import React, { useState, useEffect, useRef } from 'react';
import "./Checklist.css";
const connect = require(`../../connect.js`);

function Checklist({ list, tasks, setTasks, numberOfTasks, setNumberOfTasks, completed, updateCompleted, listUpdate, isSaved, setIsSaved, completedTasks, setCompleteTasks }) {
  const [listid, setListid] = useState(list.listid);
  const [listName, setListName] = useState(list.name);
  const [isTextBoxActive, setTextBoxActive] = useState(false); 
  const prevID = usePrevious(listid);
  const prevTasks = usePrevious(tasks);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    if (numberOfTasks !== 0 ) {
      const ratio = Math.round(completedTasks/numberOfTasks * 100)
      updateCompleted(ratio)
    }
  }, [completedTasks, numberOfTasks])

  useEffect(() => {
    if (list.listid !== listid || list.name !== listName){
      setListid(list.listid);
      setListName(list.name);
      setTasks(list.tasks);
      setNumberOfTasks(list.numTasks);
      setCompleteTasks(list.completedTasks);
    }
    else if (isSaved && !isTextBoxActive && prevID === listid && JSON.stringify(prevTasks) !== JSON.stringify(tasks)){
      updateDB();
    }

  }, [tasks, list])

  function updateDB() {
    const content = [];
    const checked = [];

    tasks.forEach(task => {
      content.push(task.text)
      checked.push(task.isCompleted)
    })
    
    const vals = [listid, listName, content, checked]
    listUpdate(...vals);
    connect.updateChecklist(...vals)
      .then((res) => console.log(res))
      .catch((e) => console.log(e.message))
      .finally(() => console.log("Checklist updated"));
  }

  const addTask = () => {   //adds a new task to the 'task' array and uses setTasks to update the 'task'
    setTasks([...tasks, 
      {
        text: '',
        isCompleted: false
      }
    ]);
  };

  function incrementTasks() {
    const filter = tasks.filter(task => task.text.trim() !== '')
    const filteredLength = filter.length

    if (isTextBoxActive && filteredLength > numberOfTasks) {
      setNumberOfTasks(numberOfTasks + 1);
      setIsSaved(true);
    }
  } 
  
  function shareList() {
    let email = prompt("Enter the username of the person you wish to share with:");
    if (email === null || email === "") {
      alert("No username entered. List not shared");
    }
    else {
      const badMsg = 'Something went wrong. List not shared.'
      const goodMsg = `List shared with ${email}.`
      connect.shareList(listid, email)
        .then((res) => {
          if (res["status"] === 1){
            alert(badMsg);
          }  
          else{
            alert(goodMsg);
          }
        })
        .catch((e) => alert(badMsg)); 
      setIsSaved(true);
    }
  }

  const updateTask = (index, value) => { //takes in an index and value and creates a new array by copying the current 'task' array. Then newTasks is updated and set with the new index and value.
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const removeTask = (index) => { //remove tasks by copying the 'tasks' array into newTasks then using the .splice function the item from the list based on the index is removed. 'tasks' is updated
    if(isSaved){
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      if (numberOfTasks !== 0) {
        setNumberOfTasks(numberOfTasks - 1); 

      }
      if (tasks[index].isCompleted) {
        setCompleteTasks(completedTasks - 1);
      }
      setTasks(newTasks);
    }
  };    

  const handleSubmit = (event) => { //This is the 'Add Task' button's functionality.
    event.preventDefault();

    if(isSaved){
      setIsSaved(false);
      addTask();
    }
  };

  const crossOutTask = (index) => {
    const taskText = tasks[index].text;
    if (isTextBoxActive) return;

    if (taskText) {
      const newTasks = [...tasks];

      console.log(newTasks[index])
      if (!newTasks[index].isCompleted) {
        newTasks[index] = { text: tasks[index].text, isCompleted: true};
        setCompleteTasks(completedTasks + 1)
      } else {
        newTasks[index] = { text: tasks[index].text, isCompleted: false};
        setCompleteTasks(completedTasks - 1)
      }
      setTasks(newTasks);
    }
  };
  
  return (
    <div className="checklist">
      {tasks.map((task, index) => (
        <div key={index} className={`checklistTask ${task.isCompleted ? 'completed' : ''}`}> {/* 'completed' is a special case for strikthrough */}
          <button className="deleteButton button2" onClick={() => removeTask(index)}>X</button>
          <input
            className="taskTextBox"
            type="text"
            value={task.text}
            onChange={(event) => updateTask(index, {text: event.target.value, isCompleted: task.isCompleted})}
            onFocus={() => setTextBoxActive(true)}
          />
          {task.isCompleted ? (
            <button className="checkButton button2" onClick={() => crossOutTask(index)}>&#10003;</button>
            ) : (
            <button className="emptyButton1 button2" onClick={() => crossOutTask(index)}>&shy;</button>
          )}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <button className="newTask button" type="submit">Add Task</button>
        
        {isTextBoxActive && (
        <button className="saveButton button" onClick={() => {
          setTextBoxActive(false)
          incrementTasks();
          updateDB();
          }}>Save</button>)}
      </form>
      <div> 
        <button className="button" onClick={()=>shareList()}>Share List</button>
      </div>
  </div>
  );
}

export default Checklist;
