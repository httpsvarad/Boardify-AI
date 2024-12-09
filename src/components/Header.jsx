import { Eraser, Pencil, Undo } from 'lucide-react'
import React, { useState } from 'react'

const Header = () => {

    const [strokesize, setStrokesize] = useState(2)

    return (
        <div >

            <div className='flex p-3 bg-black gap-2 justify-between'>
                <h2 className='text-2xl font-bold text-white my-auto'>Boardify AI</h2>
                {/* <div className='flex my-auto gap-2'>
                    <div className='rounded-full bg-white w-10 h-10'>
                    </div>
                    <div className='rounded-full bg-blue-500 w-10 h-10'>
                    </div>
                    <div className='rounded-full bg-yellow-500 w-10 h-10'>
                    </div>
                    <div className='rounded-full bg-red-500 w-10 h-10'>
                    </div>
                    <div className='rounded-full bg-green-500 w-10 h-10'>
                    </div>
                </div> */}
                <div className='flex gap-3'>
                <div className='my-auto hidden md:block'>
                    <div className='flex gap-3'>
                        <span className='my-auto text-white'>{strokesize}</span><input onChange={(e) => setStrokesize(e.target.value)} type="range" min={1} max="50" value={strokesize} className="range my-auto bg-gray-700 range-primary" />
                    </div>

                </div>

                <div className='flex gap-3'>
                    <button className="btn btn-primary"><Pencil /></button>
                    <button className="btn btn-primary"><Eraser /></button>
                    <button className="btn btn-primary"><Undo /></button>
                </div>

                <div className='hidden md:block'>
                <div className='flex gap-3'>
                    <button className="btn btn-success">Calculate</button>
                    <button className="btn btn-error">Reset</button>
                </div>
                </div>
                </div>
            </div>

        </div>

    )
}

export default Header