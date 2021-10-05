
export const PRIMARY_KEY_FLAG = '<pk/>'
export const FOREIGN_KEY_MATCH = /<fk table='(.*)' column='(.*)'\/>/

export const FORMATS = {
  ARRAY: 'ARRAY',
  TIME_STAMP_Z: 'timestamp with time zone',
  TIME_STAMP: 'timestamp without time zone',
  TEXT: 'text',
  UUID: 'uuid',
  VARCHAR: 'character varying',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  JSON: 'jsonb'
}

export const isPrimaryKey = (columnProperties) =>
  columnProperties.description && columnProperties.description.includes(PRIMARY_KEY_FLAG)

export const isForeignKey = (columnProperties) =>
  columnProperties.description && FOREIGN_KEY_MATCH.test(columnProperties.description)

export const rowFormating = (type) => (value, row) => {
  switch (type) {
    case FORMATS.ARRAY: {
      return value.join(', ')
    }
    case FORMATS.TEXT:
    case FORMATS.VARCHAR:
    case FORMATS.INTEGER:
    case FORMATS.UUID: {
      return value
    }
    case FORMATS.BOOLEAN: {
      return value ? 'Yes' : 'No'
    }
    case FORMATS.JSON: {
      return JSON.stringify(value, undefined, 2)
    }
    case FORMATS.TIME_STAMP:
    case FORMATS.TIME_STAMP_Z: {
      return new Date(value).toLocaleString()
    }
    default: {
      return value
    }
  }
}
