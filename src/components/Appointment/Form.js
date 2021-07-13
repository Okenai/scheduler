import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

const Form = function (props) {
  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  const reset = function () {
    setName('');
    setInterviewer(null)
  }

  const cancel = function () {
    reset();
    props.onCancel();
  }

  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    // if (!interviewer) {
    //   setError("Please choose an interviewer");
    //   return;
    // }

    props.onSave(name, interviewer);
  }

  const onChange = function (event) {
    const text = event.target.value;

    setError(text.length ? "" : "Student name cannot be blank")

    setName(text)
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={event => event.preventDefault()} autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            value={name}
            onChange={onChange}
            type="text"
            name="name"
            placeholder="Enter Student Name"
            data-testid="student-name-input"
          /*
            This must be a controlled component
          */
          />
        </form>
        <InterviewerList interviewers={props.interviewers} interviewer={interviewer} setInterviewer={setInterviewer} />
      </section>
      <section className="appointment__validation">{error}</section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>Cancel</Button>
          <Button onClick={validate} confirm>Save</Button>
        </section>
      </section>
    </main>
  )
}

export default Form;