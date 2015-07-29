define(function (require) {
	'use strict';

	var React = require('react');
	var client = require('./client');

	var follow = require('./follow'); // function to hop multiple links by "rel"

	var root = '/api';

	var App = React.createClass({
		// tag::follow-2[]
		loadFromServer: function (pageSize) {
			var self = this;
			follow(client, root, [
				{rel: 'employees', params: {size: pageSize}}]).done(function (employeeCollection) {
				client({
					method: 'GET',
					path: employeeCollection.entity._links.self.href + '/schema'
				}).done(function (response) {
					self.setState({
						employees: employeeCollection.entity._embedded.employees,
						attributes: Object.keys(response.entity.properties),
						pageSize: pageSize,
						links: employeeCollection.entity._links
					});
				})
			});
		},
		// end::follow-2[]
		// tag::create[]
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
					attributes: self.state.attributes,
					pageSize: self.state.pageSize,
					links: self.state.links
				});
			});
		},
		// end::create[]
		// tag::delete[]
		onDelete: function (employee) {
			var self = this;
			client({method: 'DELETE', path: employee._links.self.href}).done(function (response) {
				var newEmployees = self.state.employees.filter(function (thatEmployee) {
					return thatEmployee._links.self.href !== employee._links.self.href;
				})
				self.setState({
					employees: newEmployees, attributes: self.state.attributes,
					pageSize: self.state.pageSize, links: self.state.links
				});
			})
		},
		// end::delete[]
		// tag::navigate[]
		onNavigate: function(navUri) {
			var self = this;
			client({method: 'GET', path: navUri}).done(function(response) {
				self.setState({employees: response.entity._embedded.employees, attributes: self.state.attributes,
					links: response.entity._links});
			});
		},
		// end::navigate[]
		// tag::update-page-size[]
		updatePageSize: function (pageSize) {
			this.loadFromServer(pageSize);
		},
		// end::update-page-size[]
		getInitialState: function () {
			return ({employees: [], attributes: [], pageSize: 2, links: {}});
		},
		// tag::follow-1[]
		componentDidMount: function () {
			this.loadFromServer(this.state.pageSize);
		},
		// end::follow-1[]
		render: function () {
			return (
				<div>
					<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
					<EmployeeList employees={this.state.employees}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}
								  onDelete={this.onDelete}
								  updatePageSize={this.updatePageSize}/>
				</div>
			)
		}
	})

	// tag::create-dialog[]
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
					<input key={attribute} type="text" placeholder={attribute} ref={attribute} />
				)
			})
			return (
				<div>
					<a href="#createEmployee">Create</a>

					<div id="createEmployee" className="modalDialog">
						<div>
							<a href="#" title="Close" className="close">X</a>

							<h2>Create new employee</h2>

							<form>
								{inputs}
								<button onClick={this.handleSubmit}>Create</button>
							</form>
						</div>
					</div>
				</div>
			)
		}
	})
	// end::create-dialog[]

	var EmployeeList = React.createClass({
		handleInput: function (e) {
			e.preventDefault();
			var pageSize = React.findDOMNode(this.refs.pageSize).value;
			if (/^[0-9]+$/.test(pageSize)) {
				this.props.updatePageSize(pageSize);
			} else {
				React.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
			}
		},
		handleNavFirst: function(e){
			e.preventDefault();
			this.props.onNavigate(this.props.links.first.href);
		},
		handleNavPrev: function(e) {
			e.preventDefault();
			this.props.onNavigate(this.props.links.prev.href);
		},
		handleNavNext: function(e) {
			e.preventDefault();
			this.props.onNavigate(this.props.links.next.href);
		},
		handleNavLast: function(e) {
			e.preventDefault();
			this.props.onNavigate(this.props.links.last.href);
		},
		render: function () {
			var self = this;
			var employees = this.props.employees.map(function (employee) {
				return (
					<Employee key={employee._links.self.href} employee={employee} onDelete={self.props.onDelete}/>
				)
			});

			var navLinks = [];
			if ("first" in this.props.links) {
				navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
			}
			if ("prev" in this.props.links) {
				navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
			}
			if ("next" in this.props.links) {
				navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
			}
			if ("last" in this.props.links) {
				navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
			}

			return (
				<div>
					<input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}></input>
					<table>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Description</th>
							<th></th>
						</tr>
						{employees}
					</table>
					<div>
						{navLinks}
					</div>
				</div>
			)
		}
	})

	// tag::employee[]
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
	// end::employee[]

	React.render(
		<App />,
		document.getElementById('react')
	)

});