import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        title: '',
        bio: '',
        skills: '',
        portfolio: '',
        socials: {
            linkedin: '',
            github: '',
            website: ''
        },
        company: {
            name: user?.company?.name || '',
            website: user?.company?.website || '',
            industry: user?.company?.industry || ''
        }
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, name: user?.name || '' }));
        if (user?.company) {
            setFormData(prev => ({
                ...prev,
                company: {
                    name: user.company.name || '',
                    website: user.company.website || '',
                    industry: user.company.industry || ''
                }
            }));
        }

        const fetchProfile = async () => {
            if (user?.role !== 'student') return;
            try {
                const res = await api.get('/api/profiles/me');
                if (res.data.data) {
                    const p = res.data.data;
                    setFormData(prev => ({
                        ...prev,
                        title: p.title || '',
                        bio: p.bio || '',
                        skills: p.skills ? p.skills.join(', ') : '',
                        portfolio: p.portfolio ? p.portfolio.map(i => i.url).join(', ') : '',
                        socials: {
                            linkedin: p.socials?.linkedin || '',
                            github: p.socials?.github || '',
                            website: p.socials?.website || ''
                        }
                    }));
                }
            } catch (err) {
                console.log("No profile yet");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
        if (user?.role !== 'student') setLoading(false);
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update User Details (Name/Company)
            await api.put('/api/auth/updatedetails', {
                name: formData.name,
                companyName: formData.company.name,
                companyWebsite: formData.company.website,
                companyIndustry: formData.company.industry
            });

            // Update Student Profile if applicable
            if (user?.role === 'student') {
                const portfolioArray = formData.portfolio.split(',')
                    .filter(url => url.trim() !== '')
                    .map(url => ({ url: url.trim(), title: 'Project Link' }));

                const payload = {
                    title: formData.title,
                    bio: formData.bio,
                    skills: formData.skills,
                    portfolio: portfolioArray,
                    socials: formData.socials
                };

                await api.post('/api/profiles', payload);
            }

            alert('Profile Updated Successfully!');
            window.location.reload();
        } catch (err) {
            alert('Error updating profile');
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Your {user?.role === 'student' ? 'Student Profile' : 'Business Profile'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200">

                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Display Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                {user?.role === 'client' && (
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input
                                    type="text"
                                    className="mt-1 shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    value={formData.company.name}
                                    onChange={(e) => setFormData({ ...formData, company: { ...formData.company, name: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Website</label>
                                <input
                                    type="text"
                                    className="mt-1 shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="https://company.com"
                                    value={formData.company.website}
                                    onChange={(e) => setFormData({ ...formData, company: { ...formData.company, website: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Industry</label>
                                <input
                                    type="text"
                                    className="mt-1 shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="e.g. Technology, Education"
                                    value={formData.company.industry}
                                    onChange={(e) => setFormData({ ...formData, company: { ...formData.company, industry: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {user?.role === 'student' && (
                    <div className="space-y-6">
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
                    </div>
                )}

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

            <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Badge</h2>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Status</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                                ${user?.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                                    user?.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        user?.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                {user?.verificationStatus?.toUpperCase() || 'NONE'}
                            </span>
                        </div>
                        {user?.verificationStatus === 'verified' && (
                            <div className="bg-blue-600 text-white p-2 rounded-full">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {(user?.verificationStatus === 'none' || user?.verificationStatus === 'rejected') && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Submit a link to your Student ID card or Enrollment Letter to get a "Verified Student" badge on your profile.
                            </p>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    id="doc-url"
                                    className="flex-1 shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="Link to Student ID (Google Drive, Imgur, etc.)"
                                />
                                <button
                                    onClick={async () => {
                                        const url = document.getElementById('doc-url').value;
                                        if (!url) return alert('Please provide a URL');
                                        try {
                                            await api.post('/api/auth/request-verification', { documentUrl: url });
                                            alert('Verification request submitted!');
                                            window.location.reload();
                                        } catch (err) {
                                            alert('Failed to submit request');
                                        }
                                    }}
                                    className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
