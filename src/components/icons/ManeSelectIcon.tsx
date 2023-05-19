/* eslint-disable max-len */
import React from 'react';
import cx from 'classnames';

import { IconProps } from '.';

const ManeSelectIcon = ({ className = '', width = '18', height = '18' }: IconProps) => (
  <svg
    className={cx('anticon', className)}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM8.98279 6.13477H5.83264V17.8652H8.24158V14.5298L8.00107 9.08184L11.1742 17.8652H12.8177L15.9909 9.08184L15.7504 14.5298V17.8652H18.1674V6.13477H15.0092L11.996 14.7473L8.98279 6.13477Z"
    />
  </svg>
);
export default ManeSelectIcon;
