/* eslint-disable max-len */
import React from 'react';
import cx from 'classnames';

import { IconProps } from '.';

const CanonicalIcon = ({ className = '', width = '18', height = '18' }: IconProps) => (
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
      d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM16.7732 13.9783H14.3643C14.332 14.451 14.2273 14.8457 14.05 15.1626C13.8782 15.4795 13.6284 15.7185 13.3008 15.8797C12.9731 16.0408 12.5569 16.1214 12.052 16.1214C11.6223 16.1214 11.2544 16.0435 10.9482 15.8877C10.6475 15.7266 10.4004 15.4903 10.207 15.1787C10.019 14.8618 9.87939 14.4751 9.78809 14.0186C9.69678 13.5567 9.65112 13.0222 9.65112 12.4153V11.5855C9.65112 10.9624 9.69946 10.42 9.79614 9.95804C9.89819 9.49075 10.0513 9.10403 10.2554 8.79788C10.4595 8.49173 10.7119 8.26346 11.0127 8.11307C11.3135 7.96268 11.6653 7.88748 12.0681 7.88748C12.6052 7.88748 13.0349 7.97342 13.3572 8.14529C13.6848 8.3118 13.9292 8.56155 14.0903 8.89456C14.2515 9.2222 14.3455 9.62234 14.3723 10.095H16.7893C16.7141 9.30008 16.4885 8.59109 16.1125 7.96805C15.7419 7.345 15.2183 6.85623 14.5415 6.50174C13.8701 6.14725 13.0457 5.97 12.0681 5.97C11.3323 5.97 10.6663 6.10159 10.0701 6.36478C9.47388 6.62796 8.96094 7.00394 8.53125 7.49271C8.10693 7.98148 7.7793 8.57498 7.54834 9.27322C7.32275 9.96609 7.20996 10.7422 7.20996 11.6016V12.4153C7.20996 13.2747 7.32007 14.0508 7.54028 14.7437C7.7605 15.4366 8.08008 16.0274 8.49902 16.5161C8.92334 17.0049 9.43359 17.3809 10.0298 17.6441C10.626 17.9019 11.3 18.0308 12.052 18.0308C13.0134 18.0308 13.8352 17.8589 14.5173 17.5152C15.2048 17.1714 15.7393 16.6934 16.1206 16.0811C16.5073 15.4688 16.7249 14.7679 16.7732 13.9783Z"
    />
  </svg>
);
export default CanonicalIcon;