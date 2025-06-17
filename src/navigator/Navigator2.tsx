import React, { useState, useRef } from "react";

type ItemType = {
  id: string;
  name: string;
  children?: ItemType[];
  type: "container" | "widget";
};

type NavigatorItemProps = {
  item: ItemType;
  depth: number;
  onDrop: (
    draggedId: string,
    targetId: string,
    position: "before" | "after" | "inside"
  ) => void;
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  draggedItemId: string | null;
  setDraggedItemId: (id: string | null) => void;
  maxNestingLevel: number;
};

const NavigatorItem: React.FC<NavigatorItemProps> = ({
  item,
  depth,
  onDrop,
  onSelect,
  selectedId,
  draggedItemId,
  setDraggedItemId,
  maxNestingLevel,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dragOverState, setDragOverState] = useState<
    "before" | "after" | "inside" | null
  >(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const hasChildren = item.children;

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", item.id);
    setDraggedItemId(item.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const canNestInside = (): boolean => {
    // Widgets can't contain other elements
    if (item.type === "widget") return false;

    // Check nesting level limits
    if (maxNestingLevel === -1) return true; // Infinite nesting
    return depth < maxNestingLevel;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!itemRef.current || draggedItemId === item.id) return;

    const rect = itemRef.current.getBoundingClientRect();
    const mouseY = e.clientY;
    const itemTop = rect.top;
    const itemBottom = rect.bottom;
    const itemHeight = rect.height;
    const threshold = itemHeight / 3;

    const canNest = canNestInside();

    if (
      canNest &&
      mouseY > itemTop + threshold &&
      mouseY < itemBottom - threshold
    ) {
      setDragOverState("inside");
    } else if (mouseY < itemTop + threshold) {
      setDragOverState("before");
    } else {
      setDragOverState("after");
    }
  };

  const handleDragLeave = () => {
    setDragOverState(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData("text/plain");

    if (dragOverState && draggedId !== item.id) {
      onDrop(draggedId, item.id, dragOverState);
    }
    setDragOverState(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverState(null);
  };

  return (
    <div
      ref={itemRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      style={{
        paddingLeft: `${depth * 12}px`,
        cursor: "pointer",
        position: "relative",
        transition: "background-color 0.2s",
        opacity: draggedItemId === item.id ? 0.5 : 1,
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
    >
      {dragOverState === "before" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            backgroundColor: "#42a5f5",
          }}
        />
      )}
      {dragOverState === "after" && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            backgroundColor: "#42a5f5",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor:
            selectedId === item.id
              ? "#e3f2fd"
              : dragOverState === "inside"
              ? "#bbdefb"
              : "transparent",
        }}
      >
        {hasChildren && (
          <span
            style={{
              width: "16px",
              height: "16px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: "#757575",
              transition: "transform 0.2s",
              transform: isExpanded ? "rotate(90deg)" : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            ►
          </span>
        )}
        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "2px",
            display: "inline-block",
            backgroundColor: item.type === "container" ? "#42a5f5" : "#ffa726",
          }}
        ></span>
        <span style={{ fontSize: "13px", color: "#212121" }}>{item.name}</span>
      </div>
      {isExpanded && hasChildren && (
        <div style={{ marginLeft: "12px" }}>
          {item.children?.map((child) => (
            <NavigatorItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onDrop={onDrop}
              onSelect={onSelect}
              selectedId={selectedId}
              draggedItemId={draggedItemId}
              setDraggedItemId={setDraggedItemId}
              maxNestingLevel={maxNestingLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type NavigatorProps = {
  items: ItemType[];
  onStructureChange: (newItems: ItemType[]) => void;
  maxNestingLevel?: number; // -1 for infinite, 0 for no nesting, 1 for one level, etc.
};

const Navigator2: React.FC = () => {
  const maxNestingLevel = 2;
  const [items, setItems] = useState<ItemType[]>([
    {
      id: "1",
      name: "Section 1",
      type: "container",
      children: [
        {
          id: "2",
          name: "Column 1",
          type: "container",
          children: [
            { id: "3", name: "Heading", type: "widget" },
            { id: "4", name: "Text Editor", type: "widget" },
          ],
        },
        {
          id: "5",
          name: "Column 2",
          type: "container",
          children: [{ id: "6", name: "Button", type: "widget" }],
        },
      ],
    },
    {
      id: "7",
      name: "Section 2",
      type: "container",
      children: [{ id: "8", name: "Image", type: "widget" }],
    },
    {
      id: "9",
      name: "Section 3",
      type: "widget",
    },
    {
      id: "10",
      name: "Section 4",
      type: "widget",
    },
    {
      id: "11",
      name: "Section 5",
      type: "widget",
    },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const findItemAndParent = (
    tree: ItemType[],
    id: string,
    parentId?: string
  ): {
    item: ItemType | null;
    parentId: string | null;
    itemsArray: ItemType[];
  } => {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === id) {
        return { item: tree[i], parentId: parentId || null, itemsArray: tree };
      }
      if (tree[i].children) {
        const found = findItemAndParent(tree[i].children!, id, tree[i].id);
        if (found.item) return found;
      }
    }
    return { item: null, parentId: null, itemsArray: tree };
  };

  const isDescendant = (parentItem: ItemType, childId: string): boolean => {
    if (parentItem.id === childId) return true;
    if (!parentItem.children) return false;
    return parentItem.children.some(
      (child) => child.id === childId || isDescendant(child, childId)
    );
  };

  const getItemDepth = (
    tree: ItemType[],
    id: string,
    currentDepth = 0
  ): number => {
    for (const item of tree) {
      if (item.id === id) return currentDepth;
      if (item.children) {
        const depth = getItemDepth(item.children, id, currentDepth + 1);
        if (depth !== -1) return depth;
      }
    }
    return -1;
  };

  const handleDrop = (
    draggedId: string,
    targetId: string,
    position: "before" | "after" | "inside"
  ) => {
    if (draggedId === targetId) return;

    // Create deep copies to avoid mutation
    const itemsCopy = JSON.parse(JSON.stringify(items));

    // Find dragged item and its parent
    const {
      item: draggedItem,
      parentId: draggedParentId,
      itemsArray: draggedItemsArray,
    } = findItemAndParent(itemsCopy, draggedId);

    if (!draggedItem) return;

    // Find target and its parent in the copied tree
    const {
      item: targetItem,
      parentId: targetParentId,
      itemsArray: targetItemsArray,
    } = findItemAndParent(itemsCopy, targetId);

    if (!targetItem) return;

    // Check if we're trying to nest a container inside itself or its own children
    if (position === "inside") {
      // Prevent nesting a container inside itself or its children
      if (isDescendant(draggedItem, targetId)) {
        return;
      }

      // Check if target can accept children (is a container and within nesting limit)
      const targetDepth = getItemDepth(itemsCopy, targetId);
      if (
        targetItem.type !== "container" ||
        (maxNestingLevel !== -1 && targetDepth >= maxNestingLevel)
      ) {
        position = "after"; // Fall back to adjacent position
      }
    }

    // Remove dragged item from its current position
    const sourceArray = draggedParentId
      ? findItemAndParent(itemsCopy, draggedParentId).item?.children ||
        itemsCopy
      : itemsCopy;
    const draggedIndex = sourceArray.findIndex(
      (item: ItemType) => item.id === draggedId
    );
    if (draggedIndex === -1) return; // Item not found
    sourceArray.splice(draggedIndex, 1);

    // Determine where to insert
    if (position === "inside") {
      // Add as child of target
      if (!targetItem.children) targetItem.children = [];
      targetItem.children.unshift(draggedItem);
    } else {
      // Add before or after target
      const targetArray = targetParentId
        ? findItemAndParent(itemsCopy, targetParentId).item?.children ||
          itemsCopy
        : itemsCopy;
      const targetIndex = targetArray.findIndex(
        (item: ItemType) => item.id === targetId
      );
      if (targetIndex === -1) return; // Target not found

      const insertIndex = position === "before" ? targetIndex : targetIndex + 1;
      targetArray.splice(insertIndex, 0, draggedItem);
    }

    const newItems = itemsCopy;
    setItems(newItems);
    setItems(newItems);
    setDraggedItemId(null);
  };

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        width: "300px",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        overflow: "hidden",
        backgroundColor: "#fff",
        userSelect: "none",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <h3
          style={{
            margin: "0",
            fontSize: "14px",
            fontWeight: "500",
            color: "#555",
          }}
        >
          Navigator
        </h3>
      </div>
      <div style={{ padding: "8px 0", maxHeight: "500px", overflowY: "auto" }}>
        {items.map((item) => (
          <NavigatorItem
            key={item.id}
            item={item}
            depth={0}
            onDrop={handleDrop}
            onSelect={setSelectedId}
            selectedId={selectedId}
            draggedItemId={draggedItemId}
            setDraggedItemId={setDraggedItemId}
            maxNestingLevel={maxNestingLevel}
          />
        ))}
      </div>
    </div>
  );
};

export default Navigator2;
