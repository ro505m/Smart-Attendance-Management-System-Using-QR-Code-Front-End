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
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MailIcon, User } from "lucide-react";
import {  useState } from "react";
import { Axios } from "@/Api/AxiosCreate";
import { usersURL } from "@/Api/Api";


export default function AddUser() {
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


    async function Submit(e){
        e.preventDefault();
        setLoading(true)
        await Axios.post(usersURL, formData)
        .then(()=>{
            setLoading(false)
            setMessage("the account is added")
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
                    Add Account
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

                    <div>
                    <Field>
                    <FieldLabel htmlFor="role">
                        Role
                    </FieldLabel>
                    <Select onValueChange={(value) => setFormData({...formData, role: Number(value)})}>
                        <SelectTrigger id="role">
                        <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 text-white">
                        <SelectItem value={"1"}>Student</SelectItem>
                        <SelectItem value={"2"}>Instructor</SelectItem>
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
