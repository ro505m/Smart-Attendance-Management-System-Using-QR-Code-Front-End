import { attendanceMark, generateSession, getAllReports, getAllSubjectsOfInstructor, leave } from "@/Api/Api"
import { Axios } from "@/Api/AxiosCreate"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/Components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import Cookie from 'cookie-universal'
import QRCode from "qrcode"
import { Print } from "@/Components/print/Print"
import { Label } from "@/Components/ui/label"
import Header from "@/Components/atom/Header";




export default function Instructor() {
    const cookie = new Cookie();
    const [subjects, setSubjects] = useState([])
    const [reports, setReports] = useState([])
    const [message, setMessage] = useState('')
    const userId = cookie.get("userId");
    const date = new Date();

    //get All Subjects Of Instructor
    useEffect(() => {
            setMessage("")
            Axios.get(`${getAllSubjectsOfInstructor}/${userId}`)
            .then(res=>setSubjects(res.data))
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
    }, [])

    async function handelGenrateSession(id){
        setMessage("")
        setReports("")
        await Axios.post(`${generateSession}/${id}`, {userId: userId})
            .then(res=>{
                cookie.set("session",res.data.session)
                QRCode.toDataURL(res.data.session)
                .then(url =>{ 
                    setMessage("The QR Code Created Successfuly")
                    window.open(`/qr-view?img=${encodeURIComponent(url)}`, "_blank");
                })
                .catch(err => {
                    setMessage("The QR Code Is Not Create")
                    console.error(err)
                })
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
            }
            )
    }

    async function handelReport(subjectId){
        setMessage("")
        await Axios.get(getAllReports, {
            params: {
                month: (date.getMonth() + 1),
                year:  date.getFullYear(),
                subjectId: subjectId
            }
        })
        .then(res=>{
            setReports(res.data)
            console.log(res.data)
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
        }
        )
    }

    async function handelLeave(studentId, subjectId){
        setMessage("")
        const session = await cookie.get("session")
        await Axios.post(`${attendanceMark}${leave}`,{
            userId: studentId,
            session: session
        })
        .then(res=>{
            setMessage(res.data.message)
            handelReport(subjectId)
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
        }
        )
    }



    return (
        <div className="w-screen min-h-screen text-white flex p-2 flex-col overflow-x-auto">
        <div className="w-full h-fit mb-7">
            <Header/>
        </div>
        <Table>
        <TableCaption className="text-white">List Of All Your Subjects.</TableCaption>
        <TableCaption className="text-white">{message}</TableCaption>
        <TableHeader>
            <TableRow>
            <TableHead className="text-white">No.</TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Department</TableHead>
            <TableHead className="text-white">Stage</TableHead>
            <TableHead className="text-white flex justify-center items-center">Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
            subjects.length > 0 
            ?
            subjects.map((subject, index) => (
            <TableRow key={subject._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.department}</TableCell>
                <TableCell>{subject.stage}</TableCell>
                <TableCell className="flex justify-center items-center">
                    <div className="flex justify-start items-center gap-1">
                        <Button variant="destructive" onClick={()=>handelGenrateSession(subject._id)}>Create Lecture</Button>
                        <Button variant="secondary" onClick={()=>handelReport(subject._id)}>Get Report</Button>
                    </div>
                </TableCell>
            </TableRow>
            ))
            :
            <>
            <TableRow>
                <TableCell> <Skeleton className="h-4 w-[200px]" /> </TableCell>
                <TableCell> <Skeleton className="h-4 w-[200px]" /> </TableCell>
                <TableCell> <Skeleton className="h-4 w-[200px]" /> </TableCell>
                <TableCell> <Skeleton className="h-4 w-[200px]" /> </TableCell>
                <TableCell> <Skeleton className="h-4 w-[200px]" /> </TableCell>
            </TableRow>
            <TableRow>
                <TableCell> <Skeleton className="h-4 w-[200px]" /> </TableCell>
                <TableCell> <Skeleton className="h-4 w-[200px]" /> </TableCell>
                <TableCell> <Skeleton className="h-4 w-[200px]" /> </TableCell>
                <TableCell> <Skeleton className="h-4 w-[200px]" /> </TableCell>
                <TableCell> <Skeleton className="h-4 w-[200px]" /> </TableCell>
            </TableRow>
            </>
            }
        </TableBody>
        <TableFooter>
            <TableRow>
            </TableRow>
        </TableFooter>
        </Table>
        
        {
        (reports.length !== 0)
        &&
        <div className="flex justify-center items-center flex-col overflow-x-auto w-full">
        <div className="w-full h-fit flex p-2">
            <div className="h-fit flex justify-items-start flex-col gap-2 mb-1.5 flex-1">
                <Label>Instructor Name: {reports.instructorName}</Label>
                <Label>Subject Name: {reports.subjectName}</Label>
                <Label>Department: {reports.department}</Label>
                <Label>Stage: {reports.stage}</Label>
            </div>
            <div className="h-fit flex justify-items-end flex-col gap-2 mb-1.5">
                <Label>Total Lectures: {reports.totalSessions}</Label>
                <Label>Academic Year: {(reports.year + 1)}-{reports.year}</Label>
            </div>
        </div>
        <Table className="min-w-full">
        <TableCaption className="text-white">Monthly Attendance Report</TableCaption>
        <TableCaption className="text-white">{message}</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="text-white">No.</TableHead>
                <TableHead className="text-white">Student Name</TableHead>
                {
                    (reports.length !== 0)
                    &&
                    reports?.report[0]?.dates.map((d, i) => (
                        <TableHead key={i} className="text-white">
                            {d.date}
                        </TableHead>
                    ))
                }
                <TableHead className="text-white">Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
            (reports.length !== 0)
            &&
            reports?.report?.map((item, index) => (
            <TableRow key={item.studentId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.studentName}</TableCell>
                {item.dates.map((d, i) => (
                    <TableCell key={i}>
                        {d.status}
                    </TableCell>
                ))}
                <TableCell>
                    <Button className="bg-emerald-500 hover:bg-emerald-700 h-6 font-medium" onClick={()=>handelLeave(item.studentId, reports.subjectId)}>Leave</Button>
                </TableCell>
            </TableRow>
            ))
        }
        </TableBody>
        <TableFooter>
        </TableFooter>
        </Table>
        {
            reports.totalSessions > 0
            &&
            <Button className="w-[30%]" variant="secondary" onClick={()=>Print(reports)}>Print</Button>
        }
        </div>
        }
    </div>
    )
}
