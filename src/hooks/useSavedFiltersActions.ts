import { ISavedFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import copy from 'copy-to-clipboard';

import { useAppDispatch } from 'store';
import { globalActions } from 'store/global';
import { createSavedFilter, deleteSavedFilter, updateSavedFilter } from 'store/savedFilter/thunks';
import { SHARED_FILTER_ID_QUERY_PARAM_KEY } from 'utils/constants';
import { getCurrentUrl } from 'utils/helper';

const useSavedFiltersActions = (savedFilterTag: string) => {
  const dispatch = useAppDispatch();

  const handleOnUpdateFilter = (filter: ISavedFilter) => dispatch(updateSavedFilter(filter));

  const handleOnSaveFilter = (filter: ISavedFilter) =>
    dispatch(
      createSavedFilter({
        ...filter,
        tag: savedFilterTag,
      }),
    );

  const handleOnDeleteFilter = (id: string) => dispatch(deleteSavedFilter(id));

  const handleOnShareFilter = (filter: ISavedFilter) => {
    copy(`${getCurrentUrl()}?${SHARED_FILTER_ID_QUERY_PARAM_KEY}=${filter.id}`);
    dispatch(
      globalActions.displayMessage({
        content: 'Copied share url',
        type: 'success',
      }),
    );
  };

  return {
    handleOnUpdateFilter,
    handleOnSaveFilter,
    handleOnDeleteFilter,
    handleOnShareFilter,
  };
};

export default useSavedFiltersActions;
