import { Space } from 'antd';
import cx from 'classnames';

import { ContentHeaderProps } from './Header';

import styles from './index.module.scss';

interface OwnProps {
  children: React.ReactNode;
  className?: string;
  headerProps: ContentHeaderProps;
}

const ContentWithHeader = ({ children, className = '' }: OwnProps) => (
  <Space className={cx(styles.contentWithHeader, className)} direction="vertical" size={0}>
    {/* <ContentHeader {...headerProps} /> */}
    <div className={styles.pageWrapper}>{children}</div>
  </Space>
);

export default ContentWithHeader;
