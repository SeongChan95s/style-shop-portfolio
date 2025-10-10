import { useEffect } from 'react';
import { useExplorerStore } from '../explorer.store';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/app/providers';
import { addSearchAction } from '@/app/actions/explorer';

interface UseExplorer {
	search: string;
}

export const useExplorer = ({ search }: UseExplorer) => {
	const queryClient = useQueryClient();
	const session = useSession();

	const searchUnshift = useExplorerStore(state => state.unshift);

	useEffect(() => {
		if (search == '') return;

		if (session) {
			addSearchAction(search);
			queryClient.invalidateQueries({ queryKey: ['getRecentSearchBySession'] });
		} else {
			searchUnshift({
				_id: Math.random().toString().slice(2, 10),
				search,
				timestamp: new Date().getTime()
			});
		}
	}, [search]);
};
