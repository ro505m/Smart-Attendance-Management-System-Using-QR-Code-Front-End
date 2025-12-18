import { useNavigate, useParams } from "react-router-dom";
import {
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { MailIcon, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Axios } from "@/Api/AxiosCreate";
import { usersURL } from "@/Api/Api";

export default function UpdateUser() {
    const id = useParams().id;
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        stage: '',
        department: '',
    });
    const navigate = useNavigate();

 // handle form change
    function handleChange(e){
        const { name, value } = e.target;
        setFormData({...formData, [name]: value.toLowerCase()});
    }

    useEffect(()=>{
        Axios.get(`${usersURL}/${id}`)
        .then(res=>{
            setFormData(res.data);
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
    },[id])

    async function Submit(e){
        e.preventDefault();
        setLoading(true)
        await Axios.put(`${usersURL}/${id}`, formData)
        .then(()=>{
            setLoading(false)
            setMessage("the user is updated")
            navigate("/admin/users")
            
        })
        .catch(err=>{
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
                    Update User Account
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
                        placeholder="John"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        />
                        <InputGroupAddon>
                        <User />
                        </InputGroupAddon>
                    </InputGroup>
                    </div>

                    <div>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                        <InputGroupAddon>
                        <MailIcon />
                        </InputGroupAddon>
                    </InputGroup>
                    </div>
                    {
                        formData?.role === 1 && <>
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
                    </>
                }
                </div>
                <FieldDescription className="mt-4 text-sm text-green-400">
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

