import React from 'react'


const Hero = () => {
    return (
        <div className='flex flex-col sm:flex-row border border-gray-400 rounded-lg  overflow-hidden' style={{ margin: "15px", 
            padding: "20px",
        }}>
            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
                <div className='px-6 sm:px-12 text-center sm:text-left'>
                    <div className='text-[#414141]'>
                        <p className='w-8 md:w-11 h-0.5 bg-[#414141] '></p>
                    <p className='font-sans text-xs sm:text-sm md:text-base font-semibold tracking-[0.2em] uppercase'>
                        OUR BESTSELLERS
                    </p>
                    </div>
                    <h1 className='font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight sm:leading-tight font-semibold text-[#111827] sm:py-3'>Latest Arrivals</h1>
                    <div className='flex items-center gap-2'>
                        <p className='font-sans text-sm sm:text-base md:text-lg font-semibold tracking-[0.12em] uppercase'> SHOP NOW
                            </p>
                            <p className='w-8 md:w-11 h-px bg-[#414141]'></p>

                    </div>
                
                </div>
            </div>
            <img
                src='https://plus.unsplash.com/premium_photo-1727943457941-9cb1db1ad8d1?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='hero'
                className='w-full sm:w-1/2 h-64 sm:h-96 object-contain object-center bg-white'
            />


        </div>
    )
}

export default Hero
