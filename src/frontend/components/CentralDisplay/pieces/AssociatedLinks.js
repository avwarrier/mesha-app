import {React, useEffect, useState} from 'react'
import LinkAdd from './subpieces/LinkAdd'
import { v4 as uuid } from 'uuid';
import { auth, db } from '../../../../backend/firebase'
import { collection, doc, setDoc, getDocs, collectionGroup, updateDoc, deleteDoc } from "firebase/firestore";
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import './styleOther.css'

const AssociatedLinks = (props) => {

    const [links, setLinks] = useState([]);

    useEffect(() => {
        setLinks(props.links);
    }, [props.links])

    const callCheck = async (saved) => {
        console.log('heroo')
        const userRef = doc(db, "users", props.userEmail, "openItems", props.id);
        await updateDoc(userRef, {
            links: saved,
        });
      }

    const addLink = () => {
        let temp = [...links];
        let myid = uuid();
        temp.push({
            name: 'default',
            id: myid,
        })
        setLinks(temp);
        
    }

    const setLink = (id, link) => {
        let temp = [...links];
        for(let i = 0; i < temp.length; i++) {
            
            if(temp[i].id == id) {

                temp[i].name = link;
                break;
            }
        }
        setLinks(temp);
        callCheck(temp);
        console.log(temp);
        
    }
    

    const deleteLink = (id) => {
        let temp = [...links];
        for(let i = 0; i < temp.length; i++) {
            if(temp[i].id == id) {
                temp.splice(i, 1);
                break;
            }
        }
        console.log(temp);
        setLinks(temp);
        
        callCheck(temp);
    }

  return (
    <div className='no-scrollbar  mt-[1%] gap-[0px] h-[calc(100%-280px)]  m-auto overflow-scroll '>
        {
            links.map(link => {
                console.log(link);
                return <LinkAdd id={link.id} link={link} addLink={setLink} deleteLink={deleteLink}/>
            })
        }
            {
            
            <div onClick={() => addLink()} className='bg-[#ffffff] w-[10%] h-[30px] items-center px-[15px] rounded-md cursor-pointer border-[1.5px] flex  justify-center ml-[5px] mt-[2px] hover:border-[#c5c5c5]'>
                <AddLinkOutlinedIcon  sx={{fontSize: '22px', color: "#3a4754"}}/>
        
            </div>
            
            }
    </div>
  )
}

export default AssociatedLinks