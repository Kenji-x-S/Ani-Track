import React from 'react'
import { Loader2 } from "lucide-react"
const Loading = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center'><Loader2 className="mr-2 h-24 w-24 animate-spin text-primary" /></div>
  )
}
export default Loading