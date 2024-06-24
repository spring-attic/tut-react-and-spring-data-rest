import Form from './Form'

// tag::vars[]
const React = require('react'); // <1>
const ReactDOM = require('react-dom'); // <2>
const client = require('./client'); // <3>
// end::vars[]

// tag::app[]
class App extends React.Component { // <1>

	constructor(props) {
		super(props);
		this.state = {forms: []};
	}

	componentDidMount() { // <2>
		client({method: 'GET', path: '/form'}).done(response => {
			this.setState({form: response.entity});
		});
	}

	render() { // <3>
		return (
			<Form form={this.state.form}/>
		)
	}
}
// end::app[]

// class EmployeeList extends React.Component{
// 	render() {
// 		const employees = this.props.employees.map(employee =>
// 			<Employee key={employee._links.self.href} employee={employee}/>
// 		);
// 		return (
// 			<table>
// 				<tbody>
// 					<tr>
// 						<th>First Name</th>
// 						<th>Last Name</th>
// 						<th>Description</th>
// 					</tr>
// 					{employees}
// 				</tbody>
// 			</table>
// 		)
// 	}
// }
// // end::employee-list[]
//
// // tag::employee[]
// class Employee extends React.Component{
// 	render() {
// 		return (
// 			<tr>
// 				<td>{this.props.employee.firstName}</td>
// 				<td>{this.props.employee.lastName}</td>
// 				<td>{this.props.employee.description}</td>
// 			</tr>
// 		)
// 	}
// }
// end::employee[]

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]
