import {React, useState, useEffect, useRef} from 'react'
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import SubjectIcon from '@mui/icons-material/Subject';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import docsLogo from '../../../../assets/docsLogo.png'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const Link = (props) => {
    const [onEdit, setOnEdit] = useState(false);
    const itemInput = useRef(null);
    const [categoryName, setName] = useState('');
    const [prevName, setPrevName] = useState('default');
    const [displayName, setDisplayName] = useState('');

    const ref = useRef(null);

    useEffect(() => {
            setName(props.name);
            if(props.name.length >= 12) {
                setDisplayName(props.name.substring(0, 9) + '...');
            } else {
                setDisplayName(props.name);
        }
    }, [props.name]);
    

    const [anchorEl, setAnchorEl] = useState(null);
    const opener = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };


  return (
    <div ref={ref} style={{'--hover-color': props.selectionColor, '--color': props.dropColor}} className={onEdit ? 'w-[100%] rounded-xl h-[30px]  flex items-center justify-between p-[10px] ' : (!props.open ?  'w-[100%] rounded-xl h-[30px]  flex items-center justify-between p-[10px]  cursor-pointer  hover:!bg-[--hover-color]' : 'w-[100%] rounded-xl h-[30px]  flex items-center justify-between p-[10px]  cursor-pointer  !bg-[--color]')}>
        <div className='flex items-center'>
            <CloudDownloadIcon onClick={() => props.setPropOpen(props.id, !props.open)} sx={{fontSize: '20px', marginRight: '2px', color: "#3a6391"}}/>
            
                <p onClick={() => props.setPropOpen(props.id, !props.open)} className={!props.open ? ' flex items-center ml-[5px]  ' : ' flex items-center  ml-[5px]  '}>{displayName}</p>
        </div>
        <div className='gap-[0px] flex justify-center items-center'>
            
                <a target='_blank' href={props.fileUrl} download><div style={{'--hover-color': props.selectionColor}} onClick={() => {
                    
                }} className='flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:!bg-[--hover-color] hover:drop-shadow-lg'>
                    <FileDownloadIcon sx={{fontSize: "17px", marginTop: "2px"}} />
                </div></a>
            
                

            <div style={{'--hover-color': props.selectionColor}} onClick={() => props.removeItem(props.id)} className='flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:!bg-[--hover-color] hover:drop-shadow-lg'>
                <DeleteIcon sx={{fontSize: "15px"}}/>
            </div>
        </div>
    </div>
  )
}

export default Link