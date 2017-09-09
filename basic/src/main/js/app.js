// tag::vars[]
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import client from './client';
// end::vars[]

// tag::app[]
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {employees: [] };
  }

  componentDidMount() {
    client({method: 'GET', path: '/api/employees'})
      .then(response => {
        this.setState({employees: response.entity._embedded.employees});
      })
      .catch(error => console.log(error));
  }

  render() {
    return <EmployeeList employees={this.state.employees} />;
  }
}
// end::app[]

// tag::employee-list[]
class EmployeeList extends React.Component {
  render() {
    const employees = this.props.employees.map(employee =>
      <Employee key={employee._links.self.href} employee={employee} />
    );
    return (
      <table>
        <tbody>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Description</th>
          </tr>
          {employees}
        </tbody>
      </table>
    );
  }
}
// end::employee-list[]

// tag::employee[]
class Employee extends React.Component {
  render() {
    return (
      <tr>
        <td>
          {this.props.employee.firstName}
        </td>
        <td>
          {this.props.employee.lastName}
        </td>
        <td>
          {this.props.employee.description}
        </td>
      </tr>
    );
  }
}
// end::employee[]

// tag::render[]
ReactDOM.render(<App />, document.getElementById('react'));
// end::render[]
