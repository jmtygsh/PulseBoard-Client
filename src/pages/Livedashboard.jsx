import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { io } from 'socket.io-client';
import api from '@/api/axios';
import Header from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Users, Link as LinkIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function LiveDashboard() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [poll, setPoll] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const pollResponse = await api.get(`/api/polls/analytics/${id}`);
                const pollData = pollResponse.data.data;
                setPoll(pollData);

                // Check if expired
                if ((pollData.expiresAt && new Date() > new Date(pollData.expiresAt)) || pollData.status === "expired") {
                    setIsExpired(true);
                }
            } catch (err) {
                setError("Failed to load poll analytics.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchAnalytics();

        // Only connect to socket if the poll is NOT expired
        let socket;
        if (!isExpired) {
            socket = io(import.meta.env.VITE_API_URL, {
                withCredentials: true,
            });

            socket.on("connect", () => {
                console.log("Connected to socket server");
                if (id) {
                    socket.emit("join_poll", id);
                }
            });

            socket.on("connect_error", (err) => {
                // console.error("Socket connection error:", err);
            });

            socket.on("new_response", (update) => {
                setPoll(prevPoll => {
                    if (!prevPoll) return prevPoll;

                    const { isAuth, data } = update;
                    const newPoll = { ...prevPoll };

                    // Clone responses object to mutate
                    newPoll.responses = { ...prevPoll.responses };
                    newPoll.responses.total += 1;
                    if (isAuth) {
                        newPoll.responses.auth += 1;
                    } else {
                        newPoll.responses.ano += 1;
                    }

                    // Deep clone questions to mutate
                    newPoll.questions = prevPoll.questions.map(q => {
                        const answerForQuestion = data.answers.find(a => a.questionId === q.id);
                        if (!answerForQuestion) return q;

                        return {
                            ...q,
                            options: q.options.map(opt => {
                                if (opt.id === answerForQuestion.selectedOptionId) {
                                    const newVoteCount = { ...opt.voteCount };
                                    newVoteCount.total += 1;
                                    if (isAuth) {
                                        newVoteCount.auth += 1;
                                    } else {
                                        newVoteCount.ano += 1;
                                    }
                                    return { ...opt, voteCount: newVoteCount };
                                }
                                return opt;
                            })
                        };
                    });

                    return newPoll;
                });
            });
        }

        return () => {
            if (socket) {
                socket.emit("leave_poll", id); // Optional: if you have a leave_poll event on the backend
                socket.disconnect();
            }
        };
    }, [id, isExpired]);

    const shareableUrl = `${window.location.origin}/dashboard/submit-vote?id=${id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareableUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return <div className="text-white p-6 text-center">Loading analytics...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-6 text-center">{error}</div>;
    }

    return (
        <section className="container mx-auto p-6 space-y-6 text-white min-h-screen">
            <Header title="Live Analytics" subtitle={`Monitoring: ${poll?.title || ''}`} createUrl="/dashboard" createButtonText="Back to Dashboard" />

            {/* Shareable Link Banner */}
            <Card className="bg-orange-500/10 border-orange-500/30 text-white">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <LinkIcon className="text-orange-500" />
                        <div>
                            <p className="text-sm text-orange-200">Share this link to collect responses</p>
                            <p className="font-mono text-sm sm:text-base break-all">{shareableUrl}</p>
                        </div>
                    </div>
                    <Button onClick={handleCopyLink} variant="outline" className="bg-transparent border-orange-500/50 hover:bg-orange-500/20 text-orange-400 w-full sm:w-auto">
                        <Copy size={16} className="mr-2" />
                        {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                </CardContent>
            </Card>

            {/* Total Responses Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-transparent border-white/10 text-white md:col-span-1 flex flex-col justify-center items-center py-8">
                    <Users size={48} className="text-orange-500 mb-4 opacity-80" />
                    <h3 className="text-xl text-slate-400 font-medium">Total Responses</h3>
                    <p className="text-5xl font-bold mt-2">{poll?.responses?.total || 0}</p>
                </Card>

                {/* Additional Insights Placeholder */}
                <Card className="bg-transparent border-white/10 text-white md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Participation Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400 text-sm">Real-time voting activity is being monitored.</p>
                        <div className="mt-6 flex gap-4">
                            <div className="bg-white/5 p-4 rounded-lg flex-1 border border-white/10">
                                <p className="text-sm text-slate-400 mb-1">Authenticated</p>
                                <p className="text-3xl font-bold text-orange-400">{poll?.responses?.auth || 0}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg flex-1 border border-white/10">
                                <p className="text-sm text-slate-400 mb-1">Anonymous</p>
                                <p className="text-3xl font-bold text-orange-400">{poll?.responses?.ano || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-6 mt-8">
                <h3 className="text-2xl font-semibold pb-2">Question Breakdown</h3>

                {poll?.questions?.map((q, idx) => {
                    const chartData = q.options.map(opt => ({
                        ...opt,
                        count: opt.voteCount.total
                    }));

                    return (
                        <Card key={q.id || idx} className="bg-transparent border-white/10 text-white">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    <span className="text-orange-500 mr-2">Q{idx + 1}.</span>
                                    {q.questionText}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                            <XAxis type="number" stroke="#888" allowDecimals={false} />
                                            <YAxis dataKey="optionText" type="category" stroke="#ccc" width={150} tick={{ fill: '#ccc' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                                                itemStyle={{ color: '#f97316' }}
                                                cursor={{ fill: '#27272a' }}
                                            />
                                            <Bar dataKey="count" name="Votes" fill="#f97316" radius={[0, 4, 4, 0]}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f97316' : '#ea580c'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}