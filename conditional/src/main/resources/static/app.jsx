define(function (require) {
	'use strict';

	var React = require('react');
	var when = require('when');
	var client = require('./client');

	var follow = require('./follow'); // function to hop multiple links by "rel"

	var root = '/api';

	var App = React.createClass({
		// tag::follow-2[]
		loadFromServer: function (pageSize) {
			follow(client, root, [
				{rel: 'employees', params: {size: pageSize}}]
			).then(employeeCollection => {
				return client({
					method: 'GET',
					path: employeeCollection.entity._links.self.href + '/schema'
				}).then(schema => {
					this.schema = schema.entity;
					this.links = employeeCollection.entity._links;
					return employeeCollection;
				});
			}).then(employeeCollection => {
				return employeeCollection.entity._embedded.employees.map(employee =>
						client({
							method: 'GET',
							path: employee._links.self.href
						})
				);
			}).then(employeePromises => {
				return when.all(employeePromises);
			}).done(employees => {
				this.setState({
					employees: employees,
					attributes: Object.keys(this.schema.properties),
					pageSize: pageSize,
					links: this.links
				});
			});
		},
		// end::follow-2[]
		// tag::create[]
		onCreate: function (newEmployee) {
			follow(client, root, ['employees']).then(response => {
				return client({
					method: 'POST',
					path: response.entity._links.self.href,
					entity: newEmployee,
					headers: {'Content-Type': 'application/json'}
				})
			}).then(response => {
				return follow(client, root, [{rel: 'employees', params: {'size': this.state.pageSize}}]);
			}).done(response => {
				this.onNavigate(response.entity._links.last.href);
			});
		},
		// end::create[]
		// tag::update[]
		onUpdate: function (employee, updatedEmployee) {
			client({
				method: 'PUT',
				path: employee.entity._links.self.href,
				entity: updatedEmployee,
				headers: {
					'Content-Type': 'application/json',
					'If-Match': employee.headers.Etag
				}
			}).done(response => {
				this.loadFromServer(this.state.pageSize);
			}, response => {
				if (response.status.code === 412) {
					alert('Unable to update ' + employee.entity._links.self.href + '. Your copy is stale.');
				}
			});
		},
		// end::update[]
		// tag::delete[]
		onDelete: function (employee) {
			client({method: 'DELETE', path: employee.entity._links.self.href}).done(response => {
				this.loadFromServer(this.state.pageSize);
			});
		},
		// end::delete[]
		// tag::navigate[]
		onNavigate: function(navUri) {
			client({
				method: 'GET',
				path: navUri
			}).then(employeeCollection => {
				this.links = employeeCollection.entity._links;

				return employeeCollection.entity._embedded.employees.map(employee =>
						client({
							method: 'GET',
							path: employee._links.self.href
						})
				);
			}).then(employeePromises => {
				return when.all(employeePromises);
			}).done(employees => {
				this.setState({
					employees: employees,
					attributes: Object.keys(this.schema.properties),
					pageSize: this.state.pageSize,
					links: this.links
				});
			});
		},
		// end::navigate[]
		// tag::update-page-size[]
		updatePageSize: function (pageSize) {
			if (pageSize !== this.state.pageSize) {
				this.loadFromServer(pageSize);
			}
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
								  attributes={this.state.attributes}
								  onNavigate={this.onNavigate}
								  onUpdate={this.onUpdate}
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
			this.props.attributes.forEach(attribute => {
				newEmployee[attribute] = React.findDOMNode(this.refs[attribute]).value.trim();
			});
			this.props.onCreate(newEmployee);
			this.props.attributes.forEach(attribute => {
				React.findDOMNode(this.refs[attribute]).value = ''; // clear out the dialog's inputs
			});
			window.location = "#";
		},
		render: function () {
			var inputs = this.props.attributes.map(attribute =>
				<p key={attribute}>
					<input type="text" placeholder={attribute} ref={attribute} className="field" />
				</p>
			);
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
	});
	// end::create-dialog[]

	// tag::update-dialog[]
	var UpdateDialog = React.createClass({

		handleSubmit: function (e) {
			e.preventDefault();
			var updatedEmployee = {};
			this.props.attributes.forEach(attribute => {
				updatedEmployee[attribute] = React.findDOMNode(this.refs[attribute]).value.trim();
			});
			this.props.onUpdate(this.props.employee, updatedEmployee);
			window.location = "#";
		},

		render: function () {
			var inputs = this.props.attributes.map(attribute =>
					<p key={this.props.employee.entity[attribute]}>
						<input type="text" placeholder={attribute}
							   defaultValue={this.props.employee.entity[attribute]}
							   ref={attribute} className="field" />
					</p>
			);

			var dialogId = "updateEmployee-" + this.props.employee.entity._links.self.href;

			return (
				<div key={this.props.employee.entity._links.self.href}>
					<a href={"#" + dialogId}>Update</a>
					<div id={dialogId} className="modalDialog">
						<div>
							<a href="#" title="Close" className="close">X</a>

							<h2>Update an employee</h2>

							<form>
								{inputs}
								<button onClick={this.handleSubmit}>Update</button>
							</form>
						</div>
					</div>
				</div>
			)
		}

	});
	// end::update-dialog[]


	var EmployeeList = React.createClass({
		// tag::handle-page-size-updates[]
		handleInput: function (e) {
			e.preventDefault();
			var pageSize = React.findDOMNode(this.refs.pageSize).value;
			if (/^[0-9]+$/.test(pageSize)) {
				this.props.updatePageSize(pageSize);
			} else {
				React.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
			}
		},
		// end::handle-page-size-updates[]
		// tag::handle-nav[]
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
		// end::handle-nav[]
		// tag::employee-list-render[]
		render: function () {
			var employees = this.props.employees.map(employee =>
					<Employee key={employee.entity._links.self.href}
							  employee={employee}
							  attributes={this.props.attributes}
							  onUpdate={this.props.onUpdate}
							  onDelete={this.props.onDelete}/>
			);

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
					<input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
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
		// end::employee-list-render[]
	})

	// tag::employee[]
	var Employee = React.createClass({
		handleDelete: function () {
			this.props.onDelete(this.props.employee);
		},
		render: function () {
			return (
				<tr>
					<td>{this.props.employee.entity.firstName}</td>
					<td>{this.props.employee.entity.lastName}</td>
					<td>{this.props.employee.entity.description}</td>
					<td>
						<UpdateDialog employee={this.props.employee}
									  attributes={this.props.attributes}
									  onUpdate={this.props.onUpdate}/>
					</td>
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