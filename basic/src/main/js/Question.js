const React = require('react'); // <1>

export default class Question extends React.Component{
  render() {
    return (
      <div>
        <div>{this.props.question.value}</div>
      </div>
    )
  }
}