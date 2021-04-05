/* eslint-disable no-undef */
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

_dropTable = (tx) => {
  tx.executeSql(`DROP TABLE link`)
    .then(() => {
      console.log('sqlite DROP TABLE done');
    })
    .catch((error) => {
      console.log('sqlite DROP TABLE error: ', error);
    });
};

_createTable = (tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS link (
        "id"	INTEGER NOT NULL,
        "url"	TEXT,
        "domain"	TEXT,
        "title"	TEXT,
        "description"	TEXT,
        "category_id"	INTEGER,
        "category_name"	TEXT,
        "category_color"	TEXT,
        "updated_at" TEXT,
        "inserted_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "icon" TEXT,
        PRIMARY KEY("id")
    )`,
  )
    .then(() => {
      console.log('sqlite CREATE TABLE done');
    })
    .catch((error) => {
      console.log('sqlite CREATE TABLE error: ', error);
    });
};

_updateTable = (
  tx,
  id,
  url,
  domain,
  title,
  description,
  category_id,
  category_name,
  category_color,
  updated_at,
  icon,
) => {
  tx.executeSql(
    `UPDATE link set id=${id},url='${url}',domain='${domain}',title='${title}',description='${description}',category_id=${category_id},category_name='${category_name}',category_color='${category_color}',updated_at='${updated_at}',icon='${icon}'  where id=${id}`,
  )
    .then(() => {
      console.log('sqlite CREATE TABLE done');
    })
    .catch((error) => {
      console.log('sqlite CREATE TABLE error: ', error);
    });
};

_insertTable = (
  tx,
  id,
  url,
  domain,
  title,
  description,
  category_id,
  category_name,
  category_color,
  updated_at,
  icon,
) => {
  tx.executeSql(
    `insert into link (id,
    url,
    domain,
    title,
    description,
    category_id,
    category_name,
    category_color,
    updated_at,
    icon) values(${id},'${url}','${domain}','${title}','${description}',${category_id},'${category_name}','${category_color}','${updated_at}','${icon}')`,
  )
    .then(() => {
      console.log('sqlite insert done');
    })
    .catch((error) => {
      console.log('sqlite insert error: ', error);
    });
};

_selectTable = (tx) => {
  tx.executeSql(
    'select * from link order by inserted_date desc',
    [],
    (tx, results) => {
      let links = [];
      const rows = results.rows;
      for (var i = 0; i < rows.length; i++) {
        links.push({
          ...rows.item(i),
        });
      }
      return links;
    },
  );
};

_deleteLink = (tx, id) => {
  tx.executeSql(`delete from link where id=${id}`)
    .then(() => {
      console.log('sqlite delete done');
    })
    .catch((error) => {
      console.log('sqlite delete error: ', error);
    });
};

export const createTable = async () => {
  await SQLite.openDatabase(
    {
      name: 'linklocal.db',
      createFromLocation: 1,
    },
    (DB) => {
      // DB.transaction(this._dropTable);
      DB.transaction(this._createTable)
        .then(() => {
          console.log('create table transaction done');
        })
        .catch((error) => {
          console.log('create table transaction fail: ', error);
        });
    },
    (error) => {
      console.error(error);
    },
  );
};

export const insertLink = async (
  id,
  url,
  domain,
  title,
  description,
  category_id,
  category_name,
  category_color,
  updated_at,
  icon,
) => {
  await SQLite.openDatabase(
    {
      name: 'linklocal.db',
      createFromLocation: 1,
    },
    (DB) => {
      DB.transaction((tx) =>
        this._insertTable(
          tx,
          id,
          url,
          domain,
          title,
          description,
          category_id,
          category_name,
          category_color,
          updated_at,
          icon,
        ),
      )
        .then(() => {
          console.log('insert table transaction done');
        })
        .catch((error) => {
          console.log('insert table transaction fail: ', error);
        });
    },
    (error) => {
      console.error(error);
    },
  );
};

export const deleteLink = async (id) => {
  await SQLite.openDatabase(
    {
      name: 'linklocal.db',
      createFromLocation: 1,
    },
    (DB) => {
      DB.transaction((tx) => this._deleteLink(tx, id))
        .then(() => {
          console.log('delete table transaction done');
        })
        .catch((error) => {
          console.log('delete table transaction fail: ', error);
        });
    },
    (error) => {
      console.error(error);
    },
  );
};

export const updateLink = async (
  id,
  url,
  domain,
  title,
  description,
  category_id,
  category_name,
  category_color,
  updated_at,
  icon,
) => {
  await SQLite.openDatabase(
    {
      name: 'linklocal.db',
      createFromLocation: 1,
    },
    (DB) => {
      DB.transaction((tx) =>
        this._updateTable(
          tx,
          id,
          url,
          domain,
          title,
          description,
          category_id,
          category_name,
          category_color,
          updated_at,
          icon,
        ),
      )
        .then(() => {
          console.log('update table transaction done');
        })
        .catch((error) => {
          console.log('update table transaction fail: ', error);
        });
    },
    (error) => {
      console.error(error);
    },
  );
};

export const selectLinks = async () => {
  const DB = await SQLite.openDatabase({
    name: 'linklocal.db',
    createFromLocation: 1,
  });

  let links = [];

  await DB.transaction((tx) => {
    tx.executeSql(
      'select * from link order by inserted_date desc',
      [],
      (tx, results) => {
        const rows = results.rows;
        for (var i = 0; i < rows.length; i++) {
          console.log(rows.item(i).updated_at);
          links.push({
            id: rows.item(i).id,
            title: rows.item(i).title,
            url: rows.item(i).url,
            description: rows.item(i).description,
            domain: rows.item(i).domain,
            category_id: rows.item(i).category_id,
            category: {
              color: rows.item(i).category_color,
              name: rows.item(i).category_name,
            },
            updated_at: rows.item(i).updated_at,
            icon: rows.item(i).icon,
          });
        }
      },
    );
  });

  return links;
};
