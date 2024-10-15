/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "1t53ws7lvwiybfw",
    "created": "2024-10-14 20:51:36.294Z",
    "updated": "2024-10-14 20:51:36.294Z",
    "name": "source",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "toklfsqi",
        "name": "content",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
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
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("1t53ws7lvwiybfw");

  return dao.deleteCollection(collection);
})
