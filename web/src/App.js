import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import List from './List';
import { arrayMove } from 'react-sortable-hoc';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

class App extends Component {
  state = {
    items: [[
      { id:0, task:'Item 1 x', date: new Date('2018-12-01'), important: true },
      { id:1, task:'Item 2 x', date: new Date(), important: true },
      { id:2, task:'Item 3 x', date: new Date(), important: true }
    ], [
      { id:3, task:'Item 4', date: new Date(), important: false },
      { id:4, task:'Item 5', date: new Date(), important: false, done: false }
    ], [
      { id:5, task:'Item 6', date: new Date(), important: false, done: true }
    ]]
  };
  componentDidMount() {
    axios.get(`${url}/tasks`)
      .then(res => {
        const tasks = res.data;
        console.log(tasks);
        const newItems = [];
        newItems.push(tasks.filter(d => d.important && !d.done));
        newItems.push(tasks.filter(d => !d.important && !d.done));
        newItems.push(tasks.filter(d => d.done));
        console.log(newItems);
        this.setState({ items: newItems });
      });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.items !== prevState.items) {
      axios.post(`${url}/tasks`, this.state.items.reduce((acc, val) => acc.concat(val), []))
        .then(res => {
          const tasks = res.data;
          console.log(tasks);
        });
    }
  }
  handleSortEnd = (listIndex) => ({oldIndex, newIndex}) => {
    const newItems = this.state.items.slice(0);
    newItems[listIndex] = arrayMove(newItems[listIndex], oldIndex, newIndex);
    this.setState({ items: newItems });
  };
  handleChangeImportant = (listIndex) => (value) => (event) => {
    console.log(listIndex, value, event.target.checked);
    const newItems = this.state.items.slice(0);
    newItems[listIndex] = newItems[listIndex].filter(x => x.id !== value.id);
    const newValue = Object.assign({}, value, { important: !value.important });
    const moveToList = newValue.done ? 2 : (newValue.important ? 0 : 1);
    newItems[moveToList] = [].concat(newValue).concat(newItems[moveToList]);
    this.setState({ items: newItems });
  };
  handleChangeDone = (listIndex) => (value) => (event) => {
    console.log(listIndex, value, event.target.checked);
    const newItems = this.state.items.slice(0);
    newItems[listIndex] = newItems[listIndex].filter(x => x.id !== value.id);
    const newValue = Object.assign({}, value, { done: !value.done });
    const moveToList = newValue.done ? 2 : (newValue.important ? 0 : 1);
    newItems[moveToList] = [].concat(newValue).concat(newItems[moveToList]);
    this.setState({ items: newItems });
  };
  render() {
    return (
      <div className="container">
        <h1 className="App-title">Todo List</h1>
        <p className="lead">LINE botfor helping people manage their todo list</p>
        <h4>Important</h4>
        <div className="container">
          <List id="important" items={this.state.items[0]}
            onSortEnd={this.handleSortEnd(0)}
            onChangeImportant={this.handleChangeImportant(0)}
            onChangeDone={this.handleChangeDone(0)}></List>
        </div>
        <h4>In progress</h4>
        <div className="container">
          <List id="normal" items={this.state.items[1]}
            onSortEnd={this.handleSortEnd(1)}
            onChangeImportant={this.handleChangeImportant(1)}
            onChangeDone={this.handleChangeDone(1)}></List>
        </div>
        <h4>Done</h4>
        <div className="container">
          <List id="done" items={this.state.items[2]}
            onSortEnd={this.handleSortEnd(2)}
            onChangeImportant={this.handleChangeImportant(2)}
            onChangeDone={this.handleChangeDone(2)}></List>
        </div>
      </div>
    );
  }
}

export default App;
