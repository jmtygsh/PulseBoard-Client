import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, FileQuestion, Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getStatusColor } from "@/constants/Colors";

const Homepage = () => {
    const [publicPolls, setPublicPolls] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPublicPolls = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/polls/public?page=${currentPage}&limit=9`);
                setPublicPolls(response.data.data.polls);
                setTotalPages(response.data.data.totalPages);
            } catch (error) {
                console.error("Failed to fetch public polls", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublicPolls();
    }, [currentPage]);

    const handleVoteClick = (slug, e) => {
        e.stopPropagation();
        navigate(`/dashboard/submit-vote?id=${slug}`);
    };

    const handleResultClick = (slug, e) => {
        e.stopPropagation();
        navigate(`/dashboard/live/poll?id=${slug}`);
    };

    return (
        <>
            <main className="relative">
                <section className="flex justify-center items-center h-screen container mx-auto px-6 shadow-none">
                    <div className="space-y-6">

                        <h1 className="text-3xl sm:text-5xl xl:text-6xl font-bold text-center
                bg-linear-to-r from-slate-50 to-orange-500 bg-clip-text text-transparent">
                            PulseBoard: Live Polls For Feedback
                        </h1>
                        <p className="text-md sm:text-lg text-center ">
                            Create, share, and vote on live polls to gather feedback from your audience.
                        </p>


                        <div className="flex justify-center mt-8 gap-4">
                            <Button variant="outline" asChild className="text-black hover:opacity-80 cursor-pointer shadow-xl">
                                <Link to="/create-poll">
                                    Create New Poll
                                </Link>
                            </Button>

                            <Button variant="outline" asChild className="text-black hover:opacity-80 cursor-pointer shadow-xl">
                                <Link to="/dashboard">
                                    Go to Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="relative overflow-hidden min-h-screen border-t border-white/10 border-dashed bg-zinc-950">
                    {/* Medium intensity Glowing effect backgrounds */}
                    <div className="absolute top-[-50px] left-[-50px] w-[400px] h-[400px] bg-slate-400/10 blur-[200px] rounded-full pointer-events-none -z-0"></div>


                    <div className="container mx-auto px-6 py-20 relative z-10">
                        <div className="flex items-center mb-12">
                            <div className="relative border-b border-dashed border-white/30 w-full">
                                {/* Decorative "cut-out" block that sits over the top right corner to hide the border */}
                                {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-950 rotate-45 z-10"></div> */}

                                <h2 className="relative text-2xl font-bold text-white border border-white/20 border-b-0 p-2 px-4 w-fit border-dashed">
                                    <span className="text-orange-500 italic mr-2">Public</span>
                                    Polls
                                </h2>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
                            </div>
                        ) : publicPolls.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {publicPolls.map((poll) => (
                                        <Card
                                            key={poll.id}
                                            className="bg-transparent border border-white/10 hover:border-orange-500/50 transition-colors flex flex-col h-full"
                                        >
                                            <CardHeader className="pb-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <CardTitle className="text-xl font-bold text-white line-clamp-2 leading-tight flex-1 mr-4">
                                                        {poll.title}
                                                    </CardTitle>
                                                    <span className={`text-xs px-2.5 py-1 rounded-full border uppercase tracking-wider font-semibold flex-shrink-0 ${getStatusColor(poll.status)}`}>
                                                        {poll.status}
                                                    </span>
                                                </div>
                                                <CardDescription className="text-slate-400 line-clamp-2">
                                                    {poll.description || "No description provided."}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="mt-auto pt-4 border-t border-white/5">
                                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-300 pb-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Users size={16} className="text-orange-500" />
                                                        <span><strong className="text-white">{poll.responseCount}</strong></span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <FileQuestion size={16} className="text-blue-500" />
                                                        <span><strong className="text-white">{poll.questionCount}</strong></span>
                                                    </div>
                                                    {poll.expiresAt && (
                                                        <div className="flex items-center gap-1.5 ml-auto">
                                                            <Clock size={14} className="text-slate-500" />
                                                            <span className="text-xs text-slate-400">
                                                                {new Date(poll.expiresAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-3 pt-4 border-t border-white/5">
                                                    <Button
                                                        variant="outline"
                                                        onClick={(e) => handleVoteClick(poll.shareSlug, e)}
                                                        className="flex-1 bg-transparent border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white"
                                                    >
                                                        Vote
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={(e) => handleResultClick(poll.shareSlug, e)}
                                                        className="flex-1 bg-transparent border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white"
                                                    >
                                                        Results
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-12">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1 || isLoading}
                                            className="bg-transparent border-white/20 text-white hover:bg-white/10"
                                        >
                                            <ChevronLeft size={16} className="mr-1" /> Previous
                                        </Button>
                                        <span className="text-slate-400 text-sm">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages || isLoading}
                                            className="bg-transparent border-white/20 text-white hover:bg-white/10"
                                        >
                                            Next <ChevronRight size={16} className="ml-1" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 text-slate-400 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-lg">No public polls available at the moment.</p>
                                <p className="text-sm mt-2">Be the first to create and publish one!</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Homepage;