import {React, useState, useEffect, useRef} from 'react'
import Tag from './pieces/Tag'
import AssociatedLinks from './pieces/AssociatedLinks';
import Description from './pieces/Description';
import Comments from './pieces/Comments';
import "quill/dist/quill.snow.css"
import Quill from "quill"
import { auth, db } from '../../../backend/firebase'
import { collection, doc, setDoc, getDocs, collectionGroup, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import NotificationsPausedOutlinedIcon from '@mui/icons-material/NotificationsPausedOutlined';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import NoteScreen from './pieces/NoteScreen';
import Skeleton from '@mui/material/Skeleton';



function ButtonField(props) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <div
      className='font-light cursor-pointer rounded-md w-[50px] flex items-center justify-center h-[30px]'
      id={id}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}
    >
      {label ?? 'Pick a date'}
    </div>
  );
}

function ButtonDatePicker(props) {
  const [open, setOpen] = useState(false);

  return (
    <MobileDateTimePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}

const CentralDisplay = (props) => {
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [links, setLinks] = useState([]);
  const [comments, setComments] = useState([]);
  

  

  const setDueDate = async(newValue) => {
    console.log(newValue);
    newValue = Object.assign({}, newValue);
    let hour = newValue.$H;
    let am = 'am'
    let minute = newValue.$m;
    if(hour >= 12) {
      hour -= 12;
      am = 'pm'
    } else if(hour == 0) {
      hour = 12;
    }
    if(minute < 10) {
      minute = minute.toString();
      minute = '0' + minute;
    }
    let val = {
      date: `${newValue.$M+1}/${newValue.$D}/${newValue.$y.toString().substring(2)}`,
      time: `${hour}:${minute}${am}`
    }
    const userRef = doc(db, "users", props.userEmail, "openItems", props.centralInfo.id);
        await updateDoc(userRef, {
            dueDate: val,
        });
    
    setValue(val)
    const dueRef = doc(db, "users", props.userEmail, "dueDateCollection", props.centralInfo.id);
        await setDoc(dueRef, {
            dateTime: val,
            type: type,
            name: name
        });
        props.updateDues(!props.dues);
  }

  const switchChange = async(event) => {
    setOnDue(event.target.checked);
    const userRef = doc(db, "users", props.userEmail, "openItems", props.centralInfo.id);
    if(event.target.checked == false) {
      await updateDoc(userRef, {
        dueDate: null,
    });
    }
    setValue(null);
    const dueRef = doc(db, "users", props.userEmail, "dueDateCollection", props.centralInfo.id);
        await deleteDoc(dueRef);
        props.updateDues(!props.dues);
  }

  const IOSSwitch = styled((props) => (
    <Switch checked={onDue} onChange={switchChange} focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 36,
    height: 20,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#a2b7ce',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#839ab5' : '#839ab5',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 16,
      height: 16,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkOpen = async () => {
      if(props.centralInfo.id == 'yee') {
        setType('blank');
      } else {
        console.log(props.centralInfo.id, "  ", props.userEmail)
        //setLoading(true);
        const docRef = doc(db, "users", props.userEmail, "openItems", props.centralInfo.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setType(docSnap.data().type);
          if(docSnap.data().type == 'note') {
            setName(docSnap.data().name);
          } else {
            setName(props.centralInfo.name);
          }
          setNotes(docSnap.data().description);
          setDate(docSnap.data().date);
          setTime(docSnap.data().time);
          setLinks(docSnap.data().links);
          setComments(docSnap.data().comments);
          setValue(docSnap.data().dueDate)
          if(docSnap.data().dueDate == null) {
            setOnDue(false);
          } else {
            setOnDue(true);
          }
          localStorage.setItem("id", JSON.stringify(props.centralInfo.id));
          localStorage.setItem("name", JSON.stringify(props.centralInfo.name));
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
        //setLoading(false);
      }
      
      
  }
  
  checkOpen();
  }, [props.centralInfo, props.dueChange])

  const handleEnter = async(event) => {
    if (event.key === 'Enter') {
      const userRef = doc(db, "users", props.userEmail, "openItems", props.centralInfo.id);
        await updateDoc(userRef, {
            name: name
        });
        props.setChan({
          id: props.centralInfo.id,
          name: name
        });
      
  }
  }

  

  

  const [value, setValue] = useState(null);
  const [onDue, setOnDue] = useState(false);


  return (
    loading ? 
      <div className='bg-[#ffffff] h-[80vh] w-[680px] rounded-md flex'>
      <div className='h-[100%] w-[70%] flex flex-col items-center py-[20px]'>
        <div className='flex  w-[90%] h-[100px] items-center justify-between'>
        <div className='w-[220px]  h-[70%] rounded-lg flex items-center justify-center gap-[10px]'>
        <Skeleton sx={{bgcolor: "#f5f5f5"}} variant="circular" width={32} height={32} />
              <Skeleton sx={{marginLeft: "0px", bgcolor: "#f5f5f5"}} variant="rounded" width={110} height="25px" />
        </div>
          <div className='flex flex-col mt-[0px] '>
          <div className={'flex items-center justify-center gap-[10px] '}>
          <div className='flex flex-col justify-center items-end pt-[10px] h-[100px] mr-[20px] gap-[2px]'>
            <Skeleton sx={{bgcolor: "#f5f5f5"}} variant="rounded" width={80} height="20px" />
            <Skeleton sx={{bgcolor: "#f5f5f5"}} variant="rounded" width={40} height="20px" />
          </div>
          </div>
          
          </div>
        </div>
        <div className='h-[35%] w-[85%] ml-[30px] mt-[1%] flex flex-col gap-[5px] overflow-auto'>
          <Skeleton sx={{bgcolor: "#f5f5f5"}} variant="rounded" width={300} height="20px" />
          <Skeleton sx={{bgcolor: "#f5f5f5"}} variant="rounded" width={250} height="20px" />
          <Skeleton sx={{marginTop: "5px", bgcolor: "#f5f5f5"}} variant="rounded" width={300} height="20px" />
        </div>
          <Skeleton sx={{bgcolor: "#f5f5f5", width: "400px", height: "43vh", marginTop: "37vh", position: "absolute"}} />
      </div>
      <div className=' w-[200px] h-[100%] flex items-center justify-center mr-[10px]'>
        <Skeleton sx={{bgcolor: "#f5f5f5", width: "200px", height: "125vh", marginBottom: "8vh"}} />
      </div>
  </div>
    :
    type == 'note' ?
        <NoteScreen setChan={props.setChan} userEmail={props.userEmail} id={props.centralInfo.id} name={name} handleEnter={handleEnter} setName={setName} />
    :
      type == 'blank' ?
        <div className='bg-[#ffffff] h-[calc(100vh-70px)] w-[680px] rounded-md flex justify-center items-center'>
          <div className='flex flex-col justify-center items-center'>
            <NotificationsPausedOutlinedIcon sx={{color: "#777", fontSize: "40px"}}/>
            <p className='text-[25px] font-light text-[#888]'>no items selected...</p>
          </div>
      </div> 
      :
        <div className='bg-[#ffffff] h-[calc(100vh-70px)] w-[680px] rounded-md flex overflow-scroll no-scrollbar'>
          <div className='h-[100%] w-[70%] flex-col items-center '>
            <div className='flex m-auto w-[90%] h-[100px] items-center justify-between'>
              <Tag date={date} time={time} type={type} name={name}/>
              <div className='flex flex-col mt-[0px] '>
              <div className={'flex items-center justify-center gap-[10px] '}>
              <div className=''>
              {
                onDue ?
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ButtonDatePicker
                  label={<div className=''>{
                    value == null ? <p className=' text-[15px] border-[1.5px] border-[#e6e6e6] w-[80px] h-[30px] rounded-md flex items-center justify-center hover:border-[#cacaca] mr-[20px]'>pick date</p>
                    :
                    <p className='mt-[20px] font-normal text-[15px] '>{value.date}</p>
                  }
                      {
                        value != null &&
                        <p className='text-[14px] ml-[5px]'>{`${
                          value.time
                        }`}</p>
                      }</div>}
                  value={value}
                  onChange={(newValue) => setDueDate(newValue)}
                />
              </LocalizationProvider>
              :
              <div className='font-light border-[1.5px] border-[#e6e6e6] rounded-md w-[50px] flex items-center justify-center h-[30px] text-[15px]'>
                due?
              </div>
              }
              </div>
                <IOSSwitch />
              </div>
              
              </div>
            </div>

            
            <AssociatedLinks userEmail={props.userEmail} id={props.centralInfo.id} links={links} setLinks={setLinks}/>
            
            <div className='mt-[6px] w-[100%] mx-auto flex items-center justify-center'>
            <Description type={type} notes={notes} setNotes={setNotes} userEmail={props.userEmail} id={props.centralInfo.id}/></div>
          </div>
          <div className=' w-[200px]  mt-[10px] flex items-center justify-center mr-[10px]'>
            <Comments id={props.centralInfo.id} userEmail={props.userEmail} comments={comments} setComments={setComments}/>
          </div>
      </div>
  )
}

export default CentralDisplay