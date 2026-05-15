import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, X, Trash2, Clock, ShieldCheck, Save, Send } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Header from '@/components/Header';
import api from '@/api/axios';

import { toast } from 'sonner';

// Factory functions replace repetitive inline objects
const newId = () => Math.random().toString(36).slice(2);
const newOption = () => ({ id: newId(), text: '' });
const newQuestion = () => ({
    id: newId(),
    questionText: '',
    isRequired: true,
    options: [newOption(), newOption()],
});


function QuestionCard({ question, index, onRemove, onUpdate }) {
    // One shared updater replaces 3 separate handlers
    const updateOptions = (updater) =>
        onUpdate(question.id, { options: updater(question.options) });

    return (
        <Card className="p-6 bg-transparent shadow-none border border-white/20 text-white">

            <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Question {index + 1}</h4>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={question.isRequired}
                            onChange={(e) => onUpdate(question.id, { isRequired: e.target.checked })}
                            className="accent-orange-500"
                        />
                        Required
                    </label>
                    {index > 0 && (
                        <Button variant="destructive" size="sm" type="button" onClick={() => onRemove(question.id)} className="flex items-center gap-1">
                            <Trash2 size={14} />
                            Remove
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <Input
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-orange-500"
                    value={question.questionText}
                    onChange={(e) => onUpdate(question.id, { questionText: e.target.value })}
                    placeholder="What do you want to ask?"
                    required
                />

                {/* options */}
                <div className="space-y-3">
                    {question.options.map((opt, i) => (
                        <div key={opt.id} className="flex items-center gap-2">
                            <Input
                                className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-orange-500"
                                value={opt.text}
                                onChange={(e) =>
                                    updateOptions((opts) =>
                                        opts.map((o) => (o.id === opt.id ? { ...o, text: e.target.value } : o))
                                    )
                                }
                                placeholder={`Option ${i + 1}`}
                                required
                            />
                            {question.options.length > 2 && (
                                <button
                                    type="button"
                                    className="text-slate-500 hover:text-red-500 transition-colors p-1"
                                    onClick={() => updateOptions((opts) => opts.filter((o) => o.id !== opt.id))}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    <Button variant="outline" size="sm" type="button"
                        className="bg-transparent border-slate-700 hover:bg-slate-800 hover:text-white flex items-center gap-1"
                        onClick={() => updateOptions((opts) => [...opts, newOption()])}>
                        <Plus size={14} />
                        Add Option
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function CreatePoll() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [poll, setPoll] = useState({
        title: '',
        description: '',
        requireAuth: false,
        expiresAt: '',
        questions: [newQuestion()],
    });

    // Short, single-purpose updaters
    const update = (field, value) => setPoll((p) => ({ ...p, [field]: value }));
    const addQuestion = () => setPoll((p) => ({ ...p, questions: [...p.questions, newQuestion()] }));
    const removeQuestion = (id) => setPoll((p) => ({ ...p, questions: p.questions.filter((q) => q.id !== id) }));
    const updateQuestion = (id, fields) =>
        setPoll((p) => ({ ...p, questions: p.questions.map((q) => (q.id === id ? { ...q, ...fields } : q)) }));

    // Payload building extracted — handleSubmit stays clean
    const buildPayload = (status, userId) => {
        let expiresAtISO;
        if (poll.expiresAt && poll.expiresAt !== 'never') {
            const now = new Date();
            const value = parseInt(poll.expiresAt.slice(0, -1), 10);
            const unit = poll.expiresAt.slice(-1);

            const timeMap = { m: 'Minutes', h: 'Hours', d: 'Date' };
            if (timeMap[unit]) now[`set${timeMap[unit]}`](now[`get${timeMap[unit]}`]() + value);

            expiresAtISO = now.toISOString();
        }

        return {
            userId,
            title: poll.title,
            description: poll.description?.trim() || 'No description provided',
            requireAuth: poll.requireAuth,
            ...(expiresAtISO && { expiresAt: expiresAtISO }),
            status,
            questions: poll.questions.map(({ questionText, isRequired, options }) => ({
                questionText,
                isRequired,
                options: options.map((o) => o.text).filter(Boolean),
            })),
        };
    };

    const handleSubmit = async (e, status) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const authRes = await api.get('/api/auth/me');
            const userId = authRes?.data?.data?.id;

            const payload = buildPayload(status, userId);

            // Remove savedPollId logic entirely since there is no update endpoint
            const response = await api.post('/api/polls/create', payload);

            if (response.data.success) {
                toast.success('Event has been created successfully!');
                // The backend response object puts the ID in response.data.data._id
                const newPollId = response.data.data.shareSlug;
                navigate(`/dashboard/live/poll?id=${newPollId}`);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save poll.');
            setError(err?.response?.data?.message || 'Failed to save poll.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="container mx-auto p-6 space-y-6 text-white">

            <Header title="Create Poll" subtitle="Create a live poll with PulseBoard & share it with your audience." createUrl="/dashboard" createButtonText="Dashboard" />

            <form onSubmit={(e) => handleSubmit(e, 'published')}>
                <Card className="bg-transparent border border-white/30 text-white shadow-none relative">
                    <CardHeader className="flex flex-col gap-6 sm:flex-row justify-between items-start">
                        <div>
                            <CardTitle>Poll Details</CardTitle>
                            <CardDescription className="text-slate-400">Fill in the information to create your live poll.</CardDescription>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer mt-1 text-slate-300 hover:text-white transition-colors">
                                <input type="checkbox" checked={poll.requireAuth}
                                    onChange={(e) => update('requireAuth', e.target.checked)}
                                    className="w-4 h-4 accent-orange-500 bg-slate-800 border-slate-700" />
                                <ShieldCheck size={16} className="text-orange-500" />
                                <span className="text-sm font-medium">Authentication Required</span>
                            </label>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <Input
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-orange-500"
                            placeholder="Poll Title"
                            value={poll.title}
                            onChange={(e) => update('title', e.target.value)}
                            required
                        />
                        <Input
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-orange-500"
                            placeholder="Description (optional)"
                            value={poll.description}
                            onChange={(e) => update('description', e.target.value)}
                        />

                        <div className="flex-1 space-y-1 w-full sm:w-auto">
                            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300 mb-2">
                                <Clock size={14} className="text-orange-500" />
                                Expiry Date (Optional)
                            </label>
                            <Select value={poll.expiresAt} onValueChange={(value) => update('expiresAt', value)}>
                                <SelectTrigger className="w-full  bg-slate-800  text-white ">
                                    <SelectValue placeholder="Never Expire" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-orange-500 text-white shadow-xl">
                                    <SelectGroup>
                                        <SelectLabel className="text-slate-400">Expiration Time</SelectLabel>
                                        <SelectItem value="never">Never Expire</SelectItem>
                                        <SelectItem value="1m">Expire in 1 minute</SelectItem>
                                        <SelectItem value="3h">Expire in 3 hours</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h3 className="text-lg font-semibold pb-2 border-b border-slate-800">Questions</h3>
                            {poll.questions.map((q, i) => (
                                <QuestionCard key={q.id} index={i} question={q}
                                    onRemove={removeQuestion} onUpdate={updateQuestion} />
                            ))}
                            <Button variant="secondary" type="button" onClick={addQuestion} className="w-full bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2">
                                <Plus size={16} />
                                Add Another Question
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t border-slate-800 pt-6">
                        <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Send size={16} />
                            {isLoading ? 'Publishing...' : 'Publish Poll'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>

        </section>
    );
}

export default CreatePoll;