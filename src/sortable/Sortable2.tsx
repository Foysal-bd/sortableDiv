import React, { useState, useRef } from 'react';
import './nested-dropdown.scss';

type Item = {
  id: string;
  label: string;
  order: number;
  parent?: string;
};

type TreeItem = Item & {
  children?: TreeItem[];
};

const NestedDropdown2: React.FC = () => {
  const initialFlatData: Item[] = [
    { id: '2', label: 'two', order: 1 },
    { id: '1', label: 'one', order: 2 },
    { id: '3', label: 'three', order: 3 },
    { id: '31', label: 'three-one', parent: '3', order: 1 },
    { id: '5', label: 'five', parent: '31', order: 1 },
    { id: '4', label: 'four', order: 4 },
  ];

  const [flatItems, setFlatItems] = useState<Item[]>(initialFlatData);
  const dragItem = useRef<Item | null>(null);
  const dragOverItem = useRef<Item | null>(null);

  // Convert flat array to tree
  const buildTree = (items: Item[], parentId?: string): TreeItem[] => {
    return items
      .filter((item) => item.parent === parentId)
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        ...item,
        children: buildTree(items, item.id),
      }));
  };

  const handleDragStart = (item: Item) => {
    dragItem.current = item;
  };

  const handleDragEnter = (item: Item) => {
    dragOverItem.current = item;
  };

  const handleDrop = () => {
    if (!dragItem.current || !dragOverItem.current) return;

    const dragged = dragItem.current;
    const target = dragOverItem.current;

    // Prevent dropping on itself
    if (dragged.id === target.id) return;

    // Update parent
    const updatedItems = flatItems.map((item) =>
      item.id === dragged.id
        ? { ...item, parent: target.id, order: getNextOrder(target.id) }
        : item
    );

    setFlatItems(updatedItems);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const getNextOrder = (parentId?: string) => {
    const siblings = flatItems.filter((item) => item.parent === parentId);
    return siblings.length > 0
      ? Math.max(...siblings.map((i) => i.order)) + 1
      : 1;
  };

  const renderTree = (nodes: TreeItem[]) => {
    return nodes.map((node) => (
      <div
        key={node.id}
        className="dropdown-item"
        draggable
        onDragStart={() => handleDragStart(node)}
        onDragEnter={() => handleDragEnter(node)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {node.label}
        {node.children && node.children.length > 0 && (
          <div className="children">{renderTree(node.children)}</div>
        )}
      </div>
    ));
  };

  return <div className="nested-dropdown">{renderTree(buildTree(flatItems))}</div>;
};

export default NestedDropdown2;
