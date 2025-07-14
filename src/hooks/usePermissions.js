import { useQuery } from '@tanstack/react-query';
import { Resources, Actions } from '@/lib/permissions';

export function usePermissions() {
    const { data, error, isLoading } = useQuery({
        queryKey: ['permissions'],
        queryFn: () =>
            fetch('/api/auth/permissions')
                .then(res => res.json())
                .then(json => {
                    if (json.error) throw new Error(json.error);
                    return json;
                }),
        staleTime: 60 * 1000, // cache for 1 minute
    });
    const role = data?.role;
    const perms = data?.permissions || {};

    function can(resource, action) {
        if (role === 'admin') return true;
        if (role === 'sub-admin') return !!perms[resource]?.[action];
        return false;
    }

    function onlyAdmin() {
        return role === 'admin';
    }

    return {
        isLoading,
        error,
        data: data,
        checkView: resource => can(resource, Actions.VIEW),
        checkAdd: resource => can(resource, Actions.ADD),
        checkEdit: resource => can(resource, Actions.EDIT),
        checkDelete: resource => can(resource, Actions.DELETE),
        onlyAdmin,
    };
}
