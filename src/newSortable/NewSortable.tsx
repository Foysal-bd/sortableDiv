// 


import React, { useState } from "react";

type Item = {
  id: string;
  label: string;
  type: "Container" | "widget";
  order: number;
  parent?: string;
};

type ItemComponentProps = {
  item: Item;
  items: Item[];
};

const ItemComponent: React.FC<ItemComponentProps> = ({ item, items }) => {
  const children = items
    .filter((child) => child.parent === item.id)
    .sort((a, b) => a.order - b.order);

  return (
    <div draggable className="border m-2 p-2">
      {item.label}
      {children.map((child) => (
        <ItemComponent key={child.id} item={child} items={items} />
      ))}
    </div>
  );
};

const NewSortable: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      label: "Container 1",
      type: "Container",
      order: 1,
    },
    {
      id: "2",
      label: "heading",
      type: "widget",
      parent: "1",
      order: 1,
    },
    {
      id: "3",
      label: "text",
      type: "widget",
      parent: "1",
      order: 2,
    },
    {
      id: "4",
      label: "Container 2",
      type: "Container",
      order: 2,
    },
    {
      id: "5",
      label: "heading",
      type: "widget",
      parent: "4",
      order: 1,
    },
    {
      id: "6",
      label: "Container 3",
      type: "Container",
      parent: "4",
      order: 2,
    },
  ]);

  const topLevelItems = items
    .filter((item) => !item.parent)
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      {topLevelItems.map((item) => (
        <ItemComponent key={item.id} item={item} items={items} />
      ))}
    </div>
  );
};

export default NewSortable;
