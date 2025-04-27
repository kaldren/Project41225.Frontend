export enum EntityErrorType {
  Update,
  Upload,
  Create,
  Load,
  Remove,
  Processing,
  GenerateFile,
  Print,
}

function displayLoadingDataErrorMessage(entityName: string, errorType?: EntityErrorType) {
  switch (errorType) {
    case EntityErrorType.Load:
      return `An Error Occurred while loading '${entityName}' data`;
    case EntityErrorType.Create:
      return `An Error Occurred while creating a '${entityName}' entry`;
    case EntityErrorType.Upload:
      return `An Error Occurred while uploading '${entityName}' data`;
    case EntityErrorType.Remove:
      return `An Error Occurred while deleting a '${entityName}' entry`;
    case EntityErrorType.GenerateFile:
      return `An Error Occurred while generating '${entityName}' file`;
    case EntityErrorType.Print:
      return `An Error Occurred while printing '${entityName}' data`;
    case EntityErrorType.Processing:
    default:
      return `An Error Occurred while processing '${entityName}' request`;
  }
}

export function setFailingRequestMessage(entityName: string, errorType?: EntityErrorType) {
  return { failureRequestMessage: displayLoadingDataErrorMessage(entityName, errorType) };
}

export function setCustomFailingRequestMessage(customError: string) {
  return { failureRequestMessage: customError };
}
