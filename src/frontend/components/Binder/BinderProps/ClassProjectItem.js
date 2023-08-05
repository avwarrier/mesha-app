import {React, useState, useEffect, useRef} from 'react'

import AddIcon from '@mui/icons-material/Add';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import SubjectIcon from '@mui/icons-material/Subject';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import EditNoteIcon from '@mui/icons-material/EditNote';
import docsLogo from '../../../assets/docsLogo.png'
import NotesIcon from '@mui/icons-material/Notes';
import LinkIcon from '@mui/icons-material/Link';
import Dialog from '@mui/material/Dialog';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudIcon from '@mui/icons-material/Cloud';
import {storage} from '../../../../backend/firebase'
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import { v4 as uuid } from 'uuid';
import ReactLoading from "react-loading";

const ClassProjectItem = (props) => {
    const [openAfterEdit, setOpenAfterEdit] = useState(false);

    const [onEdit, setOnEdit] = useState(false);
    const itemInput = useRef(null);
    const [categoryName, setName] = useState('');
    const [prevName, setPrevName] = useState('default');
    const [displayName, setDisplayName] = useState('');
    const reff = useRef(null);
    const { onClickOutside } = props;

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (reff.current && !reff.current.contains(event.target)) {
            onClickOutside && onClickOutside();
            if(onEdit) {
                if(categoryName != '') {
                    setOnEdit(false);
                } else {
                props.removeItem(props.id);
                console.log('done');
                }
            }
        }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
        document.removeEventListener('click', handleClickOutside, true);
        };
    }, [ onClickOutside, onEdit ]);

    

    useEffect(() => {
        console.log(onEdit)
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
            if(props.name.length >= 17) {
                setDisplayName(props.name.substring(0, 14) + '...');
            } else {
                setDisplayName(props.name);
            }
        }
    }, [props.name]);

    

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [anchorEls, setAnchorEls] = useState(null);
    const opens = Boolean(anchorEls);
    const handleClicks = (event) => {
        setAnchorEls(event.currentTarget);
    };
    const handleCloses = () => {
        setAnchorEls(null);
    };
    const [untitled, setUntitled] = useState(false);
    

    const handleKeyDown = event => {
        console.log('User pressed: ', event.key);
    
        if (event.key === 'Enter') {
            console.log(categoryName)
            if(categoryName.length >= 17) {
                setDisplayName(categoryName.substring(0, 14) + '...');
            } else if(categoryName == '') {
                setUntitled(true);
                return;
            } else {
                setDisplayName(categoryName);
            }
            
            props.setName(props.id, '', categoryName);
            setPrevName(categoryName);
          setOnEdit(false);
          if(openAfterEdit) props.setOpen(props.id, true);
          setOpenAfterEdit(true);
        }
    };

    const returnEdit = () => {
        if(categoryName.length >= 17) {
            setDisplayName(categoryName.substring(0, 14) + '...');
        } else if(categoryName == '') {
            setUntitled(true);
                return;
        }
        props.setName(props.id, '', categoryName);
            setPrevName(categoryName);
            if(openAfterEdit) props.setOpen(props.id, true);
          setOpenAfterEdit(true);
          setOnEdit(false);
    }

    const [openDialog, setOpenDialog] = useState(false);
    const [openFileDialog, setOpenFileDialog] = useState(false);

    const closeDialog = () => {
        setOpenDialog(false)
    }

    const closeFileDialog = () => {
        setOpenFileDialog(false)
    }

    const closeDialogColor = (color, dropColorr, otherColor, finalColor, inputColor) => {
        props.setColors(props.id, color, dropColorr, otherColor, finalColor, inputColor);
        setOpenDialog(false)
        //database
    }

    const [file, setFile] = useState();
    const [file_name, setfile_name] = useState('Select File');
    const [fileLoading, setFileLoading] = useState(false);

    const uploadFile = async(id) => {
        setFileLoading(true);
        if(file == null) return;
        const fileRef = ref(storage, `${props.userEmail}/${id}`)
        await uploadBytes(fileRef, file)
        let fileUrl = await getDownloadURL(fileRef);
        
        return fileUrl;
    }

    

  return (
    <div ref={reff} style={{'--hover-color': props.dropColor}}  className={onEdit ? `bg-[${props.color}] shadow-sm rounded-lg h-[40px] w-[250px]  flex items-center justify-between p-[10px] hover:!bg-[--hover-color] ` : `bg-[${props.color}] shadow-sm rounded-lg h-[40px] w-[250px] flex items-center justify-between p-[10px]  cursor-pointer  hover:!bg-[--hover-color] `}>
        <Dialog onClose={closeDialog} open={openDialog}>
            <div className='w-[300px] h-[200px] bg-[#f1f1f1] flex flex-col justify-center items-center gap-[10px]'>
                <div className='flex justify-center items-center gap-[10px]'>
                    <div onClick={() => {
                        closeDialogColor('#b8ebfc', '#a4d8eb', "#b8ebfc", "#b1e2f2", "#d0edf7")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#b8ebfc] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#bdfffb', '#a5e8e4', "#bdfffb", "#b8f5f1", "#d4fffc")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#bdfffb] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#bdffd1', '#aae6bc', "#bdffd1", "#b3f2c6", "#d2fcde")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#bdffd1] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#d2fca9', '#bbe096', "#d2fca9", "#caf2a2", "#e4fccc")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#d2fca9] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#fcf8a9', '#e3df98', "#fcf8a9", "#f5f1a6", "#fcfacc")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#fcf8a9] cursor-pointer'></div>
                </div>
                <div className='flex justify-center items-center gap-[10px]'>
                    <div onClick={() => {
                        closeDialogColor('#ffdca3', '#e3c38f', "#ffdca3", "#f5d39d", "#ffe8c4")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#ffdca3] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#ffbb8a', '#e6a87c', "#ffbb8a", "#f5b384", "#f7c8a6")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#ffbb8a] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#ffb7ad', '#e3a198', "#ffb7ad", "#f5aea4", "#fac5be")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#ffb7ad] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#ffccec', '#e6b8d4', "#ffccec", "#f2c2df", "#fae3f1")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#ffccec] cursor-pointer' ></div>
                    <div onClick={() => {
                        closeDialogColor('#f1ccff', '#d6b6e3', "#f1ccff", "#e7c4f5", "#f3e3fa")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#f1ccff] cursor-pointer'></div>
                </div>
                <div className='flex justify-center items-center gap-[10px]'>
                    <div onClick={() => {
                        closeDialogColor('#ffcccd', '#e0b4b4', "#ffcccd", "#f5c6c6", "#fae8e8")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#ffcccd] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#85b4ff', '#76a0e3', "#85b4ff", "#7eabf2", "#b0cbf5")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#85b4ff] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#d6fff5', '#bfe3da', "#d6fff5", "#cef5eb", "#ebfaf6")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#d6fff5] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#f7ffba', '#dee6a8', "#f7ffba", "#ecf5b3", "#f7fcd4")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#f7ffba] cursor-pointer'></div>
                    <div onClick={() => {
                        closeDialogColor('#f1f1f1', '#dadada', "#eaeaea", "#ececec", "#fff")
                        }} className='rounded-3xl w-[40px] h-[40px] shadow-sm bg-[#fff] cursor-pointer'></div>
                </div>
                
            </div>
        </Dialog>
        <Dialog onClose={closeFileDialog} open={openFileDialog}>
            <div className='w-[380px] h-[280px] bg-[#f1f1f1] flex flex-col justify-center items-center gap-[20px]'>
                {
                    fileLoading ? 
                    <ReactLoading type="bubbles" color="#4a6a8f" />
                    :
                    <>
                    <label onChange={(event) => {
                    setFile(event.target.files[0]);
                    setfile_name(event.target.files[0].name)
                }}>
            <input type='file' hidden/>
            <div className='w-[300px] h-[150px] rounded-lg border-dashed border-[#72b6e1] cursor-pointer hover:border-[#5593b9] border-[2px] flex flex-col justify-center items-center'>
                <CloudIcon sx={{fontSize: 70, color: "#bfd2de", "&:hover": {
      color: "#b0c6d4"
    }}}/>
                <p className='text-[#49596b]'>{file_name}</p>
            </div>
            </label>
                
                <div onClick={async() => {
                    if(file == null) return;
                    const id = uuid();
                    let myurl = await uploadFile(id);
                    props.addFile(file, id, myurl)
                    setFileLoading(false);
                    
                    setfile_name('Select File');
                    setOpenFileDialog(false);
                    }} className='h-[30px] w-[200px] rounded-sm  bg-[#4a6a8f] cursor-pointer  text-[#fff] shadow-md hover:bg-[#425c7a] items-center justify-center flex font-light'>upload</div></>
                }
            
                
            </div>
        </Dialog>
        <div className='flex items-center'>
            <SchoolIcon sx={{color: "#4a6a8f"}} onClick={() => props.setOpen(props.id, !props.open)}/>
            {
                onEdit ? 
                <input ref={itemInput} onKeyDown={handleKeyDown} value={categoryName} onChange={(e) => {setName(e.target.value)
                    setDisplayName(e.target.value) //cbecf7
                    if(untitled) setUntitled(false);
                }} style={{'--color': props.inputColor}} className={!untitled ? '!bg-[--color] outline-none border-[1.3px] border-[#000] rounded-sm h-[25px] w-[130px] px-[3px] ml-[6px]' : '!bg-[--color] outline-none border-[1.5px] border-red-500 placeholder:text-red-700 rounded-sm h-[25px] w-[130px] px-[3px] ml-[6px]'}/>
                :
                <p onClick={() => props.setOpen(props.id, !props.open)} className={!props.open ? ' flex items-center  ml-[10px] w-[130px] select-none' : ' flex items-center ml-[10px] underline w-[130px] select-none'}>{displayName}</p>
            }
        </div>
        <div className='gap-[0px] flex justify-center items-center'>

                <div onClick={() => {
                    setOpenDialog(true);
                }} style={{'--hover-color': props.buttonColors}} className={`flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:!bg-[--hover-color] hover:drop-shadow-lg`}>
                    <ColorLensIcon sx={{fontSize: "15px"}} />
                </div>

                <div style={{'--hover-color': props.buttonColors}} onClick={handleClick} className={` flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:!bg-[--hover-color] hover:drop-shadow-lg`}>
                    <MoreVertIcon sx={{fontSize: "15px"}} />
                </div>
                
                <Menu
                elevation={3}
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                  }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                TransitionComponent={Fade}
                
                sx={
                    { "& .MuiMenu-paper": 
                      { backgroundColor: props.inputColor, borderRadius: "10px", width: "110px", paddingX: "5px"}, 
                      
                    }
                  }
            >
                <MenuItem sx={{borderRadius: "5px",}} onClick={() => {
                    props.setOpen(props.id, false);
                    setOnEdit(true)
                    }} className='flex items-center gap-[10px] h-[30px]'>
                  <EditSharpIcon sx={{fontSize: '20x'}}/>
                  <p className=' font-light'>edit</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px",}} onClick={() => {
                    console.log(categoryName);
                    props.removeItem(props.id)
                }} className='flex items-center gap-[10px] h-[30px]'>
                  <DeleteIcon sx={{fontSize: '20px'}}/>
                  <p className=' font-light'>delete</p>
                </MenuItem>
                
            </Menu>
            
            
            
            <div style={{'--hover-color': props.buttonColors}} onClick={handleClicks} className={`flex justify-center items-center h-[20px] w-[20px] p-[5px] rounded-sm cursor-pointer  hover:!bg-[--hover-color] hover:drop-shadow-lg`}>
                <AddIcon sx={{fontSize: "15px"}}/>
            </div>
            <Menu
            elevation={3}
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                  }}
                anchorEl={anchorEls}
                open={opens}
                onClose={handleCloses}
                onClick={handleCloses}
                TransitionComponent={Fade}
                style={{'--color': props.inputColor}}
                sx={
                    { "& .MuiMenu-paper": 
                      { backgroundColor: props.inputColor, borderRadius: "10px", width: "140px", paddingX: "5px"}, 
                      
                    }
                  }
            >
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                    props.addItem(20)
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }} className='flex items-center gap-[10px] h-[30px]'>
                  <CreateNewFolderIcon sx={{color: "#6a8099"}}/>
                  <p className=' font-light'>Folder</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                    props.addItem(30)
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }}  className='flex items-center gap-[10px] h-[30px]'>
                <EditNoteIcon sx={{color: "#333"}}/>
                  <p className=' font-light'>Notebook</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                    props.addItem(40)
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }}  className='flex items-center gap-[10px] h-[30px]'>
                <img className='h-[18px] items-center justify-center flex' src={docsLogo}/>
                  <p className=' font-light'>Document</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                    props.addItem(50)
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }}  className='flex items-center gap-[10px] h-[30px]'>
                <LinkIcon sx={{color: "#c41a0e"}}/>
                  <p className=' font-light'>Link</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                    props.addItem(60)
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }}  className='flex items-center gap-[10px] h-[30px]'>
                <NotesIcon sx={{color: "#222"}}/>
                  <p className=' font-light'>Note</p>
                </MenuItem>
                <MenuItem sx={{borderRadius: "5px"}} onClick={() => {
                        setOpenFileDialog(true);
                        props.setOpen(props.id, true);
                        returnEdit(false);
                    }}  className='flex items-center gap-[10px] h-[30px]'>
                <CloudDownloadIcon sx={{color: "#3a6391"}}/>
                  <p className=' font-light'>File</p>
                </MenuItem>
                
            </Menu>
        </div>
    </div>
  )
}

export default ClassProjectItem