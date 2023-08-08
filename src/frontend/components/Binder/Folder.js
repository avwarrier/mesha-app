import {React, useEffect, useState, forwardRef, useImperativeHandle, useRef} from 'react'
import FolderItem from './BinderProps/FolderItem'
import Notebook from './Notebook';
import Note from './BinderProps/DocItems/Note';
import Document from './BinderProps/DocItems/Document';
import Link from './BinderProps/DocItems/Link';
import { v4 as uuid } from 'uuid';
import { auth, db } from '../../../backend/firebase'
import { collection, doc, setDoc, getDocs, collectionGroup, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import File from './BinderProps/DocItems/File'

const Folder = forwardRef((props, ref) => {

    
    const [items, setItems] = useState([]);
    

    const childRef = useRef(null);

    useImperativeHandle(ref, () => ({
        childFunction1(id) {
            if(id != props.id) return;
            let temp = [...items]
            for(let i = 0; i < items.length; i++) {
                if(temp[i].num >= 40) {
                    props.setCentralInfo('yee', 'yee');
                    props.setDocOpen('none');
                    delDoc(temp[i].id, temp[i].num);
                    removeDue(temp[i].id);
                } else {
                    childRef.current.childFunction1(temp[i].id);
                }
            }
        },
      }));
    
    useEffect(() => {
        setItems(props.components);
        
        //checkOpen();
    }, [props.components])


    useEffect(() => {
        let saved = localStorage.getItem("structId");
        if(saved != null) {
            saved = saved.substring(1, saved.length-1)
        }
        let temp = [...props.components];
        for(let i = 0; i < temp.length; i++) {
            if(temp[i].num >= 40) {
                if(temp[i].id != props.docOpen) {
                    if(temp[i].id != saved) {
                        temp[i].open = false;
                    }
                    
                }
            }
        }
        setItems(temp);
        props.setComponents(props.id, temp);
    }, [props.docOpen])

    const addFile = async (file, id, myurl) => {

        let temp = addItem(70, file, file.name, id, myurl);
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ];
            let today = new Date();
            let date = monthNames[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear()
            let hour = today.getHours();
            let am = 'am';
            if(hour > 12) {
                am = 'pm';
                hour -= 12;
            } else if (hour == 0) {
                hour = 12;
            }
            let minute = '';
            if(today.getMinutes() < 10) {
                minute = '0' + today.getMinutes();
            } else {
                minute = today.getMinutes();
            }
            let time = hour + ":" + minute + "" + am;
            const userRef = doc(db, "users", props.userEmail, "openItems", id);
        await setDoc(userRef, {
            name: file.name,
            date: date,
            time: time,
            links: [],
            comments: [],
            description: '',
            type: 'file',
            open: true,
            id: id,
            dueDate: null
          });
          
          
        switchOpen(id, 'file');
        props.setCentralInfo(id, file.name)
        localStorage.setItem("structId", JSON.stringify(id));
        props.setDocOpen(id);
        console.log(temp);
        props.setComponents(props.id, temp);
        
    }
    

    const addItem = (num, file, fileName, fileId, myurl) => {
        let aaa;
        let arr = [...items];
        if(items.length == 0) {
            const myId = uuid();
            if(num == 40) {
                arr.push({
                    type: 'document',
                    name: 'default',
                    num: num,
                    open: false,
                    id: myId
                })
                console.log(arr);
                setItems(arr);
            } else if(num == 20) {
                setItems([{
                    type: 'folder',
                    name: 'default',
                    components: [],
                    num: num,
                    open: false,
                    id: myId
                }]);
            } else if (num == 30) {
                setItems([{
                    type: 'notebook',
                    name: 'default',
                    components: [],
                    num: num,
                    open: false,
                    id: myId

                }]);
            } else if (num == 50) {
                const myId = uuid();
                setItems([{
                    type: 'link',
                    name: 'default',
                    num: num,
                    open: false,
                    id: myId
                }]);
            } else if (num == 60) {
                const myId = uuid();
                setItems([{
                    type: 'note',
                    name: 'default',
                    num: num,
                    open: false,
                    id: myId
                }]);
            } else {
                setItems([{
                    type: 'file',
                    name: fileName,
                    num: num,
                    open: true,
                    id: fileId,
                    fileUrl: myurl
                }]);
                arr.push({
                    type: 'file',
                    name: fileName,
                    num: num,
                    open: true,
                    id: fileId,
                    fileUrl: myurl
                })
                return arr;

            }

            console.log(items);
            return;
    
        }
        if(items.length == 1) {
            let temp = [...items];
            if(num == 40) {
                const myId = uuid();
                if(num < items[0].num) {
                    temp.unshift({
                        type: 'document',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId
                        
                    })
                } else {
                    temp.push({
                        type: 'document',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    })
                }
            } else if(num == 20) {
                const myId = uuid();
                if(num < items[0].num) {
                    temp.unshift({
                        type: 'folder',
                        name: 'default',
                        components: [],
                    num: num,
                    open: false,
                    id: myId

                    })
                    console.log(temp);
                } else {
                    temp.push({
                        type: 'folder',
                        name: 'default',
                        components: [],
                    num: num,
                    open: false,
                    id: myId

                    })
                }
            } else if (num == 30) {
                const myId = uuid();
                if(num < items[0].num) {
                    temp.unshift({
                        type: 'notebook',
                        name: 'default',
                        components: [],
                    num: num,
                    open: false

                    })
                } else {
                    temp.push({
                        type: 'notebook',
                        name: 'default',
                        components: [],
                    num: num,
                    open: false

                    })
                }
            } else if (num == 50) {
                const myId = uuid();
                if(num < items[0].num) {
                    temp.unshift({
                        type: 'link',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    })
                } else {
                    temp.push({
                        type: 'link',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    })
                }
            } else if (num == 60) {
                const myId = uuid();
                if(num < items[0].num) {
                    temp.unshift({
                        type: 'note',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    })
                } else {
                    temp.push({
                        type: 'note',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    })
                }
            } else {
                const myId = uuid();
                if(num < items[0].num) {
                    temp.unshift({
                        type: 'file',
                    name: fileName,
                    num: num,
                    open: true,
                    id: fileId,
                    fileUrl: myurl

                    })
                } else {
                    temp.push({
                        type: 'file',
                    name: fileName,
                    num: num,
                    open: true,
                    id: fileId,
                    fileUrl: myurl

                    })
                }
            }

            console.log("yee yee yee " + temp);
            setItems(temp);
            if(num == 70) return temp;
            return;
    
        }
        console.log("starting for")
        for(let i = 0; i < arr.length; i++) {
            if(num < arr[i].num) {
                const myId = uuid();
                if(num == 40) {
                    arr.splice(i, 0, {
                        type: 'document',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    });
                    setItems(arr);
                    return;
                } else if(num == 20) {
                    arr.splice(i, 0, {
                        type: 'folder',
                        name: 'default',
                        components: [],
                    num: num,
                    open: false,
                    id: myId

                    });
                    setItems(arr);
                    return;
                } else if (num == 30) {
                    arr.splice(i, 0, {
                        type: 'notebook',
                        name: 'default',
                        components: [],
                    num: num,
                    open: false,
                    id: myId

                    });
                    setItems(arr);
                    return;
                } else if (num == 50) {
                    arr.splice(i, 0, {
                        type: 'link',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    });
                    setItems(arr);
                    return;
                } else if (num == 60) {
                    arr.splice(i, 0, {
                        type: 'note',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    });
                    setItems(arr);
                    return;
                } else {
                    arr.splice(i, 0, {
                        type: 'file',
                    name: fileName,
                    num: num,
                    open: true,
                    id: fileId,
                    fileUrl: myurl

                    });
                    setItems(arr);
                    return arr;
                }
                
            } else if(i == arr.length - 1) {
                const myId = uuid();
                if(num == 40) {
                    arr.push({
                        type: 'document',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    });
                    setItems(arr);
                    return;
                } else if(num == 20) {
                    arr.push({
                        type: 'folder',
                        name: 'default',
                        components: [],
                    num: num,
                    open: false,
                    id: myId

                    });
                    setItems(arr);
                    return;
                } else if (num == 30) {
                    arr.push({
                        type: 'notebook',
                        name: 'default',
                        components: [],
                    num: num,
                    open: false,
                    id: myId

                    });
                    setItems(arr);
                    return;
                } else if (num == 50) {
                    arr.push({
                        type: 'link',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    });
                    setItems(arr);
                    return;
                } else if (num == 60) {
                    arr.push({
                        type: 'note',
                        name: 'default',
                    num: num,
                    open: false,
                    id: myId

                    });
                    setItems(arr);
                    return;
                } else {
                    arr.splice(i, 0, {
                        type: 'file',
                    name: fileName,
                    num: num,
                    open: true,
                    id: fileId,
                    fileUrl: myurl
                    });
                    setItems(arr);
                    return arr;
                }
            }
        }
        
        
        console.log(arr);
        console.log(items);
    }

    

    const updateDB = async(id, object) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ];
            let today = new Date();
            let date = monthNames[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear()
            let hour = today.getHours();
            let am = 'am';
            if(hour > 12) {
                am = 'pm';
                hour -= 12;
            } else if (hour == 0) {
                hour = 12;
            }
            let minute = '';
            if(today.getMinutes() < 10) {
                minute = '0' + today.getMinutes();
            } else {
                minute = today.getMinutes();
            }
            let time = hour + ":" + minute + "" + am;
        const userRef = doc(db, "users", props.userEmail, "openItems", id);
        await setDoc(userRef, {
            name: object.name,
            date: date,
            time: time,
            links: [],
            comments: [],
            description: '',
            type: object.type,
            open: true,
            id: id,
            dueDate: null
          });
          if(object.type == 'note') {
            const noteRef = doc(db, "users", props.userEmail, "openNotes", id);
        await setDoc(noteRef, {
            name: object.name,
            open: true,
            parentName: props.name,
            parentType: 'class'
          });
          }
          switchOpen(id, object.type);
    }

    const switchOpen = async (id, type) => {
        const colRef = collection(db, "users", props.userEmail, "openItems");
            const docsSnap = await getDocs(colRef);
            docsSnap.forEach(async dox => {
                if(id != dox.data().id) {
                    const userRef = doc(db, "users", props.userEmail, "openItems", dox.data().id);
                    await updateDoc(userRef, {
                        open: false,
                    });
                }
            })
            if(type == 60 || type == 'note') {
                const anothaRef = collection(db, "users", props.userEmail, "openNotes");
            const snape = await getDocs(anothaRef);
            snape.forEach(async dox => {
                if(id != dox.id) {
                    const userRef = doc(db, "users", props.userEmail, "openNotes", dox.id);
                    await updateDoc(userRef, {
                        open: false,
                    });
                }
            })
            }

            //props.setComponents(props.id, items);
            props.setNoteChange(id);
    }

    
    const changeName = async (paramName, id, type) => {
        const userRef = doc(db, "users", props.userEmail, "openItems", id);
        await updateDoc(userRef, {
            name: paramName,
          });
          if(type == 60) {
            const noteRef = doc(db, "users", props.userEmail, "openNotes", id);
        await updateDoc(noteRef, {
            name: paramName
          });
          }
    }

    const changeOpen = async (id, type) => {
        const userRef = doc(db, "users", props.userEmail, "openItems", id);
        await updateDoc(userRef, {
            open: true,
          });
          if(type == 60) {
            const noteRef = doc(db, "users", props.userEmail, "openNotes", id);
        await updateDoc(noteRef, {
            open: true
          });
          }
          switchOpen(id, type);
    }

    const updateDue = async(name, id) => {
        const dueRef = doc(db, "users", props.userEmail, "dueDateCollection", id);
        const docSnap = await getDoc(dueRef);
        if (docSnap.exists()) {
            await updateDoc(dueRef, {
                name: name
            })
            props.updateDues(!props.dues);
          } else {
            return;
          }
          
        
    }

    const setName = (id, prevName, name) => {
        let temp = [...items];
        for(let i = 0; i < temp.length; i++) {
            if(temp[i].id == id) {
                temp[i].name = name;
                if(temp[i].num >= 40) {
                    if(prevName == 'default') {
                        updateDB(temp[i].id, temp[i]);
                        props.setCentralInfo(temp[i].id, temp[i].name)
                        localStorage.setItem("structId", JSON.stringify(temp[i].id));
                        props.setDocOpen(temp[i].id);
                        
                    } else {
                        changeName(temp[i].name, temp[i].id, temp[i].num);
                        updateDue(temp[i].name, temp[i].id)
                        props.setCentralInfo(temp[i].id, temp[i].name);
                        localStorage.setItem("structId", JSON.stringify(temp[i].id));
                        props.setDocOpen(temp[i].id);
                        switchOpen(temp[i].id, temp[i].num);
                    }
                    
                }
            }
        }
        setItems(temp);
        props.setComponents(props.id, items);
    }

    const setComponents = (id, comps) => {
        let temp = [...items];
        for(let i = 0; i < items.length; i++) {
            if(temp[i].id == id) {
                temp[i].components = comps;
            }
        }
        setItems(temp);
        props.setComponents(props.id, items);
    }

    const setOgOpen = (id, open) => {
        let temp = [...items];
        
        for(let i = 0; i < items.length; i++) {
            if(temp[i].id == id) {
                temp[i].open = open;
            }
        }
        console.log(temp);
        setItems(temp);
        props.setComponents(props.id, items);
    }

    const setPropOpen = (id, open) => {
        let temp = [...items];
        for(let j = 0; j < items.length; j++) {
            if(temp[j].type == 'document' || temp[j].type == 'link' || temp[j].type == 'note' || temp[j].type == 'file') {
                if(temp[j].id == id && temp[j].open == true) {
                    return;
                }
                if(temp[j].open == true) {
                    temp[j].open = false;
                }
            }
        }
        for(let i = 0; i < items.length; i++) {
            if(temp[i].id == id) {
                temp[i].open = open;
                changeOpen(temp[i].id, temp[i].num)
                props.setCentralInfo(id, temp[i].name);
                localStorage.setItem("structId", JSON.stringify(id));
                props.setDocOpen(id);
            }
        }
        console.log(temp);
        setItems(temp);
        props.setComponents(props.id, items);
    }


    const removeItem = (id) => {
        let temp = [...items];
        for(let i = 0; i < items.length; i++) {
            if(temp[i].id == id) {
                childRef.current.childFunction1(id);
                temp.splice(i, 1);
                break;
            }
        }
        setItems(temp);
        console.log(temp);
        props.setComponents(props.id, temp);
    }

    const delDoc = async (id, type) => {
        await deleteDoc(doc(db, "users", props.userEmail, "openItems", id));
        if(type == 60) {
            await deleteDoc(doc(db, "users", props.userEmail, "openNotes", id))
          }
    }
    
    const removeDue = async(id) => {
        const dueRef = doc(db, "users", props.userEmail, "dueDateCollection", id);
        await deleteDoc(dueRef);
        props.updateDues(!props.dues);
    }

    const removeNoteOpen = async(id) => {
        const anothaRef = collection(db, "users", props.userEmail, "openNotes");
            const snape = await getDocs(anothaRef);
            snape.forEach(async dox => {
                    const userRef = doc(db, "users", props.userEmail, "openNotes", dox.id);
                    if(dox.data().open == true)
                    await updateDoc(userRef, {
                        open: false,
                    });
                
            })
    }

    const removeSubItem = (id) => {
        let temp = [...items];
        for(let i = 0; i < items.length; i++) {
            if(temp[i].id == id) {
                if(temp[i].name != 'default') {
                    console.log(props.centralInfo + "   " + id)
                    if(props.centralInfo.id == id) {
                    props.setCentralInfo('yee', 'yee');
                props.setDocOpen('none');
                    }
                }
                let numz = temp[i].num
                temp.splice(i, 1);
                
                delDoc(id, numz);
                //if(numz == 60) removeNoteOpen(id);
                removeDue(id);
                break;
            }
        }
        setItems(temp);
        console.log(temp);
        props.setComponents(props.id, temp);
    }


  return (
    <div className='flex flex-col'>
        <FolderItem userEmail={props.userEmail} addFile={addFile} inputColor={props.inputColor} dropColor={props.dropColor} selectionColor={props.selectionColor} id={props.id} open={props.open} setOpen={props.setPropOpen} addItem={addItem} removeItem={props.removeItem} name={props.name} setName={props.setName}/>
        {props.open && 
            <div className={items.length > 0 ? 'ml-[20px] my-[0px]' : "ml-[20px]"}>
                {
                    items.map((item) => {
                        if (item.type === 'folder') {
                            return <Folder centralInfo={props.centralInfo} inputColor={props.inputColor} dropColor={props.dropColor} selectionColor={props.selectionColor} setNoteChange={props.setNoteChange} ref={childRef} dues={props.dues} updateDues={props.updateDues} chan={props.chan} docOpen={props.docOpen} setDocOpen={props.setDocOpen} userEmail={props.userEmail} setPropOpen={setOgOpen} id={item.id} open={item.open} components={item.components} setComponents={setComponents} removeItem={removeItem} setName={setName} name={item.name} setCentralInfo={props.setCentralInfo}/>
                        } else if (item.type === 'notebook') {
                            return <Notebook id={item.id} setNoteChange={props.setNoteChange} centralInfo={props.centralInfo} inputColor={props.inputColor} dropColor={props.dropColor} selectionColor={props.selectionColor} ref={childRef} dues={props.dues} updateDues={props.updateDues} chan={props.chan} docOpen={props.docOpen} setDocOpen={props.setDocOpen} userEmail={props.userEmail} setPropOpen={setOgOpen} open={item.open} components={item.components} setComponents={setComponents} removeItem={removeItem} setName={setName} name={item.name} setCentralInfo={props.setCentralInfo}/>
                        } else if (item.type === 'document') {
                            return <Document inputColor={props.inputColor} dropColor={props.dropColor} selectionColor={props.selectionColor} setPropOpen={setPropOpen} open={item.open} removeItem={removeSubItem} id={item.id} setName={setName} name={item.name}/>
                        } else if (item.type === 'link') {
                            return <Link inputColor={props.inputColor} dropColor={props.dropColor} selectionColor={props.selectionColor} setPropOpen={setPropOpen} open={item.open} removeItem={removeSubItem} id={item.id} setName={setName} name={item.name}/>
                        } else if (item.type == 'note') {
                            return <Note inputColor={props.inputColor} dropColor={props.dropColor} selectionColor={props.selectionColor} setPropOpen={setPropOpen} open={item.open} removeItem={removeSubItem} id={item.id} setName={setName} name={item.name}/>
                        } else {
                            return <File fileUrl={item.fileUrl} inputColor={props.inputColor} dropColor={props.dropColor} selectionColor={props.selectionColor} setPropOpen={setPropOpen} open={item.open} removeItem={removeSubItem} id={item.id} setName={setName} name={item.name}/>
                        }
                    })
                }
            </div>  
        }
    </div>
  )
})

export default Folder