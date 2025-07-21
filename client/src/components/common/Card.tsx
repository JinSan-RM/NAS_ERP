// client/src/components/common/Card.tsx
import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  $hover?: boolean; // $ prefix for transient props
  padding?: string;
  margin?: string;
  background?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
}

const StyledCard = styled.div<{
  $hover?: boolean;
  $padding?: string;
  $margin?: string;
  $background?: string;
  $border?: string;
  $borderRadius?: string;
  $boxShadow?: string;
}>`
  background: ${props => props.$background || '#ffffff'};
  border: ${props => props.$border || '1px solid #e1e5e9'};
  border-radius: ${props => props.$borderRadius || '8px'};
  box-shadow: ${props => props.$boxShadow || '0 2px 4px rgba(0, 0, 0, 0.1)'};
  padding: ${props => props.$padding || '1.5rem'};
  margin: ${props => props.$margin || '0'};
  transition: all 0.2s ease-in-out;
  cursor: ${props => props.$hover ? 'pointer' : 'default'};

  ${props => props.$hover && `
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
      border-color: #c3d4e6;
    }
  `}

  @media (max-width: 768px) {
    padding: ${props => props.$padding || '1rem'};
    margin: ${props => props.$margin || '0 0 1rem 0'};
  }
`;

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  $hover = false,
  padding,
  margin,
  background,
  border,
  borderRadius,
  boxShadow,
  ...props
}) => {
  return (
    <StyledCard
      className={className}
      onClick={onClick}
      $hover={$hover}
      $padding={padding}
      $margin={margin}
      $background={background}
      $border={border}
      $borderRadius={borderRadius}
      $boxShadow={boxShadow}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card;