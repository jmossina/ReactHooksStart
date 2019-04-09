import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ENDPOINT_TODOS = 'https://react-hooks-start.firebaseio.com/todos.json';

const todo = props => {
  // !!! ONLY call useState on ROOT level of your function !!!
  const [todo, setTodo] = useState({ id: '', name: '' });
  const [todoList, setTodoList] = useState([]);

  // 2nd argument is CRUCIAL: the 1st argument will execute when the value
  // of the 2nd changes
  // The 1st argument function CAN return a function that will be used as
  // cleanup function: it will execute BEFORE any subsequent execution of
  // the 1st argument
  useEffect(() => {
    console.log('[useEffect] fetchRemoteTodos');
    fetchRemoteTodos();
    return () => {
      console.log('[cleanup] fetchRemoteTodos');
    };
  }, []);

  const fetchRemoteTodos = async () => {
    let response = undefined;
    try {
      response = await axios.get(ENDPOINT_TODOS);
      console.log('[GET todos] ', response);
      const updatedList = [];
      for (let id in response.data) {
        updatedList.push(response.data[id]);
      }
      setTodoList(updatedList);
    } catch (ex) {
      console.error('[GET todos] ', ex.message);
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
      console.log('[POST todos] ', response);
    } catch (ex) {
      console.error('[POST todos] ', ex.error);
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
