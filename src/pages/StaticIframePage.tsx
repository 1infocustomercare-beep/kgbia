interface Props {
  src: string;
  title?: string;
}

export default function StaticIframePage({ src, title = "Empire.AI" }: Props) {
  return (
    <iframe
      src={src}
      title={title}
      className="w-screen h-screen border-0"
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
    />
  );
}
