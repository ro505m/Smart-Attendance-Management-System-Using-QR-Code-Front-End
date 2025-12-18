import { Button } from "@/Components/ui/button";
import Cookie from 'cookie-universal'

export default function Header(){
    const cookie = new Cookie();
    function handleLogout(){
        cookie.remove("userId");
        cookie.remove("userRole");
        cookie.remove("accessToken");
        window.location.pathname="/login";
    }
    return (
        <header className="w-full h-4">
            <nav className="flex justify-between items-center p-1.5">
                <h1 className="scroll-m-20 text-center font-extrabold tracking-tight text-balance text-white">ATTENDIFY</h1>
                <Button variant="destructive" className="cursor-pointer" onClick={handleLogout}>Logout</Button>
            </nav>
        </header>
    )
}

