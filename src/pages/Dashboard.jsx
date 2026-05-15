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
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
    const { token } = useAuth();
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        const fetchPolls = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const pollData = await api.get(`/api/polls/data/list`);
                const fetchedPolls = pollData.data.data.map(poll => {
                    // Dynamically calculate if poll is expired based on current time
                    const isExpired = poll.expiresAt && new Date() > new Date(poll.expiresAt);
                    return {
                        ...poll,
                        status: isExpired ? 'expired' : poll.status
                    };
                });
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

    const handleCopyLink = () => {
        if (!selectedPoll) return;
        const shareableUrl = `${window.location.origin}/dashboard/submit-vote?id=${selectedPoll.shareSlug}`;
        navigator.clipboard.writeText(shareableUrl);
        toast.success("Link copied to clipboard!");
    };

    const handleDelete = async () => {
        if (!selectedPoll) return;

        try {
            await api.delete(`/api/polls/${selectedPoll.id}`);
            toast.success("Poll deleted successfully");

            // Remove deleted poll from the state
            const updatedPolls = polls.filter(p => p.id !== selectedPoll.id);
            setPolls(updatedPolls);

            // Select another poll if available
            setSelectedPoll(updatedPolls.length > 0 ? updatedPolls[0] : null);
            setIsDeleteDialogOpen(false); // Close dialog on success
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete poll");
        }
    };

    const handleMakePublic = async () => {
        if (!selectedPoll) return;

        try {
            const response = await api.post(`/api/polls/public/${selectedPoll.id}`);
            toast.success(response.data.message || "Poll results are now public!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to make poll public");
        }
    };

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
                                <CardHeader className="pb-6">
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
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-300 mt-6">
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


                                    {/* Poll Details Instead of Dummy Chart */}
                                    <div className="mb-6 pt-4 border-t border-zinc-900">
                                        <h4 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Poll Settings</h4>
                                        <div className="bg-zinc-950/50 border border-zinc-900 rounded-lg p-5 space-y-4">

                                            <div className="flex justify-between items-center pb-3 border-b border-zinc-900/50">
                                                <span className="text-zinc-400 text-sm">Status</span>
                                                <span className={`text-sm font-medium uppercase tracking-wider ${getStatusTextColor(selectedPoll.status)}`}>
                                                    {selectedPoll.status}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center pb-3 border-b border-zinc-900/50">
                                                <span className="text-zinc-400 text-sm">Authentication Required</span>
                                                <span className={`text-sm font-medium ${selectedPoll.requireAuth ? 'text-green-500' : 'text-zinc-300'}`}>
                                                    {selectedPoll.requireAuth ? 'Yes' : 'No'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-zinc-400 text-sm">Expires At</span>
                                                <span className="text-sm font-medium text-zinc-300">
                                                    {selectedPoll.expiresAt ? new Date(selectedPoll.expiresAt).toLocaleString() : 'Never'}
                                                </span>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Actions Section */}
                                    <div className="space-y-4">
                                        <a href={`/dashboard/live/poll?id=${selectedPoll.shareSlug}`} className="block w-full">
                                            <Button size="lg" className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                                                <BarChart3 size={18} />
                                                View Full Analytics
                                            </Button>
                                        </a>

                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCopyLink}
                                                className="bg-transparent border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400"
                                            >
                                                <LinkIcon size={16} className="mr-1.5" />
                                                Copy Link
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleMakePublic}
                                                className="bg-transparent border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400"
                                            >
                                                Make it Public
                                            </Button>

                                            <div className="flex gap-2 ml-auto">
                                                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 size={16} className="mr-1.5" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-white">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-zinc-400">
                                                                This action cannot be undone. This will permanently delete your poll
                                                                and remove its data from our servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-transparent border-zinc-800 hover:bg-zinc-900 text-white">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
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
