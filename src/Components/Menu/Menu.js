import "./Menu.css"
import Checklist from "../Checklist/Checklist"
import ProgressBar from '../ProgressBar/ProgressBar';
import {useEffect, useState} from 'react';
const connect = require("../../connect");
function Menu (props) {
    const [lists, setLists] = useState(props.lists); //lists is a nested array, every index corresponds to a checklist = [checklist, 0], [checklist, 1]...
    const [currIndex, setCurrIndex] = useState(undefined);
    const [completed, setCompleted] = useState(0);
    const [curList, setCurList] = useState({listid: null});
    const [tasks, setTasks] = useState([])
    const [isSaved, setIsSaved] = useState(true); 
    const [numberOfTasks, setNumberOfTasks] = useState(0); //used to increment the number of tasks that have been created.
    const [completedTasks, setCompleteTasks] = useState(0);


    useEffect(() => {
        const newCurList = {
            ...curList,
            "tasks": tasks
        }
        setCurList(newCurList)
        // setNumberOfTasks(tasks.length)

    }, [tasks])

    function onListUpdate(id, name, content, checked) {
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].listid === id) {
                setLists(oldList => {
                    
                    const updatedList = [...oldList]
                    updatedList[i] = {
                        listid: id,
                        name: name,
                        content: content,
                        checked: checked,
                        isSelected: lists[i].isSelected
                    }

                    return updatedList
                })
                break;
            }
        }
    }

    function updateCompleted(newCompleted) {
        if(isNaN(newCompleted)) {
            setCompleted(0);
        }else {
            setCompleted(newCompleted);
        }
    }

    const addList = (index) => {

        let newListId = null;
        const listName = `List ${index}`
        connect.createChecklist(props.userid, listName, [], [])
            .then((res) => {
                console.log(res);
                newListId = res["listid"];
                const newList = {
                    listid: newListId,
                    name: listName,
                    content: [],
                    checked: [],
                    isSelected: false
                }
                setLists([...lists, newList]);
            } )
            .catch((e) => console.log(e.message))
    }
    
    const removeList = (index) => {//this removes a list from the menu
        const remList = lists[index];
        connect.deleteChecklist(remList.listid);
        const newLists = [...lists];
        newLists.splice(index, 1);
        if (index === currIndex || newLists.length === 0){
            setCurList({listid: null});
            setCurrIndex(undefined);
        }
        setLists(newLists);
    };

    const handleListClick = (index) => { //this handles the assigning of isSelected for switching from dot to empty
        if (index === currIndex) return

        setIsSaved(true)
        setCurrIndex(index);

        const newLists = lists.map((list, i) => {
            if (i === index) {
              return { ...list, isSelected: true };
            } else {
              return { ...list, isSelected: false };
            }
        })
        setLists(newLists);

        // console.log(lists[index]);
        const list = newLists[index];
        const content = list["content"];
        const checked = list["checked"];
        let newNumTasks = null;
        try {
            newNumTasks = content.length;
        }
        catch(err) {
            newNumTasks = 0;
        }
        // console.log(newNumTasks);
        let newTasks = [];
        let newCompletedTasks = 0;
        for (let i = 0; i < newNumTasks; i++) {
          newTasks.push({ "text": content[i], "isCompleted": checked[i] });
          if (checked[i] === true) {
            newCompletedTasks += 1;
          }
        }
        setCurList({
            "listid": list.listid,
            "name": list.name,
            "tasks": newTasks,
            "numTasks": newNumTasks,
            "completedTasks": newCompletedTasks
        });
        setTasks(newTasks)
        setCompleteTasks(newCompletedTasks)
    };

    const handleNameChange = (index, newName) => {
        setLists(prevLists => prevLists.map((list, i) => {
          if (i === index) {
            if (newName === "") {
                newName = list.name;
            }
            if (currIndex === index) {
                const newCurList = {
                    ...curList,
                    name: newName
                }
                setCurList(newCurList);
            }
            connect.updateChecklist(list.listid, newName, list.content, list.checked)
                .then((res) => console.log(`listname updated: ${list.name} => ${newName}`))
                .catch((e) => console.log(e.message));
            return { ...list, name: newName };
          } else {
            return list;
          }
        }));
    }

    const handleSubmit = (event) => { //This is the 'Add Task' button's functionality.
        event.preventDefault();
        addList(lists.length);
    };    
    
    //Grow Tree
    //remove every completeded task
    //pass the number of Compelted tasks to the tree
    const removeCompletedTask = () =>  {
        
        props.updateTreeEXP(completedTasks)

        const id = curList.listid;
        const name = curList.name;
        const content = [];
        const checked = [];
        const newTasks = []

        curList.tasks.forEach((element) => {
            console.log(element)
            if (!element.isCompleted) {
                content.push(element.text);
                checked.push(element.isCompleted);
                newTasks.push({
                    text: element.text,
                    isCompleted: element.isCompleted
                })
            }
        })


        onListUpdate(id, name, content, checked);
        setCurList({
            "listid": id,
            "name": name,
            "tasks": newTasks,
            "numTasks": newTasks.length,
            "completedTasks": 0
        });
        setTasks(newTasks)
        setNumberOfTasks(newTasks.length)
        setCompleteTasks(0)
    }


    return( 
    <div className="overall">
        <div className="menuSection">
            <h1 className="leftTop">
                <div className="titles">Menu</div>
            </h1>            
            <div className="menuList">
                {lists.map((list, index) => (
                    <div className="lists" key={index}>
                      <button className="removeList button2" onClick={() => removeList(index)}>X</button>
                      <input 
                        className="listNumber" 
                        type="text" 
                        value={list.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                      />
                      {list.isSelected ? (
                        <button className="selectedButton button2" onClick={() => handleListClick(index)}>•</button>
                    ) : (
                            <button className="emptyButton button2" onClick={() => handleListClick(index)}>&shy;</button>
                        )}
                    </div>
                ))}
                <div>
                    <form onSubmit={handleSubmit}>
                        <button className="addList button" type="submit">New List</button>
                    </form>
                </div>
            </div>
        </div>

        <div className="checklistSection"> 
            <h1 className="centerTop">
                <div className="titles">Checklist</div>
                
            </h1>
            {curList.listid && <Checklist list={curList} tasks={tasks} setTasks={setTasks} numberOfTasks={numberOfTasks} setNumberOfTasks={setNumberOfTasks} completed={completed} updateCompleted={updateCompleted} listUpdate={onListUpdate} isSaved={isSaved} setIsSaved={setIsSaved} completedTasks={completedTasks} setCompleteTasks={setCompleteTasks} />}
            <button className="growTreeButton button" onClick={removeCompletedTask}>Grow Tree</button>
            <footer className="centerBottom">
                <ProgressBar completed={completed}/>
            </footer>
        </div>
    </div>
    )
}

export default Menu;
