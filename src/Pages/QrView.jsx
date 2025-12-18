import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


export default function QrView () {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const qrImage = queryParams.get("img");
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

    useEffect(() => {
                if (timeLeft <= 0) return;
                const timer = setInterval(() => {
                    setTimeLeft((prev) => prev - 1);
                }, 1000);
                return () => clearInterval(timer);
        }, [timeLeft]);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="w-full h-screen flex justify-center items-center bg-black">
        {qrImage ? (
        <div className="flex flex-col justify-center items-center">
        <img
            src={qrImage}
            alt="QR Code"
            className="rounded-2xl shadow-lg w-xl h-xl"
        />
        <p className="text-white mt-4">Time Remaining: {minutes}:{seconds.toString().padStart(2, '0')}</p>
        </div>
        ) : (
            <p className="text-white">No QR code found</p>
        )}
        </div>
    )
}
