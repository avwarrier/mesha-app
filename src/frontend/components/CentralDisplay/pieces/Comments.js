import {React, useEffect, useState} from 'react'
import Comment from './subpieces/Comment';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuid } from 'uuid';
import { auth, db } from '../../../../backend/firebase'
import { collection, doc, setDoc, getDocs, collectionGroup, updateDoc, deleteDoc } from "firebase/firestore";
import './styleOther.css'

const Comments = (props) => {

    const [comments, setComments] = useState([]);

    useEffect(() => {
        setComments(props.comments);
    }, [props.comments])

    const addComment = (comment) => {
        let temp = [...comments];
        temp.unshift(comment);
        setComments(temp);
        console.log(temp);
    }

    const callCheck = async (saved) => {
        console.log('heroo')
        const userRef = doc(db, "users", props.userEmail, "openItems", props.id);
        await updateDoc(userRef, {
            comments: saved,
        });
      }

    const setComment = (id, desc) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let today = new Date();
        let date = today.getMonth()-1 + "/" + today.getDate() + "/" + today.getFullYear()
        let hour = today.getHours();
        let am = 'am';
        if(hour > 12) {
            hour -= 12;
            am = 'pm';
        } else if (hour == 0) {
            hour = 12;
        }
        let minute = '';
        if(today.getMinutes() < 10) {
            minute = '0' + today.getMinutes();
        } else {
            minute = today.getMinutes();
        }
        let time = hour + ":" + minute + am;
        let temp = [...comments];
        console.log(temp);
        for(let i = 0; i < temp.length; i++) {
            
            if(temp[i].id == id) {
                console.log('j')
                temp[i].name = desc;
                temp[i].date = date;
                temp[i].time = time;
                break;
            }
        }
        setComments(temp);
        callCheck(temp);
        console.log(temp);
    }

    const deleteComment = (comment) => {
        let temp = [...comments];
        if(comment == '') {
            for(let i = 0; i < temp.length; i++) {
                if(temp[i].name == 'default') {
                    temp.splice(i, 1);
                }
            }
        }

        console.log(temp);
        console.log(comment)
        for(let i = 0; i < temp.length; i++) {
            if(temp[i].name == comment) {
                temp.splice(i, 1);
            }
        }
        setComments(temp);
        callCheck(temp);
    }

    


  return (
    <div className='w-[200px] rounded-md flex flex-col h-[calc(100vh-100px)] bg-[#f5f5f5] items-center justify-between'>
        <div className='w-[200px] flex flex-col items-center mt-[10px]'>
            <p className='font-light text-[17px] underline'>Comments/Progress</p>
            <div className='overflow-scroll no-scrollbar h-[calc(100vh-210px)] mt-[10px] w-[100%]'>
            {
                comments.map(comment => {
                    return <Comment id={comment.id} setComment={setComment} deleteComment={deleteComment} comment={comment}/>
                })
            }
            </div>
        </div>
        <div onClick={() => {
            const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ];
            let today = new Date();
            let date = today.getMonth()-1 + "/" + today.getDate() + "/" + today.getFullYear()
            let hour = today.getHours();
            let am = 'am';
            if(hour > 12) {
                hour -= 12;
                am = 'pm';
            } else if (hour == 0) {
                hour = 12;
            }
            let minute = '';
            if(today.getMinutes() < 10) {
                minute = '0' + today.getMinutes();
            } else {
                minute = today.getMinutes();
            }
            let time = hour + ":" + minute + am;
            let id = uuid();
            addComment({
                name: 'default',
                id: id,
                date: date,
                time: time,
            })
        }} className='w-[180px] h-[40px] bg-[#4a6a8f] rounded-3xl shadow-md flex items-center justify-center cursor-pointer  hover:bg-[#3a6391] mb-[10px] hover:shadow-lg'>
            <AddIcon sx={{color: "#ffffff"}}/>
        </div>
        
    </div>
  )
}

export default Comments