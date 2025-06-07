"use client";
import { DndContext } from "@dnd-kit/core";
import { sections } from "@/lib/static/playground/project";
import CanbanColumn from "../CanbanColumn";

const CanbanMain = () => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log("Dragged", active.id, "over", over?.id);
    // Bu yerga reorder yoki API chaqiruvini keyin qo‘shamiz
  };

  return (
    <div className="canbanboard">
      <div className="canbanboard__header">
        <div className="header-back">back to main page</div>
        <h1 className="header-title">Kanban Board</h1>
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "scroll",
            marginTop: "30px",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE va eski Edge
          }}
          className="hide-scrollbar" // 👇 Chrome uchun CSS class (quyida yoziladi)
        >
          {sections.map((section) => (
            <CanbanColumn key={section.id} section={section} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default CanbanMain;
