import {DataTransferMode} from '@nlux/core';
import {LangServeInputPreProcessor} from './inputPreProcessor';
import {LangServeConfig, LangServeHeaders} from './langServe';
import {LangServeOutputPreProcessor} from './outputPreProcessor';

export type ChatAdapterOptions<AiMsg> = {
    /**
     * The URL of the LangServe runnable.
     *
     * You can either provide the path to the langserve runnable without the specific action
     * to perform. Example: https://api.example.com/v1/my_runnable
     *
     * Or you can provide the URL to the specific endpoint, with either `invoke` or `stream`
     * at the end of the URL. Example: https://api.example.com/v1/my_runnable/stream
     *
     */
    url: string;

    /**
     * The data transfer mode to use when communicating with the LangServe runnable.
     * If not provided, the `url` will be checked to see if it contains the action
     * to perform (either `/invoke` or `/stream`). If the action is not provided, the default
     * data transfer mode will be `stream`. If the action is provided, the data transfer mode
     * should match the action (either `batch` mode for `/invoke` or `stream` mode for `/stream`).
     */
    dataTransferMode?: DataTransferMode;

    /**
     * This contains the headers that implementers can use to send additional data such as authentication headers.
     */
    headers?: LangServeHeaders;

    /**
     * The configuration object that will be sent to the LangServe runnable.
     */
    config?: LangServeConfig;

    /**
     * A function to preprocess the user input before sending it to the LangServe runnable.
     * If this option is not provided, the adapter will attempt to call `input_schema` endpoint on
     * the LangServe runnable and build the input according to the schema.
     *
     * If no schema is available, or if the schema is non-decisive (example: complex schema where
     * no attribute can be matched to the user message), the adapter will send the user message
     * as a string.
     */
    inputPreProcessor?: LangServeInputPreProcessor<AiMsg>;

    /**
     * When no `inputPreProcessor` is provided, the adapter will attempt to call `input_schema`
     * endpoint on the LangServe runnable and build the input according to the schema.
     * Set this option to `false` to disable this behavior.
     *
     * Default: `true`
     */
    useInputSchema?: boolean;

    /**
     * A function to preprocess the LangServe runnable output before returning it to the user.
     * If this option is not provided, the adapter will attempt to call `output_schema` endpoint on
     * the LangServe runnable and build the output according to the schema.
     *
     * If no schema is available, or if the schema is non-decisive (example: complex schema where
     * no attribute can be matched to expected output), the adapter will return the LangServe runnable
     * output as a string.
     */
    outputPreProcessor?: LangServeOutputPreProcessor<AiMsg>;
};
