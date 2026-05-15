import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import api from '@/api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SubmitVote() {
    const [searchParams] = useSearchParams();
    const slug = searchParams.get('id');
    const navigate = useNavigate();

    const [poll, setPoll] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await api.get(`/api/polls/questions/${slug}`);
                const pollData = response.data.data || response.data;
                setPoll(pollData);

                // Check if the poll is expired based on the fetched data
                if (pollData.expiresAt && new Date() > new Date(pollData.expiresAt)) {
                    setIsExpired(true);
                } else if (pollData.status === "expired") {
                    setIsExpired(true);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load poll questions.");
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) fetchPoll();
    }, [slug]);

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmit = async () => {
        const requiredQuestions = poll?.questions?.filter(q => q.isRequired) || [];
        const missingRequired = requiredQuestions.some(q => !answers[q._id]);

        if (missingRequired) {
            toast.error("Please answer all required questions before submitting.");
            setError("Please answer all required questions before submitting.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            let anonymousId = localStorage.getItem('anonymousId');
            if (!anonymousId) {
                anonymousId = crypto.randomUUID();
                localStorage.setItem('anonymousId', anonymousId);
            }

            const payload = {
                answers,
                anonymousId
            };

            await api.post(`/api/polls/answers/${slug}`, payload);
            toast.success("Your vote has been submitted successfully!");
            setIsSuccess(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit vote. Please try again.");
            setError(err.response?.data?.message || "Failed to submit vote. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
            </div>
        );
    }

    if (error && !poll) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
                <Card className="bg-transparent border-red-500/30 max-w-md w-full text-red-500">
                    <CardContent className="pt-6 flex flex-col items-center">
                        <p>{error}</p>
                        <Button onClick={() => navigate('/')} variant="outline" className="mt-6 border-red-500/50 text-red-400 hover:bg-red-500/10">
                            Go Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white p-6">
                <Card className="bg-transparent border-orange-500/30 max-w-md w-full text-center py-8">
                    <CardContent className="flex flex-col items-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-orange-500" />
                        <h2 className="text-2xl font-bold">Vote Submitted!</h2>
                        <p className="text-slate-400">Thank you for your participation.</p>
                        <Button onClick={() => navigate('/')} className="bg-orange-600 hover:bg-orange-700 text-white mt-4">
                            Return Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <section className="container mx-auto p-6 max-w-3xl text-white min-h-screen space-y-8">
            <div className="space-y-2 border-b border-white/10 pb-6">
                <h1 className="text-3xl font-bold text-orange-500">{poll?.title || 'Poll'}</h1>
                {poll?.description && <p className="text-slate-400">{poll.description}</p>}

                {isExpired && (
                    <div className="inline-block mt-4 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-md text-sm font-semibold uppercase tracking-wider">
                        This poll has expired
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-md text-sm text-center">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {poll?.questions?.map((q, idx) => (
                    <Card key={q._id || idx} className="bg-transparent border-white/10 text-white shadow-none">
                        <CardHeader>
                            <CardTitle className="text-lg leading-relaxed">
                                <span className="text-orange-500 mr-2">{idx + 1}.</span>
                                {q.questionText}
                                {q.isRequired && <span className="text-red-500 ml-1">*</span>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {q.options?.map((opt) => {
                                const isSelected = answers[q._id] === opt._id;
                                return (
                                    <div
                                        key={opt._id}
                                        onClick={() => handleOptionSelect(q._id, opt._id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-center gap-3
                                            ${isSelected
                                                ? 'border-orange-500 bg-orange-500/10'
                                                : 'border-white/10 hover:border-orange-500/50 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
                                            ${isSelected ? 'border-orange-500' : 'border-slate-500'}`}
                                        >
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                        </div>
                                        <span className={isSelected ? 'text-white' : 'text-slate-300'}>
                                            {opt.optionText}
                                        </span>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSubmit}
                    disabled={
                        isSubmitting ||
                        isExpired ||
                        (poll?.questions && poll.questions.filter(q => q.isRequired).some(q => !answers[q._id]))
                    }
                    className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting...
                        </>
                    ) : isExpired ? (
                        'Poll Expired'
                    ) : (
                        'Submit Vote'
                    )}
                </Button>
            </div>
        </section>
    );
}
