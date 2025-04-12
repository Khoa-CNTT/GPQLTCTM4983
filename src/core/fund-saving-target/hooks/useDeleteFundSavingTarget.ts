import { fundSavingTargetRoutes } from '@/api/fund-saving-target';
import { useMutationCustom } from '@/hooks/useMutationCustom';
import { IUseQueryHookOptions } from '@/types/query.interface';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const useDeleteFundSavingTarget = (opts?: IUseQueryHookOptions) => {
    return useMutationCustom<{ id: string }, any>({
        pathUrl: fundSavingTargetRoutes.delete,
        method: 'delete',       
        mutateOption: {
            onError: (error: AxiosError | any) => {
                if (error.response?.status === 401) {
                    return toast.error(`${error?.response?.data?.messages} !`);
                }
                opts?.callBackOnError?.();
            }
        }
    });
};