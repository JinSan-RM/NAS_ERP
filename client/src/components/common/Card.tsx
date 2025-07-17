// client/src/components/common/Card.tsx
import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  hover?: boolean;
}

const CardContainer = styled.div<{ padding?: string; hover?: boolean }>`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: ${props => props.padding || props.theme.spacing.lg};
  transition: all 0.2s ease;
  
  ${props => props.hover && `
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.md};
    }
  `}
`;

const Card: React.FC<CardProps> = ({ children, className, padding, hover = false }) => {
  return (
    <CardContainer className={className} padding={padding} hover={hover}>
      {children}
    </CardContainer>
  );
};

export default Card;