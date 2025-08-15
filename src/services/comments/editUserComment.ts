import { db } from '@/config/firebase.config';
import { TElementType } from '@/types/misc';
import { doc, updateDoc } from 'firebase/firestore';

interface IEditCommentParams {
  newText: string;
  commentId: string;
  elementId: string;
  elementType: TElementType;
  elementOwnerId: string;
}

interface ICommentEditByElementType {
  newText: string;
  commentId: string;
  elementId: string;
  elementOwnerId: string;
}

export async function editUserComment({
  elementId,
  commentId,
  elementType,
  newText,
  elementOwnerId,
}: IEditCommentParams) {
  try {
    switch (elementType) {
      case 'post':
        await postCommentEdit({ elementId, commentId, newText });
        break;
      case 'accountPicture':
        await accountPictureCommentCreate({ elementId, commentId, newText, elementOwnerId });
        break;
      case 'backgroundPicture':
        await backgroundPictureCommentCreate({ elementId, commentId, newText, elementOwnerId });
        break;
    }
  } catch (err) {
    console.log(err);
  }
}

async function postCommentEdit({
  commentId,
  elementId,
  newText,
}: Omit<ICommentEditByElementType, 'elementOwnerId'>) {
  const docRef = doc(db, 'posts', elementId);
  const commentPath = `comments.${commentId}.commentText`;
  await updateDoc(docRef, commentPath, newText);
}

async function accountPictureCommentCreate({
  elementId,
  commentId,
  newText,
  elementOwnerId,
}: ICommentEditByElementType) {
  const docRef = doc(db, `users/${elementOwnerId}/pictures/pictures`);
  const commentPath = `account.${elementId}.comments.${commentId}.commentText`;
  await updateDoc(docRef, commentPath, newText);
}

async function backgroundPictureCommentCreate({
  elementId,
  commentId,
  newText,
  elementOwnerId,
}: ICommentEditByElementType) {
  const docRef = doc(db, `users/${elementOwnerId}/pictures/pictures`);
  const commentPath = `background.${elementId}.comments.${commentId}`;
  await updateDoc(docRef, commentPath, { text: newText });
}
