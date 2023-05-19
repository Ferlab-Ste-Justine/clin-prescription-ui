import React from 'react';
import cx from 'classnames';

import { IconProps } from '.';

const SupervisorIcon = ({ className = '', width = '20', height = '20' }: IconProps) => (
  <svg
    className={cx('anticon', className)}
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      // eslint-disable-next-line max-len
      d="M9.99166 6.66666C9.99166 8.04999 8.88332 9.16666 7.49999 9.16666C6.11666 9.16666 4.99999 8.04999 4.99999 6.66666C4.99999 5.28332 6.11666 4.16666 7.49999 4.16666C8.88332 4.16666 9.99166 5.28332 9.99166 6.66666ZM15.825 7.91666C15.825 9.06666 14.9 9.99999 13.75 9.99999C12.6 9.99999 11.6667 9.06666 11.6667 7.91666C11.6667 6.76666 12.6 5.83332 13.75 5.83332C14.9 5.83332 15.825 6.76666 15.825 7.91666ZM13.75 11.6667C12.225 11.6667 9.16666 12.4333 9.16666 13.9583V15.8333H18.3333V13.9583C18.3333 12.4333 15.275 11.6667 13.75 11.6667ZM1.66666 13.75C1.66666 11.8083 5.55832 10.8333 7.49999 10.8333C8.04999 10.8333 8.74999 10.9167 9.47499 11.0667C7.77499 12.0083 7.49999 13.25 7.49999 13.9583V15.8333H1.66666V13.75Z"
    />
  </svg>
);
export default SupervisorIcon;
