import { isEmpty } from 'lodash';
import { FormikErrors } from 'formik';
import { ValidationResponse } from '../../services/Content/ContentApi';
import ERROR_CODE from './httpErrorCodes.json';

export const REGEX_URL =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export const isValidURL = (val: string) => {
  const regex = new RegExp(REGEX_URL);
  return val.match(regex);
};

export const mapFormikToAPIValues = (
  formikValues: {
    name: string;
    url: string;
    gpgKey: string;
    arch: string;
    versions: string[];
    gpgLoading: boolean;
    expanded: boolean;
  }[],
) =>
  formikValues.map(({ name, url, arch, versions, gpgKey }) => ({
    name,
    url,
    distribution_arch: arch,
    package_coung: 0,
    distribution_versions: versions,
    gpgKey,
  }));

const mapNoMetaDataError = (validationData: ValidationResponse) =>
  validationData.map(({ url, ...rest }) => ({
    ...rest,
    url: {
      ...url,
      error:
        !url?.error && !url?.metadata_present
          ? `Unable to retrieve YUM Metadata, Recieved HTTP ${url?.http_code}: ${
              url ? ERROR_CODE[url.http_code] : ''
            }`
          : url?.error,
    },
  }));

export const mapValidationData = (
  validationData: ValidationResponse,
  formikErrors: FormikErrors<
    | {
        name: string;
        url: string;
        gpgKey: string;
        arch: string;
        versions: never[];
        gpgLoading: boolean;
        expanded: boolean;
      }
    | undefined
  >[],
) => {
  const updatedValidationData = mapNoMetaDataError(validationData);
  const errors = updatedValidationData.map(({ name, url }, index: number) => ({
    // First apply the errors found in the ValidationAPI
    ...(name?.error ? { name: name?.error } : {}),
    ...(url?.error ? { url: url?.error } : {}),
    // Overwrite any errors with errors found within the UI itself
    ...formikErrors[index],
  }));

  if (errors.every((err) => isEmpty(err))) {
    return [];
  }

  return errors;
};
