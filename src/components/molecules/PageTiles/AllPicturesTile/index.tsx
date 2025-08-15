import getPicturesSortedByDate from '@/common/misc/photoManagment/getPicturesSortedByDate';
import LoadingPlaceholder from '@/components/atoms/LoadingPlaceholder';
import FullPageAccountPicturesView from '@/components/organisms/FullPagePhotosView/variants/FullPageAccountPicturesView';
import { useUserPicturesByIdQuery } from '@/redux/services/userDataAPI';
import { IAccountPicture } from '@/types/picture';
import { Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { StyledFullSizePageTile, StyledPageTileHeader } from '../styles';
import PictureButton from './PictureButton';
import { StyledPictureContainer } from './styles';
import { AllPicturesTileProps } from './types';

export default function AllPicturesTile({ profileData, sx, ...rootProps }: AllPicturesTileProps) {
  const theme = useTheme();
  const {
    data: picturesMap,
    isError,
    isLoading: isUserDataLoading,
  } = useUserPicturesByIdQuery(profileData.id);

  const pictures = getPicturesSortedByDate({ picturesMap, type: 'account' });

  const [isFullViewOpen, setIsFullViewOpen] = useState<boolean>(false);
  const [currentPhoto, setCurrentPhoto] = useState<IAccountPicture>(pictures[0]);
  const handleOpenFullView = (picture: IAccountPicture) => {
    setCurrentPhoto(picture);
    setIsFullViewOpen(true);
  };

  if (!picturesMap || isError) return null;
  return (
    <>
      {isFullViewOpen && (
        <FullPageAccountPicturesView
          initialPhoto={currentPhoto}
          setOpen={setIsFullViewOpen}
          ownerId={profileData.id}
        />
      )}
      <StyledFullSizePageTile
        sx={sx}
        {...rootProps}
        position='relative'
        overflow='hidden'
        minHeight='200px'>
        <StyledPageTileHeader mb={1}>Photos</StyledPageTileHeader>
        {isUserDataLoading ? (
          <LoadingPlaceholder />
        ) : (
          <Stack direction='row' flexWrap='wrap' justifyContent='flex-start' sx={{}}>
            {pictures.map((picture) => (
              <StyledPictureContainer key={picture.id}>
                <PictureButton
                  key={picture.id}
                  picture={picture}
                  onClick={() => handleOpenFullView(picture)}
                />
              </StyledPictureContainer>
            ))}
            {!pictures[0] && (
              <Typography
                variant='h3'
                fontWeight={600}
                color={theme.palette.text.secondary}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}>
                No photos to show
              </Typography>
            )}
          </Stack>
        )}
      </StyledFullSizePageTile>
    </>
  );
}
