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

 
const Document = (props) => {
    const [onEdit, setOnEdit] = useState(false);
    const itemInput = useRef(null);
    const [categoryName, setName] = useState('');
    const [prevName, setPrevName] = useState('default');
    const [displayName, setDisplayName] = useState('');

    const ref = useRef(null);
    const { onClickOutside } = props;

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            onClickOutside && onClickOutside();
            if(onEdit) {
                if(categoryName != '') {
                    setOnEdit(false);
                } else {
                props.removeItem(props.id);
                console.log('done');
                }
            };
        }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
        document.removeEventListener('click', handleClickOutside, true);
        };
    }, [ onClickOutside, onEdit ]);

    useEffect(() => {
        
            if (itemInput.current) {
            itemInput.current.focus();
            itemInput.current.select();
        }
    }, [onEdit]);

    useEffect(() => {
        setPrevName(props.name);
        if(props.name == 'default') { 
            setOnEdit(true);
        } else {
            setOnEdit(false);
            setName(props.name);
            if(props.name.length >= 12) {
                setDisplayName(props.name.substring(0, 9) + '...');
            } else {
                setDisplayName(props.name);
            }
        }
    }, [props.name]);

    
    

    const [anchorEl, setAnchorEl] = useState(null);
    const opener = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    
    const [untitled, setUntitled] = useState(false);

    const handleKeyDown = event => {
        console.log('User pressed: ', event.key);
    
        if (event.key === 'Enter') {

            if(categoryName.length >= 12) {
                setDisplayName(categoryName.substring(0, 9) + '...');
            } else if(categoryName == '') {
                setUntitled(true);
                return;
            } else {
                setDisplayName(categoryName);
            }
            props.setName(props.id, prevName, categoryName);
            setPrevName(categoryName);
            props.setPropOpen(props.id, true);
          setOnEdit(false);
        }
    };

  return (
    <div ref={ref} style={{'--hover-color': props.selectionColor, '--color': props.dropColor}}  className={onEdit ? 'w-[100%] rounded-xl h-[30px] flex items-center justify-between p-[10px] ' : (!props.open ?  'w-[100%] rounded-xl h-[30px]  flex items-center justify-between p-[10px]  cursor-pointer  hover:!bg-[--hover-color]' : `w-[100%] rounded-xl h-[30px] flex items-center justify-between p-[10px]  cursor-pointer  !bg-[--color]`)}>
        <div className='flex items-center'>
            <img onClick={() => props.setPropOpen(props.id, !props.open)} className='mr-[2px] h-[18px] items-center justify-center flex' src={docsLogo}/>
            {
                onEdit ? 
                <input style={{'--color': props.inputColor}} ref={itemInput} onKeyDown={handleKeyDown} value={categoryName} onChange={(e) => {setName(e.target.value)
                    setDisplayName(e.target.value)
                }} className={!untitled ? '!bg-[--color] outline-none border-[1.3px] border-[#000] rounded-sm h-[25px] w-[110px] px-[3px] ml-[1px]' : '!bg-[--color] outline-none border-[1.5px] border-red-500 rounded-sm h-[25px] w-[110px] px-[3px] ml-[1px]'}/>
                :
                <p onClick={() => props.setPropOpen(props.id, !props.open)} className={!props.open ? ' flex items-center ml-[5px]  ' : ' flex items-center  ml-[5px]  '}>{displayName}</p>
            }
        </div>
        <div className='gap-[0px] flex justify-center items-center'>
            
                <div style={{'--hover-color': props.selectionColor}} onClick={() => setOnEdit(true)} className='flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:!bg-[--hover-color] hover:drop-shadow-lg'>
                    <EditSharpIcon sx={{fontSize: "15px"}} />
                </div>
            
                

            <div style={{'--hover-color': props.selectionColor}} onClick={() => props.removeItem(props.id)} className='flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:!bg-[--hover-color] hover:drop-shadow-lg'>
                <DeleteIcon sx={{fontSize: "15px"}}/>
            </div>
        </div>
    </div>
  )
}

export default Document