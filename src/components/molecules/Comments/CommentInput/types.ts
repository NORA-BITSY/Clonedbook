import { IRefetchElementHadler, TElementType } from '@/types/misc';
import { IAccountPicture } from '@/types/picture';
import { IPost } from '@/types/post';
import { BoxProps } from '@mui/material';
import { TDisplayMode } from '../types';

export interface CommentInputProps extends BoxProps {
  displayMode: TDisplayMode;
  element: IPost | IAccountPicture;
  parentElementType: TElementType;
  refetchElement: IRefetchElementHadler;
  commentInputRef: React.RefObject<HTMLTextAreaElement | null>;
  scrollToNewComment: () => void;
}
