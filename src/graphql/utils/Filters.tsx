import intl from 'react-intl-universal';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import FilterSelector from '@ferlab/ui/core/components/filters/FilterSelector';
import { IFilter, IFilterGroup } from '@ferlab/ui/core/components/filters/types';
import { updateActiveQueryFilters } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import {
  keyEnhance,
  keyEnhanceBooleanOnly,
  underscoreToDot,
} from '@ferlab/ui/core/data/arranger/formatting';
import { getFilterType } from '@ferlab/ui/core/data/filters/utils';
import { getSelectedFilters } from '@ferlab/ui/core/data/sqon/utils';
import { removeUnderscoreAndCapitalize } from '@ferlab/ui/core/utils/stringUtils';
import { Aggregations } from 'graphql/models';
import { ExtendedMapping, ExtendedMappingResults } from 'graphql/models';

import { getFiltersDictionary } from 'utils/translation';

import { dictionaries } from './dictionaries';
import { transformNameIfNeeded } from './nameTransformer';

export interface RangeAggs {
  stats: {
    max: number;
    min: number;
  };
}
export interface TermAggs {
  buckets: TermAgg[];
}

export interface TermAgg {
  doc_count: number;
  key: string;
}

export interface IGenerateFilter {
  queryBuilderId: string;
  aggregations: Aggregations;
  extendedMapping: ExtendedMappingResults;
  className?: string;
  filtersOpen?: boolean;
  filterFooter?: boolean;
  showSearchInput?: boolean;
  useFilterSelector?: boolean;
  index?: string;
}

const isTermAgg = (obj: TermAggs) => !!obj.buckets;
const isRangeAgg = (obj: RangeAggs) => !!obj.stats;

export const generateFilters = ({
  queryBuilderId,
  aggregations,
  extendedMapping,
  className = '',
  filtersOpen = true,
  filterFooter = false,
  showSearchInput = false,
  useFilterSelector = false,
  index,
}: IGenerateFilter) =>
  Object.keys(aggregations || [])
    .filter((key) => key != '__typename')
    .map((key) => {
      const found = (extendedMapping?.data || []).find(
        (f: ExtendedMapping) => f.field === underscoreToDot(key),
      );

      const filterGroup = getFilterGroup(found, aggregations[key], [], filterFooter, index);
      const filters = getFilters(aggregations, key);
      const selectedFilters = getSelectedFilters({
        queryBuilderId,
        filters,
        filterGroup,
      });
      const FilterComponent = useFilterSelector ? FilterSelector : FilterContainer;

      return (
        <div className={className} key={`${key}_${filtersOpen}`}>
          <FilterComponent
            dictionary={getFiltersDictionary()}
            maxShowing={5}
            isOpen={filtersOpen}
            filterGroup={filterGroup}
            filters={filters}
            collapseProps={{
              headerBorderOnly: true,
            }}
            onChange={(fg, f) =>
              updateActiveQueryFilters({
                queryBuilderId,
                filterGroup: fg,
                selectedFilters: f,
                index,
              })
            }
            searchInputVisible={showSearchInput}
            selectedFilters={selectedFilters}
          />
        </div>
      );
    });

const translateWhenNeeded = (group: string, key: string) =>
  intl
    .get(`filters.options.${underscoreToDot(group)}.${keyEnhance(key)}`)
    .defaultMessage(removeUnderscoreAndCapitalize(keyEnhanceBooleanOnlyExcept(group, key)));

const keyEnhanceBooleanOnlyExcept = (field: string, fkey: string) =>
  ['chromosome'].includes(field) ? fkey : keyEnhanceBooleanOnly(fkey);

export const getFilters = (aggregations: Aggregations | null, key: string): IFilter[] => {
  if (!aggregations || !key) return [];
  if (isTermAgg(aggregations[key])) {
    return aggregations[key!].buckets
      .map((f: any) => {
        const translatedKey = translateWhenNeeded(key, f.key);
        const name = translatedKey ? translatedKey : f.key;
        return {
          data: {
            count: f.doc_count,
            key: keyEnhanceBooleanOnlyExcept(key, f.key),
          },
          id: f.key,
          name: transformNameIfNeeded(key, f.key, name),
        };
      })
      .filter((f: any) => !(f.name === ''));
  } else if (aggregations[key]?.stats) {
    return [
      {
        data: { max: 1, min: 0 },
        id: key,
        name: translateWhenNeeded(key, key),
      },
    ];
  }
  return [];
};

export const getFilterGroup = (
  extendedMapping: ExtendedMapping | undefined,
  aggregation: any,
  rangeTypes: string[],
  filterFooter: boolean,
  index: string | undefined,
): IFilterGroup => {
  const title = intl
    .get(`${index}.filters.group.${extendedMapping?.field}`)
    .defaultMessage(
      intl
        .get(`filters.group.${extendedMapping?.field}`)
        .defaultMessage(extendedMapping?.displayName || ''),
    );

  if (isRangeAgg(aggregation)) {
    return {
      field: extendedMapping?.field || '',
      title,
      type: getFilterType(extendedMapping?.type || ''),
      config: {
        min: aggregation.stats.min,
        max: aggregation.stats.max,
        rangeTypes: rangeTypes.map((r) => ({
          name: r,
          key: r,
        })),
      },
    };
  }

  return {
    field: extendedMapping?.field || '',
    title,
    type: getFilterType(extendedMapping?.type || ''),
    config: {
      nameMapping: [],
      withFooter: filterFooter,
      extraFilterDictionary: extendedMapping?.field ? dictionaries[extendedMapping?.field] : null,
      facetTranslate: (value: string) => {
        const name = translateWhenNeeded(extendedMapping?.field!, value);
        return transformNameIfNeeded(extendedMapping?.field?.replaceAll('.', '__')!, value, name);
      },
    },
  };
};
