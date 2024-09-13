import { useEffect, useRef } from "react";

export function BlogContent(props) {
  const blockquoteRef = useRef(null);

  useEffect(() => {
    if (blockquoteRef.current) {
      const images = blockquoteRef.current.querySelectorAll("img");
      images.forEach((img) => {
        img.classList.add("fixed-size-img");
        img.setAttribute("width", "100%");
        img.setAttribute("height", "auto");
      });
    }
  }, [props.content]);

  return (
    <blockquote
      ref={blockquoteRef}
      className="content" // Thêm lớp CSS ở đây
      dangerouslySetInnerHTML={{
        __html: props.content,
      }}
    ></blockquote>
  );
}
