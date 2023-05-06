enum PROPERTY_TYPES {
  number = 'number',
  formula = 'formula',
  select = 'select',
  multi_select = 'multi_select',
  status = 'status',
  relation = 'relation',
  rollup = 'rollup',
  title = 'title',
  rich_text = 'rich_text',
  url = 'url',
  people = 'people',
  files = 'files',
  email = 'email',
  phone_number = 'phone_number',
  date = 'date',
  checkbox = 'checkbox',
  created_by = 'created_by',
  created_time = 'created_time',
  last_edited_by = 'last_edited_by',
  last_edited_time = 'last_edited_time',
}

export function isPropertiesGuard(value: any) {
  if (!value) {
    return false;
  }

  if (typeof value !== 'object') {
    return false;
  }

  if (!value.hasOwnProperty('type')) {
    return false;
  }

  if (!Object.values(PROPERTY_TYPES).includes(value.type)) {
    return false;
  }

  if (!Object.keys(PROPERTY_TYPES).includes(value.type)) {
    return false;
  }

  return true;
}
