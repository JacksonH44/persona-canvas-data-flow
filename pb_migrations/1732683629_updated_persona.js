/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mw0sw8m5upy92ec")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ndl9cugv",
    "name": "active",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mw0sw8m5upy92ec")

  // remove
  collection.schema.removeField("ndl9cugv")

  return dao.saveCollection(collection)
})
