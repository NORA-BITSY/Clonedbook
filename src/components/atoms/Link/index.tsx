import { LinkProps, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

/**
 * @description - Default link for text. Uses Next.js Link with MUI theme styling.
 */

export default function Link({ sx, children, href, ...rootProps }: LinkProps) {
  return (
    <MuiLink sx={sx} href={href || ''} {...rootProps} component={NextLink}>
      {children}
    </MuiLink>
  );
}
