import {React, useState, useEffect} from 'react'
import SchoolIcon from '@mui/icons-material/School';
import FolderIcon from '@mui/icons-material/Folder';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';

const NoteStruct = (props) => {
  return (
    <div className={props.open ? 'h-[30px] w-[100%] bg-[#eaeaea] flex items-center px-[0px] justify-between cursor-pointer' : 'h-[30px] w-[100%] bg-[#fff] flex items-center px-[0px] justify-between cursor-pointer'}>
        <p className='ml-[20px] w-[70px]'>{props.name}</p>
        <div className='flex items-center justify-center mr-[30px]'>
        {
            props.parentType == 'class' ?
            <SchoolIcon sx={{color: "#4a6a8f", fontSize: '20px', marginRight: '5px'}} onClick={() => props.setOpen(props.id, !props.open)}/>
            :
            
                props.parentType == 'folder' ?
                <FolderIcon sx={{fontSize: '20px', marginRight: '5px', color: "#6a8099"}}/>
                :
                <EditNoteIcon sx={{fontSize: '20px', marginRight: '5px', color: "#333"}}/>
            
        }
        <p>{props.parentName}</p>
        
        </div>
        <IconButton><CloseRoundedIcon sx={{fontSize: "15px"}}/></IconButton>
    </div>
  )
}

export default NoteStruct