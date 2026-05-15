'use client';

//my note: backend response should send the data of his own polls only

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3, Link as LinkIcon, Edit, Trash2, Clock, Users, FileQuestion } from 'lucide-react';
import { getStatusTextColor, getStatusColor } from '@/constants/Colors';
import Header from '@/components/Header';
import api from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';



export default function Dashboard() {
    const { token } = useAuth();
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolls = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const pollData = await api.get(`/api/polls/data/list`);
                const fetchedPolls = pollData.data.data;
                setPolls(fetchedPolls);
                if (fetchedPolls && fetchedPolls.length > 0) {
                    setSelectedPoll(fetchedPolls[0]);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch polls. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchPolls();
        } else {
            setIsLoading(false);
        }
    }, [token])

    return (
        <section className="container mx-auto p-6 space-y-6 text-white min-h-screen">
            <Header title="Dashboard" subtitle="Manage your polls and view analytics." createUrl="/create-poll" createButtonText="Create New Poll" />

            <div className="flex flex-col sm:flex-row justify-between gap-6">
                {/* Left Side: Polls List */}
                <div className="sm:flex-1 space-y-4">
                    <div className="sticky top-4 space-y-4">
                        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                            {isLoading ? (
                                <p className="text-slate-400 text-sm">Loading polls...</p>
                            ) : error ? (
                                <p className="text-red-500 text-sm">{error}</p>
                            ) : polls.length > 0 ? polls.map((poll) => (
                                <button
                                    key={poll.id}
                                    onClick={() => setSelectedPoll(poll)}
                                    className={`w-full text-left p-4 rounded-lg transition-all border ${selectedPoll?.id === poll.id
                                        ? 'bg-transparent  text-white border border-orange-500 shadow-none'
                                        : 'bg-transparent  text-white border border-white/10 '
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <h3 className="font-semibold text-sm line-clamp-2 text-white flex-1">
                                            {poll.title}
                                        </h3>
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full border uppercase tracking-wider font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(
                                                poll.status
                                            )}`}
                                        >
                                            {poll.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Users size={14} />
                                            {poll.responseCount}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(poll.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </button>
                            )) : (
                                <p className="text-slate-400 text-sm">No polls found.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Poll Details */}
                <div className="sm:flex-2 space-y-4">
                    {selectedPoll && (
                        <div className="sticky top-4">
                            <Card className="bg-transparent  text-white border border-white/10 ">
                                <CardHeader className="pb-6 border-b border-zinc-900">
                                    <div className="space-y-4">
                                        <div>
                                            <span
                                                className={`inline-block mb-3 text-xs px-3 py-1.5 rounded-md border uppercase tracking-widest font-bold ${getStatusColor(
                                                    selectedPoll.status
                                                )}`}
                                            >
                                                {selectedPoll.status}
                                            </span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-2">
                                                {selectedPoll.title}
                                            </CardTitle>
                                            <CardDescription className="text-base text-slate-400 leading-relaxed">
                                                {selectedPoll.description || 'No description provided.'}
                                            </CardDescription>
                                        </div>
                                        {/* Inline Stats Row */}
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-300 mt-6 border-b border-zinc-900">
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-orange-500" />
                                                <span><strong className="text-white">{selectedPoll.responseCount}</strong> Responses</span>
                                            </div>
                                            <span className="text-slate-700 hidden sm:inline">•</span>
                                            <div className="flex items-center gap-2">
                                                <FileQuestion size={16} className="text-blue-500" />
                                                <span><strong className="text-white">{selectedPoll.questionCount}</strong> Questions</span>
                                            </div>
                                            <span className="text-slate-700 hidden sm:inline">•</span>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-green-500" />
                                                <span>
                                                    Expires: <strong className="text-white">{selectedPoll.expiresAt ? new Date(selectedPoll.expiresAt).toLocaleDateString() : 'Never'}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6">


                                    {/* Quick Analytics Chart Placeholder */}
                                    <div className="mb-6 pt-4 border-t border-zinc-900">
                                        <h4 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Activity Overview</h4>
                                        <div className="h-48 w-full bg-zinc-950/50 border border-zinc-900 rounded-lg flex items-center justify-center flex-col relative overflow-hidden">

                                            {/* Decorative background grid */}
                                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
                                                {Array.from({ length: 24 }).map((_, i) => (
                                                    <div key={i} className="border-r border-b border-zinc-500"></div>
                                                ))}
                                            </div>

                                            <div className="flex items-end gap-2 h-24 w-full max-w-sm px-6 justify-between z-10 opacity-70">
                                                {/* Dummy bar chart data */}
                                                {[30, 50, 20, 80, 40, 90, 60].map((height, i) => (
                                                    <div key={i} className="w-8 bg-orange-500/80 rounded-t-sm hover:bg-orange-500 transition-colors" style={{ height: `${height}%` }}></div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-4 z-10">Responses over the last 7 days</p>
                                        </div>
                                    </div>

                                    {/* Actions Section */}
                                    <div className="space-y-4">
                                        <a href={`/poll/${selectedPoll.id}/analytics`} className="block w-full">
                                            <Button size="lg" className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                                                <BarChart3 size={18} />
                                                View Full Analytics
                                            </Button>
                                        </a>

                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="bg-transparent border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400">
                                                <LinkIcon size={16} className="mr-1.5" />
                                                Copy Link
                                            </Button>

                                            {selectedPoll.status === 'draft' && (
                                                <Button variant="outline" size="sm" className="bg-transparent border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400">
                                                    <Edit size={16} className="mr-1.5" />
                                                    Edit
                                                </Button>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 ml-auto"
                                            >
                                                <Trash2 size={16} className="mr-1.5" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
