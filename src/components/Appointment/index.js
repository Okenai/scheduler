import React, {useEffect} from 'react';
import './styles.scss';
import classNames from 'classnames';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import useVisualMode from 'hooks/useVisualMode';
import { getInterviewerById } from 'helpers/selectors';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  // useEffect(()=> {
  //   console.log("props in useEffect", props.interview)
  //   if (props.interview) {
  //     transition(SHOW)
  //   }
  // }, [props.interview])

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(response => {
        transition(SHOW)
      }
      )
      .catch(() => transition(ERROR_SAVE, true))
  };

  function empty() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(response => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
  }
 if (mode === SHOW) {
  console.log("props", props)
 }
  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview && props.interview.student}
          interviewer={props.interview && props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you want to delete?" onConfirm={() => empty()}
          onCancel={() => back()}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          name={props.interview.student}
          interviewer={props.interview.interviewer}
          onCancel={() => back()}
          onSave={save}
        />
      )}

      {mode === ERROR_SAVE && (
        <Error message="something went wrong" onClose={() => back()}/>
      )}

      {mode === ERROR_DELETE && (
        <Error message="something went wrong" onClose={() => back()}/>
      )}
    </article>
  )
}
