import * as flatteners from '.';
import * as assertions from '../assertions';

/**
 * flattens a notion property object, which is rendered as a column, to a single meaningful value
 * @param notionProperty notion property object
 * @returns single meaningful value from property
 * @see https://developers.notion.com/reference/property-object
 */
export const flattenNotionProperty = (notionProperty: unknown) => {
  assertions.assertsIsNotionProperty(notionProperty);

  if (!notionProperty?.['type']) {
    console.error(notionProperty);
    throw new Error('property type is missing');
  }

  if (notionProperty['type'] === 'checkbox') {
    assertions.assertsIsCheckbox(notionProperty);

    return notionProperty.checkbox;
  }

  if (notionProperty['type'] === 'created_by') {
    assertions.assertsIsCreatedBy(notionProperty);

    return notionProperty.created_by.name;
  }

  if (notionProperty['type'] === 'created_time') {
    assertions.assertsIsCreatedTime(notionProperty);

    return notionProperty.created_time;
  }

  if (notionProperty['type'] === 'date') {
    assertions.assertsIsDate(notionProperty);

    return flatteners.flattenDate(notionProperty.date);
  }

  if (notionProperty['type'] === 'email') {
    assertions.assertsIsEmail(notionProperty);

    return notionProperty.email;
  }

  if (notionProperty['type'] === 'files') {
    assertions.assertsIsFiles(notionProperty);

    return flatteners.flattenFiles(notionProperty.files);
  }

  if (notionProperty['type'] === 'formula') {
    assertions.assertsIsFormula(notionProperty);

    return flatteners.flattenFormula(notionProperty.formula);
  }

  if (notionProperty['type'] === 'last_edited_by') {
    assertions.assertsIsLasteEditedBy(notionProperty);

    return notionProperty.last_edited_by.name;
  }

  if (notionProperty['type'] === 'last_edited_time') {
    assertions.assertsIsLastEditedTime(notionProperty);

    return notionProperty.last_edited_time;
  }

  if (notionProperty['type'] === 'multi_select') {
    assertions.assertsIsMultiSelect(notionProperty);

    return flatteners.flattenMultiSelect(notionProperty.multi_select);
  }

  if (notionProperty['type'] === 'number') {
    assertions.assertsIsNumber(notionProperty);

    return notionProperty.number;
  }

  if (notionProperty['type'] === 'people') {
    assertions.assertsIsPeople(notionProperty);

    return flatteners.flattenPeople(notionProperty.people);
  }

  if (notionProperty['type'] === 'phone_number') {
    assertions.assertsIsPhoneNumber(notionProperty);

    return notionProperty.phone_number;
  }

  if (notionProperty['type'] === 'relation') {
    assertions.assertsIsRelation(notionProperty);

    return flatteners.flattenRelation(notionProperty.relation);
  }

  if (notionProperty['type'] === 'rich_text') {
    assertions.assertsIsRichText(notionProperty);

    return flatteners.flattenRichText(notionProperty.rich_text);
  }

  if (notionProperty['type'] === 'rollup') {
    return flatteners.flattenRollup(notionProperty);
  }

  if (notionProperty['type'] === 'select') {
    assertions.assertsIsSelect(notionProperty);

    return notionProperty.select
      ? flatteners.flattenSelect(notionProperty.select)
      : null;
  }

  if (notionProperty['type'] === 'status') {
    assertions.assertsIsStatus(notionProperty);

    return notionProperty.status
      ? flatteners.flattenStatus(notionProperty.status)
      : null;
  }

  if (notionProperty['type'] === 'title') {
    assertions.assertsIsTitle(notionProperty);

    return flatteners.flattenTitle(notionProperty.title);
  }

  if (notionProperty['type'] === 'url') {
    assertions.assertsIsUrl(notionProperty);

    return notionProperty.url;
  }
};
