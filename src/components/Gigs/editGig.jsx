import Navbar from '../common/Navbar';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
import { UserContext } from '../../context/UserContext';

const EditGig = () => {

    const { id } = useParams();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, userType, authToken, loadingUser } = useContext(UserContext);

    const [title, setTitle] = useState('');
    const [shortTitle, setShortTitle] = useState('');
    const [price, setPrice] = useState('');
    const [desc, setDesc] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [revisionNumber, setRevisionNumber] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [cover, setCover] = useState('');
    const [category, setCategory] = useState('');
    const [coverPreview, setCoverPreview] = useState('');
    const [features, setfeatures] = useState([]);

    
    useEffect(() => {

        const checkAccess = async () => {
            if (loadingUser) return; // Wait until user data is loaded
            if (userType !== 'seller' || !authToken || !isLoggedIn) {
                swal.fire({
                    title: "Access Denied",
                    text: "You do not have permission to edit gigs.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                navigate('/gig');
                return;
            }
            const fetchGig = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/gig/${id}`);
                    if (!response.data.success) {
                        swal.fire({
                            title: 'Error',
                            text: response.data.message,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                    const g = response.data.gig;
                    setGig(g);
                    setTitle(g.title);
                    setShortTitle(g.shortTitle);
                    setPrice(g.price);
                    setDesc(g.desc);
                    setDeliveryTime(g.deliveryTime);
                    setRevisionNumber(g.revisionNumber);
                    setShortDesc(g.shortDesc);
                    setfeatures(Array.isArray(g.features) ? g.features : []);
                    setCover(null);
                    setCoverPreview(g.cover);
                    setCategory(g.category);
                    setLoading(false);
                    console.log(response.data);
                } catch (error) {
                    console.error('Error fetching gig:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchGig();
        }
        checkAccess();
    
    }, [id, loadingUser, userType, authToken, isLoggedIn, navigate]);
    

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setLoad(true);

            const formdata = new FormData();
            formdata.append('title', title);
            formdata.append('shortTitle', shortTitle);
            formdata.append('price', price);
            formdata.append('desc', desc);
            formdata.append('deliveryTime', deliveryTime);
            formdata.append('revisionNumber', revisionNumber);
            formdata.append('shortDesc', shortDesc);
            formdata.append('category', category);
            features.forEach((feature) => {
                formdata.append(`features`, feature);
            });
            if (cover) {
                formdata.append('cover', cover);
            }

            let response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/gig/update/${id}`, formdata, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.data.success) {
                swal.fire({
                    title: 'Success',
                    text: 'Gig updated successfully',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setLoad(false);
                navigate('/gig');
            } else {
                swal.fire({
                    title: 'Error',
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                setLoad(false);
            }
        }
        catch (error) {
            console.error('Error updating gig:', error);
            swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'An error occurred while updating the gig.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            setLoad(false);
        } finally {
            setLoad(false);
        }
    }
    
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

    return (
        <div >
            <Navbar />
            <div className=" w-full flex flex-col justify-center items-center mt-36 h-full p-4">
                <h1 className="text-3xl font-bold mb-4">Edit Gig</h1>
                <form className="w-[50%] flex flex-col justify-center items-center bg-white p-6 ">
                    <div>

                        <div className="mb-4">
                            Gig Title: 
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border mt-2 rounded-xl p-3 w-full" />
                        </div>
                        <div className='w-full flex-row flex gap-10 justify-start'>
                            <div className="mb-4">
                                Short Title: 
                                <input type="text" value={shortTitle} onChange={(e) => setShortTitle(e.target.value)} className="border mt-2 rounded-xl p-3 w-full" />
                            </div>
                            <div className="mb-4">
                                Price: 
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="border mt-2 rounded-xl p-3 w-full" />
                            </div>
                        </div>
                        <div className="mb-4">
                            Description: 
                            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="border mt-2 rounded-xl p-3 w-full" />
                        </div>
                        <div className='w-full flex-row flex gap-10 justify-start'>
                            <div className="mb-4">
                                Delivery Time: 
                                <input type="number" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="border mt-2 rounded-xl p-3 w-full" />
                            </div>
                            <div className="mb-4">
                                Revisions: 
                                <input type="number" value={revisionNumber} onChange={(e) => setRevisionNumber(e.target.value)} className="border mt-2 rounded-xl p-3 w-full" />
                            </div>
                        </div>
                        <div className="mb-4">
                            Short Description: 
                            <input type="text" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="border mt-2 rounded-xl p-3 w-full" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2" for="upload">Cover Image:</label>
                            <div className="flex flex-col items-center">
                                <img src={coverPreview} alt="Cover Preview" className="w-48 h-48 object-cover mb-2 rounded-xl" />
                                <input type="file" accept="image/*" id="upload" onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) {
                                        setCover(file);
                                        setCoverPreview(URL.createObjectURL(file));
                                    }
                                }} className="border mt-2 rounded-xl p-2 w-full" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold text-lg">Category:</label>
                                <select name='category' value={category} onChange={(e) => setCategory(e.target.value)} className="border mt-2 rounded-xl p-3 w-full">
                                    <option value="" className="p-3">Select a category</option>
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
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block mb-2 font-semibold text-lg">Features:</label>
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 mb-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => {
                                            const updated = [...features];
                                            updated[index] = e.target.value;
                                            setfeatures(updated);
                                        }}
                                        placeholder={`Feature ${index + 1}`}
                                        className="w-full p-3 border-2 border-black rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = [...features];
                                            updated.splice(index, 1);
                                            setfeatures(updated);
                                        }}
                                        className="text-red-600 text-xl"
                                        title="Remove Feature"
                                    >
                                        ✗
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setfeatures(prev => [...prev, ''])}
                                className="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                + Add Feature
                            </button>
                        </div>

                    </div>

                    <div className="mb-4 justify-self-end">
                        <button type="submit" onClick={handleSave} disabled={load} className={`bg-[var(--purple)] text-white px-4 py-2 rounded-xl ${load ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {load ? 'Saving..' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditGig;
