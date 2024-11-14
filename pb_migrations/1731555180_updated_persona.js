/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mw0sw8m5upy92ec")

  // remove
  collection.schema.removeField("cvwfwerz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4y6nqjfh",
    "name": "age",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mw0sw8m5upy92ec")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cvwfwerz",
    "name": "age",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("4y6nqjfh")

  return dao.saveCollection(collection)
})
