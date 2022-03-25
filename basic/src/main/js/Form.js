const React = require('react'); // <1>
import Question from './Question'


export default class Form extends React.Component{
  render() {
    const questionsArr = this.props.form?.questions ?? []
    const questions = questionsArr.map(question =>
      <Question key={question.id} question={question}/>
    );
    return (
      <div>
        {questions}
      </div>
    )
  }
}