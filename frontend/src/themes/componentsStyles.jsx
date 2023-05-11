import styled from 'styled-components';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { TextField } from '@mui/material';
import { Colors } from './colors';

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.grey[400],
  },
  textDecoration: 'none',
  ' &:hover': {
    textDecoration: 'underline',
  }
}));

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.palette.secondary.main};
`;

export const StyledHeader = styled(Typography)`
  font-weight: bold;
  text-align: center;
`;

export const StyledAvatar = styled(Avatar)`
  background-color: ${({ theme }) => theme.palette.secondary.main};
`;

export const formVariants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  exit: { opacity: 0, y: -100, transition: { duration: 0.7 } }
};

// Chat Styles
export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${Colors.white};
  height: 88vh;
  border: 1px solid ${Colors.white};
  border-radius: 8px;
  padding: 8px;
  margin-right: 8px;
  margin-top: 8px;
  max-width: 300px;
`;

export const ChatForm = styled.form`
  display: flex;
  align-items: center;
  margin-top: auto;
`;

export const ChatInput = styled(TextField)`
  flex: 4;
  margin-right: 10px;
  overflow-y: auto;
`;

export const ChatButton = styled(Button)`
  flex: 1;
`;

export const ChatContent = styled.div`
flex-grow: 1;
overflow-y: auto;
`;
