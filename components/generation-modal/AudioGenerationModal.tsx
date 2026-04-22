'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import AudioGenerationForm from './AudioGenerationForm';
import AudioHistoryList from './AudioHistoryList';
import useUserAudioHistory, { refreshAudioHistory } from '@/network/profile/use-user-audio-history';
import { deleteAudioApi } from '@/network/audio/client';

interface AudioGenerationModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAudioSelect?: (audioUrl: string, prompt?: string) => void;
  generateTabTitle: string;
  historyTabTitle: string;
  confirmButtonText?: string;
}

export default function AudioGenerationModal({
  open,
  onOpenChange,
  onAudioSelect,
  generateTabTitle,
  historyTabTitle,
  confirmButtonText,
}: AudioGenerationModalProps) {
  const tModal = useTranslations('components.audio-modal');
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const [pageNum, setPageNum] = useState(1);
  const [selectedHistoryPrompt, setSelectedHistoryPrompt] = useState<string>('');

  const { data: audioHistory, total: audioHistoryTotal, isLoading } = useUserAudioHistory(pageNum, 30);

  const handleSuccess = () => {
    refreshAudioHistory();
    setActiveTab('history');
  };

  const handleAudioSelect = async (audioUrl: string, prompt?: string) => {
    await onAudioSelect?.(audioUrl, prompt);
    onOpenChange?.(false);
  };

  const handleDelete = async (audioId: string) => {
    try {
      const res = await deleteAudioApi({ audioId });
      if (res.code === 200) {
        toast.success('Audio deleted successfully');
        refreshAudioHistory();
      } else {
        toast.error(res.msg || 'Failed to delete audio');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete audio');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='flex h-[90vh] w-full max-w-5xl flex-col gap-0 overflow-hidden bg-[#f7f7fb] p-0 sm:h-[85vh] md:h-[90vh]'
        overlayClassName='bg-black/50'
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className='border-b border-[#e5e5e5] px-3 pt-2.5 sm:px-4 sm:pt-3 md:px-6 md:pt-4'>
          <DialogTitle className='flex flex-row items-center gap-2 text-base font-normal sm:gap-3 sm:text-lg md:gap-4'>
            <button
              type='button'
              onClick={() => setActiveTab('generate')}
              className={cn(
                'cursor-pointer whitespace-nowrap transition-all',
                activeTab === 'generate'
                  ? 'bg-gradient-to-r from-[#2563eb] to-[#60a5fa] bg-clip-text'
                  : 'text-[#999] hover:text-[#777]',
              )}
              style={activeTab === 'generate' ? { WebkitTextFillColor: 'transparent' } : undefined}
            >
              {generateTabTitle}
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('history')}
              className={cn(
                'cursor-pointer whitespace-nowrap transition-all',
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-[#2563eb] to-[#60a5fa] bg-clip-text'
                  : 'text-[#999] hover:text-[#777]',
              )}
              style={activeTab === 'history' ? { WebkitTextFillColor: 'transparent' } : undefined}
            >
              {historyTabTitle}
            </button>
          </DialogTitle>
          <DialogDescription className='sr-only'>{generateTabTitle}</DialogDescription>
        </DialogHeader>

        <div className='flex flex-1 overflow-hidden rounded-xl bg-[#f7f7fb] p-2 sm:p-3 lg:rounded-[36px] lg:p-5'>
          <div
            className='flex flex-1 flex-col overflow-hidden rounded-2xl bg-white p-3 sm:rounded-3xl sm:p-4'
            style={{ display: activeTab === 'generate' ? 'flex' : 'none' }}
          >
            <AudioGenerationForm onSuccess={handleSuccess} />
          </div>
          <div
            className='flex flex-1 flex-col overflow-hidden rounded-2xl bg-white p-3 sm:rounded-3xl sm:p-4'
            style={{ display: activeTab === 'history' ? 'flex' : 'none' }}
          >
            <AudioHistoryList
              audioHistory={audioHistory}
              total={audioHistoryTotal || 0}
              isLoading={isLoading}
              pageNum={pageNum}
              onPageChange={setPageNum}
              onAudioSelect={onAudioSelect ? handleAudioSelect : undefined}
              onDelete={handleDelete}
              showConfirmButton={!!confirmButtonText}
              confirmButtonText={confirmButtonText}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
