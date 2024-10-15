/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1t53ws7lvwiybfw")

  // remove
  collection.schema.removeField("jfajmlu3")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1t53ws7lvwiybfw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jfajmlu3",
    "name": "created_at",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
