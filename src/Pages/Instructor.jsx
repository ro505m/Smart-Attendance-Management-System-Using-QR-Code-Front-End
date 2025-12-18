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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import Cookie from 'cookie-universal'
import QRCode from "qrcode"
import { Print } from "@/Components/print/Print"
import { Label } from "@/Components/ui/label"
import Header from "@/Components/atom/Header";

import { Field } from "@/Components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"




export default function Instructor() {
    const cookie = new Cookie();
    const [subjects, setSubjects] = useState([])
    const [reports, setReports] = useState([])
    const [message, setMessage] = useState('')
    const [leaveData, setLeaveData] = useState({})
    const [open, setOpen] = useState(false);
    const userId = cookie.get("userId");
    const date = new Date();
    const [month, setMonth] = useState((date.getMonth() + 1).toString());

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
        setReports("")
        await Axios.get(getAllReports, {
            params: {
                month: month,
                year:  date.getFullYear(),
                subjectId: subjectId
            }
        })
        .then(res=>{
            setReports(res.data)
            setMonth((date.getMonth() + 1).toString())
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
        } finally {
            setMonth((date.getMonth() + 1).toString())
        }
    })
    }


    async function handelLeave(studentId, subjectId, attendanceId){
        setMessage("")
        await Axios.post(`${attendanceMark}${leave}`,{
            userId: studentId,
            attendanceId: attendanceId
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

    function getStatusClass(status) {
    switch (status) {
        case "present":
        return "bg-green-500 text-white";
        case "absent":
        return "bg-red-500 text-white";
        case "leave":
        return "bg-yellow-500 text-black";
        default:
        return "";
    }
    };

    return (
        <div className="w-screen min-h-screen text-white flex p-2 flex-col overflow-x-auto">
        <div className="w-full h-fit mb-7">
            <Header/>
        </div>
        <div className="flex gap-1 w-full justify-end items-center mb-4 mt-1">
            <Label>Select Month</Label>
            <Field className="w-[20%]">
                <Select value={month} onValueChange={(value) => setMonth((value).toString())}>
                    <SelectTrigger id="checkout-exp-month-ts6" className="cursor-pointer">
                        <SelectValue placeholder="MM"/>
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white">
                    <SelectItem value="1" className="cursor-pointer">01</SelectItem>
                    <SelectItem value="2" className="cursor-pointer">02</SelectItem>
                    <SelectItem value="3" className="cursor-pointer">03</SelectItem>
                    <SelectItem value="4" className="cursor-pointer">04</SelectItem>
                    <SelectItem value="5" className="cursor-pointer">05</SelectItem>
                    <SelectItem value="6" className="cursor-pointer">06</SelectItem>
                    <SelectItem value="7" className="cursor-pointer">07</SelectItem>
                    <SelectItem value="8" className="cursor-pointer">08</SelectItem>
                    <SelectItem value="9" className="cursor-pointer">09</SelectItem>
                    <SelectItem value="10" className="cursor-pointer">10</SelectItem>
                    <SelectItem value="11" className="cursor-pointer">11</SelectItem>
                    <SelectItem value="12" className="cursor-pointer">12</SelectItem>
                    </SelectContent>
                </Select>
            </Field>
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
                        <Button variant="destructive" className="cursor-pointer" onClick={()=>handelGenrateSession(subject._id)}>Create Lecture</Button>
                        <Button variant="secondary" className="cursor-pointer" onClick={()=>handelReport(subject._id)}>Get Report</Button>
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
        <TableHeader>
            <TableRow>
                <TableHead className="text-white">No.</TableHead>
                <TableHead className="text-white">Student Name</TableHead>
                {
                    (reports.length !== 0)
                    &&
                    reports?.report[0]?.dates?.map((d, i) => (
                        <TableHead key={i} className="text-white">
                            {d.date}
                        </TableHead>
                    ))
                }
                <TableHead className="text-white">Note</TableHead>
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
                    <TableCell key={i} 
                    onClick={()=>{
                        if (d.status === "absent") {
                            setLeaveData({studentId: item.studentId, subjectId: reports.subjectId, attendanceId: d.attendanceId});
                            setOpen(true);
                        }
                    }}
                    className={`${getStatusClass(d.status)} ${d.status === "absent" ? "cursor-pointer" : "cursor-no-drop"}  border border-black select-none `}>
                        {d.status}
                    </TableCell>
                ))}
                {
                    index === 0 &&(
                        <TableCell className="wrap-break-word whitespace-normal" rowspan={reports.report.length}>Click On The Status Of Student To Mark Leave </TableCell>
                    )
                }
            </TableRow>
            ))
        }
        </TableBody>
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently mark leave for this student.
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={()=>{handelLeave(leaveData.studentId, leaveData.subjectId, leaveData.attendanceId); setOpen(false);}}>Save changes</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
        <TableFooter>
        </TableFooter>
        </Table>
        {
            reports.totalSessions > 0
            &&
            <Button className="w-[30%] mt-4 cursor-pointer" variant="secondary" onClick={()=>Print(reports)}>Print</Button>
        }
        </div>
        }
    </div>
    )
}
