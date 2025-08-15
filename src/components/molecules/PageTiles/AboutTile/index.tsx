import { List, Stack, Typography, useTheme } from '@mui/material';

import { useState } from 'react';
import FamilyAndRelationshipsSection from '../AboutTile/Sections/FamilyAndRelationshipsSection';
import OverviewSection from '../AboutTile/Sections/OverviewSection';
import PlacesLived from '../AboutTile/Sections/PlacesLived';
import WorkAndEducationSection from '../AboutTile/Sections/WorkAndEducationSection';
import { StyledFullSizePageTile, StyledPageTileHeader } from '../styles';
import { StyledContentWrapper, StyledListContainer, StyledListItemButton } from './styles';
import { AboutTileProps, TAboutTileSections } from './types';
import ContactsAndBasicInfoSection from './Sections/ContactsAndBasicInfoSection';

export default function AboutTile({ profileData, sx, ...rootProps }: AboutTileProps) {
  const theme = useTheme();
  const [currentSection, setCurrentSection] = useState<TAboutTileSections>('overview');
  const aboutSections: TAboutTileSections[] = [
    'overview',
    'contact and basic info',
    'work and education',
    'family and relationships',
    'places lived',
  ];

  return (
    <StyledFullSizePageTile sx={{ padding: 0, ...sx }} {...rootProps}>
      <StyledContentWrapper>
        <StyledListContainer>
          <StyledPageTileHeader ml={theme.spacing(2)} mt={theme.spacing(1.5)}>
            About
          </StyledPageTileHeader>
          <List sx={{ paddingX: 1 }}>
            {aboutSections.map((name) => (
              <StyledListItemButton
                key={name}
                selected={name === currentSection}
                onClick={() => setCurrentSection(name)}>
                <Typography
                  variant='subtitle2'
                  color={theme.palette.text.secondary}
                  fontWeight={500}
                  textTransform='capitalize'>
                  {name}
                </Typography>
              </StyledListItemButton>
            ))}
          </List>
        </StyledListContainer>
        <Stack
          sx={{
            width: '100%',
            borderLeft: `1px solid ${theme.palette.divider}`,

            [theme.breakpoints.down('md')]: {
              borderLeft: 'none',
              borderTop: `1px solid ${theme.palette.divider}`,
            },
          }}>
          {currentSection === 'overview' && <OverviewSection profileData={profileData} />}
          {currentSection === 'contact and basic info' && (
            <ContactsAndBasicInfoSection profileData={profileData} />
          )}
          {currentSection === 'work and education' && (
            <WorkAndEducationSection profileData={profileData} />
          )}
          {currentSection === 'family and relationships' && (
            <FamilyAndRelationshipsSection profileData={profileData} />
          )}
          {currentSection === 'places lived' && <PlacesLived profileData={profileData} />}
        </Stack>
      </StyledContentWrapper>
    </StyledFullSizePageTile>
  );
}
