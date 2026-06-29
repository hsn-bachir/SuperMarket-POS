export default function Toolbar({ children, actions }) {
  return (
    <div
      className="
        mb-6
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
      "
    >
      <div className="flex flex-wrap gap-3">{children}</div>

      <div>{actions}</div>
    </div>
  );
}
