import React from 'react'
import DueDatePanel from './DueDatePanel'
import Notee from './Notee'
import Canvas from './Canvas'

const NotesPanel = (props) => {
  return (
    <div className='bg-[#ffffff] h-[calc(100vh-70px)] w-[250px] border-l-[1px] pt-[10px] border-[#dbdbdb]'>
      <DueDatePanel dueChange={props.dueChange} setDueChange={props.setDueChange} updateDues={props.updateDues} userEmail={props.userEmail} dues={props.dues}/>
      <Canvas />
    </div>
  )
}

export default NotesPanel
//<Notee noteChange={props.noteChange} userEmail={props.userEmail}/>