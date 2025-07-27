import { Link } from "react-router";

const Hero = () => {
    return (
        <>
            <div className="h-fit">
                <Section1 />       
                <Section2 />
                <Section3 /> 
            </div>
        </>
    )
}

export default Hero;

const Section1 = () => {
    return (
        <div className="h-[100dvh] w-[99dvw] bg-[var(--white)] flex flex-col items-center overflow-hidden justify-center">
            <div className="flex items-center justify-center relative text-left h-max">
                <h1 className="text-4xl font-bold">Your next <span className="text-[var(--purple)] italic text-6xl">Freelancer </span> 
                is just a <span className="italic font-thin">click</span> away</h1>
            </div>    
            <div className="flex justify-center items-center mt-10 relative ">
                <Link to='/explore'>
                    <button className="bg-[var(--purple)] text-white py-2 px-4 rounded">Get Started</button>
                </Link>
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

const Section3 = () => {
    return (
        <div className="h-[100dvh] bg-[var(--purple)]">
            
        </div>
    );
}
