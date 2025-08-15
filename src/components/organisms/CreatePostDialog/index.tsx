import { Box, Dialog, Stack, Typography, useTheme } from '@mui/material';

import {
  DialogCloseIconButton,
  PostSubmitButton,
  StyledMainContentStack,
  StyledRoot,
} from './styles';

import Icon from '@/components/atoms/Icon/Icon';
import HorizontalContentDevider from '@/components/atoms/contentDeviders/HorizontalContentDevider';
import { useGetLoggedUserQuery } from '@/redux/services/loggedUserAPI';
import useCreateNewPost from '@/services/posts/useCreateNewPost';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import PhotosInput from './PhotosInput';
import PostTextInput from './PostTextInput';
import UserInfo from './UserInfo';
import { CreatePostDialogProps } from './types';

export default function CreatePostDialog({
  setIsOpen,
  refetchPostById,
  sx,
  ...rootProps
}: CreatePostDialogProps) {
  const { data: loggedUser } = useGetLoggedUserQuery({});
  const theme = useTheme();

  const [postPhotos, setPostPhotos] = useState<File[]>([]);
  const postTextRef = useRef('');

  const { createPost, isLoading, status, setStatus } = useCreateNewPost();

  // Store active toast IDs
  const activeToastsRef = useRef<Record<string, boolean>>({});

  // Display or update toasts whenever status changes
  useEffect(() => {
    if (status.length === 0) return;

    // Get the status item
    const statusItem = status[0];
    const toastId = statusItem.id || 'default';

    if (!activeToastsRef.current[toastId]) {
      // Create new toast
      activeToastsRef.current[toastId] = true;

      switch (statusItem.sevariety) {
        case 'error':
          toast.error(statusItem.content, { id: toastId });
          break;
        case 'warning':
          toast.warning(statusItem.content, { id: toastId });
          break;
        case 'success':
          toast.success(statusItem.content, {
            id: toastId,
            onDismiss: () => {
              delete activeToastsRef.current[toastId];
            },
          });
          break;
        case 'info':
          toast.info(statusItem.content, { id: toastId });
          break;
        default:
          toast(statusItem.content, { id: toastId });
      }
    } else {
      // Update existing toast
      switch (statusItem.sevariety) {
        case 'error':
          toast.error(statusItem.content, { id: toastId });
          break;
        case 'warning':
          toast.warning(statusItem.content, { id: toastId });
          break;
        case 'success':
          toast.success(statusItem.content, {
            id: toastId,
            onDismiss: () => {
              delete activeToastsRef.current[toastId];
            },
          });
          break;
        case 'info':
          toast.info(statusItem.content, { id: toastId });
          break;
        default:
          toast(statusItem.content, { id: toastId });
      }
    }
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loggedUser || isLoading) return;
    await createPost({
      postPhotos: postPhotos,
      postText: postTextRef.current,
      refetchPostById: refetchPostById,
    });
    if (status.every((status) => status.sevariety !== 'error')) {
      setIsOpen(false);
    }
  }

  if (!loggedUser) return null;
  return (
    <Dialog open onClose={() => setIsOpen(false)}>
      <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
        <StyledRoot sx={sx} {...rootProps}>
          <Stack p={theme.spacing(2)} position='relative'>
            <Typography textAlign='center' variant='h4' fontWeight='500'>
              Create Post
            </Typography>
            <HorizontalContentDevider bottom='0' />
          </Stack>
          <DialogCloseIconButton onClick={() => setIsOpen(false)}>
            <Icon icon='xmark' />
          </DialogCloseIconButton>

          <UserInfo user={loggedUser} />
          <StyledMainContentStack>
            <PostTextInput user={loggedUser} postPhotos={postPhotos} postTextRef={postTextRef} />
            <PhotosInput photos={postPhotos} setPhotos={setPostPhotos} setErrors={setStatus} />
          </StyledMainContentStack>
          <Box p={2}>
            <PostSubmitButton
              data-testid='new-post-submit-button'
              fullWidth
              variant='contained'
              type='submit'
              disabled={isLoading}>
              <Typography fontWeight='400' variant='subtitle1' lineHeight='1.5rem'>
                {isLoading ? 'Loading...' : 'Post'}
              </Typography>
            </PostSubmitButton>
          </Box>
        </StyledRoot>
      </form>
    </Dialog>
  );
}
