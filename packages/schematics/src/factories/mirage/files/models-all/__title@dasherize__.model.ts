import { <%= classify(title) %> } from '<%= options.schema %>';
import { Model } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';

export const <%= camelize(title) %>Model: ModelDefinition<<%= classify(title) %>> = Model.extend({});
