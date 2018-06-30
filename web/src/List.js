import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import moment from 'moment';

const SortableItem = SortableElement(({value, onChangeImportant, onChangeDone}) =>
  <li className="list-group-item list-group-item-action flex-column align-items-start">
    <div className="d-flex w-100 justify-content-between">
      <h5 className="mb-1">{value.task}</h5>
      <small className="text-muted">
        {moment(value.date).format('DD/MM/YY HH:mm')}
      </small>
    </div>
    <p className="mb-1">
      <div className="form-check">
        <input className="form-check-input" type="checkbox" defaultChecked={value.important} onChange={onChangeImportant(value)} />
        <label className="form-check-label">Important</label>
      </div> 
      <div className="form-check">
        <input className="form-check-input" type="checkbox" defaultChecked={value.done} onChange={onChangeDone(value)} />
        <label className="form-check-label">Done</label>
      </div>   
    </p>
  </li>
);

const SortableList = SortableContainer(({items, onChangeImportant, onChangeDone}) => {
  return (
    <div>
      <ul className="list-group">
        {items.map((value, index) => (
          <SortableItem key={`item-${value.id}`} index={index}
            value={value}
            onChangeImportant={onChangeImportant}
            onChangeDone={onChangeDone}
          />
        ))}
      </ul>
  </div>
  );
});

class List extends Component {
  render() {
    return (
      <SortableList items={this.props.items} pressDelay="200" lockToContainerEdges="true"
        onSortEnd={this.props.onSortEnd}
        onChangeImportant={this.props.onChangeImportant}
        onChangeDone={this.props.onChangeDone} />
    );
  }
}

export default List;
