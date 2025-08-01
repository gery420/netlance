import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";
import Navbar from "../common/Navbar"

const CreateGig = () => {

    const navigate = useNavigate();

    let [ data, setData ] = useState({
        title: "",
        shortTitle: "",
        desc: "",
        shortDesc: "",
        price: "",
        deliveryTime: "",
        revisionNumber: "",
        cover: "",
        images: [],
        features: [""],
        category: ""
    });

    const [load , setLoad] = useState(false);
    const {isLoggedIn, userType, authToken} = useContext(UserContext);

    useEffect(() => {
        if (!isLoggedIn) {
            swal.fire({
                title: "Access Denied",
                text: "You must be logged in & have a seller profile to create a gig.",
                icon: "error",
                confirmButtonText: "OK"
            });
            navigate("/login");
        }
    });
    if (userType !== "seller") {
        return (
            <>  
                <Navbar />
                <div className="w-full mt-[15dvh] flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <br/>
                    <p className="text-gray-600">You do not have permission to view this page.</p>
                </div>
            </>
        );
    }

    const handleChange = (e) => {

        const { name, value, files, type } = e.target;
        if (type === "file") {
            if (name === "cover") {
                setData((prevData) => ({
                    ...prevData,
                    cover: files[0], // single file
                }));
            } else if (name === "images") {
                setData((prevData) => ({
                    ...prevData,
                    images: Array.from(files), // multiple files
                }));
            }
        } else {
            setData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    }
    const handleFeatureChange = (index, value) => {
        const updated = [...data.features];
        updated[index] = value;
        setData(prev => ({ ...prev, features: updated }));
    };

    const addFeature = () => {
        setData(prev => ({ ...prev, features: [...prev.features, ""] }));
    };

    const removeFeature = (index) => {
        const updated = [...data.features];
        updated.splice(index, 1);
        setData(prev => ({ ...prev, features: updated }));
    };

    const submit = async (event) => {

        try {
            if (data.title === "" || data.shortTitle === "" || data.desc === "" || data.price === "" || data.deliveryTime === "" || data.revisionNumber === "") {
                swal.fire({
                    title: "Error",
                    text: "Please fill all the fields",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                return;
            }

            event.preventDefault();

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("shortTitle", data.shortTitle);
            formData.append("desc", data.desc);
            formData.append("shortDesc", data.shortDesc);
            formData.append("price", data.price);
            formData.append("deliveryTime", data.deliveryTime);
            formData.append("revisionNumber", data.revisionNumber);
            formData.append("cover", data.cover);
            formData.append("category", data.category);
            data.images.forEach((image, index) => {
                formData.append("images", image);
            });
            data.features.forEach((feature) => {
                formData.append(`features[]`, feature);
            });

            setLoad(true);
            
            let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/gig/create`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`
                }
            })

            setLoad(false);

            setData({
                title: "",
                shortTitle: "",
                desc: "",
                shortDesc: "",
                price: "",
                deliveryTime: "",
                revisionNumber: "",
                cover: null,
                images: [],
                features: [""],
                category: ""
            });

            if (res.data.success) {
                swal.fire({
                    title: "Success",
                    text: "Gig created successfully!",
                    icon: "success",
                });
                navigate("/gig");
            }
        }

        catch (error) {
            console.error("Error creating gig:", error);
            swal.fire({
                title: "Error",
                text: "Failed to create gig. Please try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
            setLoad(false);
            return;
        }

    }

    return (
        <>
            <Navbar />
            <div className=" h-fit flex-col flex mt-[10dvh]">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl text-center ml-10 mt-10 text-[var(--black)] font-bold font-Nunito">Create a Gig</h1>
                    <div className="flex w-[50%] h-[100%] flex-col gap-10 items-start justify-start mt-10">
                        <div className="flex w-[100%] h-[100%] flex-row gap-10 items-start justify-between">
                            <label htmlFor="title" className="w-[60%]">Title:
                                <input type="text" name="title" placeholder="Enter gig title" onChange={handleChange} required className=" mt-1 w-[100%] h-[60%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                            <label htmlFor="shortTitle" className="w-[50%] ">Short Title:
                                <input type="text" name="shortTitle" placeholder="Enter short title" onChange={handleChange} required className=" mt-1 w-[100%] h-[60%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                        </div>
                        <div className="flex w-[100%] h-[100%] flex-col gap-10 items-start justify-start">
                        <label htmlFor="desc" className="w-[100%]">Description:
                            <input type="text" name="desc" placeholder="Enter description" required onChange={handleChange} className=" mt-1 w-[100%] h-[10dvh] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                        </label>
                        <div className="w-[100%] h-[100%] flex flex-row gap-10">
                            <label htmlFor="shortDesc" className="w-[100%]">Short Description:
                                <input type="text" name="shortDesc" placeholder="Enter short description" required onChange={handleChange} className=" mt-1 w-[100%] h-[5dvh] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                            <label className="w-[100%]">Select Category:
                                <select name="category" onChange={handleChange} required className=" mt-1 w-[100%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl">
                                    <option value="" className="rounded-xl p-3">Select a category</option>
                                    <option value="webDevelopment">Web Development</option>
                                    <option value="mobileAppDevelopment">Mobile App Development</option>
                                    <option value="softwareDevelopment">Software Development</option>
                                    <option value="graphicDesign">Graphic Design</option>
                                    <option value="logoDesign">Logo Design</option>
                                    <option value="uiUxDesign">UI/UX Design</option>
                                    <option value="videoEditing">Video Editing</option>
                                    <option value="musicProduction">Music Production</option>
                                    <option value="photography">Photography</option>
                                    <option value="photoEditing">Photo Editing</option>
                                    <option value="digitalMarketing">Digital Marketing</option>
                                    <option value="contentWriting">Content Writing</option>
                                    <option value="dataScience">Data Science</option>                                    
                                    <option value="translation">Translation</option>                                    
                                    <option value="dataEntry">Data Entry</option>
                                    <option value="other">Other</option>

                                </select>
                            </label>
                        </div>
                        </div>
                        <div className="flex w-[100%] h-[100%] flex-row gap-10 items-start justify-between">
                            <label htmlFor="price" className="w-[30%] ">Price:
                                <input type="number" name="price" placeholder="Enter gig price" onChange={handleChange} required className=" mt-1 w-[100%] h-[50%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                            <label htmlFor="deliveryTime" className="w-[30%] ">Delivery Time:
                                <input type="number" name="deliveryTime" placeholder="Enter delivery time" onChange={handleChange} required className=" mt-1 w-[100%] h-[50%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                            <label htmlFor="revisionNumber" className="w-[30%] ">Revision Number:
                                <input type="number" name="revisionNumber" placeholder="Enter revision number" onChange={handleChange} required className=" mt-1 w-[100%] h-[50%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                        </div>

                        <div className="flex w-[100%] flex-col flex-wrap gap-4 items-center">
                            <label className="w-[40%] text-center text-black">
                                {data.features.map((feature, index) => (
                                    <div key={index} className="flex items-center justify-center flex-row gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            placeholder={`Feature ${index + 1}`}
                                            className="w-full p-3 border-2 border-black rounded-xl"
                                        />
                                        {data.features.length - 1 === index && (
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                className="text-red-500"
                                            >
                                                ✗
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </label>
                            <button type="button"
                            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-2"
                            onClick={addFeature}>
                                + Add Feature
                            </button>
                        </div>

                        <div className="flex w-[100%] h-[100%] flex-row gap-4 items-start justify-between">
                            <label htmlFor="cover" for="upload">
                                Cover Image:
                                <input type="file" name="cover" id="upload" accept="image/*" onChange={handleChange} className=" mt-1 w-[100%] h-[60%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                            <label htmlFor="images" for="upload">
                                Additional Images:
                                <input type="file" name="images" id="upload" accept="image/*" multiple onChange={handleChange} className=" mt-1 w-[100%] h-[60%] p-3 border-solid border-2 border-[var(--black)] rounded-2xl" />
                            </label>
                        </div>

                        <div className="flex flex-row gap-10 justify-center mb-10 text-center items-center mt-2 w-[100%]">
                            <Link to="/gig" className=" text-[var(--black)] border-2 border-[var(--black)] p-3 rounded-2xl">Cancel</Link>
                            <button onClick={submit} disabled={load} className={`border-2 border-[var(--black)]  transition-all duration-200 ease-in-out
 border-solid text-black p-3 rounded-2xl  ${load ? "bg-[var(--purple)] opacity-45 text-[var(--white)] cursor-not-allowed" : "hover:bg-[var(--purple)]"}`}>{load ? "Creating..." : "Create Gig"}</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    ) 

}

export default CreateGig;
