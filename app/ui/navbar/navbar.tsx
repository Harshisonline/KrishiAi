"use client"

import { useRouter } from "next/navigation"

export default function Navbar () {

    const router = useRouter()

    return(
        <div className="bg-secondary h-15 flex justify-around items-center gap-120 text-tertiary">
            <div className="font-black text-2xl">
                <span className="cursor-pointer" onClick={()=>{
                    router.push("/")
                }} >KRISHIAI</span>
            </div>
            <div>
                <ul className="flex justify-around gap-15">
                    <li>Home</li>
                    <li>About</li>
                </ul>
            </div>
        </div>
    )
}