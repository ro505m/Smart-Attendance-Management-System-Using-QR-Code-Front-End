import { useNavigate } from "react-router-dom";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"

import {
    InputGroup,
    InputGroupInput,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import { Axios } from "@/Api/AxiosCreate";
import { getAllInstructors, subject } from "@/Api/Api";


export default function AddSubject() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        instructor: '',
        stage: '',
        department: '',
    });
    const [instructorData, setInstructorData] = useState([]);
    const navigate = useNavigate();


 // handle form change
    function handleChange(e){
        const { name, value } = e.target;
        setFormData({...formData, [name]: value.toLowerCase()});
    }

    useEffect(() => {
        setMessage("")
        Axios.get(getAllInstructors)
        .then(res=>setInstructorData(res.data))
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
    

    async function Submit(e){
        e.preventDefault();
        setLoading(true)
        await Axios.post(subject, formData)
        .then(()=>{
            setLoading(false)
            setMessage("the subject added")
            navigate("/admin/users")
            
        })
        .catch(err=>{
            console.log(err)
            try {
                if (err.response) {
                    setMessage(err.response.data.message)
                } else{
                setMessage(err.message)
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
            
        })
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
        <div className="w-full max-w-md outline-2 rounded-xl p-8 shadow-lg text-white">
            <form onSubmit={Submit}>
            <FieldSet>
                <FieldGroup>
                <FieldLegend className="text-lg font-semibold mb-2">
                    Add Subject
                </FieldLegend>
                <FieldDescription className="mb-6 text-gray-400 text-sm">
                    All transactions are secure and encrypted
                </FieldDescription>

                <div className="space-y-4">
                    <div>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Network"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        />
                    </InputGroup>
                    </div>

                    <div>
                    <Field>
                    <FieldLabel htmlFor="instructor">
                        Instructor
                    </FieldLabel>
                    <Select onValueChange={(value) => setFormData({...formData, instructor: value})}>
                        <SelectTrigger id="instructor">
                        <SelectValue placeholder="Instructor" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 text-white">
                            {
                                (instructorData.length !== 0) 
                                &&
                                instructorData?.map((item, i)=>(
                                    <SelectItem key={i} value={item._id}>{item.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    </Field>
                    </div>

                    <div>
                    <FieldLabel htmlFor="stage">Stage</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                        id="stage"
                        name="stage"
                        type="text"
                        placeholder="e.g., 3rd"
                        value={formData.stage}
                        onChange={handleChange}
                        required
                        />
                    </InputGroup>
                    </div>

                    <div>
                    <FieldLabel htmlFor="department">Department</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                        id="department"
                        name="department"
                        type="text"
                        placeholder="e.g., Computer Science"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        />
                    </InputGroup>
                    </div>
                </div>

                <FieldDescription className="mt-4 text-sm">
                    {message}
                </FieldDescription>

                <Button
                    type="submit"
                    variant="secondary"
                    disabled={loading}
                    className="w-full mt-6"
                >
                    {loading ? "Loading..." : "Submit"}
                </Button>
                </FieldGroup>
            </FieldSet>
            </form>
        </div>
    </div>
    )
}
