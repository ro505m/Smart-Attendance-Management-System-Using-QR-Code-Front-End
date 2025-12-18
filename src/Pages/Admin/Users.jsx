import { Assigned, getAllInstructors, getAllStudents, subject, usersURL } from "@/Api/Api";
import { Axios } from "@/Api/AxiosCreate";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty"
import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from 'cookie-universal';
import { Spinner } from "@/Components/ui/spinner";


export default function Users(){
    const [users, setUsers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [path, setPath] = useState(localStorage.getItem("path"));
    const navigate = useNavigate();
    const cookie = new Cookie();
    if (!path) {
        localStorage.setItem("path", 1)
    }
    useEffect(() => {
        if (path) {
            if (path == 1) {
                handleGetStudents();
            } else if(path == 2){
                handleGetInstructors();
            } else if(path == 3){
                handleGetSubjects()
            }
        }
    }, [path])

    async function handleGetSubjects() {
            setLoading(true)
            setUsers([])
            setMessage("")
            await Axios.get(subject)
            .then(res=>{
                setSubjects(res.data)
                setLoading(false)
                if(res.data == '')
                    setMessage("No subjects available");
            })
            .catch((err)=>{
                try {
                    if (err.response) {
                        setMessage(err.response.data.message)
                    } else{
                        setMessage(err.message)
                    }
                } catch (error) {
                    console.log(error)
                }
                if (message.includes("Network Error")) {
                    setLoading(false)
                }
            }
            )
            .finally(()=>setLoading(false))
    }

    async function handleGetStudents() {
            setUsers([])
            setLoading(true)
            setMessage("")
            await Axios.get(getAllStudents)
            .then(res=>{
                setUsers(res.data)
                setLoading(false)
                if(res.data == '')
                    setMessage("No students available");
            })
            .catch((err)=>{
                try {
                    if (err.response) {
                        if(err.response.data.message !== "users is not found"){
                            setMessage(err.response.data.message)
                        } else{
                            setMessage("No students available");
                        }
                    } else{
                        setMessage(err.message)
                    }
                } catch (error) {
                    console.log(error)
                }
                if (message.includes("Network Error")) {
                    setLoading(false)
                }
            }
            )
            .finally(()=>setLoading(false))
    }

    async function handleGetInstructors() {
            setUsers([])
            setLoading(true)
            setMessage("")
            await Axios.get(getAllInstructors)
            .then(res=>{
                setUsers(res.data)
                setLoading(false)
                if(res.data == '')
                    setMessage("No instructors available");
            })
            .catch((err)=>{
                try {
                    if (err.response) {
                        if(err.response.data.message !== "users is not found"){
                            setMessage(err.response.data.message)
                        } else{
                            setMessage("No instructors available");
                        }
                    } else{
                        setMessage(err.message)
                    }
                } catch (error) {
                    console.log(error)
                }
                if (message.includes("Network Error")) {
                    setLoading(false)
                }
            }
            )
            .finally(()=>setLoading(false))
    }

    async function handleDelete(userId){
        setSubjects([])
        setMessage("")
        await Axios.delete(`${usersURL}/${userId}`)
        .then(()=>{
            if (path == 1) {
                handleGetStudents();
            } else if(path == 2){
                handleGetInstructors();
            }
            }
        )
        .catch((err)=>{
            try {
                if (err.response) {
                    setMessage(err.response.data.message)
                } else{
                setMessage(err.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        )
    }

    async function handleDeleteSubject(subjectId){
        setUsers([])
        setMessage("")
        await Axios.delete(`${subject}/${subjectId}`)
        .then(()=>handleGetSubjects())
        .catch((err)=>{
            try {
                if (err.response) {
                    setMessage(err.response.data.message)
                } else{
                setMessage(err.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        )
    }

    async function handleAssigned(){
        setMessage("")
        await Axios.patch(`${subject}/${Assigned}`)
        .then(res=>setMessage(res.data.message))
        .catch((err)=>{
            try {
                if (err.response) {
                    setMessage(err.response.data.message)
                } else{
                setMessage(err.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        )
    }

    function handleLogout(){
        cookie.remove("userId");
        cookie.remove("userRole");
        cookie.remove("accessToken");
        localStorage.removeItem("path")
        window.location.pathname="/login";
    }


    return (
            <div className="flex justify-center items-center flex-col w-full">
                <div className="w-full h-fit mb-4">
                <header className="w-full h-4 mb-5">
                    <nav className="flex justify-between items-center p-1.5 gap-5">
                        <div className="flex justify-items-start items-center p-1.5 gap-5">
                        <h1 className="scroll-m-20 text-center font-extrabold tracking-tight text-balance">ATTENDIFY</h1>
                        <Button variant="link" className="text-white cursor-pointer" 
                        onClick={()=>{
                            handleGetStudents()
                            localStorage.setItem("path", 1)
                            setPath(localStorage.getItem("path"))
                        }}>Students</Button>
                        <Button variant="link" className="text-white cursor-pointer" 
                        onClick={()=>{
                            handleGetInstructors()
                            localStorage.setItem("path", 2)
                            setPath(localStorage.getItem("path"))
                        }}
                        >Instructors</Button>
                        <Button variant="link" className="text-white cursor-pointer" 
                        onClick={()=>{
                            handleGetSubjects()
                            localStorage.setItem("path", 3)
                            setPath(localStorage.getItem("path"))
                        }}
                        >Subjects</Button>
                        </div>
                        <Button variant="destructive" className="cursor-pointer" onClick={handleLogout}>Logout</Button>
                    </nav>
                </header>
                </div>
                {
                (users.length !== 0)
                ?
                <div className="w-full h-fit flex p-2 flex-col">
                    <Table className="min-w-full">
                        <TableCaption className="text-white">{message}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white">No.</TableHead>
                                <TableHead className="text-white">Name</TableHead>
                                <TableHead className="text-white">Email</TableHead>
                                {
                                (path == 2) ? null :
                                <>
                                <TableHead className="text-white">Stage</TableHead>
                                <TableHead className="text-white">Department</TableHead>
                                </>
                                }
                                <TableHead className="text-white">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                            users.map((item, index) => (
                            <TableRow key={item._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                {
                                (path == 2) ? null :
                                <>
                                <TableCell>{item.stage}</TableCell>
                                <TableCell>{item.department}</TableCell>
                                </>
                                }
                                <TableCell className="flex gap-2">
                                <Button 
                                className="bg-emerald-500 hover:bg-emerald-700 font-medium cursor-pointer" 
                                onClick={()=>navigate(`/admin/users/${item._id}`)}
                                >Update</Button>
                                <Button 
                                className="bg-destructive text-white hover:bg-destructive/90 font-medium cursor-pointer"
                                onClick={()=>handleDelete(item._id)}
                                >Delete</Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                        </TableFooter>
                    </Table>
                    <div className="flex justify-center items-center gap-1 flex-col m-3">
                        <Button className="w-[20%] bg-emerald-500 hover:bg-emerald-700 text-white cursor-pointer" variant="secondary" onClick={()=>navigate("/admin/addUser")}>Add User</Button>
                    </div>
                </div>
                : (subjects.length !== 0) ?
                <div className="w-full h-fit flex p-2 flex-col">
                    <Table className="min-w-full">
                        <TableCaption className="text-white">{message}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white">No.</TableHead>
                                <TableHead className="text-white">Name</TableHead>
                                <TableHead className="text-white">Instructor</TableHead>
                                <TableHead className="text-white">Stage</TableHead>
                                <TableHead className="text-white">Department</TableHead>
                                <TableHead className="text-white">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                            subjects.map((item, index) => (
                            <TableRow key={item._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.instructor?.name}</TableCell>
                                <TableCell>{item.stage}</TableCell>
                                <TableCell>{item.department}</TableCell>
                                <TableCell className="flex gap-2">
                                <Button 
                                className="bg-destructive text-white hover:bg-destructive/90 font-medium cursor-pointer"
                                onClick={()=>handleDeleteSubject(item._id)}
                                >Delete</Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                        </TableFooter>
                    </Table>
                    <div className="flex justify-center items-center gap-1 flex-col m-3">
                        <Button className="w-[20%] bg-emerald-500 hover:bg-emerald-700 text-white cursor-pointer" variant="secondary" onClick={()=>navigate("/admin/subjects")}>Add Subject</Button>
                        <Button className="w-[20%] bg-emerald-500 hover:bg-emerald-700 text-white cursor-pointer" variant="secondary" onClick={()=>handleAssigned()}>Assigned Subject</Button>
                    </div>
                </div>
                : loading ?
                <div className="w-full h-[90vh] flex justify-center items-center">
                    <Spinner className="size-8"/>
                </div>
                : message.includes("Network Error") ?
                <div className="w-full h-[90vh] text-white flex justify-center items-center">
                <Empty>
                <EmptyHeader>
                    <EmptyTitle>521 - {message}</EmptyTitle>
                    <EmptyDescription>
                        Unable to connect to the server. Please check your internet connection and try again.
                    </EmptyDescription>
                </EmptyHeader>
                </Empty>
                </div>
                :
                <div className="w-full h-[90vh] text-white flex justify-center items-center">
                <Empty>
                <EmptyHeader>
                    <EmptyTitle>204 - {message}</EmptyTitle>
                    <EmptyDescription>
                        No content available to display.
                        <div className="w-4xl flex justify-center items-center gap-1 flex-col m-3">
                            {
                            message.includes("No subjects available")?
                            <Button 
                            className="w-[20%] bg-emerald-500 hover:bg-emerald-700 text-white cursor-pointer"
                            variant="secondary" 
                            onClick={()=>navigate("/admin/subjects")}
                            >Add Subject</Button>
                            :
                            <Button 
                            className="w-[20%] bg-emerald-500 hover:bg-emerald-700 text-white cursor-pointer"
                            variant="secondary" 
                            onClick={()=>navigate("/admin/addUser")}
                            >Add User</Button>
                            }
                        </div>
                    </EmptyDescription>
                </EmptyHeader>
                </Empty>
                </div>
                }
            </div>
    )
}