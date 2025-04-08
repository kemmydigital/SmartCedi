import { toast } from '@/components/ui/use-toast';

export const showToast = (params: {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}) => {
  toast({
    title: params.title,
    description: params.description,
    variant: params.variant || 'default'
  });
};
