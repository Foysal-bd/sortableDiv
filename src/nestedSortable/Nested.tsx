import React, { useState, useRef } from 'react';
import './nested-dropdown.scss';

type Item = {
  id: string;
  label: string;
  order: number;
  parent?: string;
  collapsed?: boolean;
};

type TreeItem = Item & {
  children?: TreeItem[];
};

const NestedDropdown3: React.FC = () => {
  const initialFlatData: Item[] = [
    { id: '1', label: 'Dashboard', order: 1 },
    { id: '2', label: 'Products', order: 2 },
    { id: '3', label: 'Categories', order: 3 },
    { id: '4', label: 'Electronics', parent: '3', order: 1 },
    { id: '5', label: 'Computers', parent: '4', order: 1 },
    { id: '6', label: 'Laptops', parent: '5', order: 1 },
    { id: '7', label: 'Smartphones', parent: '4', order: 2 },
    { id: '8', label: 'Clothing', parent: '3', order: 2 },
    { id: '9', label: 'Men', parent: '8', order: 1 },
    { id: '10', label: 'Women', parent: '8', order: 2 },
    { id: '11', label: 'Orders', order: 4 },
    { id: '12', label: 'Customers', order: 5 },
    { id: '13', label: 'Reports', order: 6 },
  ];

  const [flatItems, setFlatItems] = useState<Item[]>(initialFlatData);
  const dragItem = useRef<string | null>(null);
  const dragOverItem = useRef<string | null>(null);
  const dragPosition = useRef<'above' | 'below' | 'inside'>('inside');

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

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    dragItem.current = itemId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragEnter = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    if (dragItem.current === itemId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const heightThird = rect.height / 3;
    
    if (relativeY < heightThird) {
      dragPosition.current = 'above';
    } else if (relativeY > heightThird * 2) {
      dragPosition.current = 'below';
    } else {
      dragPosition.current = 'inside';
    }
    
    dragOverItem.current = itemId;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault();
    
    if (!dragItem.current || dragItem.current === dropTargetId) return;

    const draggedId = dragItem.current;
    const dropTarget = flatItems.find(item => item.id === dropTargetId);
    if (!dropTarget) return;

    const draggedItem = flatItems.find(item => item.id === draggedId);
    if (!draggedItem) return;

    let newParent: string | undefined;
    let newOrder: number;
    let itemsToUpdate: Item[] = [];

    if (dragPosition.current === 'inside') {
      // Dropping inside the target (make it a child)
      newParent = dropTargetId;
      const siblings = flatItems.filter(item => item.parent === newParent);
      newOrder = siblings.length > 0 ? Math.max(...siblings.map(i => i.order)) + 1 : 1;
      
      // Update dragged item
      itemsToUpdate.push({
        ...draggedItem,
        parent: newParent,
        order: newOrder
      });
    } else {
      // Dropping above or below the target
      newParent = dropTarget.parent;
      const siblings = flatItems.filter(item => item.parent === newParent);
      
      // Determine new order based on position
      const dropTargetOrder = dropTarget.order;
      
      if (dragPosition.current === 'above') {
        newOrder = dropTargetOrder - 0.5;
      } else {
        newOrder = dropTargetOrder + 0.5;
      }
      
      // Update dragged item
      itemsToUpdate.push({
        ...draggedItem,
        parent: newParent,
        order: newOrder
      });
    }

    // Normalize orders to integers
    const updatedItems = [...flatItems];
    itemsToUpdate.forEach(update => {
      const index = updatedItems.findIndex(item => item.id === update.id);
      if (index !== -1) {
        updatedItems[index] = update;
      }
    });

    // Normalize all orders to integers
    const parentGroups = updatedItems.reduce((groups, item) => {
      const key = item.parent || 'root';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {} as Record<string, Item[]>);

    Object.keys(parentGroups).forEach(parentId => {
      parentGroups[parentId]
        .sort((a, b) => a.order - b.order)
        .forEach((item, index) => {
          const itemIndex = updatedItems.findIndex(i => i.id === item.id);
          if (itemIndex !== -1) {
            updatedItems[itemIndex].order = index + 1;
          }
        });
    });

    setFlatItems(updatedItems);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const toggleCollapse = (itemId: string) => {
    setFlatItems(flatItems.map(item => 
      item.id === itemId ? { ...item, collapsed: !item.collapsed } : item
    ));
  };

  const renderTree = (nodes: TreeItem[], level = 0) => {
    return nodes.map((node) => (
      <div 
        key={node.id} 
        className={`dropdown-item level-${level}`}
        draggable
        onDragStart={(e) => handleDragStart(e, node.id)}
        onDragEnter={(e) => handleDragEnter(e, node.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, node.id)}
        data-position={dragOverItem.current === node.id ? dragPosition.current : undefined}
      >
        <div className="item-content">
          {node.children && node.children.length > 0 && (
            <button 
              className="collapse-toggle"
              onClick={() => toggleCollapse(node.id)}
            >
              {node.collapsed ? '+' : '-'}
            </button>
          )}
          <span className="item-label">{node.label}</span>
        </div>
        {node.children && node.children.length > 0 && !node.collapsed && (
          <div className="children">
            {renderTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return <div className="nested-dropdown">{renderTree(buildTree(flatItems))}</div>;
};

export default NestedDropdown3;