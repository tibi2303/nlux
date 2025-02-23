import {DataTransferMode} from '@nlux/core';
import {warnOnce} from '@shared/utils/warn';
import {LangServeAbstractAdapter} from '../adapter/adapter';
import {ChatAdapterOptions} from '../types/adapterOptions';
import {getDataTransferModeFromEndpointType} from './getDataTransferModeFromEndpointType';
import {getEndpointTypeFromUrl} from './getEndpointTypeFromUrl';

export const getDataTransferModeToUse = <AiMsg>(adapterOptions: ChatAdapterOptions<AiMsg>): DataTransferMode => {
    const runnableEndpointAction = getEndpointTypeFromUrl(
        adapterOptions.url,
    );

    const dataTransferModeFromOptions = adapterOptions.dataTransferMode;
    const dataTransferModeFromAction = runnableEndpointAction
        ? getDataTransferModeFromEndpointType(runnableEndpointAction)
        : undefined;

    const dataTransferMode = dataTransferModeFromAction ?? (
        adapterOptions.dataTransferMode ?? LangServeAbstractAdapter.defaultDataTransferMode
    );

    if (
        dataTransferModeFromOptions
        && dataTransferModeFromAction
        && dataTransferModeFromOptions !== dataTransferModeFromAction
    ) {
        warnOnce(`The data transfer mode provided to LangServe adapter does not match the LangServe runnable ` +
            `URL action. When you provide a runnable URL that ends with '/${runnableEndpointAction}', ` +
            `the data transfer mode is automatically set to '${dataTransferModeFromAction}' and ` +
            `the 'dataTransferMode' option should not be provided or should be set ` +
            `to '${dataTransferModeFromAction}'`);
    }

    return dataTransferMode;
};
