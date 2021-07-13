import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const updateSpots = function (id, days, updatedAppointments) {
    
    let appointmentDay;
    let indexOfDay;
    // console.log("before days:", days)
    for (let day of days) {
      if (day.name === state.day) {
        appointmentDay = {...day};
        indexOfDay = days.indexOf(day);
        break;
      }
    }
    // console.log("days after : ", days)
    let totalSpots = appointmentDay.appointments.length;

    for (let each of appointmentDay.appointments) {
      if (updatedAppointments[each].interview !== null) {
        totalSpots--;
      };
    }
    
    days[indexOfDay].spots = totalSpots;
    
    return days;
  };

  function bookInterview(id, interview) {

    let interviewerID;
    if (interview && interview.interviewer && interview.interviewer.name) {
      interviewerID = interview.interviewer.id;

    }
    const appointment = {
      ...state.appointments[id],
      interview: {
        student: interview.student,
        interviewer: interviewerID ? interviewerID : interview.interviewer
      }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

      console.log("State before:", state.days)

      console.log("before: ", state.days[0].spots)
      let daysCopy = [...state.days]
        let days = updateSpots(id, daysCopy, appointments);

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then(response => {
        
        console.log("after: ", state.days[0].spots)
        setState({ ...state, days, appointments });
     })
      
  };
  
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id]
    };

    appointment.interview = null;

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


    return axios
      .delete(`/api/appointments/${id}`, appointment)
      .then(response => {
        let daysCopy = [...state.days]
        console.log("before: ", state.days[0].spots)
        let days = updateSpots(id, daysCopy, appointments);
        console.log("after: ", state.days[0].spots)
        setState({ ...state, days, appointments })
      }

      )
  }

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('/api/interviewers')])
      .then((all) => {
        setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
      })
  }, [])
  return { state, setDay, bookInterview, cancelInterview }
}