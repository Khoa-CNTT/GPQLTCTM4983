import { useMutationCustom } from '../../../hooks/useMutationCustom';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { IUseQueryHookOptions } from '@/types/query.interface';
import { ICreateFundSavingTargetRequest } from '../models';
import { fundSavingTargetRoutes } from '@/api/fund-saving-target';

export const useCreateFundSavingTarget = (opts?: IUseQueryHookOptions) => {
    return useMutationCustom<ICreateFundSavingTargetRequest, any>({
        pathUrl: fundSavingTargetRoutes.create,
        mutateOption: {
            onError: (error: AxiosError | any) => {
                if (error.response?.status === 401 || error.response?.status === 409) {
                    return toast.error(`${error?.response?.data?.messages} !`)
                }
                opts?.callBackOnError?.()
            }
        }
    });
};
