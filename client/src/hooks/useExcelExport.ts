// client/src/hooks/useExcelExport.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export interface ExportFunction {
  (...args: any[]): Promise<void>;
}

export interface UseExcelExportOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useExcelExport = (
  exportFunction: ExportFunction,
  options: UseExcelExportOptions = {}
) => {
  const {
    onSuccess,
    onError,
    successMessage = 'Excel 파일이 다운로드되었습니다.',
    errorMessage = 'Excel 다운로드에 실패했습니다.'
  } = options;

  return useMutation({
    mutationFn: exportFunction,
    onSuccess: () => {
      toast.success(successMessage);
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Excel export error:', error);
      toast.error(errorMessage);
      onError?.(error);
    }
  });
};
