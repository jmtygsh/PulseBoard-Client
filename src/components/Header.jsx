import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';


export default function Header({ title, subtitle, createUrl, createButtonText }) {
    return (
        <div className='flex justify-between items-center gap-10 mb-10 '>
            <div className='space-y-2'>
                <h1 className="text-lg sm:text-2xl font-bold">{title}</h1>
                <p className="text-slate-400">{subtitle}</p>
            </div>
            <a href={createUrl} className="shrink-0">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                    <Plus size={16} />
                    {createButtonText}
                </Button>
            </a>
        </div>
    )
}