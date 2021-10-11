import { uid } from 'quasar'
import { supabase } from 'boot/api'

const STORAGE_PK_SEPARATOR = '_'

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

export const areEntitiesEqual = (properties, entity1, entity2) =>
  Object
    .entries(properties)
    .filter(([_, val]) => isPrimaryKey(val))
    .every(([key]) => entity1[key] === entity2[key])

export const getPrimaryKeyMapping = (properties, data) =>
  Object
    .entries(properties)
    .reduce((result, [key, val]) => isPrimaryKey(val) ? { ...result, [key]: data[key] } : result, {})

export const isForeignKey = (columnProperties) =>
  columnProperties.description && FOREIGN_KEY_MATCH.test(columnProperties.description)

export const getForeignKeyColumn = (columnProperties) => columnProperties.description.match(FOREIGN_KEY_MATCH)[2]
export const getForeignKeyTable = (columnProperties) => columnProperties.description.match(FOREIGN_KEY_MATCH)[1]

export const isImage = (columnProperties) => columnProperties.meta?.type === 'img:one'
export const isImages = (columnProperties) => columnProperties.meta?.type === 'img:many'

export const rowFormating = (type) => (value, _) => {
  switch (type) {
    case FORMATS.ARRAY: {
      return value ? value.join(', ') : ''
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

export const uploadFile = async (blob, tableName, entityIds, columnName, bucketName = 'public') => {
  const fileExtension = blob.type.split('/').pop()
  const path = `${tableName}/${entityIds.join(STORAGE_PK_SEPARATOR)}/${columnName}/${uid()}.${fileExtension}`
  await supabase.storage.from(bucketName).upload(path, blob)
  return supabase.storage.from(bucketName).getPublicUrl(path).publicURL
}

export const uploadFiles = async (blobs, tableName, entityIds, columnName, bucketName = 'public') =>
  Promise.all(blobs ? blobs.map(blob => uploadFile(blob, tableName, entityIds, columnName, bucketName)) : [])

export const deleteFiles = async (fileUrls, tableName, entityIds, columnName, bucketName = 'public') => {
  if (!fileUrls || !fileUrls.length) return
  const fileNames = fileUrls.map(url => `${tableName}/${entityIds.join(STORAGE_PK_SEPARATOR)}/${columnName}/${url.split('/').pop()}`)
  supabase.storage.from(bucketName).remove(fileNames)
}
