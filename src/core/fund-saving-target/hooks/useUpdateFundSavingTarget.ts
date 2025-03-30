import { useMutationCustom } from '@/hooks/useMutationCustom';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { IUseQueryHookOptions } from '@/types/query.interface';
import { fundSavingTargetRoutes } from '@/api/fund-saving-target';
import { IUpdateFundSavingTargetParams } from '../models';

export const useUpdateFundSavingTarget = (opts?: IUseQueryHookOptions) => {
    return useMutationCustom<IUpdateFundSavingTargetParams, any>({
        pathUrl: fundSavingTargetRoutes.update,
        method: 'patch',
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