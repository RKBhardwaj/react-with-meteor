import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Meteor } from 'meteor/meteor';
//import { Tasks } from '../api/tasks.js';
import classnames from 'classnames';
import '../../node_modules/sweetalert/dist/sweetalert.min';

// Task component - represents a single todo item
export default class Task extends Component {

    toggleChecked() {
        // Set the checked property to the opposite of its current value
        //Commenting the code as we will doing db handing through server
        /*Tasks.update(this.props.task._id, {
            $set: { checked: !this.props.task.checked },
        });*/

        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }

    deleteThisTask() {
        //Commenting this code as we will be doing db handling from the server
        //Tasks.remove(this.props.task._id);
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this task!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    Meteor.call('tasks.remove', this.props.task._id);
                    swal("Your task has been deleted!", {
                        icon: "success",
                    });
                }
            });
    }

    togglePrivate() {
        Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
    }

    render() {
        // Give tasks a different className when they are checked off,
        // so that we can style them nicely in CSS
        const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private,
        });

        return (
            <li className={taskClassName}>
                <button className="delete" onClick={this.deleteThisTask.bind(this)}>
                    &times;
                </button>

                <input
                    type="checkbox"
                    readOnly
                    checked={this.props.task.checked}
                    onClick={this.toggleChecked.bind(this)}
                />

                { this.props.showPrivateButton ? (
                    <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
                        { this.props.task.private ? 'Private' : 'Public' }
                    </button>
                ) : ''}


                <span className="text">
                    <strong>{this.props.task.username}</strong>: {this.props.task.text}
                </span>
            </li>
        );
    }
}

Task.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    task: PropTypes.object.isRequired,
    showPrivateButton: PropTypes.bool.isRequired
};