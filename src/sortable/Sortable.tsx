import React, { useState, useRef, useEffect } from "react";
// import { Item } from '../types';
import "./nested-dropdown.scss";

// type Item = {
//   id: string;
//   label: string;
//   children?: Item[];
// };
type Item = {
  id: string;
  label: string;
  order: number;
  parent?: string;
};

const NestedDropdown: React.FC = () => {
  //   const initialData: Item[] = [
  //     {
  //       id: "1",
  //       label: "1",
  //       children: [
  //         {
  //           id: "1.1",
  //           label: "i",
  //           children: [{ id: "1.1.1", label: "a" }],
  //         },
  //       ],
  //     },
  //     {
  //       id: "2",
  //       label: "2",
  //     },
  //   ];
  const initialData: Item[] = [
    {
      id: "2",
      label: "two",
      order: 1,
    },
    {
      id: "1",
      label: "one",
      order: 2,
    },
    {
      id: "3",
      label: "three",
      order: 3,
    },
    {
      id: "31",
      label: "three-one",
      parent: "3",
      order: 1,
    },
    {
      id: "5",
      label: "five",
      parent: "31",
      order: 1,
    },
    {
      id: "4",
      label: "four",
      order: 4,
    },
  ];

  //   useEffect(() => {
  //     const findChildOfCurrentItem2 = (id: string) => {
  //       const child = initialData.filter((item) => item.parent === id);
  //       return { child };
  //     };

  //     const findChildOfCurrentItem = (id: string) => {
  //       const child = initialData.filter((item) => item.parent === id);

  //       const res = child.map((item) => {
  //         return {
  //           item,
  //           children: findChildOfCurrentItem2(item.id),
  //         };
  //       });

  //       return { child, children: res };
  //     };

  //     const res = initialData.map((item) => {
  //       if (!item.parent) {
  //         return {
  //           item,
  //           children: findChildOfCurrentItem(item.id),
  //         };
  //       }
  //     });
  //     console.log(res);
  //   }, []);

  const [items, setItems] = useState<Item[]>(initialData);
  const dragItem = useRef<Item | null>(null);
  const dragEnteredItem = useRef<Item | null>(null);

  const handleDragStart = (item: Item) => {
    dragItem.current = item;
  };

  const handleDragEnter = (item: Item, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(item);
    dragEnteredItem.current = item;
  };

  //   const handleDrop = (
  //     targetItem: Item | null,
  //     parentList: Item[],
  //     setParentList: (list: Item[]) => void
  //   ) => {
  //     if (!dragItem.current || dragItem.current.id === targetItem?.id) return;

  //     const sourceItem = dragItem.current;
  //     const updated = removeItem([...items], sourceItem.id);

  //     const updatedList = insertItem(
  //       updated,
  //       sourceItem,
  //       targetItem?.id,
  //       parentList
  //     );
  //     setItems(updatedList);
  //     dragItem.current = null;
  //   };

  const handleDrop = () => {
    console.log(dragItem.current);
    console.log(dragEnteredItem.current);

    if (dragItem.current) {
      dragItem.current.parent = dragEnteredItem.current?.id;
    }

    setItems((prev) => [...prev, dragItem.current] as Item[]);
  };

  const removeItem = (list: Item[], id: string): Item[] =>
    list.reduce<Item[]>((acc, item) => {
      if (item.id === id) return acc;
      if (item.children) {
        item.children = removeItem(item.children, id);
      }
      return [...acc, item];
    }, []);

  const insertItem = (
    list: Item[],
    itemToInsert: Item,
    targetId: string | undefined,
    searchWithin: Item[]
  ): Item[] => {
    if (!targetId) return [...searchWithin, itemToInsert];

    const newList = list.map((item) => {
      if (item.id === targetId) {
        return { ...item, children: [...(item.children || []), itemToInsert] };
      }
      if (item.children) {
        item.children = insertItem(
          item.children,
          itemToInsert,
          targetId,
          item.children
        );
      }
      return item;
    });
    return newList;
  };

  const renderItems = (
    data: Item[],
    parentList: Item[],
    setParentList: (list: Item[]) => void
  ): React.ReactNode => {
    return data.map((item) => (
      <div
        key={item.id}
        className={`dropdown-item hover:border-red-200 ${
          item.parent ? "hidden" : ""
        }`}
        draggable
        onDragStart={() => handleDragStart(item)}
        onDragEnter={(e) => handleDragEnter(item, e)}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        // onDrop={() => handleDrop(item, parentList, setParentList)}
        onDrop={handleDrop}
      >
        {item.label}
        {/* {item.children && item.children.length > 0 && (
          <div className="children">
            {renderItems(item.children, item.children, (updated) => {
              item.children = updated;
              setItems([...items]);
            })}
          </div>
        )} */}
        {/* inner 1 */}
        {data
          .filter((itm) => itm.parent === item.id)
          .map((item) => {
            return (
              <div
                key={item.id}
                draggable
                className="dropdown-item children"
                onDragStart={() => handleDragStart(item)}
                onDragEnter={(e) => handleDragEnter(item, e)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                // onDrop={() => handleDrop(item, parentList, setParentList)}
                onDrop={handleDrop}
              >
                {item.label}
                {/* inner 2 */}
                {data
                  .filter((itm) => itm.parent === item.id)
                  .map((item) => {
                    return (
                      <div
                        key={item.id}
                        draggable
                        className="dropdown-item children"
                        // onDragStart={() => handleDragStart(item)}
                        // onDragEnter={(e) => handleDragEnter(item, e)}
                        // onDragOver={(e) => {
                        //   e.preventDefault();
                        //   e.stopPropagation();
                        // }}
                        // // onDrop={() => handleDrop(item, parentList, setParentList)}
                        // onDrop={handleDrop}
                      >
                        {item.label}
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    ));
  };

  return (
    <div className="nested-dropdown">{renderItems(items, items, setItems)}</div>
  );
};

export default NestedDropdown;
