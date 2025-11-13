import { useState } from "react";
import { Button } from "@/components/ui/button"; 
import { Scanner } from "@yudiel/react-qr-scanner";
import { Axios } from "@/Api/AxiosCreate";
import { attendanceMark } from "@/Api/Api";
import Cookie from 'cookie-universal'
import Header from "@/Components/atom/Header";

export default function QrReader() {
    const cookie = new Cookie();
    const [scanned, setScanned] = useState(null);
    const [message, setMessage] = useState('')


    async function handleScan(result){
    if (result.length > 0) {
        setScanned(result[0].rawValue);
        console.log(result[0].rawValue)
        const userId = await cookie.get("userId");
        await Axios.post(attendanceMark, {
            userId: userId,
            session: result[0].rawValue
        })
        .then( res => {
            setMessage(res.data.message)
        }
        )
        .catch( err => {
            setMessage(err.response.data.message)
        }
        )
    }
    };

    const handleError = (error) => {2
    console.error("QR Scan-Error:", error);
    };

    return (
    <div>
    <Header/>
    <div className="@container p-4 w-full h-screen flex justify-center items-center flex-col gap-1.5">
        <h1 className="text-2xl mb-4">Scan  QR Code</h1>
        {!scanned && (
        <div className="border-2 rounded-sm border-gray-300 @sm:h-[40%] @sm:w-[80%] @lg:h-96 @lg:w-96">
            <Scanner onScan={handleScan} onError={handleError} />
        </div>
        )}
        {scanned && (
        <div className="w-full h-screen text-white flex justify-center items-center flex-col gap-1.5">
            <p><strong>{message}</strong></p>
            <Button variant="secondary" onClick={() => setScanned(null)}>
                Scan Again
            </Button>
        </div>
        )}
    </div>
    </div>
    );
}