import { forwardRef } from "react";

interface Props {
  src: string;
  title?: string;
}

const StaticIframePage = forwardRef<HTMLIFrameElement, Props>(
  ({ src, title = "Empire.AI" }, ref) => {
    return (
      <iframe
        ref={ref}
        src={src}
        title={title}
        className="w-screen h-screen border-0"
        style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      />
    );
  }
);

StaticIframePage.displayName = "StaticIframePage";

export default StaticIframePage;
