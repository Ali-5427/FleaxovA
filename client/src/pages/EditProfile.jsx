import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        bio: '',
        skills: '',
        portfolio: '', // Simplified as comma separated links for MVP
        socials: {
            linkedin: '',
            github: '',
            website: ''
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // We need an endpoint to get the "current student profile". 
                // We reused profileController.getMyProfile which returns a profile object.
                const res = await axios.get('http://localhost:5000/api/profiles/me');
                if (res.data.data) {
                    const p = res.data.data;
                    setFormData({
                        title: p.title || '',
                        bio: p.bio || '',
                        skills: p.skills ? p.skills.join(', ') : '',
                        portfolio: p.portfolio ? p.portfolio.map(i => i.url).join(', ') : '',
                        socials: {
                            linkedin: p.socials?.linkedin || '',
                            github: p.socials?.github || '',
                            website: p.socials?.website || ''
                        }
                    });
                }
            } catch (err) {
                // Profile might not exist yet, which is fine
                console.log("No profile yet");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert Portfolio strings to objects if needed, but our controller handles simple updates
            // Controller expects portfolio as array of objects if we strictly follow schema, 
            // OR we updated controller earlier to handle it?  
            // Let's check: updateProfile controller: 
            // "if (portfolio) profileFields.portfolio = portfolio;"
            // The schema expects an array of objects {title, url, description}.
            // We will construct this manually just to be safe.

            const portfolioArray = formData.portfolio.split(',')
                .filter(url => url.trim() !== '')
                .map(url => ({ url: url.trim(), title: 'Project Link' }));

            const payload = {
                ...formData,
                portfolio: portfolioArray,
                // Skills string is handled by controller split logic if we kept it?
                // "if (skills) profileFields.skills = skills.split(',')..." -> Yes we kept it simple in controller.
            };

            await axios.post('http://localhost:5000/api/profiles', payload);
            alert('Profile Updated Successfully!');
            navigate('/dashboard'); // or /profile/me
        } catch (err) {
            alert('Error updating profile');
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Your Student Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200">

                <div>
                    <label className="block text-sm font-medium text-gray-700">Professional Title</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            required
                            className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="e.g. Full Stack Developer | UI Designer"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Bio / About Me</label>
                    <div className="mt-1">
                        <textarea
                            rows={4}
                            required
                            className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="Tell clients about your education and expertise..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Skills (Comma Separated)</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            required
                            className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="React, Node.js, Photoshop, Copywriting"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Portfolio Links (Comma Separated)</label>
                    <p className="text-xs text-gray-500 mb-1">Add links to your Google Drive, GitHub, or Behance.</p>
                    <div className="mt-1">
                        <input
                            type="text"
                            className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="https://github.com/me/project1, https://behance.net/gallery/..."
                            value={formData.portfolio}
                            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Social Connections</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                            <input
                                type="text"
                                className="mt-1 shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                value={formData.socials.linkedin}
                                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                            <input
                                type="text"
                                className="mt-1 shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                value={formData.socials.github}
                                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, github: e.target.value } })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-5 flex justify-end">
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                        Save Profile
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditProfile;
