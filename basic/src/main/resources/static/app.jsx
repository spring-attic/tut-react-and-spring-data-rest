define(function (require) {
	'use strict';

	// tag::vars[]
	var React = require('react');
	var client = require('./client');
	// end::vars[]

	// tag::app[]
	var App = React.createClass({
		getInitialState: function () {
			return ({employees: []});
		},
		componentDidMount: function () {
			var self = this;
			client({method: 'GET', path: '/api/employees'}).done(function (response) {
				self.setState({employees: response.entity._embedded.employees});
			})
		},
		render: function () {
			return (
				<EmployeeList employees={this.state.employees}/>
			)
		}
	})
	// end::app[]

	// tag::employee-list[]
	var EmployeeList = React.createClass({
		render: function () {
			var employees = this.props.employees.map(function (employee) {
				return (
					<Employee key={employee._links.self.href} employee={employee}/>
				)
			});
			return (
				<table>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Description</th>
					</tr>
					{employees}
				</table>
			)
		}
	})
	// end::employee-list[]

	// tag::employee[]
	var Employee = React.createClass({
		render: function () {
			return (
				<tr>
					<td>{this.props.employee.firstName}</td>
					<td>{this.props.employee.lastName}</td>
					<td>{this.props.employee.description}</td>
				</tr>
			)
		}
	})
	// end::employee[]

	// tag::render[]
	React.render(
		<App />,
		document.getElementById('react')
	)
	// end::render[]

});