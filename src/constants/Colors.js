function getStatusTextColor(status) {
    switch (status) {
        case 'active':
            return 'text-emerald-700 dark:text-emerald-300';
        case 'draft':
            return 'text-amber-700 dark:text-amber-300';
        case 'closed':
            return 'text-slate-700 dark:text-slate-300';
        default:
            return 'text-slate-700';
    }
}


function getStatusColor(status) {
    switch (status) {
        case 'active':
            return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-900/60';
        case 'draft':
            return 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-900/60';
        case 'closed':
            return 'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-900/40 dark:border-slate-800/60';
        default:
            return 'text-slate-600 bg-slate-100 border-slate-200';
    }
}

export { getStatusTextColor, getStatusColor }
