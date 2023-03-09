import * as flatteners from '.';
import * as assertions from '../assertions';

/**
 * flattens a notion property object, which is rendered as a column, to a single meaningful value
 * @param entity notion property object
 * @returns single meaningful value from property
 * @see https://developers.notion.com/reference/property-object
 */
export const flattenNotionProperty = (entity: unknown) => {
  assertions.assertsIsNotionProperty(entity);

  if (!entity?.['type']) {
    console.error(entity);
    throw new Error('property type is missing');
  }

  if (entity['type'] === 'checkbox') {
    assertions.assertsIsCheckbox(entity);

    return entity.checkbox;
  }

  if (entity['type'] === 'created_by') {
    assertions.assertsIsCreatedBy(entity);

    return entity.created_by.name;
  }

  if (entity['type'] === 'created_time') {
    assertions.assertsIsCreatedTime(entity);

    return entity.created_time;
  }

  if (entity['type'] === 'date') {
    assertions.assertsIsDate(entity);

    return flatteners.flattenDate(entity.date);
  }

  if (entity['type'] === 'email') {
    assertions.assertsIsEmail(entity);

    return entity.email;
  }

  if (entity['type'] === 'files') {
    assertions.assertsIsFiles(entity);

    return flatteners.flattenFiles(entity.files);
  }

  if (entity['type'] === 'formula') {
    assertions.assertsIsFormula(entity);

    return flatteners.flattenFormula(entity.formula);
  }

  if (entity['type'] === 'last_edited_by') {
    assertions.assertsIsLasteEditedBy(entity);

    return entity.last_edited_by.name;
  }

  if (entity['type'] === 'last_edited_time') {
    assertions.assertsIsLastEditedTime(entity);

    return entity.last_edited_time;
  }

  if (entity['type'] === 'multi_select') {
    assertions.assertsIsMultiSelect(entity);

    return flatteners.flattenMultiSelect(entity.multi_select);
  }

  if (entity['type'] === 'number') {
    assertions.assertsIsNumber(entity);

    return entity.number;
  }

  if (entity['type'] === 'people') {
    assertions.assertsIsPeople(entity);

    return flatteners.flattenPeople(entity.people);
  }

  if (entity['type'] === 'phone_number') {
    assertions.assertsIsPhoneNumber(entity);

    return entity.phone_number;
  }

  if (entity['type'] === 'relation') {
    assertions.assertsIsRelation(entity);

    return flatteners.flattenRelation(entity.relation);
  }

  if (entity['type'] === 'rich_text') {
    assertions.assertsIsRichText(entity);

    return flatteners.flattenRichText(entity.rich_text);
  }

  if (entity['type'] === 'rollup') {
    return flatteners.flattenRollup(entity);
  }

  if (entity['type'] === 'select') {
    assertions.assertsIsSelect(entity);

    return entity.select ? flatteners.flattenSelect(entity.select) : null;
  }

  if (entity['type'] === 'status') {
    assertions.assertsIsStatus(entity);

    return entity.status ? flatteners.flattenStatus(entity.status) : null;
  }

  if (entity['type'] === 'title') {
    assertions.assertsIsTitle(entity);

    return flatteners.flattenTitle(entity.title);
  }

  if (entity['type'] === 'url') {
    assertions.assertsIsUrl(entity);

    return entity.url;
  }
};
