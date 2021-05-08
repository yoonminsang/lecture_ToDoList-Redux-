(function () {
  const ADDTODO = 'addToDo';
  const DELETETODO = 'deleteToDo';
  const DELETEMULTITODO = 'deleteMultiToDo';
  const DONETODO = 'doneToDo';
  const CHECKTODO = 'checkToDo';

  const form = document.querySelector('form');
  const toDoInput = document.querySelector('.toDo_input');
  const toDoMultiDelete = document.querySelector('.toDo_multi_delete');
  const toDoList = document.querySelector('.toDo_list');

  const getTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + String(month);
    let datee = date.getDate();
    if (datee < 10) datee = '0' + String(datee);
    const day = date.toString().slice(0, 3);
    const dateArr = [year, month, datee, day];
    const time = date.toString().slice(16, 24);
    return dateArr.join(' ') + '  ' + time;
  };

  const addToDo = (toDos) => {
    const newToDo = {
      id: Date.now(),
      toDo: toDoInput.value,
      date: getTime(),
      done: false,
      check: false,
    };
    toDoInput.value = '';
    return [...toDos, newToDo];
  };

  const deleteToDo = (toDos, id) => {
    return toDos.filter((v) => v.id !== id);
  };
  const deleteMultiToDo = (toDos) => {
    const ids = toDos.filter((v) => v.check === true).map((v) => v.id); // [1,2,3]
    return toDos.filter((v) => !ids.includes(v.id));
  };
  const doneToDo = (toDos, id) => {
    return toDos.map((v) => (v.id === id ? { ...v, done: !v.done } : v));
  };
  const checkToDo = (toDos, id) => {
    return toDos.map((v) => (v.id === id ? { ...v, check: !v.check } : v));
  };
  const initialState = {
    toDos: [],
  };

  function reducer(state = initialState, action) {
    switch (action.type) {
      case ADDTODO:
        action.event.preventDefault();
        return { ...state, toDos: addToDo(state.toDos) };
      case DELETETODO:
        return { ...state, toDos: deleteToDo(state.toDos, action.id) };
      case DELETEMULTITODO:
        return { ...state, toDos: deleteMultiToDo(state.toDos) };
      case DONETODO:
        if (action.event.target.nodeName === 'INPUT') return state;
        return { ...state, toDos: doneToDo(state.toDos, action.id) };
      case CHECKTODO:
        return { ...state, toDos: checkToDo(state.toDos, action.id) };
    }
  }

  const store = Redux.createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  const getToDoList = () => {
    toDoList.innerHTML = '';
    const { toDos } = store.getState();
    toDos.forEach((v) => {
      const div = document.createElement('div');
      div.id = v.id;
      div.className = 'toDo_list_item';
      if (v.done) div.style.textDecoration = 'line-through';
      div.addEventListener('click', (event) =>
        store.dispatch({ type: DONETODO, id: v.id, event })
      );
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.checked = v.check;
      checkBox.addEventListener('click', () =>
        store.dispatch({ type: CHECKTODO, id: v.id })
      );
      div.append(checkBox);
      const textDiv = document.createElement('div');
      textDiv.className = 'text';
      textDiv.textContent = v.toDo;
      div.append(textDiv);
      const dateDiv = document.createElement('div');
      dateDiv.className = 'date';
      dateDiv.textContent = v.date;
      div.append(dateDiv);
      const deleteBtn = document.createElement('input');
      deleteBtn.className = 'delete';
      deleteBtn.type = 'button';
      deleteBtn.value = '❌';
      deleteBtn.addEventListener('click', () =>
        store.dispatch({ type: DELETETODO, id: v.id })
      );
      div.append(deleteBtn);
      toDoList.append(div);
    });
  };

  store.subscribe(getToDoList);

  const init = () => {
    form.addEventListener('submit', (event) =>
      store.dispatch({ type: ADDTODO, event })
    );
    toDoMultiDelete.addEventListener('click', () =>
      store.dispatch({ type: DELETEMULTITODO })
    );
  };
  init();
})();
