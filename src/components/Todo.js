import React, { useState } from 'react';
import axios from 'axios';

const ENDPOINT_TODOS = 'https://react-hooks-start.firebaseio.com/todos.json';

const todo = props => {
  // !!! ONLY call useState on ROOT level of your function !!!
  const [todoName, setTodoName] = useState('');
  const [todoList, setTodoList] = useState([]);

  // Alternative approach: unified state - SUBOPTIMAL
  // Drawbacks: setState DOES NOT merge the state with the provided object, it completely
  // replaces it: more code to be written, error prone
  // const [state, setState] = useState({ userInput: '', todoList: [] });

  const inputChangeHandler = event => {
    setTodoName(event.target.value);
  };

  const todoAddHandler = async () => {
    const updatedList = todoList.concat(todoName);
    setTodoList(updatedList);
    let response;
    try {
      response = await axios.post(ENDPOINT_TODOS, { name: todoName });
    } catch (exception) {
      console.error(exception.message);
    } finally {
      console.log(response);
    }
  };

  return (
    <React.Fragment>
      <input
        type="text"
        placeholder="Todo"
        onChange={inputChangeHandler}
        value={todoName}
      />
      <button onClick={todoAddHandler}>Add</button>
      <ul>
        {todoList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default todo;
