import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData () {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  function bookInterview(id, interview) {
    console.log("interview inside bookInterview:", interview)
    console.log("interviewer from bookInterview:", interview.interviewer)

    let interviewerID;
    if (interview && interview.interviewer && interview.interviewer.name) {
      interviewerID = interview.interviewer.id;
      
    }
    const appointment = {
          ...state.appointments[id],
        interview: { student: interview.student,
        interviewer: interviewerID ? interviewerID : interview.interviewer }
    };

     return axios
    .put(`/api/appointments/${id}`, appointment)
    .then(response => { 
      const newAppointment = {
        ...state.appointments[id],
        interview: {...interview }
      };

      const appointments = {
        ...state.appointments,
        [id]: newAppointment
      };
    console.log(newAppointment)
      setState({...state, appointments});
    
  }
   
   )
  };
  
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...null }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
  
    return axios
    .delete(`/api/appointments/${id}`, appointment)
    .then(response => setState({...state, appointments})
   )
  }

  const setDay = day => setState({ ...state, day });
 
  useEffect(() => {
    Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('/api/interviewers')])
      .then((all) => {
        setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers:all[2].data}))
      })
  }, [])
  return {state, setDay, bookInterview, cancelInterview}
}