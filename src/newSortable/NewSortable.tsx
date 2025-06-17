// import { useState } from "react";

// const NewSortable: React.FC = () => {
//   const [items, setItems] = useState([
//     //Container 1
//     {
//       id: "1",
//       label: "Container 1",
//       type: "Container",
//       order: 1,
//     },
//     //Container 1 Child
//     {
//       id: "2",
//       label: "heading",
//       type: "widget",
//       parent: "1",
//       order: 1,
//     },
//     {
//       id: "3",
//       label: "text",
//       type: "widget",
//       parent: "1",
//       order: 2,
//     },
//     //Container 2
//     {
//       id: "4",
//       label: "Container 2",
//       type: "Container",
//       order: 2,
//     },
//     //Container 2 Child
//     {
//       id: "5",
//       label: "heading",
//       type: "widget",
//       parent: "4",
//       order: 1,
//     },
//     //Container 3 (child of Container 2)
//     {
//       id: "6",
//       label: "Container 3",
//       type: "Container",
//       parent: "4",
//       order: 2,
//     },
//   ]);
//   return (
//     <div>
//       {items.map((item) => {
//         if (item.type === "Container" && !item.parent) {
//           return (
//             <div key={item.id} className="border m-2 p-2">
//               {item.label}

//               {/* show child*/}
//               {items
//                 .filter((itm) => itm.parent === item.id)
//                 .map((childItem) => {
//                   if (childItem.type === "widget") {
//                     return (
//                       <div key={childItem.id} className="border m-2 p-2">
//                         {childItem.label}
//                       </div>
//                     );
//                   } else if (childItem.type === "Container") {
//                     return (
//                       <div key={childItem.id} className="border m-2 p-2">
//                         {childItem.label}

//                         {/* show child */}
//                         {items
//                           .filter((newItem) => newItem.parent === childItem.id)
//                           .map((child) => {
//                             <div key={child.id} className="border m-2 p-2">
//                               {child.label}
//                             </div>;
//                           })}
//                       </div>
//                     );
//                   }
//                 })}
//             </div>
//           );
//         }
//       })}
//     </div>
//   );
// };

// export default NewSortable;
