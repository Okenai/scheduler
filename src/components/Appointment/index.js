import React from 'react';
import './styles.scss';
import classNames from 'classnames';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';


export default function Appointment(props) {
  // const appointmentClass = classNames('appointment', {
  //   'last-of-type': props.id === 'last'
  // })

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onConfirm={() => console.log("Clicked onConfirm")}
          onCancel={() => console.log("Clicked onCancel")}
        />
      )}
      {mode === CREATE && <Form interviewers={props.interviewers } onCancel={() => back()} />} 
    </article>
  )
}
// onSave={} 