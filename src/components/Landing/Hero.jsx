import { Link } from "react-router";

const Hero = () => {
    return (
        <>
            <div className="h-fit">
                <Section1 />       
                <Section2 />
            </div>
        </>
    )
}

export default Hero;

const Section1 = () => {
    return (
        <div className="h-[100dvh] w-[100dvw] bg-[var(--white)] flex flex-col gap-10 items-center overflow-hidden justify-center">
            <div className="flex items-center mt-20 flex-col w-full justify-center relative h-[40%]">
                <div className="flex items-center justify-center relative h-max">
                    <h1 className="text-4xl font-bold">Your next <span className="text-[var(--purple)] italic text-6xl">Freelancer </span> 
                    is just a <span className="italic font-thin">click</span> away</h1>
                </div>    
                <div className="flex justify-center items-center mt-4 relative ">
                    <Link to='/explore'>
                        <button className="bg-[var(--purple)] text-white py-2 px-4 rounded">Get Started</button>
                    </Link>
                </div>      
            </div>
            <div className="relative w-full h-[10%]">
                <h1 className="font-bold ml-4 text-[1.5rem] lg:text-[2rem]">Or? Explore specific </h1>
                <div className="w-full h-fit p-2 px-4 gap-4 flex flex-row flex-wrap items-center justify-start mt-5">
                    <Link to="search?query=web" className=" w-fit sm:p-3 p-1 rounded-[2rem] border-2 hover:bg-[var(--purple)] cursor-pointer border-black flex items-center justify-center text-center h-fit mt-5">
                        <p>Web Development</p>
                    </Link>
                    <Link to="search?query=logo" className=" w-fit sm:p-3 p-1 rounded-[2rem] border-2 hover:bg-[var(--purple)] cursor-pointer border-black flex items-center justify-center text-center h-fit mt-5">
                        <p>Logo Design</p>
                    </Link>
                    <Link to="search?query=music" className=" w-fit sm:p-3 p-1 rounded-[2rem] border-2 hover:bg-[var(--purple)] cursor-pointer border-black flex items-center justify-center text-center h-fit mt-5">
                        <p>Music</p>
                    </Link>
                    <Link to="search?query=uiux" className=" w-fit sm:p-3 p-1 rounded-[2rem] border-2 hover:bg-[var(--purple)] cursor-pointer border-black flex items-center justify-center text-center h-fit mt-5">
                        <p>UI/UX</p>
                    </Link>
                    <Link to="search?query=photo" className=" w-fit sm:p-3 p-1 rounded-[2rem] border-2 hover:bg-[var(--purple)] cursor-pointer border-black flex items-center justify-center text-center h-fit mt-5">
                        <p>Photo Editing</p>
                    </Link>
                    <Link to="search?query=ai" className=" w-fit sm:p-3 p-1 rounded-[2rem] border-2 hover:bg-[var(--purple)] cursor-pointer border-black flex items-center justify-center text-center h-fit mt-5">
                        <p>AI/ML</p>
                    </Link>
                </div>
            </div>     
        </div>
    );
}

const Section2 = () => {
    return (
        <div className="h-[100dvh] bg-[var(--black)]">

        </div>
    );
}
