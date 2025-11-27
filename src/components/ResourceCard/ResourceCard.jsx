import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Card = styled.div`
  background: white;
  border: 2px solid var(--gitthub-gray);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Screenshot = styled.div`
  position: relative;
  height: 140px;
  background: var(--gitthub-light-beige);
  overflow: hidden;

  /* Browser window chrome */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 28px;
    background: linear-gradient(to bottom, #e8e8e8, #d0d0d0);
    border-bottom: 1px solid #bbb;
    z-index: 2;
  }

  /* Traffic light buttons */
  &::after {
    content: '';
    position: absolute;
    top: 9px;
    left: 10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ff5f57;
    box-shadow:
      16px 0 0 #ffbd2e,
      32px 0 0 #28ca42;
    z-index: 3;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    transition: transform 0.3s ease;
    padding-top: 28px;
    box-sizing: border-box;
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  color: var(--gitthub-black);
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const Description = styled.p`
  color: var(--gitthub-gray);
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gitthub-light-beige);
`;

const FormatBadge = styled.span`
  background: var(--gitthub-black);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const CategoryBadge = styled.span`
  background: var(--gitthub-light-beige);
  color: var(--gitthub-black);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid var(--gitthub-gray);
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: var(--gitthub-beige);
  color: var(--gitthub-black);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: var(--gitthub-black);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--gitthub-gray);
    transform: translateY(-2px);
  }
`;

/**
 * ResourceCard component displays a content resource with screenshot, metadata, and actions
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} [props.screenshotUrl] - Optional screenshot URL
 * @param {string} [props.format] - Resource format (e.g., 'PDF', 'URL')
 * @param {string} [props.category] - Resource category
 * @param {string[]} [props.tags] - Array of tags
 * @param {string} [props.resourceType] - Type of resource ('link' or 'document')
 * @param {Function} [props.onAction] - Callback when action button is clicked
 * @param {string} [props.apiUrl] - Base API URL for screenshot loading
 */
const ResourceCard = ({
  title,
  description,
  screenshotUrl,
  format = 'URL',
  category = 'General',
  tags = [],
  resourceType = 'link',
  onAction,
  apiUrl = ''
}) => {
  return (
    <Card onClick={onAction}>
      {screenshotUrl && (
        <Screenshot>
          <img
            src={`${apiUrl}/api/v1/databank/screenshots/${screenshotUrl.split('/').pop()}`}
            alt={title}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </Screenshot>
      )}

      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>

        <Meta>
          <FormatBadge>{format}</FormatBadge>
          <CategoryBadge>{category.replace(/_/g, ' ')}</CategoryBadge>
        </Meta>

        {tags && tags.length > 0 && (
          <TagContainer>
            {tags.slice(0, 3).map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
            {tags.length > 3 && (
              <Tag>+{tags.length - 3}</Tag>
            )}
          </TagContainer>
        )}

        <Actions>
          <ActionButton onClick={onAction}>
            {resourceType === 'link' ? '🌐 Visit Link' : '📁 Download'}
          </ActionButton>
        </Actions>
      </Content>
    </Card>
  );
};

ResourceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  screenshotUrl: PropTypes.string,
  format: PropTypes.string,
  category: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  resourceType: PropTypes.oneOf(['link', 'document']),
  onAction: PropTypes.func,
  apiUrl: PropTypes.string,
};

export default ResourceCard;
