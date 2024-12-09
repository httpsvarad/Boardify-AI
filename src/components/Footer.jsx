import React, { useState } from 'react'

const Footer = () => {
    const [strokesize, setStrokesize] = useState(2)
    return (
        <div className='flex p-3 gap-2 bg-black justify-between'>
            <div className='my-auto flex gap-3'>
                <span className='my-auto text-white'>{strokesize}</span><input onChange={(e) => setStrokesize(e.target.value)} type="range" min={1} max="50" value={strokesize} className="range my-auto bg-gray-700 range-primary" />

            </div>
            <div className='flex gap-3'>
                <button className="btn btn-success">Calculate</button>
                <button className="btn btn-error">Reset</button>
            </div>
        </div>
    )
}

export default Footer