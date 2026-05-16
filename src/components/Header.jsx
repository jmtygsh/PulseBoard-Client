import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header({ title, subtitle, createUrl, createButtonText }) {
    const { token, logout } = useAuth();

    return (
        <div className='flex justify-between items-center gap-10 mb-10 '>
            <div className='space-y-2'>
                <h1 className="text-lg sm:text-2xl font-bold">{title}</h1>
                <p className="text-slate-400">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                {createUrl && createButtonText && (
                    <a href={createUrl}>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                            <Plus size={16} />
                            <span className="hidden sm:inline">{createButtonText}</span>
                        </Button>
                    </a>
                )}
                
                {token && (
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={logout}
                        className="bg-transparent border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400 flex items-center gap-2 cursor-pointer"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                )}
            </div>
        </div>
    )
}