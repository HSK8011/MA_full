import { css } from '@emotion/react';
import { theme } from '../../../styles/theme';

export const profileSettingsStyles = {
  container: css`
    max-width: ${theme.maxWidth.lg};
    margin: 0 auto;
    padding: ${theme.spacing[4]};

    @media (min-width: ${theme.screens.md}) {
      padding: ${theme.spacing[6]};
    }
  `,

  header: css`
    margin-bottom: ${theme.spacing[8]};
  `,

  profileImage: css`
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background-color: ${theme.colors.blue[100]};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing[6]};

    @media (min-width: ${theme.screens.md}) {
      margin-bottom: 0;
    }
  `,

  editButton: css`
    position: absolute;
    top: -4px;
    right: -4px;
    padding: 4px;
    background: white;
    border-radius: 50%;
    border: 1px solid ${theme.colors.gray[200]};
    box-shadow: ${theme.shadows.sm};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${theme.colors.gray[50]};
    }
  `,

  form: css`
    display: grid;
    gap: ${theme.spacing[6]};

    @media (min-width: ${theme.screens.md}) {
      grid-template-columns: repeat(2, 1fr);
    }
  `,

  actions: css`
    display: flex;
    justify-content: space-between;
    padding-top: ${theme.spacing[6]};
    margin-top: ${theme.spacing[8]};
    border-top: 1px solid ${theme.colors.gray[200]};
  `
}; 