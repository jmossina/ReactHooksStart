import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';

const ENDPOINT_TODOS = 'https://react-hooks-start.firebaseio.com/todos.json';
const actions = { ADD: 'ADD', REMOVE: 'REMOVE', SET: 'SET' };

const todo = props => {
  // !!! ONLY call useState on ROOT level of your function !!!
  const [todo, setTodo] = useState({ id: '', name: '' });
  const [submittedTodo, setSubmittedTodo] = useState(null);
  // const [todoList, setTodoList] = useState([]);

  const todoListReducer = (state, action) => {
    switch (action.type) {
      case actions.SET:
        return action.payload;
      case actions.ADD:
        return state.concat(action.payload);
      case actions.REMOVE:
        return state.filter(todo => todo.id !== action.payload);
      default:
        return state;
    }
  };

  const [todoList, dispatch] = useReducer(todoListReducer, []);

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

  // Nice way to handle async operation holding the value of the state for
  // some time: we change submittedToDo when the promise is resolved, so
  // that we always update the current value of todoList
  useEffect(() => {
    if (submittedTodo) {
      // setTodoList(todoList.concat(submittedTodo));
      dispatch({ type: actions.ADD, payload: submittedTodo });
    }
  }, [submittedTodo]);

  const fetchRemoteTodos = async () => {
    let response = undefined;
    try {
      response = await axios.get(ENDPOINT_TODOS);
      console.log('[GET todos] ', response);
      const updatedList = [];
      for (let id in response.data) {
        updatedList.push(response.data[id]);
      }
      // setTodoList(updatedList);
      dispatch({ type: actions.SET, payload: updatedList });
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
    let response = undefined;
    try {
      const todoItem = {
        id: todo.id,
        name: todo.name
      };
      response = await axios.post(ENDPOINT_TODOS, todoItem);
      setSubmittedTodo(todoItem);
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
