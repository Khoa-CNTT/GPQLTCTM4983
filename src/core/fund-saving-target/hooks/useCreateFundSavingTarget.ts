import { useMutationCustom } from '../../../hooks/useMutationCustom';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { expenditureFundRoutes } from '../configs';
import { IUseQueryHookOptions } from '@/types/query.interface';
import { ICreateFundSavingTargetRequest } from '../models';

export const useCreateFundSavingTarget = (opts?: IUseQueryHookOptions) => {
    return useMutationCustom<ICreateFundSavingTargetRequest, any>({
        pathUrl: expenditureFundRoutes.create,
        method: 'post',
        mutateOption: {
            onError: (error: AxiosError | any) => {
                if (error.response?.status === 401) {
                    return toast.error(`${error?.response?.data?.messages} !`)
                }
                opts?.callBackOnError?.()
            }
        }
    });
};