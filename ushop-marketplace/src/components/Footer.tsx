import Image from "next/image";

const Footer = () => (
    <div className="relative bottom-0 row-start-3 flex gap-6 flex-wrap items-center justify-center md:container-xl sm:mx-auto bg-beige h-70 w-full md:pt-10 pt-7 pb-10 px-7">
        <div className='flex flex-col gap-2 md:gap-4 place-content-center py-4 md:py-8 item-top divide-y md:mx-20 md:divide-y-0 md:divide-x md:flex-row divide-dashed divide-mainBlack'>

            {/* Column 1: Contact Us */}
            <div className='md:w-1/2 pl-3'>
                <p className='font-normal text-base md:text-2xl text-mainBlack align-top'>Contact Us</p>
                {/* <p className='font-extrabold text-base md:text-2xl text-mainBlack leading-10 py-4 md:py-8'>Nanyang Technological University</p> */}
                <Image src="/icons/favicon.svg"
                        width={400}
                        height={100}
                        alt="Picture of the author" 
                        className="py-5" />
                <div className='flex flex-col gap-2 md:gap-4 place-content-left py-2 md:py-4 item-top'>
                    
                    {/* Row 1 */}
                    <div className='flex flex-row leading-3 md:leading-9 gap-8'>
                        <p className='font-bold text-xs sm:text-sm md:text-md text-darkRed tracking-wider flex-none w-14'>Address</p>
                        <a title='address' target='_blank' className='font-semibold text-xs sm:text-sm md:text-md text-mainBlack hover:text-darkRed hover:underline' href='https://maps.app.goo.gl/T3azDsJLWwQbqFS87'>North Spine Plaza, 50 Nanyang Avenue, NS3-01-09, Singapore 639798 Drive</a>
                    </div>

                    {/* Row 2 */}    
                    <div className='flex flex-row leading-3 md:leading-9 gap-8'>
                        <p className='font-bold text-xs sm:text-sm md:text-md text-darkRed tracking-wider flex-none w-14'>Email</p>
                        <a title='email' className='font-semibold text-xs sm:text-sm md:text-md text-mainBlack hover:text-darkRed hover:underline' href='mailto:enquires@UShop.com'>UShop@e.ntu.edu.sg</a>
                    </div>
                </div>
            </div>

            {/* ==== Divider ====*/}

            {/* Column 2: Locate Us */}
            <div className='min-h-full pl-3 md:w-1/2 gap-2 md:gap-4 pt-5 space-y-3 md:pb-16 pr-3 md:pt-0 md:pl-7'>
                <span className='font-normal text-base md:text-2xl text-mainBlack align-top'>Locate Us</span>
                <iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d997.178919723111!2d103.6808217!3d1.3470639999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da0f0ac6affff9%3A0x31f01545f2a58d3f!2sNTU%20North%20Spine%20Plaza!5e0!3m2!1sen!2ssg!4v1726248504860!5m2!1sen!2ssg'
                className='min-h-[200px] lg:min-h-[300px] w-full md:h-full rounded-2xl' title='Shop Location'>
                </iframe>
                {/* loading='lazy' */}
            </div>
        </div>

        {/* Below footer */}
        <div className='md:container-xl md:mx-auto bg-darkRed absolute text-mainWhite inset-x-0 bottom-0 w-full text-center pb-1'>
            <span className='font-semibold text-[8px] md:text-xs tracking-wide'>©UShop 2024, </span>
            <span className='font-semibold text-[8px] md:text-xs tracking-wide'>All rights reserved.</span>
        </div>
    </div>
)

export default Footer;