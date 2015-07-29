define(function (require) {
	'use strict';

	var React = require('react');
	var client = require('./client');

	var follow = require('./follow'); // function to hop multiple links by "rel"

	var root = '/api';

	var App = React.createClass({
		onCreate: function (newEmployee) {
			var self = this;
			follow(client, root, ['employees']).then(function (response) {
				return client({
					method: 'POST',
					path: response.entity._links.self.href,
					entity: newEmployee,
					headers: {'Content-Type': 'application/json'}
				})
			}).done(function (response) {
				self.setState({
					employees: self.state.employees.concat([response.entity]),
					attributes: self.state.attributes
				});
			});
		},
		onDelete: function (employee) {
			var self = this;
			client({method: 'DELETE', path: employee._links.self.href}).done(function (response) {
				var newEmployees = self.state.employees.filter(function (thatEmployee) {
					return thatEmployee._links.self.href !== employee._links.self.href;
				})
				self.setState({employees: newEmployees, attributes: self.state.attributes});
			})
		},
		getInitialState: function () {
			return ({employees: [], attributes: []});
		},
		// tag::follow[]
		componentDidMount: function () {
			var self = this;
			follow(client, root, ['employees']).done(function (response) {
				self.setState({employees: response.entity._embedded.employees, attributes: self.state.attributes});

				client({method: 'GET', path: response.entity._links.self.href + '/schema'}).done(function (response) {
					self.setState({
						employees: self.state.employees,
						attributes: Object.keys(response.entity.properties)
					});
				})
			});
		},
		// end::follow[]
		render: function () {
			return (
				<div>
					<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
					<EmployeeList employees={this.state.employees} onDelete={this.onDelete}/>
				</div>
			)
		}
	})

	var CreateDialog = React.createClass({
		handleSubmit: function (e) {
			e.preventDefault();
			var newEmployee = {};
			var self = this;
			this.props.attributes.forEach(function (attribute) {
				newEmployee[attribute] = React.findDOMNode(self.refs[attribute]).value.trim();
			});
			this.props.onCreate(newEmployee);
			this.props.attributes.forEach(function (attribute) {
				React.findDOMNode(self.refs[attribute]).value = ''; // clear out the dialog's inputs
			});
			window.location = "#";
		},
		render: function () {
			var inputs = this.props.attributes.map(function (attribute) {
				return (
					<input key={attribute} type="text" name={attribute} placeholder={attribute} ref={attribute}></input>
				)
			})
			return (
				<div>
					<a href="#createEmployee">Create</a>

					<div id="createEmployee" className="modalDialog">
						<div>
							<a href="#" title="Close" className="close">X</a>

							<h2>Create new employee</h2>

							<form onSubmit={this.handleSubmit}>
								{inputs}
								<button onClick={this.handleSubmit}>Create</button>
							</form>
						</div>
					</div>
				</div>
			)
		}
	})

	var EmployeeList = React.createClass({
		render: function () {
			var self = this;
			var employees = this.props.employees.map(function (employee) {
				return (
					<Employee key={employee._links.self.href} employee={employee} onDelete={self.props.onDelete}/>
				)
			});
			return (
				<table>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Description</th>
						<th></th>
					</tr>
					{employees}
				</table>
			)
		}
	})

	var Employee = React.createClass({
		handleDelete: function () {
			this.props.onDelete(this.props.employee);
		},
		render: function () {
			return (
				<tr>
					<td>{this.props.employee.firstName}</td>
					<td>{this.props.employee.lastName}</td>
					<td>{this.props.employee.description}</td>
					<td>
						<button onClick={this.handleDelete}>Delete</button>
					</td>
				</tr>
			)
		}
	})

	React.render(
		<App />,
		document.getElementById('react')
	)

});