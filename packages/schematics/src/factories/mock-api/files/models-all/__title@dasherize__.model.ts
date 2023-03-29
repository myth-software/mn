import { <%= classify(title) %> } from '<%= entities %>';
import { Model } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';

export const <%= camelize(title) %>Model: ModelDefinition<<%= classify(title) %>> = Model.extend({});
