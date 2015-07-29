define(function (require) {
	'use strict';

	// tag::vars[]
	var React = require('react');
	var client = require('./client');
	// end::vars[]

	// tag::employee-list[]
	var EmployeeList = React.createClass({
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
			var employees = this.state.employees.map(function(employee) {
				return (
					<Employee key={employee._links.self.href} employee={employee} />
				)
			});
			return (
				<ul>
					{employees}
				</ul>
			)
		}
	})
	// end::employee-list[]

	// tag::employee[]
	var Employee = React.createClass({
		render: function () {
			return (
				<li>
					{this.props.employee.firstName} {this.props.employee.lastName}, {this.props.employee.description}
				</li>
			)
		}
	})
	// end::employee[]

	// tag::render[]
	React.render(
		<EmployeeList />,
		document.getElementById('react')
	)
	// end::render[]

});