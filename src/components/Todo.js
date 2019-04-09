import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ENDPOINT_TODOS = 'https://react-hooks-start.firebaseio.com/todos.json';

const todo = props => {
  // !!! ONLY call useState on ROOT level of your function !!!
  const [todo, setTodo] = useState({ id: '', name: '' });
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    console.log('useEffect');
    fetchRemoteTodos();
  }, []);

  const fetchRemoteTodos = async () => {
    let response = undefined;
    try {
      response = await axios.get(ENDPOINT_TODOS);
      console.log(response);
      const updatedList = [];
      for (let id in response.data) {
        updatedList.push(response.data[id]);
      }
      setTodoList(updatedList);
    } catch (exception) {
      console.error(exception.message);
    }
  };

  // Alternative approach: unified state - SUBOPTIMAL
  // Drawbacks: setState DOES NOT merge the state with the provided object, it completely
  // replaces it: more code to be written, error prone
  // const [state, setState] = useState({ userInput: '', todoList: [] });

  const inputChangeHandler = event => {
    setTodo({ id: Date.now(), name: event.target.value });
  };

  const todoAddHandler = async () => {
    const updatedList = todoList.concat(todo);
    setTodoList(updatedList);
    let response = undefined;
    try {
      response = await axios.post(ENDPOINT_TODOS, {
        id: todo.id,
        name: todo.name
      });
    } catch (exception) {
      console.error(exception.error);
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
        value={todo.name}
      />
      <button onClick={todoAddHandler}>Add</button>
      <ul>
        {todoList.map((item, index) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default todo;
