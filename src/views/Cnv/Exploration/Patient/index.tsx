import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useParams } from 'react-router';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { FhirApi } from 'api/fhir';
import { ServiceRequestEntity } from 'api/fhir/models';
import { INDEXES } from 'graphql/constants';
import { GraphqlBackend } from 'providers';
import ApolloProvider from 'providers/ApolloProvider';
import { wrapSqonWithPatientIdAndRequestId } from 'views/Cnv/utils/helper';

import patientTags from 'components/Variant/PatientTags';
import VariantTypeNav, { PageType, VariantType } from 'components/Variant/TypeNav';
import useGetExtendedMappings from 'hooks/graphql/useGetExtendedMappings';

import VariantSearchLayout from '../components/VariantSearchLayout';

import PageContent from './components/PageContent';
import { getMenuItems } from './facets';

const CnvExplorationPatient = () => {
  const { patientid, prescriptionid } = useParams<{ patientid: string; prescriptionid: string }>();
  const [headerLoading, setHeaderLoading] = useState(false);
  const [prescription, setPrescription] = useState<ServiceRequestEntity>();
  const [basedOnPrescription, setBasedOnPrescription] = useState<ServiceRequestEntity>();
  const variantMappingResults = useGetExtendedMappings(INDEXES.CNV);
  const filterMapper = (filters: ISqonGroupFilter) =>
    wrapSqonWithPatientIdAndRequestId(filters, patientid);

  useEffect(() => {
    setHeaderLoading(true);
    FhirApi.fetchServiceRequestEntity(prescriptionid).then(({ data }) => {
      setPrescription(data?.data.ServiceRequest);
      data?.data.ServiceRequest.basedOn ? null : setHeaderLoading(false);
    });
  }, [prescriptionid]);

  useEffect(() => {
    if (prescription?.basedOn) {
      setHeaderLoading(true);
      FhirApi.fetchServiceRequestEntity(prescription?.basedOn.reference)
        .then(({ data }) => setBasedOnPrescription(data?.data.ServiceRequest))
        .finally(() => setHeaderLoading(false));
    }
  }, [prescription]);

  return (
    <VariantSearchLayout
      contentHeaderProps={{
        title: intl.get('screen.variantsearch.title'),
        extra: [
          <VariantTypeNav
            key="variant-type-nav"
            pageType={PageType.PATIENT}
            variantType={VariantType.CNV}
            patientId={patientid}
            prescriptionId={prescriptionid}
          />,
          ...patientTags(patientid, prescriptionid, prescription, basedOnPrescription),
        ],
        loading: headerLoading,
      }}
      menuItems={getMenuItems(variantMappingResults, filterMapper)}
    >
      <PageContent
        variantMapping={variantMappingResults}
        patientId={patientid}
        prescriptionId={prescriptionid}
      />
    </VariantSearchLayout>
  );
};

const CnvExplorationPatientWrapper = () => (
  <ApolloProvider backend={GraphqlBackend.ARRANGER}>
    <CnvExplorationPatient />
  </ApolloProvider>
);

export default CnvExplorationPatientWrapper;
